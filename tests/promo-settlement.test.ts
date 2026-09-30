import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { settleOrder, previewRules } from '../src/lib/commerce/promo/settlement.ts';
import { createInMemoryCouponStore } from '../src/lib/commerce/promo/coupon.ts';
import { DEFAULT_PROMO_CONFIG } from '../src/lib/commerce/promo/rules.ts';
import type {
  Coupon,
  PromoConfig,
  PromoLineItem,
  SettlementInput,
} from '../src/lib/commerce/promo/types.ts';

const NOW = Date.UTC(2026, 8, 30, 12, 0, 0);

/** 3 件报告：990 / 3990 / 8800 → 小计 13780，买三免一应免 990 */
const threeReports: PromoLineItem[] = [
  { sku: 'event_9_9', category: 'report', unitPrice: 990, quantity: 1 },
  { sku: 'report_39_9', category: 'report', unitPrice: 3990, quantity: 1 },
  { sku: 'premium_88', category: 'report', unitPrice: 8800, quantity: 1 },
];

const coupon = (over: Partial<Coupon> = {}): Coupon => ({
  code: 'TS-SETTLE-1',
  type: 'amount_off',
  status: 'issued',
  scope: { kind: 'all', skus: [], excludeSkus: [] },
  amountOff: 5000,
  applyOn: 'subtotal',
  validFrom: NOW - 86400000,
  validTo: NOW + 86400000,
  ...over,
});

function inputOf(over: Partial<SettlementInput> = {}): SettlementInput {
  return {
    orderId: 'order-1',
    userId: 'u-1',
    items: threeReports,
    now: NOW,
    ...over,
  };
}

// ───────────────── 结算基线 ─────────────────

test('结算：3 件报告命中买三免一，应付 = 小计 - 最低价', async () => {
  const r = await settleOrder(inputOf());
  assert.equal(r.subtotal, 13780);
  assert.equal(r.ruleDiscount, 990);
  assert.equal(r.couponDiscount, 0);
  assert.equal(r.totalDiscount, 990);
  assert.equal(r.payable, 12790);
  assert.deepEqual(r.appliedRuleIds, ['buy3_get1_free_v1']);
});

test('结算：2 件不免，应付等于原价小计', async () => {
  const r = await settleOrder(inputOf({ items: threeReports.slice(0, 2), orderId: 'order-2' }));
  assert.equal(r.ruleDiscount, 0);
  assert.equal(r.payable, r.subtotal);
});

test('结算：优惠明细可追溯（来源 / 规则 id / 金额 / 命中 SKU）', async () => {
  const r = await settleOrder(inputOf());
  assert.equal(r.discountLines.length, 1);
  const line = r.discountLines[0];
  assert.equal(line.source, 'rule');
  assert.equal(line.sourceId, 'buy3_get1_free_v1');
  assert.equal(line.amount, 990);
  assert.deepEqual(line.affectedSkus, ['event_9_9']);
  assert.ok(r.trace.length >= 2, '审计轨迹非空');
});

// ───────────────── 规则与券的叠加策略 ─────────────────

test('不叠加（默认）：规则更优时只走规则，券不被烧掉', async () => {
  const store = createInMemoryCouponStore([coupon({ amountOff: 500 })]);
  const r = await settleOrder(inputOf({ couponCode: 'ts-settle-1', couponStore: store }));
  assert.equal(r.ruleDiscount, 990);
  assert.equal(r.couponDiscount, 0);
  assert.equal(r.payable, 12790);
  assert.equal(r.coupon?.applied, false);
  assert.equal((await store.get('TS-SETTLE-1'))?.status, 'issued', '券仍是未核销状态');
});

test('不叠加（默认）：券更优时改走券，规则明细作废', async () => {
  const store = createInMemoryCouponStore([coupon({ amountOff: 5000 })]);
  const r = await settleOrder(inputOf({ couponCode: 'TS-SETTLE-1', couponStore: store }));
  assert.equal(r.ruleDiscount, 0);
  assert.deepEqual(r.appliedRuleIds, [], '规则明细被丢弃');
  assert.equal(r.couponDiscount, 5000);
  assert.equal(r.payable, 8780);
  assert.equal(r.coupon?.applied, true);
  assert.equal((await store.get('TS-SETTLE-1'))?.status, 'used');
});

test('可叠加：规则免单后券按折后金额再减', async () => {
  const config: PromoConfig = {
    version: 'test.stackable',
    rules: [
      {
        ...DEFAULT_PROMO_CONFIG.rules[0],
        stackableWithCoupon: true,
      },
    ],
  };
  const store = createInMemoryCouponStore([
    coupon({ type: 'percent_off', percentOff: 10, amountOff: undefined }),
  ]);
  const r = await settleOrder(
    inputOf({ config, couponCode: 'TS-SETTLE-1', couponStore: store, orderId: 'order-3' }),
  );
  // 规则免 990 → 折后 12790；券 10% = 1279
  assert.equal(r.ruleDiscount, 990);
  assert.equal(r.couponDiscount, 1279);
  assert.equal(r.totalDiscount, 2269);
  assert.equal(r.payable, 11511);
  assert.equal(r.coupon?.applied, true);
});

// ───────────────── 幂等与异常 ─────────────────

test('幂等：同一订单重复结算结果一致，券只核销一次', async () => {
  const store = createInMemoryCouponStore([coupon({ amountOff: 5000 })]);
  const first = await settleOrder(inputOf({ couponCode: 'TS-SETTLE-1', couponStore: store }));
  const second = await settleOrder(inputOf({ couponCode: 'TS-SETTLE-1', couponStore: store }));
  assert.equal(second.payable, first.payable);
  assert.equal(second.couponDiscount, first.couponDiscount);
  assert.equal(first.coupon?.idempotent, false);
  assert.equal(second.coupon?.idempotent, true, '重放命中幂等，不二次抵扣');
});

test('幂等：券被别的订单用掉后，本订单不可用', async () => {
  const store = createInMemoryCouponStore([coupon({ amountOff: 5000 })]);
  await store.redeem('TS-SETTLE-1', { orderId: 'order-X', userId: 'u-9', now: NOW });
  const r = await settleOrder(
    inputOf({ couponCode: 'TS-SETTLE-1', couponStore: store, orderId: 'order-4' }),
  );
  assert.equal(r.coupon?.applied, false);
  assert.equal(r.coupon?.reason, 'already_used');
  assert.equal(r.payable, 12790, '回落到规则优惠');
});

test('异常：券过期 / 券不存在 / 未提供券仓，均不影响规则结算', async () => {
  const expiredStore = createInMemoryCouponStore([coupon({ validTo: NOW - 1 })]);
  const r1 = await settleOrder(inputOf({ couponCode: 'TS-SETTLE-1', couponStore: expiredStore }));
  assert.equal(r1.coupon?.reason, 'expired');
  assert.equal(r1.payable, 12790);

  const emptyStore = createInMemoryCouponStore([]);
  const r2 = await settleOrder(
    inputOf({ couponCode: 'NOPE', couponStore: emptyStore, orderId: 'order-5' }),
  );
  assert.equal(r2.coupon?.reason, 'not_found');

  const r3 = await settleOrder(inputOf({ couponCode: 'TS-SETTLE-1', orderId: 'order-6' }));
  assert.equal(r3.coupon?.applied, false, '无券仓 = 试算，不抵扣');
  assert.equal(r3.payable, 12790);
});

test('边界：优惠不会把应付打成负数', async () => {
  const store = createInMemoryCouponStore([coupon({ amountOff: 999999 })]);
  const r = await settleOrder(
    inputOf({ couponCode: 'TS-SETTLE-1', couponStore: store, orderId: 'order-7' }),
  );
  assert.equal(r.payable, 0);
  assert.ok(r.totalDiscount <= r.subtotal);
});

// ───────────────── 购物车试算 ─────────────────

test('试算：previewRules 不碰券仓，只算规则', () => {
  const p = previewRules({ items: threeReports });
  assert.equal(p.subtotal, 13780);
  assert.equal(p.discount, 990);
  assert.equal(p.payable, 12790);
  assert.equal(p.lines.length, 1);
});
