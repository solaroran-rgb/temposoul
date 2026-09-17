/**
 * 订阅状态 API（Cloudflare Pages Functions，边缘运行）
 * 路由：
 *   GET  /api/v1/subscription          —— 查询当前订阅档位（凭 Authorization Bearer JWT）
 *   POST /api/v1/subscription          —— 更新订阅档位（管理端/支付回调，凭 X-Admin-Token）
 *
 * 说明：P3 商业化 · 订阅墙框架。支付商户（Stripe/支付宝）接入点预留：
 *      支付回调验证通过后，POST 本端点写入 premium 即可解锁 gated 功能。
 *      管理 token 建议用 AUTH_SECRET 派生（避免新增 secret 配置）。
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

interface SubEnv {
  AUTH_KV?: KVNamespace;
  AUTH_SECRET?: string;
  newsletter_emails?: KVNamespace;
}

type PagesContext = {
  request: Request;
  env?: SubEnv;
};

const SUB_KEY_PREFIX = 'sub:';
const TIERS = ['free', 'premium'] as const;
type Tier = (typeof TIERS)[number];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Admin-Token',
      'Cache-Control': 'no-store',
    },
  });
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
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

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return bufToB64url(sig);
}

async function verifyJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, b, s] = parts;
  const expected = await hmac(`${h}.${b}`, secret);
  if (expected !== s) return null;
  try {
    return JSON.parse(new TextDecoder().decode(b64urlToBytes(b))) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function isTier(v: unknown): v is Tier {
  return typeof v === 'string' && (TIERS as readonly string[]).includes(v);
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  const method = ctx.request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Admin-Token',
      },
    });
  }

  const authKv = ctx.env?.AUTH_KV;
  const secret = ctx.env?.AUTH_SECRET;

  // GET：查询当前用户订阅档位
  if (method === 'GET') {
    if (!authKv || !secret) {
      return json({ tier: 'free' as Tier });
    }
    const auth = ctx.request.headers.get('Authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json({ tier: 'free' as Tier });

    const payload = await verifyJwt(token, secret);
    const userId = typeof payload?.sub === 'string' ? payload.sub : '';
    if (!userId) return json({ tier: 'free' as Tier });

    const record = await authKv.get(`${SUB_KEY_PREFIX}${userId}`);
    if (record) {
      try {
        const parsed = JSON.parse(record) as { tier?: unknown };
        if (isTier(parsed.tier)) return json({ tier: parsed.tier });
      } catch {
        /* fallthrough */
      }
    }
    return json({ tier: 'free' as Tier });
  }

  // POST：管理端/支付回调更新订阅档位（X-Admin-Token = HMAC(AUTH_SECRET, 'subscription-admin')）
  if (method === 'POST') {
    if (!authKv || !secret) {
      return json({ error: 'subscription_unavailable' }, 503);
    }
    const adminToken = ctx.request.headers.get('X-Admin-Token') ?? '';
    const expected = await hmac('subscription-admin', secret);
    if (adminToken !== expected) {
      return json({ error: 'forbidden' }, 403);
    }

    const body = await readJson(ctx.request);
    const userId = typeof body.userId === 'string' ? body.userId : '';
    const tier = body.tier;
    if (!userId || !isTier(tier)) {
      return json({ error: 'invalid_payload' }, 400);
    }

    await authKv.put(`${SUB_KEY_PREFIX}${userId}`, JSON.stringify({ tier, ts: new Date().toISOString() }));
    return json({ ok: true, tier });
  }

  return json({ error: 'method_not_allowed' }, 405);
}
