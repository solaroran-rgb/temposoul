/**
 * 邮件退订 API（Cloudflare Pages Functions，边缘运行）
 * 路由：POST /api/v1/newsletter/unsubscribe
 * 存储：newsletter_emails（Cloudflare KV）
 *
 * 机制：
 *   - 按邮箱（已归一化小写）把记录状态机置为 unsubscribed、subscribed=false；
 *   - 幂等：已退订再调用仍返回 ok；
 *   - 安全：退订是用户自主权，无需签名令牌——任何人都能对任一邮箱发起退订，
 *     这与「可随时退订」的隐私友好原则一致（误退订可重新订阅恢复）。
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface NewsletterEnv {
  newsletter_emails?: KVNamespace;
}

type PagesContext = {
  request: Request;
  env?: NewsletterEnv;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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

function safeParseRecord(raw: string): Record<string, unknown> | null {
  try {
    const v = JSON.parse(raw) as unknown;
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  const method = ctx.request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  if (method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const kv = ctx.env?.newsletter_emails;
  if (!kv) {
    return json({ error: 'newsletter_unavailable' }, 503);
  }

  const body = await readJson(ctx.request);
  const raw = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL_RE.test(raw) || raw.length > MAX_EMAIL_LEN) {
    return json({ error: 'invalid_email' }, 400);
  }

  const key = `email:${raw}`;
  const existingRaw = await kv.get(key);
  const rec = existingRaw ? safeParseRecord(existingRaw) : null;

  if (!rec) {
    // 没有记录也按退订成功返回（幂等），不泄露邮箱是否在册
    return json({ ok: true, status: 'unsubscribed', unknown: true });
  }

  rec.status = 'unsubscribed';
  rec.subscribed = false;
  rec.unsubscribedAt = new Date().toISOString();
  await kv.put(key, JSON.stringify(rec));

  return json({ ok: true, status: 'unsubscribed' });
}
