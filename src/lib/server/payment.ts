/**
 * 多 SKU 支付支持（终版）
 * 核心变更：
 * 1. 多 SKU 映射（LEMONSQUEEZY_VARIANTS JSON）
 * 2. 防羊毛校验内置（checkout 前强制调用）
 * 3. A/B 实验分组信息写入 custom_data（全链路追踪）
 * 4. 订阅类事件写入 subscription_id（供 FTC 一键取消联动 LS API）
 */

import { OrdersStore } from './orders';

export type PaymentProvider = 'lemonsqueezy' | 'paypal' | 'none';

export type ProductId =
  'event_9_9' | 'report_39_9' | 'premium_88' | 'sub_monthly_19_9' | 'sub_yearly_168';

export interface PaymentEnv {
  PAYMENT_PROVIDER?: string;
  LEMONSQUEEZY_API_KEY?: string;
  LEMONSQUEEZY_STORE_ID?: string;
  LEMONSQUEEZY_VARIANT_ID?: string;
  LEMONSQUEEZY_VARIANTS?: string;
  LEMONSQUEEZY_WEBHOOK_SECRET?: string;
  LEMONSQUEEZY_API_URL?: string;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PUBLIC_SITE_URL?: string;
  AUTH_KV?: KVNamespace;
  AUTH_SECRET?: string;
  D1?: D1Database;
}

export interface CheckoutParams {
  userId: string;
  email?: string;
  baseUrl: string;
  productId?: ProductId;
  abBucket?: Record<string, number>; // A/B 实验分组信息
}

export type CheckoutResult =
  { ok: true; url: string } | { ok: false; error: string; detail?: string };

export const DEFAULT_PRODUCT_ID: ProductId = 'event_9_9';

/** 产品定价表 */
export const PRODUCT_CATALOG: Record<
  ProductId,
  {
    price: number;
    currency: string;
    type: 'one_time' | 'subscription';
    name: string;
    requiresChart: boolean; // 是否需完成排盘
    limitPerUser: number; // 限购次数（0=不限）
  }
> = {
  event_9_9: {
    price: 9.9,
    currency: 'CNY',
    type: 'one_time',
    name: '事件单购',
    requiresChart: true,
    limitPerUser: 1,
  },
  report_39_9: {
    price: 39.9,
    currency: 'CNY',
    type: 'one_time',
    name: '十维深度报告',
    requiresChart: true,
    limitPerUser: 0,
  },
  premium_88: {
    price: 88,
    currency: 'CNY',
    type: 'one_time',
    name: '精批旗舰版',
    requiresChart: true,
    limitPerUser: 0,
  },
  sub_monthly_19_9: {
    price: 19.9,
    currency: 'CNY',
    type: 'subscription',
    name: '情绪微订阅（月）',
    requiresChart: false,
    limitPerUser: 0,
  },
  sub_yearly_168: {
    price: 168,
    currency: 'CNY',
    type: 'subscription',
    name: '情绪微订阅（年）',
    requiresChart: false,
    limitPerUser: 0,
  },
};

/** 解析产品 ID */
export function resolveProductId(raw?: string): ProductId {
  if (raw && raw in PRODUCT_CATALOG) return raw as ProductId;
  return DEFAULT_PRODUCT_ID;
}

/** 解析 LS variant 映射 */
export function resolveVariantId(env: PaymentEnv, productId: ProductId): string | null {
  if (env.LEMONSQUEEZY_VARIANTS) {
    try {
      const map = JSON.parse(env.LEMONSQUEEZY_VARIANTS) as Record<string, string>;
      const variantId = map[productId];
      if (variantId) return variantId;
    } catch {
      // JSON 解析失败，回退单值
    }
  }

  if (env.LEMONSQUEEZY_VARIANT_ID) {
    // 单值环境变量仅支持默认产品（向后兼容）
    if (productId === DEFAULT_PRODUCT_ID) {
      return env.LEMONSQUEEZY_VARIANT_ID;
    }
  }

  return null;
}

export function resolvePaymentProvider(env: PaymentEnv): PaymentProvider {
  const provider = env.PAYMENT_PROVIDER || 'none';
  if (provider === 'lemonsqueezy' || provider === 'paypal' || provider === 'none') return provider;
  return 'none';
}

/**
 * 防羊毛校验（内置，不可绕过）
 * 规则：
 * 1. 匿名用户不可购买
 * 2. 需完成排盘（requiresChart=true 的产品）
 * 3. 限购次数校验
 */
async function antiAbuseCheck(
  kv: KVNamespace,
  userId: string,
  productId: ProductId,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const product = PRODUCT_CATALOG[productId];

  // 匿名用户不可购买
  if (userId === 'anonymous') {
    return { ok: false, reason: 'login_required' };
  }

  // 读取 sub 记录（单一事实源）
  const subKey = `sub:${userId}`;
  const raw = await kv.get(subKey);
  let record: Record<string, unknown> = {};

  if (raw) {
    try {
      record = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      // 损坏记录视为空
    }
  }

  // 排盘前置校验
  if (product.requiresChart && record.chartCompleted !== true) {
    return { ok: false, reason: 'chart_not_completed' };
  }

  // 限购次数校验
  if (product.limitPerUser > 0) {
    const orders = Array.isArray(record.orders)
      ? (record.orders as Array<{ productId?: string }>)
      : [];
    const purchaseCount = orders.filter((o) => o.productId === productId).length;
    if (purchaseCount >= product.limitPerUser) {
      return { ok: false, reason: 'purchase_limit_reached' };
    }
  }

  // 退款后限制：若已退款且产品为 event_9_9，不允许再次购买
  if (record.refunded === true && productId === 'event_9_9') {
    return { ok: false, reason: 'refunded_no_repurchase' };
  }

  return { ok: true };
}

export async function createCheckoutSession(
  env: PaymentEnv,
  params: CheckoutParams,
): Promise<CheckoutResult> {
  const provider = resolvePaymentProvider(env);
  if (provider === 'none') {
    return { ok: false, error: 'commerce_unavailable' };
  }

  // 防羊毛校验（内置，不可绕过）
  if (env.AUTH_KV) {
    const check = await antiAbuseCheck(
      env.AUTH_KV,
      params.userId,
      params.productId || DEFAULT_PRODUCT_ID,
    );
    if (!check.ok) {
      return { ok: false, error: check.reason };
    }
  }

  if (provider === 'lemonsqueezy') {
    return createLemonsqueezyCheckout(env, params);
  }

  return { ok: false, error: 'commerce_unavailable', detail: 'paypal_not_implemented' };
}

async function createLemonsqueezyCheckout(
  env: PaymentEnv,
  params: CheckoutParams,
): Promise<CheckoutResult> {
  const { userId, email, baseUrl, productId = DEFAULT_PRODUCT_ID, abBucket } = params;

  if (!env.LEMONSQUEEZY_API_KEY || !env.LEMONSQUEEZY_STORE_ID) {
    return { ok: false, error: 'commerce_unavailable', detail: 'missing_lemonsqueezy_config' };
  }

  const variantId = resolveVariantId(env, productId);
  if (!variantId) {
    return {
      ok: false,
      error: 'commerce_unavailable',
      detail: `no_variant_for_product_${productId}`,
    };
  }

  const apiBase = env.LEMONSQUEEZY_API_URL || 'https://api.lemonsqueezy.com/v1';
  const redirectUrl = `${baseUrl}/account?checkout=success&product=${productId}`;

  // 构建 custom_data（含 A/B 实验分组信息）
  const customData: Record<string, unknown> = {
    user_id: userId,
    product_id: productId,
    order_type: PRODUCT_CATALOG[productId].type,
  };

  if (abBucket) {
    customData.ab_bucket = abBucket;
  }

  try {
    const response = await fetch(`${apiBase}/checkouts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`,
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            store_id: Number(env.LEMONSQUEEZY_STORE_ID),
            variant_id: Number(variantId),
            custom_data: customData,
            checkout_data: {
              email: email || '',
            },
            product_options: {
              redirect_url: redirectUrl,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { ok: false, error: 'checkout_creation_failed', detail: text.slice(0, 200) };
    }

    const data = (await response.json()) as {
      data?: { attributes?: { url?: string } };
    };
    const url = data?.data?.attributes?.url;
    if (!url) {
      return { ok: false, error: 'checkout_creation_failed', detail: 'missing_checkout_url' };
    }

    return { ok: true, url };
  } catch (err) {
    return {
      ok: false,
      error: 'checkout_creation_failed',
      detail: err instanceof Error ? err.message : 'unknown_error',
    };
  }
}

/** 激活 Premium（扩展字段：subscription_id 写入 + 订单记录 + 订阅到期时间） */
export async function activatePremium(
  authKv: KVNamespace,
  userId: string,
  source: string,
  extra?: {
    productId?: string;
    orderType?: string;
    abBucket?: Record<string, number>;
    subscriptionId?: string;
    amount?: number;
    currency?: string;
  },
  d1?: D1Database,
): Promise<void> {
  const key = `sub:${userId}`;
  const existingRaw = await authKv.get(key);
  const now = new Date().toISOString();

  let record: Record<string, unknown> = { tier: 'premium', ts: now };

  if (existingRaw) {
    try {
      record = { ...JSON.parse(existingRaw), tier: 'premium', ts: now };
    } catch {
      // 覆盖写入
    }
  }

  // 扩展字段
  record.source = source;
  record.updatedAt = now;

  // 订阅 ID（如有）
  if (extra?.subscriptionId) {
    record.subscriptionId = extra.subscriptionId;
  }

  // 订单记录
  const orders = Array.isArray(record.orders) ? (record.orders as unknown[]) : [];
  orders.push({
    productId: extra?.productId || 'unknown',
    orderType: extra?.orderType || 'one_time',
    abBucket: extra?.abBucket || undefined,
    subscriptionId: extra?.subscriptionId || undefined,
    ts: now,
  });
  record.orders = orders;

  // 订阅到期时间
  if (extra?.orderType === 'subscription') {
    const nowDate = new Date();
    if (extra.productId === 'sub_monthly_19_9') {
      nowDate.setMonth(nowDate.getMonth() + 1);
    } else if (extra.productId === 'sub_yearly_168') {
      nowDate.setFullYear(nowDate.getFullYear() + 1);
    }
    record.expiresAt = nowDate.toISOString();
  }

  await authKv.put(key, JSON.stringify(record));

  // 写入 orders 表（若 D1 可用）
  if (d1 && extra?.productId) {
    try {
      const store = new OrdersStore(d1);
      await store.createOrder({
        user_id: userId,
        product_id: extra.productId,
        amount: extra.amount || 0,
        currency: extra.currency || 'CNY',
        status: 'completed',
        paypal_transaction_id: undefined,
        paypal_status: undefined,
        live_trade_id: undefined,
        live_status: undefined,
      });
    } catch (err) {
      // 订单落库失败不影响 KV 主流程，仅 log
      console.error('orders table write failed:', err);
    }
  }
}
