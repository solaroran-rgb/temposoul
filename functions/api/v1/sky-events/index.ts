/**
 * 星空纪念事件 · 集合路由
 *   GET  /api/v1/sky-events        → 列出本人事件（需鉴权）
 *   POST /api/v1/sky-events        → 创建事件（需鉴权），返回含 shareToken
 * 存储：AUTH_KV（见 _store.ts）。鉴权：复用 readIdentity。
 */

import { authUser } from './_auth';
import { json, options, parseEventInput, readJson } from './_http';
import {
  createSkyEvent,
  listOwnSkyEvents,
} from './_store';

export async function onRequest(context: EventContext<Env>): Promise<Response> {
  const { request, env } = context;
  if (request.method.toUpperCase() === 'OPTIONS') return options(request);

  if (!env.AUTH_KV || !env.AUTH_SECRET) {
    return json({ error: 'service_unavailable' }, 503);
  }

  // GET：列出本人事件
  if (request.method.toUpperCase() === 'GET') {
    const user = await authUser(request, env.AUTH_SECRET);
    if (!user) return json({ error: 'unauthorized' }, 401);
    const events = await listOwnSkyEvents(env, user.userId);
    return json({ events });
  }

  // POST：创建
  if (request.method.toUpperCase() === 'POST') {
    const user = await authUser(request, env.AUTH_SECRET);
    if (!user) return json({ error: 'unauthorized' }, 401);
    const body = await readJson(request);
    const parsed = parseEventInput(body);
    if ('error' in parsed) return json({ error: parsed.error }, parsed.status);
    const evt = await createSkyEvent(env, user.userId, parsed.value);
    return json({ event: evt }, 201);
  }

  return json({ error: 'method_not_allowed' }, 405);
}
