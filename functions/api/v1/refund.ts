import { readIdentityWithSession } from '../../../src/lib/server/auth';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
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

  const body = (await request.json().catch(() => null)) as { reason?: string } | null;
  const reason = body?.reason || '';

  // 读取 sub 记录（单一事实源）
  const subKey = `sub:${userId}`;
  const raw = await env.AUTH_KV.get(subKey);

  if (!raw) {
    return Response.json({ error: 'no_purchase' }, { status: 400 });
  }

  let record: Record<string, unknown>;
  try {
    record = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'invalid_record' }, { status: 500 });
  }

  // 检查是否有购买记录
  const orders = Array.isArray(record.orders) ? (record.orders as unknown[]) : [];
  if (orders.length === 0) {
    return Response.json({ error: 'no_purchase' }, { status: 400 });
  }

  // 检查是否已退款
  if (record.refunded === true) {
    return Response.json({ error: 'already_refunded' }, { status: 400 });
  }

  // 检查 7 天退款窗口
  const lastOrder = orders[orders.length - 1] as { ts?: string };
  if (!lastOrder.ts) {
    return Response.json({ error: 'invalid_order' }, { status: 500 });
  }

  const purchasedTime = new Date(lastOrder.ts).getTime();
  const now = Date.now();
  const daysSincePurchase = (now - purchasedTime) / (1000 * 60 * 60 * 24);

  if (daysSincePurchase > 7) {
    return Response.json({ error: 'refund_window_expired' }, { status: 400 });
  }

  // 记录退款申诉
  record.refundRequested = true;
  record.refundRequestedAt = new Date().toISOString();
  record.refundReason = reason;
  record.updatedAt = new Date().toISOString();

  await env.AUTH_KV.put(subKey, JSON.stringify(record));

  // 记录申诉详情（供人工处理）
  const refundKey = `refund:${userId}:${Date.now()}`;
  await env.AUTH_KV.put(
    refundKey,
    JSON.stringify({
      userId,
      reason,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    }),
  );

  return Response.json({ ok: true, message: 'refund_request_submitted' }, { status: 200 });
};
