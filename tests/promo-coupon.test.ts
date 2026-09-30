import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  computeCouponDiscount,
  createInMemoryCouponStore,
  inspectCoupon,
  isWithinValidity,
  normalizeCode,
  validateCoupon,
} from '../src/lib/commerce/promo/coupon.ts';
import { expandUnits, sumUnits } from '../src/lib/commerce/promo/rules.ts';
import type { Coupon, PromoLineItem } from '../src/lib/commerce/promo/types.ts';

const NOW = Date.UTC(2026, 8, 30, 12, 0, 0); // 2026-09-30T12:00:00Z
const DAY = 24 * 3600 * 1000;

const baseCoupon = (over: Partial<Coupon> = {}): Coupon => ({
  code: 'TS-VIP-001',
  type: 'amount_off',
  status: 'issued',
  scope: { kind: 'all', skus: [], excludeSkus: [] },
  amountOff: 2000, // ¥20
  applyOn: 'subtotal',
  validFrom: NOW - DAY,
  validTo: NOW + DAY,
  ...over,
});

const items: PromoLineItem[] = [
  { sku: 'report_39_9', category: 'report', unitPrice: 3990, quantity: 1 },
  { sku: 'premium_88', category: 'report', unitPrice: 8800, quantity: 1 },
];

const ctxOf = (orderId: string, userId = 'u-1', now = NOW) => ({ orderId, userId, now });

function baseInput(over: Partial<Parameters<typeof computeCouponDiscount>[1]> = {}) {
  const units = expandUnits(items);
  return {
    subtotal: sumUnits(units),
    scopedUnits: units,
    ruleDiscount: 0,
    stacked: false,
    ...over,
  };
}

// ───────────────── 券码与配置校验 ─────────────────

test('券码归一化：空白与大小写不敏感', () => {
  assert.equal(normalizeCode('  ts-vip-001 '), 'TS-VIP-001');
  assert.equal(normalizeCode('ABC'), 'ABC');
});

test('券配置校验：缺参数 / 折扣区间非法 / 有效期倒挂一律判为 invalid_config', () => {
  assert.equal(validateCoupon(baseCoupon({ amountOff: 0 })), 'invalid_config');
  assert.equal(
    validateCoupon(baseCoupon({ type: 'percent_off', percentOff: 120 })),
    'invalid_config',
  );
  assert.equal(
    validateCoupon(baseCoupon({ validFrom: NOW, validTo: NOW - DAY })),
    'invalid_config',
  );
  assert.equal(validateCoupon(baseCoupon()), null);
  assert.equal(validateCoupon(baseCoupon({ type: 'percent_off', percentOff: 15 })), null);
});

test('有效期判定：左闭右开 [validFrom, validTo)', () => {
  const c = baseCoupon({ validFrom: NOW, validTo: NOW + DAY });
  assert.equal(isWithinValidity(c, NOW), true);
  assert.equal(isWithinValidity(c, NOW - 1), false);
  assert.equal(isWithinValidity(c, NOW + DAY), false);
});

// ───────────────── 抵扣计算 ─────────────────

test('固定金额券：按面额抵扣且不超过基数', () => {
  assert.equal(computeCouponDiscount(baseCoupon(), baseInput()), 2000);
  assert.equal(
    computeCouponDiscount(baseCoupon({ amountOff: 99999 }), baseInput()),
    12790,
    '抵扣不会超过应付基数',
  );
});

test('折扣券：向下取整到分，让利取小', () => {
  // 12790 * 15% = 1918.5 → 1918
  assert.equal(
    computeCouponDiscount(baseCoupon({ type: 'percent_off', percentOff: 15 }), baseInput()),
    1918,
  );
});

test('折扣券：maxDiscount 封顶生效', () => {
  // 12790 * 50% = 6395 → 封顶 1000
  assert.equal(
    computeCouponDiscount(
      baseCoupon({ type: 'percent_off', percentOff: 50, maxDiscount: 1000 }),
      baseInput(),
    ),
    1000,
  );
});

test('券门槛 minSpend 按原价小计判定', () => {
  assert.equal(
    computeCouponDiscount(baseCoupon({ minSpend: 20000 }), baseInput()),
    0,
    '小计 12790 < 20000，不可用',
  );
  assert.equal(computeCouponDiscount(baseCoupon({ minSpend: 10000 }), baseInput()), 2000);
});

test('券适用域：applyOn=qualified_subtotal 只按域内商品计算', () => {
  const units = expandUnits(items);
  const scoped = units.filter((u) => u.sku === 'report_39_9');
  assert.equal(
    computeCouponDiscount(
      baseCoupon({ type: 'percent_off', percentOff: 10, applyOn: 'qualified_subtotal' }),
      baseInput({ scopedUnits: scoped }),
    ),
    399,
    '3990 * 10% = 399',
  );
});

test('叠加模式：券的基数扣除规则已减金额', () => {
  assert.equal(
    computeCouponDiscount(
      baseCoupon({ type: 'percent_off', percentOff: 10 }),
      baseInput({ ruleDiscount: 2790, stacked: true }),
    ),
    1000,
    '(12790 - 2790) * 10% = 1000',
  );
});

// ───────────────── 只读检查（不烧券） ─────────────────

test('inspectCoupon：过期 / 未开始 / 作废 / 非本人 分别给出原因', () => {
  assert.deepEqual(inspectCoupon(baseCoupon({ validTo: NOW - 1 }), ctxOf('o1'), baseInput()), {
    ok: false,
    reason: 'expired',
  });
  assert.deepEqual(
    inspectCoupon(
      baseCoupon({ validFrom: NOW + DAY, validTo: NOW + 2 * DAY }),
      ctxOf('o1'),
      baseInput(),
    ),
    {
      ok: false,
      reason: 'not_started',
    },
  );
  assert.deepEqual(inspectCoupon(baseCoupon({ status: 'revoked' }), ctxOf('o1'), baseInput()), {
    ok: false,
    reason: 'revoked',
  });
  assert.deepEqual(inspectCoupon(baseCoupon({ ownerUserId: 'u-2' }), ctxOf('o1'), baseInput()), {
    ok: false,
    reason: 'not_owner',
  });
  assert.deepEqual(inspectCoupon(null, ctxOf('o1'), baseInput()), {
    ok: false,
    reason: 'not_found',
  });
});

test('inspectCoupon：适用域为空商品时不通过，且不产生副作用', async () => {
  const store = createInMemoryCouponStore([baseCoupon()]);
  const coupon = await store.get('ts-vip-001');
  assert.deepEqual(inspectCoupon(coupon, ctxOf('o1'), baseInput({ scopedUnits: [] })), {
    ok: false,
    reason: 'scope_not_match',
  });
  const after = await store.get('ts-vip-001');
  assert.equal(after?.status, 'issued', '检查阶段券仍是未核销状态');
});

// ───────────────── 幂等：一张券只能用一次 ─────────────────

test('券幂等：同一订单重复核销结果一致，不重复抵扣', async () => {
  const store = createInMemoryCouponStore([baseCoupon()]);
  const first = await store.redeem('ts-vip-001', ctxOf('order-A'));
  const second = await store.redeem('ts-vip-001', ctxOf('order-A'));
  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(first.ok && first.idempotent, false, '首次核销非幂等');
  assert.equal(second.ok && second.idempotent, true, '重复提交命中幂等');
  const stored = await store.get('ts-vip-001');
  assert.equal(stored?.status, 'used');
  assert.equal(stored?.usedByOrderId, 'order-A');
});

test('券幂等：换订单重复核销被拒绝', async () => {
  const store = createInMemoryCouponStore([baseCoupon()]);
  assert.equal((await store.redeem('TS-VIP-001', ctxOf('order-A'))).ok, true);
  const other = await store.redeem('ts-vip-001', ctxOf('order-B'));
  assert.equal(other.ok, false);
  assert.equal(!other.ok && other.reason, 'already_used');
});

test('券幂等：已核销的券对本订单仍可读出抵扣额（幂等重放）', () => {
  const used = baseCoupon({
    status: 'used',
    usedByOrderId: 'order-A',
    usedAt: NOW,
    usedByUser: 'u-1',
  });
  assert.equal(inspectCoupon(used, ctxOf('order-A'), baseInput()).ok, true);
  assert.equal(inspectCoupon(used, ctxOf('order-C'), baseInput()).ok, false);
});

test('券幂等：过期券在核销时被惰性标记为 expired', async () => {
  const store = createInMemoryCouponStore([baseCoupon({ validTo: NOW - 1 })]);
  const res = await store.redeem('ts-vip-001', ctxOf('order-A'));
  assert.equal(res.ok, false);
  assert.equal(!res.ok && res.reason, 'expired');
  assert.equal((await store.get('ts-vip-001'))?.status, 'expired');
});
