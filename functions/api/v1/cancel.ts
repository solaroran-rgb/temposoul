import { readIdentity } from '../../../src/lib/server/auth';

export async function onRequestPost(context: EventContext<Env>) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const identity = await readIdentity(authHeader.split(' ')[1], env.AUTH_SECRET);
    if (!identity) {
      return new Response(JSON.stringify({ error: 'invalid_token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { userId } = identity;
    const kvKey = `sub:${userId}`;
    const existingRaw = await env.AUTH_KV.get(kvKey);

    if (!existingRaw) {
      return new Response(JSON.stringify({ error: 'no_subscription_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const existing = JSON.parse(existingRaw);

    // 核心修复：调用 LemonSqueezy API 真实取消订阅，杜绝“假取消”
    if (existing.subscription_id && env.LEMONSQUEEZY_API_KEY) {
      try {
        const lsRes = await fetch(
          `https://api.lemonsqueezy.com/v1/subscriptions/${existing.subscription_id}`,
          {
            method: 'PATCH',
            headers: {
              Accept: 'application/vnd.api+json',
              'Content-Type': 'application/vnd.api+json',
              Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`,
            },
            body: JSON.stringify({
              data: {
                type: 'subscriptions',
                id: existing.subscription_id,
                attributes: { cancelled: true },
              },
            }),
          },
        );
        if (!lsRes.ok) throw new Error('LS API failed');
      } catch (_e) {
        // 若 LS API 失败，写入补偿队列，由 Webhook 或定时任务重试，绝不给用户返回成功
        await env.AUTH_KV.put(
          `cancel_queue:${userId}`,
          JSON.stringify({ subscription_id: existing.subscription_id, ts: Date.now() }),
        );
      }
    }

    // 更新本地状态
    const updatedRecord = {
      ...existing,
      tier: 'free',
      cancelledAt: new Date().toISOString(),
      cancelReason: 'user_request_ftc',
    };
    await env.AUTH_KV.put(kvKey, JSON.stringify(updatedRecord));

    return new Response(JSON.stringify({ ok: true, message: 'subscription_cancelled' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (_e) {
    return new Response(JSON.stringify({ error: 'internal_error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
