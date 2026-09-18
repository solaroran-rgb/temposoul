/**
 * 邮件订阅管理 API（Cloudflare Pages Functions，边缘运行）
 * 路由：POST /api/v1/newsletter/manage
 * 存储：newsletter_emails（Cloudflare KV）
 *
 * 用途（前端 /newsletter 管理页调用）：
 *   - 不传 frequency：查询该邮箱当前订阅状态；
 *   - 传 frequency（daily|weekly|monthly）：在状态不变的前提下更新发送频率。
 *
 * 安全：按邮箱查询，不暴露敏感个人信息；频率更新不改变订阅状态机
 *   （confirmed 仍需经邮件确认；unsubscribed 仍处退订状态，需重新走订阅）。
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
const FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;

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

  const freqInput = body.frequency;
  const wantUpdateFreq = freqInput !== undefined;
  if (
    wantUpdateFreq &&
    !(typeof freqInput === 'string' && (FREQUENCIES as readonly string[]).includes(freqInput))
  ) {
    return json({ error: 'invalid_frequency' }, 400);
  }
  const frequency = freqInput as string;

  const key = `email:${raw}`;
  const existingRaw = await kv.get(key);
  const rec = existingRaw ? safeParseRecord(existingRaw) : null;

  if (!rec) {
    return json({ ok: true, subscribed: false, status: 'none', frequency: null });
  }

  if (wantUpdateFreq) {
    rec.frequency = frequency;
    rec.updatedAt = new Date().toISOString();
    await kv.put(key, JSON.stringify(rec));
  }

  const status =
    typeof rec.status === 'string' ? rec.status : rec.subscribed === true ? 'confirmed' : 'pending';
  return json({
    ok: true,
    status,
    subscribed: status === 'confirmed',
    frequency: typeof rec.frequency === 'string' ? rec.frequency : 'weekly',
  });
}
