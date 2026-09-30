/**
 * 商品目录 · 集合路由
 *   GET  /api/v1/shop/products            → 在售商品列表（公开）
 *   GET  /api/v1/shop/products?status=all → 全部商品（含下架，需管理员）
 *   POST /api/v1/shop/products            → 新建商品（需管理员）
 */

import {
  createProduct,
  listCatalog,
  parseProductInput,
  type ProductCategory,
} from '../../../../../src/lib/commerce/shop/index.ts';
import { adminGuard } from '../_auth.ts';
import { fail, handleError, json, options, readJson } from '../_http.ts';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (!env.AUTH_KV) return fail('service_unavailable', 503, request);

  const method = request.method.toUpperCase();

  if (method === 'GET') {
    const url = new URL(request.url);
    const category = (url.searchParams.get('category') ?? '') as ProductCategory | '';
    const includeInactive = url.searchParams.get('status') === 'all';

    // 含下架商品属于管理视角，必须管理员令牌
    if (includeInactive) {
      const denied = await adminGuard(request, env.AUTH_SECRET);
      if (denied) return denied;
    }

    try {
      const products = await listCatalog(env, {
        includeInactive,
        category: category || undefined,
      });
      return json({ products, count: products.length }, 200, request);
    } catch (err) {
      return handleError(err, request);
    }
  }

  if (method === 'POST') {
    const denied = await adminGuard(request, env.AUTH_SECRET);
    if (denied) return denied;

    const body = await readJson(request);
    if (!body) return fail('invalid_json', 400, request);
    const parsed = parseProductInput(body, 'create');
    if (!parsed.ok || !parsed.value) return fail(parsed.error ?? 'invalid_input', 400, request);

    try {
      const product = await createProduct(env, parsed.value);
      return json({ product }, 201, request);
    } catch (err) {
      return handleError(err, request);
    }
  }

  return fail('method_not_allowed', 405, request);
}
