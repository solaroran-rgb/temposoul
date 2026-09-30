/**
 * T06 ｜ 权益券模型
 *
 * 幂等铁律：一张券只能核销一次。
 * - 同一订单重复提交（网络重试 / 钩子重放）→ 命中 `usedByOrderId === orderId`，返回一致结果，不二次抵扣。
 * - 换订单重复核销 → 拒绝（already_used）。
 * 只有**确定要抵扣**时才调用 redeem；试算阶段一律走 inspect，绝不提前烧券。
 */

import type {
  Coupon,
  CouponRedeemContext,
  CouponRejectReason,
  CouponStore,
  PromoUnit,
} from './types.ts';
import { sumUnits } from './rules.ts';

/** 券码归一化：去空白 + 大写，避免 "abc " 与 "ABC" 被当成两张券 */
export function normalizeCode(code: string): string {
  return code.trim().toUpperCase();
}

/** 券自身配置是否合法（防止脏数据算出负优惠 / 超额抵扣） */
export function validateCoupon(coupon: Coupon): CouponRejectReason | null {
  if (!coupon.code || !coupon.type) return 'invalid_config';
  if (coupon.type === 'amount_off' && !(coupon.amountOff && coupon.amountOff > 0)) {
    return 'invalid_config';
  }
  if (coupon.type === 'percent_off') {
    if (!(coupon.percentOff && coupon.percentOff > 0 && coupon.percentOff <= 100)) {
      return 'invalid_config';
    }
  }
  if (coupon.validTo <= coupon.validFrom) return 'invalid_config';
  return null;
}

/** 有效期判定（左闭右开：[validFrom, validTo)） */
export function isWithinValidity(coupon: Coupon, now: number): boolean {
  return now >= coupon.validFrom && now < coupon.validTo;
}

export interface CouponBaseInput {
  /** 全单原价小计（分） */
  subtotal: number;
  /** 适用域内且未被规则占用的件 */
  scopedUnits: readonly PromoUnit[];
  /** 规则已减免的金额（分），叠加模式下券的基数会扣掉它 */
  ruleDiscount: number;
  /** 是否与规则叠加 */
  stacked: boolean;
}

/**
 * 计算券抵扣金额（分）。
 * - 门槛 minSpend 按**原价小计**判定（行业惯例，避免被规则优惠顶掉门槛）。
 * - percent_off 向下取整到分，并受 maxDiscount 封顶。
 * - 结果永不为负且不超过基数。
 */
export function computeCouponDiscount(coupon: Coupon, input: CouponBaseInput): number {
  const scopedTotal = sumUnits(input.scopedUnits);
  const rawBase = coupon.applyOn === 'qualified_subtotal' ? scopedTotal : input.subtotal;
  const base = input.stacked ? Math.max(0, rawBase - input.ruleDiscount) : rawBase;
  if (base <= 0) return 0;
  if (coupon.minSpend && coupon.minSpend > 0 && input.subtotal < coupon.minSpend) return 0;

  let discount =
    coupon.type === 'amount_off'
      ? Math.max(0, Math.round(coupon.amountOff ?? 0))
      : Math.floor((base * Math.max(0, coupon.percentOff ?? 0)) / 100);

  if (coupon.type === 'percent_off' && coupon.maxDiscount && coupon.maxDiscount > 0) {
    discount = Math.min(discount, coupon.maxDiscount);
  }
  return Math.max(0, Math.min(discount, base));
}

/** 只读检查：判断券能否用于本次结算，**不产生任何副作用** */
export function inspectCoupon(
  coupon: Coupon | null,
  ctx: CouponRedeemContext,
  input: CouponBaseInput,
): { ok: true; discount: number } | { ok: false; reason: CouponRejectReason } {
  if (!coupon) return { ok: false, reason: 'not_found' };
  const invalid = validateCoupon(coupon);
  if (invalid) return { ok: false, reason: invalid };

  if (coupon.status === 'revoked') return { ok: false, reason: 'revoked' };
  if (coupon.status === 'expired') return { ok: false, reason: 'expired' };
  if (coupon.status === 'used') {
    return coupon.usedByOrderId === ctx.orderId
      ? { ok: true, discount: computeCouponDiscount(coupon, input) }
      : { ok: false, reason: 'already_used' };
  }
  if (!isWithinValidity(coupon, ctx.now)) {
    return ctx.now < coupon.validFrom
      ? { ok: false, reason: 'not_started' }
      : { ok: false, reason: 'expired' };
  }
  if (coupon.ownerUserId && coupon.ownerUserId !== ctx.userId) {
    return { ok: false, reason: 'not_owner' };
  }
  if (input.scopedUnits.length === 0) return { ok: false, reason: 'scope_not_match' };
  if (coupon.minSpend && coupon.minSpend > 0 && input.subtotal < coupon.minSpend) {
    return { ok: false, reason: 'below_min_spend' };
  }
  const discount = computeCouponDiscount(coupon, input);
  if (discount <= 0) return { ok: false, reason: 'scope_not_match' };
  return { ok: true, discount };
}

/**
 * 内存券仓（默认实现）。
 * 生产落库请替换为 D1 / KV 实现（对接 T04 orders 表），接口不变。
 */
export function createInMemoryCouponStore(seed: readonly Coupon[] = []): CouponStore {
  const table = new Map<string, Coupon>();
  for (const c of seed) table.set(normalizeCode(c.code), { ...c });

  return {
    async get(code) {
      const found = table.get(normalizeCode(code));
      return found ? { ...found } : null;
    },
    async save(coupon) {
      table.set(normalizeCode(coupon.code), { ...coupon });
    },
    async redeem(code, ctx) {
      const key = normalizeCode(code);
      const current = table.get(key);
      if (!current) return { ok: false, reason: 'not_found' };
      if (current.status === 'used') {
        return current.usedByOrderId === ctx.orderId
          ? { ok: true, coupon: { ...current }, idempotent: true }
          : { ok: false, reason: 'already_used' };
      }
      if (current.status === 'revoked') return { ok: false, reason: 'revoked' };
      if (current.status === 'expired') return { ok: false, reason: 'expired' };
      if (ctx.now >= current.validTo) {
        const expired: Coupon = { ...current, status: 'expired' };
        table.set(key, expired);
        return { ok: false, reason: 'expired' };
      }
      if (ctx.now < current.validFrom) return { ok: false, reason: 'not_started' };
      if (current.ownerUserId && current.ownerUserId !== ctx.userId) {
        return { ok: false, reason: 'not_owner' };
      }
      const used: Coupon = {
        ...current,
        status: 'used',
        usedAt: ctx.now,
        usedByOrderId: ctx.orderId,
        usedByUser: ctx.userId,
      };
      table.set(key, used);
      return { ok: true, coupon: { ...used }, idempotent: false };
    },
  };
}
