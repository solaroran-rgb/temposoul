/**
 * 权益闸门（五条业务线共用的唯一权限判断入口）
 *
 * 用法：
 *  - 只判断能不能看（如按钮置灰、价格墙展示）→ evaluateAccess（不落库、不扣减）
 *  - 真正要放行一次付费动作（尤其 LLM 深度解读）→ consumeEntitlement
 *    （校验 + 扣减原子化串行，扣减成功才允许业务方调 LLM）
 *
 * 免费层：FREE_LAYER_DEEP_LLM_CALLS = 0，免费路径不进入 consumeEntitlement(report.deep)，
 * 改走 freeSkeleton.ts 的规则骨架（0 次 LLM）。
 */
import type {
  AccessCheck,
  ConsumeResult,
  EntitlementBag,
  EntitlementGrant,
  EntitlementKey,
} from './types';
import { ENTITLEMENT_KEYS } from './types';
import { grantsFor, readBag, writeBag, type EntitlementKv } from './store';

type NowInput = number | Date | string;

function toMs(now: NowInput): number {
  if (typeof now === 'number') return now;
  if (typeof now === 'string') return new Date(now).getTime();
  return now.getTime();
}

const CYCLE_MS: Record<string, number> = {
  day: 86_400_000,
  week: 7 * 86_400_000,
  month: 30 * 86_400_000,
};

/** grant 当前是否在有效期内 */
export function isGrantValid(grant: EntitlementGrant, nowMs: number): boolean {
  if (grant.expiresAt) {
    const exp = new Date(grant.expiresAt).getTime();
    if (nowMs >= exp) return false;
  }
  return true;
}

/** 对 count grant 应用周期重置，返回（可能重置后的）剩余次数 */
export function effectiveRemaining(grant: EntitlementGrant, nowMs: number): number {
  if (grant.quotaType !== 'count') return 0;
  const base = typeof grant.remaining === 'number' ? grant.remaining : grant.quotaValue;
  if (grant.resetCycle === 'none' || !grant.lastResetAt) return base;
  const cycle = CYCLE_MS[grant.resetCycle];
  if (!cycle) return base;
  const last = new Date(grant.lastResetAt).getTime();
  if (nowMs - last >= cycle) {
    // 到点重置：remaining 回满（不在这里改对象，由调用方决定是否落库）
    return grant.quotaValue;
  }
  return base;
}

/** 聚合某 key 当前可用剩余次数（仅 count grant） */
export function aggregateRemaining(
  bag: EntitlementBag,
  key: EntitlementKey,
  nowMs: number,
): number {
  return grantsFor(bag, key)
    .filter((g) => isGrantValid(g, nowMs))
    .filter((g) => g.quotaType === 'count')
    .reduce((sum, g) => sum + Math.max(0, effectiveRemaining(g, nowMs)), 0);
}

function pickGrant(bag: EntitlementBag, key: EntitlementKey, nowMs: number) {
  const valid = grantsFor(bag, key).filter((g) => isGrantValid(g, nowMs));

  // period / once：任一有效即放行（不消耗次数）
  const nonCount = valid.find((g) => g.quotaType === 'period' || g.quotaType === 'once');
  if (nonCount) return { kind: 'noncount' as const, grant: nonCount };

  // count：选「最先到期且剩余>0」的 grant 消耗（先消耗快到期的，避免浪费）
  const countable = valid
    .filter((g) => g.quotaType === 'count' && effectiveRemaining(g, nowMs) > 0)
    .sort((a, b) => {
      const ta = a.expiresAt ? new Date(a.expiresAt).getTime() : Number.POSITIVE_INFINITY;
      const tb = b.expiresAt ? new Date(b.expiresAt).getTime() : Number.POSITIVE_INFINITY;
      return ta - tb;
    });
  if (countable.length > 0) return { kind: 'count' as const, grant: countable[0] };

  return { kind: 'none' as const };
}

/**
 * 权益查询（不扣减）。匿名用户直接 invalid_user。
 */
export async function evaluateAccess(
  kv: EntitlementKv,
  userId: string,
  key: EntitlementKey,
  now: NowInput = Date.now(),
): Promise<AccessCheck> {
  if (!userId || userId === 'anonymous') {
    return { allowed: false, key, reason: 'invalid_user' };
  }
  const nowMs = toMs(now);
  const bag = await readBag(kv, userId);
  const grants = grantsFor(bag, key);
  if (grants.length === 0) return { allowed: false, key, reason: 'no_entitlement' };

  const pick = pickGrant(bag, key, nowMs);
  if (pick.kind === 'none') {
    // 有 grant 但全部失效/用尽
    const anyUnexpired = grants.some((g) => isGrantValid(g, nowMs));
    return {
      allowed: false,
      key,
      reason: anyUnexpired ? 'quota_exhausted' : 'expired',
    };
  }
  return {
    allowed: true,
    key,
    grant: pick.grant,
    remainingCount: aggregateRemaining(bag, key, nowMs),
  };
}

/**
 * 配额扣减闸门（放行 LLM 前的唯一闸门）。
 * 成功 → 返回 allowed:true 与剩余次数；失败 → 拒绝原因，业务方不得调 LLM。
 */
export async function consumeEntitlement(
  kv: EntitlementKv,
  userId: string,
  key: EntitlementKey,
  now: NowInput = Date.now(),
): Promise<ConsumeResult> {
  if (!userId || userId === 'anonymous') {
    return { allowed: false, key, reason: 'invalid_user' };
  }
  const nowMs = toMs(now);
  const bag = await readBag(kv, userId);
  const grants = grantsFor(bag, key);
  if (grants.length === 0) return { allowed: false, key, reason: 'no_entitlement' };

  const pick = pickGrant(bag, key, nowMs);
  if (pick.kind === 'none') {
    const anyUnexpired = grants.some((g) => isGrantValid(g, nowMs));
    return { allowed: false, key, reason: anyUnexpired ? 'quota_exhausted' : 'expired' };
  }

  if (pick.kind === 'noncount') {
    // period / once：窗口内访问，不扣次数
    return {
      allowed: true,
      key,
      remainingCount: aggregateRemaining(bag, key, nowMs),
      source: pick.grant.source,
    };
  }

  // count：对命中 grant 扣 1（含周期重置回满后再扣）
  const target = pick.grant;
  const list = bag.items[key] as EntitlementGrant[];
  const idx = list.indexOf(target);
  const resetNow =
    target.resetCycle !== 'none' &&
    (!target.lastResetAt || nowMs - new Date(target.lastResetAt).getTime() >=
      (CYCLE_MS[target.resetCycle] ?? Number.POSITIVE_INFINITY));

  const nextRemaining = resetNow
    ? target.quotaValue - 1
    : Math.max(0, (typeof target.remaining === 'number' ? target.remaining : target.quotaValue) - 1);

  list[idx] = {
    ...target,
    remaining: nextRemaining,
    lastResetAt: resetNow ? new Date(nowMs).toISOString() : target.lastResetAt,
  };
  bag.items[key] = list;
  await writeBag(kv, userId, bag);

  return {
    allowed: true,
    key,
    remainingCount: aggregateRemaining(bag, key, nowMs),
    source: target.source,
  };
}

/** 列出某用户全部六键的可用状态（供 /entitlement 查询接口与 me 页） */
export async function summarizeEntitlements(
  kv: EntitlementKv,
  userId: string,
  now: NowInput = Date.now(),
): Promise<Record<EntitlementKey, { allowed: boolean; remainingCount?: number; reason?: string }>> {
  const out = {} as Record<EntitlementKey, { allowed: boolean; remainingCount?: number; reason?: string }>;
  for (const key of ENTITLEMENT_KEYS) {
    const r = await evaluateAccess(kv, userId, key, now);
    out[key] = {
      allowed: r.allowed,
      remainingCount: r.remainingCount,
      reason: r.reason,
    };
  }
  return out;
}
