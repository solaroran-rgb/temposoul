/**
 * T14 轻量商店 · 积分（余额 + 流水）
 *
 * 关键设计：**余额 = 全部流水 delta 之和**，不做「读余额 → 改余额 → 写回」。
 * 每条流水一个独立 KV 键，键由 (userId, action, refId) 稳定派生：
 *   - 同一业务事实重复提交 → 落到同一个键 → 覆盖写 = 不重复计分（幂等）；
 *   - 不同业务单号 → 各自成键 → 互不覆盖（并发不丢）。
 * 代价是读余额需要扫前缀求和（用户流水量级小，可接受；量大时改为定期快照，见 README）。
 */

import { sortEntries } from './config.ts';
import { listPointsEntries, putPointsEntry, stableHash } from './store.ts';
import type { PointsAccount, PointsEntry, ShopEnv } from './types.ts';

/** 流水 id：由业务三元组稳定派生（幂等根基）。 */
export function buildEntryId(userId: string, action: string, refId: string): string {
  return `pe_${stableHash(`${userId}|${action}|${refId}`)}`;
}

export async function getAccount(env: ShopEnv, userId: string): Promise<PointsAccount> {
  const entries = sortEntries(await listPointsEntries(env, userId));
  let balance = 0;
  for (const e of entries) balance += e.delta;
  return { userId, balance, entries };
}

export async function getBalance(env: ShopEnv, userId: string): Promise<number> {
  return (await getAccount(env, userId)).balance;
}

export interface AppendInput {
  userId: string;
  /** 正 = 发放，负 = 消耗 */
  delta: number;
  action: string;
  refId: string;
  label: string;
}

/**
 * 追加一条流水（幂等）。返回 { entry, balance } —— balance 为写入后的余额。
 * 消耗（delta < 0）会校验余额充足；不足返回 null，由调用方决定降级（例如少抵 / 不抵）。
 */
export async function appendEntry(
  env: ShopEnv,
  input: AppendInput,
): Promise<{ entry: PointsEntry; balance: number } | null> {
  const id = buildEntryId(input.userId, input.action, input.refId);
  const existing = await listPointsEntries(env, input.userId);
  const prev = existing.find((e) => e.id === id);
  const prevDelta = prev?.delta ?? 0;
  const balanceBefore = existing.reduce((sum, e) => sum + e.delta, 0);

  // 扣减：以「去掉本条旧值后的余额」判定，保证重复提交不会因自身已扣而误判不足
  const available = balanceBefore - prevDelta;
  if (input.delta < 0 && available + input.delta < 0) return null;

  const entry: PointsEntry = {
    id,
    userId: input.userId,
    delta: input.delta,
    action: input.action,
    refId: input.refId,
    label: input.label,
    createdAt: prev?.createdAt ?? new Date().toISOString(),
  };
  await putPointsEntry(env, entry);
  return { entry, balance: available + input.delta };
}

/** 发放积分（签到 / 任务 / 管理补发）。 */
export async function grantPoints(
  env: ShopEnv,
  userId: string,
  credits: number,
  action: string,
  refId: string,
  label: string,
): Promise<{ entry: PointsEntry; balance: number }> {
  const res = await appendEntry(env, { userId, delta: credits, action, refId, label });
  if (!res) throw new Error('grant_points_failed');
  return res;
}

/** 结算消耗积分（refId = checkoutId，重复结算不会重复扣）。 */
export async function spendPoints(
  env: ShopEnv,
  userId: string,
  points: number,
  checkoutId: string,
): Promise<{ entry: PointsEntry; balance: number } | null> {
  if (points <= 0) return null;
  return appendEntry(env, {
    userId,
    delta: -points,
    action: 'spend:checkout',
    refId: checkoutId,
    label: `订单结算抵扣 ${points} 积分`,
  });
}

/** 取消订单冲正（refId = orderId，重复取消不会重复返还）。 */
export async function refundPoints(
  env: ShopEnv,
  userId: string,
  points: number,
  orderId: string,
): Promise<{ entry: PointsEntry; balance: number } | null> {
  if (points <= 0) return null;
  return appendEntry(env, {
    userId,
    delta: points,
    action: 'refund:order',
    refId: orderId,
    label: `订单取消返还 ${points} 积分`,
  });
}
