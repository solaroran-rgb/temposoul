/**
 * 支付确认（mock provider 全链路；live 切换后本端点同时承接 PayPal 回调验签后的确认）
 *   POST /api/v1/shop/pay  body { checkoutId } → 订单 pending → completed
 *
 * 幂等：重复确认返回已完成结果，不重复改状态、不重复扣积分。
 */

import { captureCheckout } from '../../../../src/lib/commerce/shop/index.ts';
import { authUser } from './_auth.ts';
import { fail, handleError, json, options, readJson } from './_http.ts';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (request.method.toUpperCase() !== 'POST') return fail('method_not_allowed', 405, request);
  if (!env.AUTH_KV || !env.AUTH_SECRET) return fail('service_unavailable', 503, request);

  const user = await authUser(request, env.AUTH_SECRET);
  if (!user) return fail('unauthorized', 401, request);

  const body = await readJson(request);
  if (!body) return fail('invalid_json', 400, request);
  const checkoutId = typeof body.checkoutId === 'string' ? body.checkoutId.trim() : '';
  if (!checkoutId) return fail('invalid_checkout_id', 400, request);

  try {
    const { checkout, orders } = await captureCheckout(env, user.userId, checkoutId);
    return json({ checkout, orders }, 200, request);
  } catch (err) {
    return handleError(err, request);
  }
}
