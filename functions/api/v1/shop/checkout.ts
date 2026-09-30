/**
 * 下单结算
 *   POST /api/v1/shop/checkout → 购物车 → 订单（pending）+ 支付单
 *   body: { idempotencyKey?, couponCode? }（幂等键也可走 X-Idempotency-Key 头）
 *
 * 幂等：同一 idempotencyKey 重复提交返回首次结果（replayed=true），不产生第二单。
 */

import { checkoutFromCart, type CouponStore } from '../../../../src/lib/commerce/shop/index.ts';
import { authUser, readIdempotencyKey } from './_auth.ts';
import { fail, handleError, json, options, readJson } from './_http.ts';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (request.method.toUpperCase() !== 'POST') return fail('method_not_allowed', 405, request);
  if (!env.AUTH_KV || !env.AUTH_SECRET) return fail('service_unavailable', 503, request);

  const user = await authUser(request, env.AUTH_SECRET);
  if (!user) return fail('unauthorized', 401, request);

  const body = (await readJson(request)) ?? {};
  const idempotencyKey = readIdempotencyKey(request, body);
  const couponCode = typeof body.couponCode === 'string' ? body.couponCode.trim() : undefined;

  try {
    // 券仓预留：T06 权益券落地后在此注入真实 CouponStore，路由层无需改动
    const couponStore: CouponStore | undefined = undefined;
    const result = await checkoutFromCart(env, {
      userId: user.userId,
      idempotencyKey,
      couponCode,
      couponStore,
    });
    return json(
      {
        checkout: result.checkout,
        orders: result.orders,
        payment: result.payment,
        replayed: result.replayed,
      },
      result.replayed ? 200 : 201,
      request,
    );
  } catch (err) {
    return handleError(err, request);
  }
}
