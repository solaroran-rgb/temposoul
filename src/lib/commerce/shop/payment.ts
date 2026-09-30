/**
 * T14 轻量商店 · 支付 Provider
 *
 * - `mock`：本地模拟，全链路走通「下单 → 支付 → 订单状态流转」；支付单持久化到 KV，重启不丢。
 * - `paypal_live`：**预留骨架**（#3 PayPal live 未到位）。当前显式抛错，避免被误认为已接通真实支付。
 *
 * 切换方式：env.PAYMENT_PROVIDER = 'paypal_live'（上线时只需实现 PayPalLiveProvider 两个方法）。
 */

import { ShopError } from './catalog.ts';
import { genTransactionId, getPayment, putPayment } from './store.ts';
import type { PaymentIntent, PaymentProvider, PaymentProviderName, ShopEnv } from './types.ts';

/** mock 收银台确认地址（前端 / 测试用；真实环境为 PayPal approve link） */
function approveUrl(env: ShopEnv, transactionId: string): string {
  const base = env.PUBLIC_SITE_URL ?? '';
  return base ? `${base}/shop/pay/${transactionId}` : `/api/v1/shop/pay`;
}

export class MockPaymentProvider implements PaymentProvider {
  readonly name: PaymentProviderName = 'mock';

  constructor(private readonly env: ShopEnv) {}

  async createPayment(input: {
    checkoutId: string;
    orderIds: string[];
    amountCents: number;
    currency: string;
    userId: string;
  }): Promise<PaymentIntent> {
    const transactionId = genTransactionId();
    const intent: PaymentIntent = {
      transactionId,
      provider: 'mock',
      status: 'created',
      amountCents: input.amountCents,
      currency: input.currency,
      checkoutId: input.checkoutId,
      approveUrl: approveUrl(this.env, transactionId),
      raw: { orderIds: input.orderIds, userId: input.userId },
    };
    await putPayment(this.env, intent);
    return intent;
  }

  async capturePayment(transactionId: string): Promise<PaymentIntent> {
    const existing = await getPayment(this.env, transactionId);
    if (!existing) throw new ShopError('payment_not_found', 404);
    if (existing.status === 'completed') return existing; // 幂等：重复确认直接回放
    const next: PaymentIntent = { ...existing, status: 'completed' };
    await putPayment(this.env, next);
    return next;
  }
}

/**
 * PayPal live 骨架（未实现）。
 * 实现清单（#3 到位后补齐，接口不变，路由层零改动）：
 *   1. createPayment → 调 PayPal Orders v2 创建订单，返回 approveUrl 与 transactionId；
 *   2. capturePayment → 调 Orders Capture，按返回 status 映射 'completed' / 'failed'；
 *   3. Webhook 验签后复用 captureCheckout() 完成订单状态流转。
 */
export class PayPalLiveProvider implements PaymentProvider {
  readonly name: PaymentProviderName = 'paypal_live';

  async createPayment(): Promise<PaymentIntent> {
    throw new ShopError('paypal_live_not_implemented', 501);
  }

  async capturePayment(): Promise<PaymentIntent> {
    throw new ShopError('paypal_live_not_implemented', 501);
  }
}

/** 按 env 选择 provider；未知值一律回落 mock（fail-safe，绝不静默走真实支付）。 */
export function createPaymentProvider(env: ShopEnv): PaymentProvider {
  if (env.PAYMENT_PROVIDER === 'paypal_live') return new PayPalLiveProvider();
  return new MockPaymentProvider(env);
}
