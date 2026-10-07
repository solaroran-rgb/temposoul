import { readIdentityWithSession } from '../../../../src/lib/server/auth';

// 精准匹配 DELETE /api/v1/me/data
export async function onRequestDelete(context: EventContext<Env>) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }

  try {
    const identity = await readIdentityWithSession(authHeader.split(' ')[1], env.AUTH_SECRET, env.AUTH_KV);
    if (!identity) return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401 });

    const { userId, email } = identity;

    // 1. 删除订阅状态
    await env.AUTH_KV.delete(`sub:${userId}`);

    // 2. 删除邮件订阅
    if (email && env.newsletter_emails) {
      await env.newsletter_emails.delete(email);
    }

    // 3. 核心修复：反向索引级联删除报告 KV
    const assetsRaw = await env.AUTH_KV.get(`user_assets:${userId}`);
    if (assetsRaw) {
      const assets: string[] = JSON.parse(assetsRaw);
      // 并发删除所有关联的报告 KV
      await Promise.all(assets.map((key) => env.AUTH_KV.delete(key)));
      await env.AUTH_KV.delete(`user_assets:${userId}`);
    }

    return new Response(JSON.stringify({ ok: true, message: 'data_physically_deleted' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (_e) {
    return new Response(JSON.stringify({ error: 'internal_error' }), { status: 500 });
  }
}
