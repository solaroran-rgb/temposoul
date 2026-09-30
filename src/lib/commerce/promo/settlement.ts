/**
 * T06 ｜ 结算钩子
 *
 * 位置：订单创建 / 结算时调用 `settleOrder`，把结果与 `discountLines` 一起写入订单（T04 orders 表）。
 * 策略：
 * - 先跑规则集（串行、防重复免单），得到规则优惠；
 * - 券只在**确定要抵扣**时才核销（先 inspect 试算，再 redeem 落库），绝不因试算烧券；
 * - 命中不可叠加规则时，规则优惠与券优惠**二选一取大**（默认口径），可叠加时券按折后金额再减。
 */

import type { PromoDiscountLine, SettlementInput, SettlementResult } from './types.ts';
import { DEFAULT_PROMO_CONFIG, applyRules, expandUnits, isInScope, sumUnits } from './rules.ts';
import { inspectCoupon, normalizeCode } from './coupon.ts';

export async function settleOrder(input: SettlementInput): Promise<SettlementResult> {
  const units = expandUnits(input.items);
  const subtotal = sumUnits(units);
  const userTags = input.userTags ?? [];
  const config = input.config ?? DEFAULT_PROMO_CONFIG;
  const trace: string[] = [
    `订单 ${input.orderId}：${units.length} 件，原价小计 ${subtotal} 分，规则集 ${config.version}`,
  ];

  const ruleRes = applyRules(config.rules, { units, subtotal, userTags });
  trace.push(...ruleRes.trace);

  let ruleDiscount = ruleRes.discount;
  let discountLines: PromoDiscountLine[] = ruleRes.outcomes.map((o) => ({
    source: 'rule' as const,
    sourceId: o.ruleId,
    label: o.label,
    amount: o.discount,
    affectedSkus: o.freeSkus,
    meta: { qualifiedUnits: o.qualifiedUnitCount, freeUnits: o.freeUnits.length },
  }));
  let appliedRuleIds = ruleRes.outcomes.map((o) => o.ruleId);
  let couponDiscount = 0;
  let couponInfo: SettlementResult['coupon'];

  // ── 权益券 ──
  const rawCode = input.couponCode ? normalizeCode(input.couponCode) : '';
  if (rawCode) {
    const store = input.couponStore;
    if (!store) {
      couponInfo = { code: rawCode, applied: false, reason: 'not_found' };
      trace.push(`券 ${rawCode} 未提供券仓，跳过券抵扣（试算模式）`);
    } else {
      const coupon = await store.get(rawCode);
      const scopedUnits = coupon
        ? units.filter(
            (u) =>
              !ruleRes.claimedIndexes.has(u.index) && isInScope(u.category, u.sku, coupon.scope),
          )
        : [];

      const exclusive = ruleRes.hasNonStackableRule && ruleDiscount > 0;
      const verdict = inspectCoupon(
        coupon,
        {
          orderId: input.orderId,
          userId: input.userId,
          now: input.now,
        },
        {
          subtotal,
          scopedUnits,
          ruleDiscount,
          stacked: !exclusive,
        },
      );

      if (!verdict.ok) {
        couponInfo = { code: rawCode, applied: false, reason: verdict.reason };
        trace.push(`券 ${rawCode} 不可用：${verdict.reason}`);
      } else if (exclusive && verdict.discount <= ruleDiscount) {
        // 规则更优惠 → 不烧券
        couponInfo = { code: rawCode, applied: false };
        trace.push(
          `券 ${rawCode} 可抵 ${verdict.discount} 分 ≤ 规则优惠 ${ruleDiscount} 分，规则与券不叠加，取规则，券未核销`,
        );
      } else {
        const redeem = await store.redeem(rawCode, {
          orderId: input.orderId,
          userId: input.userId,
          now: input.now,
        });
        if (!redeem.ok) {
          couponInfo = { code: rawCode, applied: false, reason: redeem.reason };
          trace.push(`券 ${rawCode} 核销失败：${redeem.reason}`);
        } else {
          couponDiscount = verdict.discount;
          couponInfo = { code: rawCode, applied: true, idempotent: redeem.idempotent };
          if (exclusive) {
            // 券更优惠 → 丢弃规则明细
            trace.push(
              `券 ${rawCode} 可抵 ${couponDiscount} 分 > 规则优惠 ${ruleDiscount} 分，取券，规则明细作废`,
            );
            ruleDiscount = 0;
            discountLines = [];
            appliedRuleIds = [];
          } else {
            trace.push(
              `券 ${rawCode} 抵扣 ${couponDiscount} 分（${redeem.idempotent ? '幂等命中' : '首次核销'}）`,
            );
          }
          discountLines.push({
            source: 'coupon',
            sourceId: rawCode,
            label: `权益券 ${rawCode}`,
            amount: couponDiscount,
            affectedSkus: [...new Set(scopedUnits.map((u) => u.sku))],
            meta: { type: redeem.coupon.type, mode: exclusive ? 'exclusive' : 'stacked' },
          });
        }
      }
    }
  }

  const totalDiscount = Math.min(subtotal, ruleDiscount + couponDiscount);
  return {
    orderId: input.orderId,
    subtotal,
    discountLines,
    ruleDiscount,
    couponDiscount,
    totalDiscount,
    payable: Math.max(0, subtotal - totalDiscount),
    appliedRuleIds,
    coupon: couponInfo,
    trace,
  };
}

/**
 * 纯试算（不读券仓、不核销），用于购物车价格预览。
 * 需要精确券抵扣时传 store 走 settleOrder。
 */
export function previewRules(
  input: Pick<SettlementInput, 'items' | 'userTags'> & { config?: SettlementInput['config'] },
): { subtotal: number; discount: number; payable: number; lines: PromoDiscountLine[] } {
  const units = expandUnits(input.items);
  const subtotal = sumUnits(units);
  const res = applyRules((input.config ?? DEFAULT_PROMO_CONFIG).rules, {
    units,
    subtotal,
    userTags: input.userTags ?? [],
  });
  return {
    subtotal,
    discount: res.discount,
    payable: Math.max(0, subtotal - res.discount),
    lines: res.outcomes.map((o) => ({
      source: 'rule' as const,
      sourceId: o.ruleId,
      label: o.label,
      amount: o.discount,
      affectedSkus: o.freeSkus,
      meta: { qualifiedUnits: o.qualifiedUnitCount, freeUnits: o.freeUnits.length },
    })),
  };
}
