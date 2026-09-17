/**
 * 支付 Checkout 会话创建 API（Cloudflare Pages Functions，边缘运行）
 * 路由：POST /api/v1/checkout
 *
 * 选型（2026-09 MainAgent 拍板）：主 Lemon Squeezy（MoR，个人可注册、无公司要求），
 *   备选 PayPal（接口预留）；排除 Stripe 直连 / Paddle / 支付宝。
 *   抽象与实现见 src/lib/server/payment.ts；切换通道只改 env PAYMENT_PROVIDER。
 *
 * 流程：校验 Bearer JWT 取 userId → createCheckoutSession(...) → 返回托管收银台 URL，
 *   前端 redirect 即完成支付；支付成功由 ls-webhook 回写 premium。
 *
 * 环境变量（占位，严禁硬编码）：见 src/lib/server/payment.ts 与
 *   docs/commerce/2026-09-12-commerce-setup.md。
 *
 * 降级：未配置 PAYMENT_PROVIDER 或对应密钥 → 503 commerce_unavailable，
 *   前端优雅降级到登录页。
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface CheckoutEnv {
  PAYMENT_PROVIDER?: string;
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
  PUBLIC_SITE_URL?: string;
  [k: string]: unknown;
}

type PagesContext = {
  request: Request;
  env?: CheckoutEnv;
};

import { createCheckoutSession, type PaymentEnv } from '../../../src/lib/server/payment';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Cache-Control': 'no-store',
    },
  });
}

function bufToB64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '===='.slice(0, pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** 与 functions/api/v1/subscription.ts 同方案 HMAC-SHA256 JWT 校验（仅取 sub/email） */
async function readIdentity(authHeader: string, secret: string): Promise<{ userId: string; email?: string }> {
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
  if (!token) return { userId: 'anonymous' };
  const parts = token.split('.');
  if (parts.length !== 3) return { userId: 'anonymous' };
  const [h, b, s] = parts;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${h}.${b}`));
  if (bufToB64url(sig) !== s) return { userId: 'anonymous' };
  try {
    const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(b))) as { sub?: string; email?: string };
    return { userId: typeof payload.sub === 'string' ? payload.sub : 'anonymous', email: payload.email };
  } catch {
    return { userId: 'anonymous' };
  }
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  const method = ctx.request.method.toUpperCase();
  if (method === 'OPTIONS') return new Response(null, { status: 204 });
  if (method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const env = (ctx.env ?? {}) as PaymentEnv;
  const baseUrl = new URL(ctx.request.url).origin;

  let userId = 'anonymous';
  let email: string | undefined;
  if (env.AUTH_SECRET) {
    const id = await readIdentity(ctx.request.headers.get('Authorization') ?? '', env.AUTH_SECRET);
    userId = id.userId;
    email = id.email;
  }

  const result = await createCheckoutSession(env, { userId, email, baseUrl });
  if (!result.ok) {
    return json({ error: result.error, detail: result.detail ?? '' }, result.error === 'commerce_unavailable' ? 503 : 502);
  }
  return json({ url: result.url });
}
