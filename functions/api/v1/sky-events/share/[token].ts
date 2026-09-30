/**
 * 星空纪念事件 · 公开分享读（无需鉴权，只读）
 *   GET /api/v1/sky-events/share/:token → 返回公开投影（剔除 userId）
 * 防遍历：仅按 128-bit 随机 token 取；不存在返回 404；无任何列表端点。
 */

import { json, options } from '../_http';
import { getPublicSkyEvent } from '../_store';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env, params } = context;
  const token = params.token;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);

  // 公开端点：即使鉴权未启用也应可访问；但数据本体在 AUTH_KV，缺失则 503。
  if (!env.AUTH_KV) return json({ error: 'service_unavailable' }, 503);

  if (request.method.toUpperCase() !== 'GET') {
    return json({ error: 'method_not_allowed' }, 405);
  }
  if (!token) return json({ error: 'not_found' }, 404);

  const evt = await getPublicSkyEvent(env, token);
  if (!evt) return json({ error: 'not_found' }, 404);
  return json({ event: evt });
}
