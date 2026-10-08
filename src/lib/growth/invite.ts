// src/lib/growth/invite.ts
// S-6b B2 邀请制冷启动片 · 邀请 token 生成 / 解码 / 结算（规格 §2.3 冻结签名）。
//
// 设计要点（与规格 §2.3 逐字对齐）：
//   - token = 'inv-' + base64url(JSON(InviteInfo))，24h 有效期（exp = 签发 + 24h，epoch ms）；
//   - InviteInfo.inviterId = 邀请者设备指纹短 hash（轻量客户端指纹，异常降级 'unknown'）；
//   - 结算双方各 +1 AI 解读额度（grantAiCredits(1) ×2；MVP 无后端，跨设备发放待 G 组 entitlement）；
//   - 日回馈上限 3：localStorage `growth:inviteReward:{dateKey}` >= 3 → 'daily_cap'；
//   - 幂等：localStorage `growth:inviteConsumed:{tokenHash}` 已消费 → 'already'；
//   - 设备指纹绑定：换设备 / 转发消费同 token → 'already'（记录的 fp 与当前 fp 不一致也视为已消费）；
//   - riskFlags? 为前端结构预留字段：同 IP 批量注册判定属后端职责，本批不编造检测结果。
//
// 合规：激励仅为「AI 解读额度」（内容权益），日上限 3；无现金 / 无代币 / 无吉凶措辞。

import { getDailyKey } from '../daily-sky/dailyKey';
import { grantAiCredits } from './ai-credits';

const TOKEN_PREFIX = 'inv-';
const TTL_MS = 24 * 60 * 60 * 1000; // 24h
const DAILY_REWARD_LIMIT = 3;

// ---------- 存储兜底（与 dailyKey.ts / profile.ts 同模式，函数体惰性读 localStorage） ----------
function storage(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* SSR / 隐私模式 / 单测未注入 */
  }
  return null;
}

// ---------- base64url（参考 share.ts 写法，独立实现避免耦合） ----------
function encodeB64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = '';
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

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

// ---------- 轻量 hash（djb2 ×2，输出短 hex） ----------
function shortHash(s: string, len = 16): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 ^ c, 0x01000193) >>> 0;
  }
  const out = h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
  return out.slice(0, len);
}

// ---------- 设备指纹（canvas 采样 hash → UA+分辨率+语言 hash → 'unknown'） ----------
let cachedFp: string | null = null;
export function getDeviceFingerprint(): string {
  if (cachedFp !== null) return cachedFp;
  try {
    if (typeof window !== 'undefined' && window.document && window.navigator) {
      // 首选 canvas 采样（同渲染环境稳定）
      try {
        const c = document.createElement('canvas');
        c.width = 240;
        c.height = 60;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.textBaseline = 'top';
          ctx.font = "16px 'Arial'";
          ctx.fillStyle = '#f60';
          ctx.fillRect(0, 0, 120, 30);
          ctx.fillStyle = '#069';
          ctx.fillText('temposoul·invite·fp', 4, 18);
          const data = ctx.getImageData(0, 0, 240, 60).data.join(',');
          cachedFp = shortHash(data, 12);
          return cachedFp;
        }
      } catch {
        /* canvas 被禁用（隐私模式）时降级 UA 组合 */
      }
      const ua = window.navigator.userAgent || '';
      const res = `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`;
      const lang = window.navigator.language || '';
      cachedFp = shortHash(`${ua}|${res}|${lang}`, 12);
      return cachedFp;
    }
  } catch {
    /* 任何异常都降级，不阻断 */
  }
  cachedFp = 'unknown';
  return cachedFp;
}

// ---------- InviteInfo 与 token 编解码 ----------
export interface InviteInfo {
  /** 邀请者设备指纹（短 hash） */
  inviterId: string;
  /** epoch ms = 签发 + 24h */
  exp: number;
  /** 4 位随机 nonce */
  nonce: string;
  /**
   * 预留字段：同 IP 批量注册 / 设备农场等风险标记。
   * 同 IP 判定属后端职责，本批仅在结构上留钩子，前端不编造检测结果。
   */
  riskFlags?: string[];
}

function randNonce(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 4; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function isInviteInfo(v: unknown): v is InviteInfo {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Record<string, unknown>;
  return (
    typeof p.inviterId === 'string' &&
    typeof p.exp === 'number' &&
    Number.isFinite(p.exp) &&
    typeof p.nonce === 'string' &&
    p.nonce.length >= 3
  );
}

/** 生成邀请 token（'inv-' + base64url(JSON)，24h 有效）。 */
export function createInviteToken(): string {
  const info: InviteInfo = {
    inviterId: getDeviceFingerprint(),
    exp: Date.now() + TTL_MS,
    nonce: randNonce(),
  };
  return `${TOKEN_PREFIX}${encodeB64Url(JSON.stringify(info))}`;
}

/**
 * 解码邀请 token。
 * - 前缀错误 / base64url 损坏 / JSON 非法 / 结构不符 → null（invalid）；
 * - exp < 当前时间（已过 24h）→ null（expired）。
 */
export function decodeInviteToken(token: string): InviteInfo | null {
  if (!token || typeof token !== 'string' || !token.startsWith(TOKEN_PREFIX)) return null;
  const json = decodeB64Url(token.slice(TOKEN_PREFIX.length));
  if (!json) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return null;
  }
  if (!isInviteInfo(parsed)) return null;
  if (parsed.exp < Date.now()) return null; // 过期
  return parsed;
}

// ---------- 结算 ----------
export type SettleResult = 'granted' | 'daily_cap' | 'already' | 'invalid' | 'expired';

function rewardCountKey(dateKey: string): string {
  return `growth:inviteReward:${dateKey}`;
}

function consumedKey(token: string): string {
  return `growth:inviteConsumed:${shortHash(token, 16)}`;
}

function readDailyCount(dateKey: string): number {
  const s = storage();
  if (!s) return 0;
  try {
    const raw = s.getItem(rewardCountKey(dateKey));
    const n = raw ? Number.parseInt(raw, 10) : 0;
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

function bumpDailyCount(dateKey: string): void {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(rewardCountKey(dateKey), String(readDailyCount(dateKey) + 1));
  } catch {
    /* 写入失败不阻塞主流程 */
  }
}

interface ConsumedRecord {
  fp: string;
  at: number;
}

function readConsumed(token: string): ConsumedRecord | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(consumedKey(token));
    if (!raw) return null;
    const obj = JSON.parse(raw) as Partial<ConsumedRecord>;
    if (typeof obj?.fp === 'string' && typeof obj?.at === 'number') {
      return { fp: obj.fp, at: obj.at };
    }
    return null;
  } catch {
    return null;
  }
}

function writeConsumed(token: string, fp: string): void {
  const s = storage();
  if (!s) return;
  try {
    const rec: ConsumedRecord = { fp, at: Date.now() };
    s.setItem(consumedKey(token), JSON.stringify(rec));
  } catch {
    /* 写入失败不阻塞 */
  }
}

/**
 * 结算邀请。
 *
 * 判定顺序：
 *   1. 结构非法 → 'invalid'；
 *   2. exp < now → 'expired'；
 *   3. token 已被消费过（含换设备 / 转发）→ 'already'；
 *   4. 当日回馈已达上限（3 次）→ 'daily_cap'；
 *   5. 否则发放：邀请者 +1、被邀者 +1、日计数 +1、消费记录写回 → 'granted'。
 */
export function settleInvite(token: string): SettleResult {
  // 1. 结构判定（同时覆盖 invalid / expired）
  if (!token || typeof token !== 'string' || !token.startsWith(TOKEN_PREFIX)) {
    return 'invalid';
  }
  const info = decodeInviteToken(token);
  if (info === null) {
    // 区分 invalid vs expired：再解一次看是结构坏还是过期
    const json = decodeB64Url(token.slice(TOKEN_PREFIX.length));
    if (json) {
      try {
        const parsed = JSON.parse(json);
        if (isInviteInfo(parsed) && parsed.exp < Date.now()) return 'expired';
      } catch {
        /* fallthrough → invalid */
      }
    }
    return 'invalid';
  }

  // 2. 幂等 / 防转发：已消费（无论是否同一设备）→ already
  const rec = readConsumed(token);
  if (rec !== null) {
    return 'already';
  }

  // 3. 日上限
  const dateKey = getDailyKey();
  if (readDailyCount(dateKey) >= DAILY_REWARD_LIMIT) {
    return 'daily_cap';
  }

  // 4. 发放：先写消费记录（防并发重复），再日计数 +1，再双方额度 +1
  const fp = getDeviceFingerprint();
  writeConsumed(token, fp);
  bumpDailyCount(dateKey);
  // MVP 无后端：邀请者与被邀者额度都在本设备记账（跨设备真实发放待后端 entitlement）
  grantAiCredits(1); // 邀请者侧（MVP 本地占位）
  grantAiCredits(1); // 被邀者侧（当前设备）
  return 'granted';
}

/** 当日已发放的邀请回馈次数（供 UI 展示剩余次数 = DAILY_REWARD_LIMIT - count）。 */
export function getDailyInviteRewardCount(): number {
  return readDailyCount(getDailyKey());
}

export { DAILY_REWARD_LIMIT };
