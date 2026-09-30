/**
 * T06 ｜ 促销规则引擎 + 权益券模型 · 对外出口
 *
 * 用法（订单创建 / 结算钩子）：
 * ```ts
 * const result = await settleOrder({
 *   orderId, userId, items, now: Date.now(),
 *   couponCode, couponStore,
 *   config: resolvePromoConfig(env.PROMO_RULES_JSON),
 * });
 * // 把 result.discountLines / result.payable / result.trace 一起写入 orders 表
 * ```
 */

export type {
  Coupon,
  CouponRedeemContext,
  CouponRedeemResult,
  CouponRejectReason,
  CouponStatus,
  CouponStore,
  CouponType,
  PromoCategory,
  PromoConfig,
  PromoDiscountLine,
  PromoLineItem,
  PromoRule,
  PromoRuleAction,
  PromoRuleCondition,
  PromoRuleOutcome,
  PromoScope,
  PromoScopeKind,
  PromoUnit,
  SettlementInput,
  SettlementResult,
} from './types.ts';

export type { ApplyRulesResult } from './rules.ts';
export type { CouponBaseInput } from './coupon.ts';

export {
  DEFAULT_PROMO_CONFIG,
  DEFAULT_PROMO_RULE_ID,
  DEFAULT_SKU_CATEGORY,
  applyRule,
  applyRules,
  expandUnits,
  filterQualifiedUnits,
  isInScope,
  resolvePromoConfig,
  sumUnits,
} from './rules.ts';

export {
  computeCouponDiscount,
  createInMemoryCouponStore,
  inspectCoupon,
  isWithinValidity,
  normalizeCode,
  validateCoupon,
} from './coupon.ts';

export { previewRules, settleOrder } from './settlement.ts';
