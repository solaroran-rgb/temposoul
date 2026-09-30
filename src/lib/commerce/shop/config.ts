/**
 * T14 轻量商店 · 配置层
 *
 * 设计原则（对齐 T06）：配置即数据、可 JSON 序列化；非法配置一律回退默认值，
 * **绝不阻断下单**。金额单位统一「分」。
 */

import type { PointsEntry } from './types.ts';

/** 积分抵扣策略 */
export interface PointsPolicy {
  version: string;
  /** 总开关：false 时结算跳过积分抵扣 */
  enabled: boolean;
  /** 兑换率：多少积分抵 1 元（默认 100 积分 = ¥1） */
  pointsPerYuan: number;
  /** 单笔最多抵扣「应付金额」的比例，0~1（默认 0.5 = 最多抵一半） */
  maxDeductRatio: number;
  /** 单笔最多可用积分，0 = 不限 */
  maxPointsPerOrder: number;
  /** 订单应付低于该金额（分）时不参与抵扣，默认 0 */
  minOrderCents: number;
}

export const DEFAULT_POINTS_POLICY: PointsPolicy = {
  version: 'points_v1',
  enabled: true,
  pointsPerYuan: 100,
  maxDeductRatio: 0.5,
  maxPointsPerOrder: 0,
  minOrderCents: 0,
};

/** 默认币种 */
export const DEFAULT_CURRENCY = 'CNY';

/** 购物车单行最大件数（防刷） */
export const MAX_QUANTITY_PER_LINE = 99;
/** 购物车最多行数 */
export const MAX_CART_LINES = 50;

/**
 * 解析积分策略：JSON 非法 / 字段越界 → 回退默认值（逐字段校验，部分合法部分生效）。
 */
export function resolvePointsPolicy(raw?: string | null): PointsPolicy {
  if (!raw) return { ...DEFAULT_POINTS_POLICY };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ...DEFAULT_POINTS_POLICY };
  }
  if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_POINTS_POLICY };
  const obj = parsed as Record<string, unknown>;

  const num = (v: unknown, fallback: number): number =>
    typeof v === 'number' && Number.isFinite(v) ? v : fallback;

  const policy: PointsPolicy = {
    version: typeof obj.version === 'string' ? obj.version : DEFAULT_POINTS_POLICY.version,
    enabled: typeof obj.enabled === 'boolean' ? obj.enabled : DEFAULT_POINTS_POLICY.enabled,
    pointsPerYuan: num(obj.pointsPerYuan, DEFAULT_POINTS_POLICY.pointsPerYuan),
    maxDeductRatio: num(obj.maxDeductRatio, DEFAULT_POINTS_POLICY.maxDeductRatio),
    maxPointsPerOrder: num(obj.maxPointsPerOrder, DEFAULT_POINTS_POLICY.maxPointsPerOrder),
    minOrderCents: num(obj.minOrderCents, DEFAULT_POINTS_POLICY.minOrderCents),
  };

  // 兜底钳制：兑换率必须为正；比例限制在 0~1；上限不得为负
  if (policy.pointsPerYuan <= 0) policy.pointsPerYuan = DEFAULT_POINTS_POLICY.pointsPerYuan;
  if (policy.maxDeductRatio < 0) policy.maxDeductRatio = 0;
  if (policy.maxDeductRatio > 1) policy.maxDeductRatio = 1;
  if (policy.maxPointsPerOrder < 0) policy.maxPointsPerOrder = 0;
  if (policy.minOrderCents < 0) policy.minOrderCents = 0;

  return policy;
}

/** 积分抵扣试算结果 */
export interface PointsQuote {
  /** 实际可用积分（整数） */
  pointsUsed: number;
  /** 抵扣金额（分） */
  discountCents: number;
  /** 抵扣后应付（分） */
  payableCents: number;
  /** 未参与抵扣的原因（enabled=false / 低于门槛 / 余额为 0 等），正常抵扣时为空串 */
  reason: string;
}

/**
 * 纯函数试算积分抵扣（无副作用、无 Date.now，便于测试与重放）。
 *
 * 计算顺序（保守取整，宁可少抵不多抵）：
 *   1. 上限金额 = floor(应付 × 比例)
 *   2. 上限积分 = floor(上限金额 × pointsPerYuan / 100)
 *   3. 实际积分 = min(余额, 上限积分, 单笔积分上限)
 *   4. 抵扣金额 = floor(实际积分 × 100 / pointsPerYuan)
 */
export function quotePointsDeduction(
  payableCents: number,
  balance: number,
  policy: PointsPolicy,
): PointsQuote {
  if (!policy.enabled) {
    return { pointsUsed: 0, discountCents: 0, payableCents, reason: 'points_disabled' };
  }
  if (payableCents <= 0) {
    return { pointsUsed: 0, discountCents: 0, payableCents, reason: 'nothing_to_pay' };
  }
  if (policy.minOrderCents > 0 && payableCents < policy.minOrderCents) {
    return { pointsUsed: 0, discountCents: 0, payableCents, reason: 'below_min_order' };
  }
  if (balance <= 0) {
    return { pointsUsed: 0, discountCents: 0, payableCents, reason: 'empty_balance' };
  }

  const capCents = Math.floor(payableCents * policy.maxDeductRatio);
  let capPoints = Math.floor((capCents * policy.pointsPerYuan) / 100);
  if (policy.maxPointsPerOrder > 0) capPoints = Math.min(capPoints, policy.maxPointsPerOrder);

  const pointsUsed = Math.max(0, Math.min(balance, capPoints));
  const discountCents = Math.min(
    payableCents,
    Math.floor((pointsUsed * 100) / policy.pointsPerYuan),
  );

  return {
    pointsUsed,
    discountCents,
    payableCents: payableCents - discountCents,
    reason: pointsUsed > 0 ? '' : 'no_usable_points',
  };
}

/** 流水排序：时间升序（余额按流水累加顺序可复算） */
export function sortEntries(entries: PointsEntry[]): PointsEntry[] {
  return entries.slice().sort((a, b) => {
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? -1 : 1;
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });
}
