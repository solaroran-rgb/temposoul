/**
 * AARRR 增长事件族（线程 B，2026-09-18）
 * 复用 src/lib/analytics/index.ts 的 trackEvent，失败不阻塞主流程。
 * 事件命名 snake_case，与既有 FUNNEL_EVENTS（T0-T5）/ REPORT_EVENTS 并存，不覆盖。
 *
 * 合规沙盒 5% 流量切分：
 *  - 默认采样率 5%（0.05），仅对落入样本的用户上报本族事件；
 *  - 采样率可被以下来源覆盖（优先级：Cookie > 运行时配置 > 构建期环境变量 > 默认值）：
 *      1) Cookie `ts_aarrr_rate`   例："0"=关闭 / "1"=全量 / "0.2"=20%
 *      2) Cookie `ts_aarrr_opt`     例："off"=强制排除 / "all"=强制纳入（QA/合规用）
 *      3) window.__TEMPOSOUL_RUNTIME_CONFIG__.aarrrSampleRate （运行时配置）
 *      4) import.meta.env.VITE_AARRR_SAMPLE_RATE             （构建期注入）
 *  - 分桶确定性：访客级稳定 id 存于 Cookie `ts_aarrr_uid`（首次访问随机生成），
 *    fnv1a(uid) → [0,1)，bucket < rate 即入样本，保证同一用户跨会话一致。
 *
 * 注意：支付未上线，first_purchase / repurchase 仅定义事件名与触发点占位，
 *       待支付商户号接通后在 checkout/webhook 回调处调用对应 track 函数。
 */
import { trackEvent } from './index';

/** AARRR 事件名（snake_case，与 CF Web Analytics 自定义事件对齐） */
export const AARRR_EVENTS = {
  /** Acq/Act：新注册账号 */
  NEW_REGISTER: 'new_register',
  /** Aha：一次排盘完成（结果页渲染完毕） */
  CHART_COMPLETED: 'chart_completed',
  /** Activation：激活（完成首个关键动作，如首次 AI 解读 / 首次报告查看） */
  ACTIVATED: 'activated',
  /** Revenue：首次付费（占位，待支付接通） */
  FIRST_PURCHASE: 'first_purchase',
  /** Revenue：复购（占位，待支付接通） */
  REPURCHASE: 'repurchase',
  /** Retention：注册后第 7 天回访 */
  RETENTION_D7: 'retention_d7',
  /** Retention：注册后第 30 天回访 */
  RETENTION_D30: 'retention_d30',
} as const;

export type AarrrEventName = (typeof AARRR_EVENTS)[keyof typeof AARRR_EVENTS];

/** 默认采样率：合规沙盒 5% 流量 */
const DEFAULT_SAMPLE_RATE = 0.05;
const COOKIE_RATE = 'ts_aarrr_rate';
const COOKIE_OPT = 'ts_aarrr_opt';
const COOKIE_UID = 'ts_aarrr_uid';
const COOKIE_MAX_AGE_DAYS = 180;

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const raw = document.cookie
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${name}=`));
  if (!raw) return null;
  try {
    return decodeURIComponent(raw.slice(name.length + 1));
  } catch {
    return raw.slice(name.length + 1);
  }
}

function writeCookie(name: string, value: string, maxAgeDays: number): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeDays * 86400}; SameSite=Lax`;
}

/** FNV-1a 32 位哈希（与 ab-tests.ts 同算法，本地独立实现避免循环依赖） */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** 读取访客稳定 uid（首次访问随机生成并写 Cookie） */
function getVisitorUid(): string {
  let uid = readCookie(COOKIE_UID);
  if (!uid) {
    const bytes = new Uint8Array(8);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 8; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    uid = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    writeCookie(COOKIE_UID, uid, COOKIE_MAX_AGE_DAYS);
  }
  return uid;
}

/** 当前采样率（0~1），按优先级解析；非法值回落默认 */
export function getAarrrSampleRate(): number {
  // 1) Cookie 显式指定
  const cookieRate = readCookie(COOKIE_RATE);
  if (cookieRate !== null && cookieRate !== '') {
    const n = Number(cookieRate);
    if (Number.isFinite(n) && n >= 0 && n <= 1) return n;
  }
  // 2) 运行时配置（与 initAnalyticsFromRuntime 同源）
  const rt = (window as unknown as { __TEMPOSOUL_RUNTIME_CONFIG__?: { aarrrSampleRate?: number } })
    .__TEMPOSOUL_RUNTIME_CONFIG__;
  if (rt && typeof rt.aarrrSampleRate === 'number' && Number.isFinite(rt.aarrrSampleRate)) {
    return Math.min(1, Math.max(0, rt.aarrrSampleRate));
  }
  // 3) 构建期环境变量
  const envRate = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_AARRR_SAMPLE_RATE;
  if (envRate) {
    const n = Number(envRate);
    if (Number.isFinite(n) && n >= 0 && n <= 1) return n;
  }
  // 4) 默认 5%
  return DEFAULT_SAMPLE_RATE;
}

/** 当前访客是否落入 AARRR 样本（确定性分桶） */
export function isInAarrrSample(): boolean {
  if (!isBrowser()) return false;
  // 显式开关优先
  const opt = readCookie(COOKIE_OPT);
  if (opt === 'off') return false;
  if (opt === 'all') return true;

  const rate = getAarrrSampleRate();
  if (rate <= 0) return false;
  if (rate >= 1) return true;

  const bucket = (fnv1a(getVisitorUid()) % 1000) / 1000; // [0, 1)
  return bucket < rate;
}

/** AARRR 上报主入口：采样门控 → safe trackEvent */
function trackAarrr(name: AarrrEventName, props?: Record<string, unknown>): void {
  if (!isBrowser()) return;
  if (!isInAarrrSample()) return;
  try {
    trackEvent(name, { ...(props ?? {}), sample_rate: getAarrrSampleRate() });
  } catch {
    /* 埋点失败不阻塞主流程 */
  }
}

// ── 事件触发点 ──────────────────────────────────────────────

/** Acq/Act：新账号注册成功时（接 RegisterPage 注册回调） */
export function trackNewRegister(props: { method: string }): void {
  trackAarrr(AARRR_EVENTS.NEW_REGISTER, props);
}

/** Aha：排盘结果页渲染完毕时（接 ResultPage / trackChartResult 同时点） */
export function trackChartCompleted(props: { mode: string; promptSource?: string }): void {
  trackAarrr(AARRR_EVENTS.CHART_COMPLETED, props);
}

/** Activation：完成首个关键动作（首次 AI 解读 / 首次报告查看）时 */
export function trackActivated(props: { activationPoint: 'ai_interpret' | 'report_view' | 'first_chart' }): void {
  trackAarrr(AARRR_EVENTS.ACTIVATED, props);
}

/**
 * Revenue：首次付费【占位】。
 * TODO(支付接通)：在 checkout 成功 / 支付 webhook 回调处调用，
 *  props 建议：{ orderId, amount, currency, channel: 'alipay'|'wechat'|'apple' }
 */
export function trackFirstPurchase(props: { orderId: string; amount: number; currency: string; channel: string }): void {
  trackAarrr(AARRR_EVENTS.FIRST_PURCHASE, props);
}

/**
 * Revenue：复购【占位】。
 * TODO(支付接通)：同一用户第 2 笔及以上订单支付成功时调用，
 *  props 建议：{ orderId, previousOrderId, amount, currency, channel, orderCount }
 */
export function trackRepurchase(props: {
  orderId: string;
  previousOrderId: string;
  amount: number;
  currency: string;
  channel: string;
  orderCount: number;
}): void {
  trackAarrr(AARRR_EVENTS.REPURCHASE, props);
}

/** Retention：注册后第 7 天回访时（由会话层判断注册时长后调用） */
export function trackRetentionD7(props: { daysSinceRegister: number }): void {
  trackAarrr(AARRR_EVENTS.RETENTION_D7, props);
}

/** Retention：注册后第 30 天回访时（由会话层判断注册时长后调用） */
export function trackRetentionD30(props: { daysSinceRegister: number }): void {
  trackAarrr(AARRR_EVENTS.RETENTION_D30, props);
}
