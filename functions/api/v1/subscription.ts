import { readIdentityWithSession } from '../../../src/lib/server/auth';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
}

interface SubscriptionRecord {
  tier: 'free' | 'premium';
  ts: string;
  plan?: string;
  orders?: unknown[];
  expiresAt?: string;
  refunded?: boolean;
  cancelledAt?: string;
  source?: string;
  updatedAt?: string;
  chartCompleted?: boolean;
  subscriptionId?: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return Response.json({ tier: 'free' }, { status: 200 });
  }

  const token = authHeader.slice(7);
  let userId: string;
  try {
    const identity = await readIdentityWithSession(token, env.AUTH_SECRET || '', env.AUTH_KV);
    userId = identity.sub || '';
  } catch {
    return Response.json({ tier: 'free' }, { status: 200 });
  }

  if (!userId || !env.AUTH_KV) {
    return Response.json({ tier: 'free' }, { status: 200 });
  }

  const key = `sub:${userId}`;
  const raw = await env.AUTH_KV.get(key);

  if (!raw) {
    return Response.json({ tier: 'free' }, { status: 200 });
  }

  try {
    const record = JSON.parse(raw) as SubscriptionRecord;
    // 向后兼容：始终返回 tier；同时透出扩展字段供前端/me 使用
    return Response.json(
      {
        tier: record.tier || 'free',
        ts: record.ts,
        plan: record.plan || undefined,
        orders: record.orders || [],
        expiresAt: record.expiresAt || undefined,
        refunded: record.refunded || false,
        cancelledAt: record.cancelledAt || undefined,
        source: record.source || undefined,
        chartCompleted: record.chartCompleted || false,
        subscriptionId: record.subscriptionId || undefined,
        updatedAt: record.updatedAt || undefined,
      },
      { status: 200 },
    );
  } catch {
    return Response.json({ tier: 'free' }, { status: 200 });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // 管理端写操作：X-Admin-Token 校验
  const adminToken = request.headers.get('X-Admin-Token') || '';
  const expectedToken = await generateAdminToken(env.AUTH_SECRET || '');

  if (adminToken !== expectedToken) {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as {
    userId?: string;
    tier?: string;
    plan?: string;
    expiresAt?: string;
    chartCompleted?: boolean;
    subscriptionId?: string;
  } | null;

  if (!body?.userId || !body?.tier) {
    return Response.json({ error: 'missing_fields' }, { status: 400 });
  }

  const key = `sub:${body.userId}`;
  const existingRaw = await env.AUTH_KV!.get(key);
  let record: SubscriptionRecord = { tier: 'free', ts: new Date().toISOString() };

  if (existingRaw) {
    try {
      record = { ...JSON.parse(existingRaw), tier: 'free', ts: new Date().toISOString() };
    } catch {
      // 覆盖写入
    }
  }

  record.tier = body.tier === 'premium' ? 'premium' : 'free';
  if (body.plan) record.plan = body.plan;
  if (body.expiresAt) record.expiresAt = body.expiresAt;
  if (body.chartCompleted !== undefined) record.chartCompleted = body.chartCompleted;
  if (body.subscriptionId) record.subscriptionId = body.subscriptionId;
  record.updatedAt = new Date().toISOString();

  await env.AUTH_KV!.put(key, JSON.stringify(record));

  return Response.json({ ok: true }, { status: 200 });
};

async function generateAdminToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode('subscription-admin'));
  return [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
