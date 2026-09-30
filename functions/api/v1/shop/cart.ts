/**
 * 购物车 · 路由（用户级，KV 持久，重启不丢）
 *   GET    /api/v1/shop/cart            → 当前购物车（含商品快照与小计）
 *   POST   /api/v1/shop/cart            → 加购 { sku, quantity? }
 *   DELETE /api/v1/shop/cart            → 清空
 */

import { addItem, clearUserCart, getCartView } from '../../../../src/lib/commerce/shop/index.ts';
import { authUser } from './_auth.ts';
import { fail, handleError, json, options, readJson } from './_http.ts';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (!env.AUTH_KV || !env.AUTH_SECRET) return fail('service_unavailable', 503, request);

  const user = await authUser(request, env.AUTH_SECRET);
  if (!user) return fail('unauthorized', 401, request);

  const method = request.method.toUpperCase();
  try {
    if (method === 'GET') {
      const cart = await getCartView(env, user.userId);
      return json({ cart }, 200, request);
    }

    if (method === 'POST') {
      const body = await readJson(request);
      if (!body) return fail('invalid_json', 400, request);
      const sku = typeof body.sku === 'string' ? body.sku.trim().toLowerCase() : '';
      if (!sku) return fail('invalid_sku', 400, request);
      const quantity = body.quantity === undefined ? 1 : Number(body.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) return fail('invalid_quantity', 400, request);

      await addItem(env, user.userId, sku, quantity);
      const cart = await getCartView(env, user.userId);
      return json({ cart }, 200, request);
    }

    if (method === 'DELETE') {
      await clearUserCart(env, user.userId);
      const cart = await getCartView(env, user.userId);
      return json({ cart }, 200, request);
    }
  } catch (err) {
    return handleError(err, request);
  }

  return fail('method_not_allowed', 405, request);
}
