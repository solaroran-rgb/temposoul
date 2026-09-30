/**
 * 发送前置闸门：退订过滤 / 频控 / 成本闸门
 *
 * 铁律：调度器不得绕过既有能力。
 *   - 退订：读 newsletter_emails 的 `email:<addr>` 记录（与 /api/v1/newsletter/unsubscribe 同一份数据）；
 *     仅 marketing 流受约束，事务流（OTP / 重置密码 / 已付费报告）不受营销退订影响。
 *   - 频控：固定窗口计数，键前缀 mq:rl:，风格对齐 functions/_middleware.ts 的 rl: 限流。
 *   - 成本闸门：report_delivery 复用既有 checkCostGate（src/lib/server/report/cost-gate.ts）。
 */

import type { MailFlowId, RateLimitRule } from './types';
import { RATE_KEY_PREFIX } from './store';
import { checkCostGate } from '../report/cost-gate';

/** 订阅记录存储（退订判定数据源） */
export interface SubscriptionStore {
  get(key: string): Promise<string | null>;
}

export interface MailGateEnv {
  newsletter_emails?: KVNamespace;
  MAIL_QUEUE_KV?: KVNamespace;
}

/** 每流频控规则（窗口内最多发送封数） */
export const FLOW_RATE_RULES: Record<MailFlowId, RateLimitRule> = {
  // 订阅确认：24h 内最多 3 封（防重复订阅轰炸）
  newsletter_confirm: { limit: 3, windowMs: 24 * 60 * 60 * 1000 },
  // 注册欢迎：24h 内 1 封
  register_welcome: { limit: 1, windowMs: 24 * 60 * 60 * 1000 },
  // OTP：10 分钟内最多 5 次（撞库 / 短信炸弹防护）
  otp_code: { limit: 5, windowMs: 10 * 60 * 1000 },
  // 找回密码：30 分钟内最多 3 次
  password_reset: { limit: 3, windowMs: 30 * 60 * 1000 },
  // 报告投递：1 小时内最多 10 封
  report_delivery: { limit: 10, windowMs: 60 * 60 * 1000 },
};

export type UnsubscribeCheck = { unsubscribed: boolean; reason?: string };

/**
 * 退订判定。兼容历史记录口径：
 *   - 显式 status === 'unsubscribed'  → 退订
 *   - 无 status 字段的老记录           → 以 subscribed === false 判定
 *   - pending / confirmed              → 未退订（pending 是刚订阅待确认，不能误杀确认信本身）
 */
export function readUnsubscribed(rec: Record<string, unknown> | null): boolean {
  if (!rec) return false;
  if (rec.status === 'unsubscribed') return true;
  if (typeof rec.status !== 'string') return rec.subscribed === false;
  return false;
}

export async function checkUnsubscribed(
  env: MailGateEnv,
  email: string,
): Promise<UnsubscribeCheck> {
  const kv = env.newsletter_emails;
  if (!kv) return { unsubscribed: false };
  const raw = await kv.get(`email:${email}`).catch(() => null);
  if (!raw) return { unsubscribed: false };
  let rec: Record<string, unknown> | null = null;
  try {
    const v = JSON.parse(raw) as unknown;
    rec = v && typeof v === 'object' ? (v as Record<string, unknown>) : null;
  } catch {
    return { unsubscribed: false };
  }
  const unsubscribed = readUnsubscribed(rec);
  return unsubscribed ? { unsubscribed: true, reason: 'unsubscribed' } : { unsubscribed: false };
}

export type RateCheck =
  | { ok: true }
  | { ok: false; retryAtMs: number };

/**
 * 频控：固定窗口计数，命中即返回下一窗口起点；未命中则计数 +1。
 * 计数与任务共用同一命名空间（resolveQueueStore 同款回落策略）。
 */
export async function checkRateLimit(
  store: { get(key: string): Promise<string | null>; put(key: string, value: string, ttlSec?: number): Promise<void> },
  flow: MailFlowId,
  email: string,
  nowMs: number,
): Promise<RateCheck> {
  const rule = FLOW_RATE_RULES[flow];
  const bucket = Math.floor(nowMs / rule.windowMs);
  const key = `${RATE_KEY_PREFIX}${flow}:${email}:${bucket}`;
  const raw = await store.get(key).catch(() => null);
  const current = Number(raw ?? '0');
  const used = Number.isFinite(current) && current > 0 ? Math.floor(current) : 0;
  if (used >= rule.limit) {
    return { ok: false, retryAtMs: (bucket + 1) * rule.windowMs };
  }
  await store.put(key, String(used + 1), Math.ceil(rule.windowMs / 1000) + 60);
  return { ok: true };
}

export type GateCheck = { ok: true } | { ok: false; reason: string };

/**
 * 既有闸门接入：report_delivery 走成本闸门（预估成本超售价 70% 熔断）。
 * payload 未带 productId 时无据可查，放行（不伪造 productId 绕过检查）。
 */
export async function checkFlowGate(
  env: MailGateEnv,
  flow: MailFlowId,
  payload: Record<string, unknown>,
): Promise<GateCheck> {
  if (flow !== 'report_delivery') return { ok: true };
  const productId = payload.productId;
  if (typeof productId !== 'string' || !productId) return { ok: true };
  const r = await checkCostGate(env as unknown as Env, productId);
  return r.ok ? { ok: true } : { ok: false, reason: r.reason ?? 'cost_gate_blocked' };
}
