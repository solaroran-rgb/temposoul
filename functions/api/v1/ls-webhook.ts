import { activatePremium } from '../../../src/lib/server/payment';

interface Env {
  LEMONSQUEEZY_WEBHOOK_SECRET?: string;
  AUTH_KV?: KVNamespace;
  D1?: D1Database;
}

const SUCCESS_EVENTS = new Set([
  'subscription_created',
  'subscription_payment_success',
  'order_created',
]);
const REFUND_EVENTS = new Set(['subscription_cancelled', 'order_refunded']);

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

async function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  if (!secret || !signature) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
  const sigHex = [...new Uint8Array(sigBuf)].map((b) => b.toString(16).padStart(2, '0')).join('');

  return constantTimeEqual(sigHex, signature);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const rawBody = await request.text();

  // 验签
  const signature = request.headers.get('X-Signature') || '';
  const secret = env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

  const valid = await verifyWebhookSignature(rawBody, signature, secret);
  if (!valid) {
    return Response.json({ received: true, event: 'invalid_signature' }, { status: 200 });
  }

  // 解析事件
  let payload: {
    event_name?: string;
    meta?: {
      event_name?: string;
      custom_data?: {
        user_id?: string;
        product_id?: string;
        order_type?: string;
        ab_bucket?: Record<string, number>;
      };
    };
    data?: {
      id?: string;
    };
  };

  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ received: true, event: 'invalid_json' }, { status: 200 });
  }

  // 事件名从 meta.event_name 读取（对齐现有实现）
  const eventName = payload.meta?.event_name || '';
  const customData = payload.meta?.custom_data || {};
  const userId = customData.user_id;

  if (!userId || !env.AUTH_KV) {
    return Response.json({ received: true, event: eventName }, { status: 200 });
  }

  // 成功事件 → 激活 premium + 记录订单（单一事实源）
  if (SUCCESS_EVENTS.has(eventName)) {
    // 订阅类事件解析 subscription_id
    let subscriptionId: string | undefined;
    if (eventName === 'subscription_created' || eventName === 'subscription_payment_success') {
      subscriptionId = payload.data?.id;
    }

    await activatePremium(env.AUTH_KV, userId, 'lemonsqueezy', {
      productId: customData.product_id,
      orderType: customData.order_type,
      abBucket: customData.ab_bucket,
      subscriptionId,
    }, env.D1);
  }

  // 退款/取消事件 → 更新状态（单一事实源）
  if (REFUND_EVENTS.has(eventName)) {
    const subKey = `sub:${userId}`;
    const existingRaw = await env.AUTH_KV.get(subKey);
    if (existingRaw) {
      try {
        const record = JSON.parse(existingRaw) as Record<string, unknown>;
        if (eventName === 'subscription_cancelled') {
          record.tier = 'free';
          record.cancelledAt = new Date().toISOString();
        }
        if (eventName === 'order_refunded') {
          record.refunded = true;
          record.refundedAt = new Date().toISOString();
          record.tier = 'free';
        }
        record.updatedAt = new Date().toISOString();
        await env.AUTH_KV.put(subKey, JSON.stringify(record));
      } catch {
        // 记录损坏则忽略
      }
    }
  }

  return Response.json({ received: true, event: eventName }, { status: 200 });
};
