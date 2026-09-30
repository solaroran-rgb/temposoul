/**
 * 商品目录 · 单项路由
 *   GET   /api/v1/shop/products/:sku → 商品详情（公开，仅返回在售商品）
 *   PATCH /api/v1/shop/products/:sku → 改价 / 改描述 / 上下架（需管理员）
 *   下架 = PATCH { "status": "archived" }；上架 = PATCH { "status": "active" }
 */

import {
  getCatalogItem,
  parseProductInput,
  updateProduct,
} from '../../../../../src/lib/commerce/shop/index.ts';
import { adminGuard } from '../_auth.ts';
import { fail, handleError, json, options, readJson } from '../_http.ts';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env, params } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (!env.AUTH_KV) return fail('service_unavailable', 503, request);

  const sku = String(params.sku ?? '').toLowerCase();
  if (!sku) return fail('invalid_sku', 400, request);
  const method = request.method.toUpperCase();

  if (method === 'GET') {
    try {
      const product = await getCatalogItem(env, sku);
      if (!product || product.status !== 'active') return fail('product_not_found', 404, request);
      return json({ product }, 200, request);
    } catch (err) {
      return handleError(err, request);
    }
  }

  if (method === 'PATCH') {
    const denied = await adminGuard(request, env.AUTH_SECRET);
    if (denied) return denied;

    const body = await readJson(request);
    if (!body) return fail('invalid_json', 400, request);
    const parsed = parseProductInput({ ...body, sku }, 'patch');
    if (!parsed.ok || !parsed.value) return fail(parsed.error ?? 'invalid_input', 400, request);

    try {
      const product = await updateProduct(env, sku, parsed.value);
      if (!product) return fail('product_not_found', 404, request);
      return json({ product }, 200, request);
    } catch (err) {
      return handleError(err, request);
    }
  }

  return fail('method_not_allowed', 405, request);
}
