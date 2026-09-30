/**
 * 星空纪念事件 · 单项路由（需本人鉴权）
 *   GET    /api/v1/sky-events/:id   → 读取本人事件
 *   PUT    /api/v1/sky-events/:id   → 更新本人事件（部分字段）
 *   DELETE /api/v1/sky-events/:id   → 删除本人事件
 * 越权 / 不存在一律返回 404（不泄露存在性）。
 */

import { authUser } from './_auth';
import { json, options, parseEventInput, readJson } from './_http';
import {
  deleteOwnSkyEvent,
  getOwnSkyEvent,
  updateOwnSkyEvent,
} from './_store';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env, params } = context;
  const id = params.id;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);
  if (!id) return json({ error: 'not_found' }, 404);

  if (!env.AUTH_KV || !env.AUTH_SECRET) {
    return json({ error: 'service_unavailable' }, 503);
  }

  const user = await authUser(request, env.AUTH_SECRET);
  if (!user) return json({ error: 'unauthorized' }, 401);

  if (request.method.toUpperCase() === 'GET') {
    const evt = await getOwnSkyEvent(env, user.userId, id);
    if (!evt) return json({ error: 'not_found' }, 404);
    return json({ event: evt });
  }

  if (request.method.toUpperCase() === 'PUT') {
    const body = await readJson(request);
    const parsed = parseEventInput(body);
    if ('error' in parsed) return json({ error: parsed.error }, parsed.status);
    const updated = await updateOwnSkyEvent(env, user.userId, id, parsed.value);
    if (!updated) return json({ error: 'not_found' }, 404);
    return json({ event: updated });
  }

  if (request.method.toUpperCase() === 'DELETE') {
    const ok = await deleteOwnSkyEvent(env, user.userId, id);
    if (!ok) return json({ error: 'not_found' }, 404);
    return json({ ok: true });
  }

  return json({ error: 'method_not_allowed' }, 405);
}
