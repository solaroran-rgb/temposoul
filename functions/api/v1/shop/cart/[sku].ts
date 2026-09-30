/**
 * 购物车 · 单项路由
 *   PATCH  /api/v1/shop/cart/:sku → 改数量 { quantity }（<=0 视为移除该行）
 *   DELETE /api/v1/shop/cart/:sku → 移除该行
 */

import { getCartView, removeItem, setItemQuantity } from '../../../../../src/lib/commerce/shop/index.ts';
import { authUser } from '../_auth.ts';
import { fail, handleError, json, options, readJson } from '../_http.ts';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env, params } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (!env.AUTH_KV || !env.AUTH_SECRET) return fail('service_unavailable', 503, request);

  const user = await authUser(request, env.AUTH_SECRET);
  if (!user) return fail('unauthorized', 401, request);

  const sku = String(params.sku ?? '').toLowerCase();
  if (!sku) return fail('invalid_sku', 400, request);
  const method = request.method.toUpperCase();

  try {
    if (method === 'PATCH') {
      const body = await readJson(request);
      if (!body) return fail('invalid_json', 400, request);
      const quantity = Number(body.quantity);
      if (!Number.isInteger(quantity)) return fail('invalid_quantity', 400, request);
      await setItemQuantity(env, user.userId, sku, quantity);
      return json({ cart: await getCartView(env, user.userId) }, 200, request);
    }

    if (method === 'DELETE') {
      await removeItem(env, user.userId, sku);
      return json({ cart: await getCartView(env, user.userId) }, 200, request);
    }
  } catch (err) {
    return handleError(err, request);
  }

  return fail('method_not_allowed', 405, request);
}
