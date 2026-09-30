/**
 * 订单 · 集合路由
 *   GET /api/v1/shop/orders → 本人订单列表（倒序）
 */

import { listOrders } from '../../../../src/lib/commerce/shop/index.ts';
import { authUser } from '../_auth.ts';
import { fail, handleError, json, options } from '../_http.ts';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (request.method.toUpperCase() !== 'GET') return fail('method_not_allowed', 405, request);
  if (!env.AUTH_KV || !env.AUTH_SECRET) return fail('service_unavailable', 503, request);

  const user = await authUser(request, env.AUTH_SECRET);
  if (!user) return fail('unauthorized', 401, request);

  try {
    const orders = await listOrders(env, user.userId);
    return json({ orders, count: orders.length }, 200, request);
  } catch (err) {
    return handleError(err, request);
  }
}
