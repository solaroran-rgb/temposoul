/**
 * T14 轻量商店 · 结算与订单状态机
 *
 * 链路：购物车 → 商品快照计价 → T06 促销结算（规则，券为预留） → 积分抵扣 → 落订单（KV + D1 orders）
 *      → 创建支付单 →（支付确认）→ 订单 completed。
 *
 * 幂等：同一 (userId, idempotencyKey) 派生出同一个 checkoutId，订单 id 再由 (checkoutId, sku) 派生，
 *      所有写入都落到**确定性的键**上 → 并发重复提交 = 重复覆盖同一批键，不产生第二条订单。
 * 并发：不同 checkoutId 各自成键，互不覆盖，不丢单；积分流水按 refId 成键，不重复扣也不丢扣。
 */

import { DEFAULT_CURRENCY, quotePointsDeduction, resolvePointsPolicy } from './config.ts';
import { decreaseStock, increaseStock, ShopError } from './catalog.ts';
import { clearUserCart, getCart, resolveCartProducts } from './cart.ts';
import { getBalance, refundPoints, spendPoints } from './points.ts';
import { createPaymentProvider } from './payment.ts';
import {
  genCheckoutId,
  getCheckout,
  getOrder,
  putCheckout,
  putOrder,
  readIdempotency,
  stableHash,
  writeIdempotency,
} from './store.ts';
import { resolvePromoConfig, settleOrder, type CouponStore } from '../promo/index.ts';
import { OrdersStore } from '../../server/orders.ts';
import type {
  CheckoutRecord,
  PaymentIntent,
  Product,
  ShopEnv,
  ShopOrder,
} from './types.ts';

export interface CheckoutInput {
  userId: string;
  /** 幂等键（建议：前端生成 UUID 或「购物车指纹」）；不传则每次下单都是新单 */
  idempotencyKey?: string;
  /** 权益券码：预留（T06 衔接）。未提供券仓时只试算不核销 */
  couponCode?: string;
  /** 券仓：预留接口，T06 落地后注入即可生效 */
  couponStore?: CouponStore;
  userTags?: string[];
  /** 结算时刻（ms），不传取当前时间 */
  now?: number;
}

export interface CheckoutResult {
  checkout: CheckoutRecord;
  orders: ShopOrder[];
  payment: PaymentIntent;
  /** true = 命中幂等键，回放的是首次结果 */
  replayed: boolean;
}

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * 最大余额法金额分摊：把 total 按 weights 比例拆成整数数组，保证 sum(结果) === total。
 * weights 全为 0 时按等分处理（保证总额不丢）。
 */
export function allocateAmounts(total: number, weights: number[]): number[] {
  const n = weights.length;
  if (n === 0) return [];
  const sum = weights.reduce((a, b) => a + b, 0);
  if (total <= 0) return new Array(n).fill(0);

  if (sum <= 0) {
    const base = Math.floor(total / n);
    const out = new Array(n).fill(base);
    for (let i = 0; i < total - base * n; i += 1) out[i] += 1;
    return out;
  }

  const raw = weights.map((w) => (total * w) / sum);
  const out = raw.map((v) => Math.floor(v));
  let rest = total - out.reduce((a, b) => a + b, 0);
  // 余数按小数部分降序派发；同小数按 index 升序 —— 确定性，无随机
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => (b.frac !== a.frac ? b.frac - a.frac : a.i - b.i));
  let k = 0;
  while (rest > 0) {
    out[order[k % n].i] += 1;
    rest -= 1;
    k += 1;
  }
  return out;
}

function toYuan(cents: number): number {
  return Math.round(cents) / 100;
}

/** D1 orders 表写入（可选副本）：金额为「元」，内部 *100 存分。 */
async function writeOrderToD1(env: ShopEnv, order: ShopOrder): Promise<void> {
  const store = new OrdersStore(env.D1);
  try {
    await store.createOrder({
      id: order.id,
      user_id: order.userId,
      product_id: order.sku,
      amount: order.amountCents / 100,
      currency: order.currency,
      status: order.status,
      paypal_transaction_id: order.transactionId ?? null,
      paypal_status: order.status === 'completed' ? 'COMPLETED' : null,
      live_trade_id: null,
      live_status: null,
    });
  } catch {
    // 与 payment.ts 同口径：D1 写入失败不影响 KV 主流程
  }
}

async function syncOrderStatusToD1(
  env: ShopEnv,
  order: ShopOrder,
  transactionId?: string,
): Promise<void> {
  const store = new OrdersStore(env.D1);
  try {
    await store.updateOrderStatus(order.id, order.status, {
      paypal_transaction_id: transactionId ?? order.transactionId,
      paypal_status: order.status === 'completed' ? 'COMPLETED' : order.status.toUpperCase(),
    });
  } catch {
    // 忽略：KV 为唯一事实源
  }
}

/** 结算：购物车 → 订单（pending）+ 支付单。 */
export async function checkoutFromCart(env: ShopEnv, input: CheckoutInput): Promise<CheckoutResult> {
  const userId = input.userId;
  const idemKey = input.idempotencyKey?.trim();

  // ── 幂等回放 ──
  if (idemKey) {
    const existingId = await readIdempotency(env, userId, idemKey);
    if (existingId) {
      const checkout = await getCheckout(env, existingId);
      if (checkout) {
        const orders: ShopOrder[] = [];
        for (const id of checkout.orderIds) {
          const o = await getOrder(env, id);
          if (o) orders.push(o);
        }
        return {
          checkout,
          orders,
          payment: {
            transactionId: checkout.transactionId ?? '',
            provider: (checkout.provider as PaymentIntent['provider']) ?? 'mock',
            status: checkout.status === 'completed' ? 'completed' : 'created',
            amountCents: checkout.payableCents,
            currency: checkout.currency,
            checkoutId: checkout.id,
          },
          replayed: true,
        };
      }
    }
  }

  const cart = await getCart(env, userId);
  if (cart.items.length === 0) throw new ShopError('cart_empty', 409);

  const resolved = await resolveCartProducts(env, cart);
  const products: Product[] = resolved.map((r) => r.product);
  const quantities = new Map(resolved.map((r) => [r.product.sku, r.quantity]));

  // ── T06 促销结算（规则生效；券为预留，未给券仓时不核销） ──
  const now = input.now ?? Date.now();
  const settlement = await settleOrder({
    orderId: 'preview',
    userId,
    items: resolved.map(({ product, quantity }) => ({
      sku: product.sku,
      category: product.category,
      unitPrice: product.priceCents,
      quantity,
      title: product.title,
    })),
    now,
    couponCode: input.couponCode,
    couponStore: input.couponStore,
    userTags: input.userTags,
    config: resolvePromoConfig(env.PROMO_RULES_JSON),
  });

  const listCents = products.map((p) => p.priceCents * (quantities.get(p.sku) ?? 1));
  const subtotalCents = listCents.reduce((a, b) => a + b, 0);
  const payableAfterRules = settlement.payable;

  // ── 积分抵扣（先扣流水，扣不到就降级为不抵扣，保证「扣了就一定有单」） ──
  const policy = resolvePointsPolicy(env.SHOP_POINTS_POLICY_JSON);
  const balance = await getBalance(env, userId);
  let quote = quotePointsDeduction(payableAfterRules, balance, policy);
  const checkoutId = idemKey
    ? `ckt_${stableHash(`${userId}|${idemKey}`)}`
    : genCheckoutId();

  let spent: Awaited<ReturnType<typeof spendPoints>> = null;
  if (quote.pointsUsed > 0) {
    spent = await spendPoints(env, userId, quote.pointsUsed, checkoutId);
    if (!spent) {
      // 并发下余额被别的单抢走：降级为不抵扣，绝不阻断下单
      quote = { pointsUsed: 0, discountCents: 0, payableCents: payableAfterRules, reason: 'points_insufficient' };
    }
  }

  const payableCents = quote.payableCents;

  // ── 金额分摊到行（总额守恒） ──
  const lineAfterRules = allocateAmounts(payableAfterRules, listCents);
  const lineAmounts = payableAfterRules === payableCents ? lineAfterRules : allocateAmounts(payableCents, lineAfterRules);
  const linePointsUsed = allocateAmounts(quote.pointsUsed, lineAfterRules);

  const ts = nowIso();
  const orders: ShopOrder[] = products.map((product, i) => {
    const quantity = quantities.get(product.sku) ?? 1;
    const amountCents = lineAmounts[i];
    const afterRules = lineAfterRules[i];
    return {
      id: `ord_${stableHash(`${checkoutId}|${product.sku}`)}`,
      userId,
      sku: product.sku,
      quantity,
      currency: DEFAULT_CURRENCY,
      listAmountCents: listCents[i],
      amountCents,
      ruleDiscountCents: listCents[i] - afterRules,
      pointsDiscountCents: afterRules - amountCents,
      pointsUsed: linePointsUsed[i],
      status: 'pending',
      checkoutId,
      provider: env.PAYMENT_PROVIDER === 'paypal_live' ? 'paypal_live' : 'mock',
      idempotencyKey: idemKey,
      createdAt: ts,
      updatedAt: ts,
      amountYuan: toYuan(amountCents),
    };
  });

  // ── 支付单 ──
  const provider = createPaymentProvider(env);
  const payment = await provider.createPayment({
    checkoutId,
    orderIds: orders.map((o) => o.id),
    amountCents: payableCents,
    currency: DEFAULT_CURRENCY,
    userId,
  });

  const trace = [...settlement.trace];
  if (quote.pointsUsed > 0) {
    trace.push(
      `积分抵扣 ${quote.pointsUsed} 分（余额 ${balance}，兑换率 ${policy.pointsPerYuan} 积分/元，上限 ${Math.round(policy.maxDeductRatio * 100)}%）→ 抵 ${quote.discountCents} 分`,
    );
    if (spent) trace.push(`积分流水 ${spent.entry.id} 已写入，余额 ${spent.balance}`);
  } else if (quote.reason) {
    trace.push(`积分未抵扣（${quote.reason}）`);
  }
  if (settlement.coupon?.code) {
    trace.push(
      `券 ${settlement.coupon.code}：${settlement.coupon.applied ? '已核销' : `未生效(${settlement.coupon.reason ?? 'unknown'})`}`,
    );
  }

  const checkout: CheckoutRecord = {
    id: checkoutId,
    userId,
    orderIds: orders.map((o) => o.id),
    currency: DEFAULT_CURRENCY,
    subtotalCents,
    ruleDiscountCents: settlement.ruleDiscount,
    couponDiscountCents: settlement.couponDiscount,
    pointsDiscountCents: quote.discountCents,
    pointsUsed: quote.pointsUsed,
    payableCents,
    status: 'pending',
    provider: payment.provider,
    transactionId: payment.transactionId,
    appliedRuleIds: settlement.appliedRuleIds,
    trace,
    idempotencyKey: idemKey,
    createdAt: ts,
    updatedAt: ts,
    payableYuan: toYuan(payableCents),
  };

  await putCheckout(env, checkout);
  for (const order of orders) {
    await putOrder(env, order);
    await writeOrderToD1(env, order);
  }

  // 库存与购物车：订单已落库后才动，避免「下单失败但购物车已空」
  for (const { product } of resolved) {
    await decreaseStock(env, product.sku, quantities.get(product.sku) ?? 1);
  }
  await clearUserCart(env, userId);

  if (idemKey) await writeIdempotency(env, userId, idemKey, checkoutId);

  return { checkout, orders, payment, replayed: false };
}

/** 支付确认：pending → completed（幂等，重复确认直接回放）。 */
export async function captureCheckout(
  env: ShopEnv,
  userId: string,
  checkoutId: string,
): Promise<{ checkout: CheckoutRecord; orders: ShopOrder[] }> {
  const checkout = await getCheckout(env, checkoutId);
  if (!checkout || checkout.userId !== userId) throw new ShopError('checkout_not_found', 404);
  if (checkout.status === 'completed') {
    return { checkout, orders: await loadOrders(env, checkout.orderIds) };
  }
  if (checkout.status !== 'pending') throw new ShopError('checkout_not_payable', 409);

  const provider = createPaymentProvider(env);
  const intent = await provider.capturePayment(checkout.transactionId ?? '');

  const ts = nowIso();
  const orders: ShopOrder[] = [];
  for (const id of checkout.orderIds) {
    const order = await getOrder(env, id);
    if (!order) continue;
    const next: ShopOrder = {
      ...order,
      status: 'completed',
      transactionId: intent.transactionId,
      updatedAt: ts,
    };
    await putOrder(env, next);
    await syncOrderStatusToD1(env, next, intent.transactionId);
    orders.push(next);
  }

  const nextCheckout: CheckoutRecord = {
    ...checkout,
    status: 'completed',
    transactionId: intent.transactionId,
    updatedAt: ts,
  };
  await putCheckout(env, nextCheckout);
  return { checkout: nextCheckout, orders };
}

/** 取消订单：pending → cancelled，返还积分、回滚库存（幂等）。 */
export async function cancelOrder(
  env: ShopEnv,
  userId: string,
  orderId: string,
): Promise<ShopOrder> {
  const order = await getOrder(env, orderId);
  if (!order || order.userId !== userId) throw new ShopError('order_not_found', 404);
  if (order.status === 'cancelled') return order;
  if (order.status !== 'pending') throw new ShopError('order_not_cancellable', 409);

  const next: ShopOrder = { ...order, status: 'cancelled', updatedAt: nowIso() };
  await putOrder(env, next);
  await syncOrderStatusToD1(env, next);

  if (next.pointsUsed > 0) await refundPoints(env, userId, next.pointsUsed, next.id);
  await increaseStock(env, next.sku, next.quantity);

  // 结算单下全部订单都取消时，结算单同步置为 cancelled
  const checkout = await getCheckout(env, next.checkoutId);
  if (checkout && checkout.status === 'pending') {
    const siblings = await loadOrders(env, checkout.orderIds);
    if (siblings.every((o) => o.status === 'cancelled')) {
      await putCheckout(env, { ...checkout, status: 'cancelled', updatedAt: nowIso() });
    }
  }
  return next;
}

export async function loadOrders(env: ShopEnv, orderIds: string[]): Promise<ShopOrder[]> {
  const orders: ShopOrder[] = [];
  for (const id of orderIds) {
    const o = await getOrder(env, id);
    if (o) orders.push(o);
  }
  return orders;
}

/** 本人订单查询（越权 id 直接 404，不泄露存在性）。 */
export async function getOwnOrder(
  env: ShopEnv,
  userId: string,
  orderId: string,
): Promise<ShopOrder | null> {
  const order = await getOrder(env, orderId);
  if (!order || order.userId !== userId) return null;
  return order;
}
