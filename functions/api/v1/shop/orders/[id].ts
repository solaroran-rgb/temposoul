/**
 * 订单 · 单项路由
 *   GET  /api/v1/shop/orders/:id        → 订单详情（非本人一律 404，不泄露存在性）
 *   POST /api/v1/shop/orders/:id        → { "action": "cancel" } 取消未支付订单
 *
 * 取消为幂等操作：已取消直接回放；会返还该单分摊的积分并回滚库存。
 */

import { cancelOrder, getOwnOrder } from '../../../../../src/lib/commerce/shop/index.ts';
import { authUser } from '../_auth.ts';
import { fail, handleError, json, options, readJson } from '../_http.ts';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env, params } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (!env.AUTH_KV || !env.AUTH_SECRET) return fail('service_unavailable', 503, request);

  const user = await authUser(request, env.AUTH_SECRET);
  if (!user) return fail('unauthorized', 401, request);

  const orderId = String(params.id ?? '');
  if (!orderId) return fail('invalid_order_id', 400, request);
  const method = request.method.toUpperCase();

  try {
    if (method === 'GET') {
      const order = await getOwnOrder(env, user.userId, orderId);
      if (!order) return fail('order_not_found', 404, request);
      return json({ order }, 200, request);
    }

    if (method === 'POST') {
      const body = await readJson(request);
      if (!body) return fail('invalid_json', 400, request);
      if (body.action !== 'cancel') return fail('unsupported_action', 400, request);
      const order = await cancelOrder(env, user.userId, orderId);
      return json({ order }, 200, request);
    }
  } catch (err) {
    return handleError(err, request);
  }

  return fail('method_not_allowed', 405, request);
}
