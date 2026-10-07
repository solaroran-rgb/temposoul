import { readIdentityWithSession } from '../../../src/lib/server/auth';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // 校验 Bearer JWT
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7);
  let userId: string;
  try {
    const identity = await readIdentityWithSession(token, env.AUTH_SECRET || '', env.AUTH_KV);
    userId = identity.sub || '';
  } catch {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!userId || !env.AUTH_KV) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  // 读改写 sub:{userId} 记录，标记 chartCompleted=true
  const subKey = `sub:${userId}`;
  const existingRaw = await env.AUTH_KV.get(subKey);
  let record: Record<string, unknown> = { tier: 'free', ts: new Date().toISOString() };

  if (existingRaw) {
    try {
      record = { ...JSON.parse(existingRaw) };
    } catch {
      // 覆盖写入
    }
  }

  record.chartCompleted = true;
  record.chartCompletedAt = new Date().toISOString();
  record.updatedAt = new Date().toISOString();

  await env.AUTH_KV.put(subKey, JSON.stringify(record));

  return Response.json({ ok: true }, { status: 200 });
};
