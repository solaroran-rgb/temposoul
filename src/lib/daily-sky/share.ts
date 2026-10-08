/**
 * @file 每日星象 · 分享链接生成与解码（S-6 分享片，规格 §5 冻结）
 *
 * 接口契约（与规格 §5 逐字一致；每日片模块未落盘前，DailySkyPayload 按规格 §4
 * 冻结字段在此本地定义，每日片落盘后仅需把 import 切到其类型来源，字段名不变）：
 *   buildDailyShareUrl(payload): string | null
 *   decodeDailyShareToken(token): DailySkyPayload | null
 *
 * token 设计：复用既有路由 /sky-event/:token，不新增路由。
 *   token = 'daily-' + base64url(JSON(payload + 4位随机nonce))
 *   - 以 'daily-' 开头，落地页据此走客户端解码分支（不打 getPublicSkyEvent 后端）；
 *   - payload 自包含在 token 里，客户端可解，零后端压力；
 *   - dateKey 参与 24h 过期判定：解码出的 dateKey ≠ 用户本地今日 → 返回 null（过期）；
 *   - 单日分享上限 5：localStorage `daily-sky:shareCount:{dateKey}`。
 * 无现金激励、无邀请码（连续登录/邀请制属 S-6b 后续批）。
 */

/** 每日星象 payload（规格 §4 冻结签名；每日片落盘后以其导出类型为准） */
export interface DailySkyPayload {
  /** 用户本地时区当天日期，YYYY-MM-DD（24h 刷新唯一依据） */
  dateKey: string;
  /** IANA 时区，如 Asia/Shanghai */
  timeZone: string;
  /** 月相，如「满月 / 上弦月」 */
  moonPhase: string;
  /** 真实天象事件标题，如「月亮进入金牛座」 */
  skyEventTitle: string;
  /** 个性化观察行（中性，禁吉凶断言） */
  personalNote: string;
  /** 可选：星座日运行 */
  zodiacLine?: string;
  /** 文化引文 */
  quote: string;
  /** 引文出处 */
  source: string;
  /** 全站统一合规句 */
  compliance: '此为传统命理观点';
}

/** 单用户单日分享上限（Q5 补交稿冻结） */
export const DAILY_SHARE_LIMIT = 5;

const TOKEN_PREFIX = 'daily-';

function shareCountKey(dateKey: string): string {
  return `daily-sky:shareCount:${dateKey}`;
}

/** 用户本地时区当天 YYYY-MM-DD（en-CA 格式即 YYYY-MM-DD） */
function todayKey(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function readShareCount(dateKey: string): number {
  try {
    const raw = window.localStorage.getItem(shareCountKey(dateKey));
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function bumpShareCount(dateKey: string): void {
  try {
    window.localStorage.setItem(shareCountKey(dateKey), String(readShareCount(dateKey) + 1));
  } catch {
    /* localStorage 不可用（隐私模式等）时静默降级，不影响分享生成 */
  }
}

function randNonce(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 4; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

/** JSON → base64url（无填充，Unicode 安全） */
function encodeB64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** base64url → JSON string；非法输入返回 null */
function decodeB64Url(s: string): string | null {
  try {
    const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4 === 0 ? b64 : `${b64}${'='.repeat(4 - (b64.length % 4))}`;
    const bin = atob(pad);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

function isDailyPayload(v: unknown): v is DailySkyPayload {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.dateKey === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(p.dateKey) &&
    typeof p.timeZone === 'string' &&
    typeof p.moonPhase === 'string' &&
    typeof p.skyEventTitle === 'string' &&
    typeof p.personalNote === 'string' &&
    typeof p.quote === 'string' &&
    typeof p.source === 'string'
  );
}

/**
 * 生成每日星象分享链接（复用 /sky-event/:token，不新增路由）。
 * 单日达上限（5 次）返回 null——调用方提示「今日分享已达上限，明天再来」。
 */
export function buildDailyShareUrl(payload: DailySkyPayload): string | null {
  if (readShareCount(payload.dateKey) >= DAILY_SHARE_LIMIT) return null;

  const packed = { ...payload, n: randNonce() };
  const token = `${TOKEN_PREFIX}${encodeB64Url(JSON.stringify(packed))}`;
  bumpShareCount(payload.dateKey);
  return `/sky-event/${token}`;
}

/**
 * 解码 daily- 前缀 token。
 * 非法 token / 结构损坏 / dateKey 与今日不等（24h 过期）一律返回 null。
 */
export function decodeDailyShareToken(token: string): DailySkyPayload | null {
  if (!token || !token.startsWith(TOKEN_PREFIX)) return null;
  const json = decodeB64Url(token.slice(TOKEN_PREFIX.length));
  if (!json) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  if (!isDailyPayload(parsed)) return null;
  if (parsed.dateKey !== todayKey()) return null; // 24h 过期
  return parsed;
}
