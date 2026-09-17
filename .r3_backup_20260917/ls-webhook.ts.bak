/**
 * Lemon Squeezy Webhook 接收端点（Cloudflare Pages Functions，边缘运行）
 * 路由：POST /api/v1/ls-webhook
 *
 * 作用：支付成功闭环。Lemon Squeezy 在此推送订单/订阅事件 → 验签通过后，
 *   把 checkout 时附带的 custom_data.user_id 对应订阅置为 premium（写 AUTH_KV）。
 *
 * 验签：Lemon Squeezy 在请求头 `X-Signature` 放 hex 编码的
 *   HMAC-SHA256(webhookSecret, rawBody)；本端点取原始 body 计算并常量时间比较。
 *
 * 关心的事件（meta.event_name）：
 *   - subscription_created / subscription_payment_success → 订阅成功，置 premium
 *   - order_created → 一次性订单成功，置 premium
 *   - 其它事件一律 200 确认收到（LS 不重试）
 *
 * 环境变量（占位，严禁硬编码）：
 *   LEMONSQUEEZY_WEBHOOK_SECRET  机密（LS Dashboard → Webhook 端点创建后下发）
 *   AUTH_KV                      KV 命名空间绑定（与 /api/v1/subscription 同库）
 *
 * 配置：LS Dashboard → Settings → Webhooks → 端点 https://<域名>/api/v1/ls-webhook，
 *   订阅上述事件，签名密钥填 LEMONSQUEEZY_WEBHOOK_SECRET。
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface WebhookEnv {
  LEMONSQUEEZY_WEBHOOK_SECRET?: string;
  AUTH_KV?: KVNamespace;
}

type PagesContext = {
  request: Request;
  env?: WebhookEnv;
};

import { activatePremium } from '../../../src/lib/server/payment';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function bufToHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let hex = '';
  for (const b of bytes) hex += b.toString(16).padStart(2, '0');
  return hex;
}

async function hmacHex(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return bufToHex(sig);
}

/** 这些事件视为「付费成功」，需要回写 premium */
const SUCCESS_EVENTS = new Set(['subscription_created', 'subscription_payment_success', 'order_created']);

export async function onRequest(ctx: PagesContext): Promise<Response> {
  if (ctx.request.method.toUpperCase() !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const env = ctx.env ?? {};
  if (!env.LEMONSQUEEZY_WEBHOOK_SECRET || !env.AUTH_KV) {
    return json({ error: 'webhook_unavailable' }, 503);
  }

  const signature = (ctx.request.headers.get('x-signature') ?? '').toLowerCase();
  const rawBody = await ctx.request.text();
  if (!signature) return json({ error: 'missing_signature' }, 400);

  const expected = await hmacHex(env.LEMONSQUEEZY_WEBHOOK_SECRET, rawBody);
  if (expected.length !== signature.length) return json({ error: 'invalid_signature' }, 400);
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  if (diff !== 0) return json({ error: 'invalid_signature' }, 400);

  let event: { meta?: { event_name?: string; custom_data?: { user_id?: string } } };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return json({ error: 'invalid_payload' }, 400);
  }

  const eventName = event.meta?.event_name ?? '';
  if (!SUCCESS_EVENTS.has(eventName)) return json({ received: true, event: eventName });

  const userId = event.meta?.custom_data?.user_id;
  if (!userId || userId === 'anonymous') {
    return json({ received: true, event: eventName, note: 'no_user_link' });
  }

  await activatePremium(env.AUTH_KV, userId, 'lemonsqueezy');
  return json({ received: true, event: eventName, tier: 'premium', userId });
}
