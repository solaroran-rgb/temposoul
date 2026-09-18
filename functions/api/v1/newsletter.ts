/**
 * 邮件订阅 API（Cloudflare Pages Functions，边缘运行）
 * 路由：POST /api/v1/newsletter
 * 存储：newsletter_emails（Cloudflare KV）
 * 说明：P3 商业化 · 邮件捕获（双确认框架）
 *   - 新订阅写入 status:pending 记录，并签发确认 token、调用 sendConfirmationEmail 预留 hook；
 *   - 用户点击邮件链接后由 /api/v1/newsletter-confirm 完成 pending→confirmed。
 *   - 邮件通道未接入前，hook 为空操作，记录保持 pending（不实际发信）。
 */

import {
  CONFIRM_TOKEN_TTL_SEC,
  createConfirmToken,
  sendConfirmationEmail,
  type ConfirmEnv,
} from './newsletter-confirm';

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}

interface NewsletterEnv extends ConfirmEnv {
  newsletter_emails?: KVNamespace;
  AUTH_SECRET?: string;
}

type PagesContext = {
  request: Request;
  env?: NewsletterEnv;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;

const FREQUENCIES = ['daily', 'weekly', 'monthly'] as const;
type Frequency = (typeof FREQUENCIES)[number];

function parseFrequency(v: unknown): Frequency {
  return typeof v === 'string' && (FREQUENCIES as readonly string[]).includes(v)
    ? (v as Frequency)
    : 'weekly';
}

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

/** 读取并宽松解析一条订阅记录；解析失败返回 null（按不存在处理） */
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
  const frequency = parseFrequency(body.frequency);
  const existingRaw = await kv.get(key);
  const existing = existingRaw ? (safeParseRecord(existingRaw) ?? null) : null;
  if (existing) {
    // 已存在记录：若用户重新提交了频率，则同步更新频率（不改变订阅状态机）
    if (body.frequency !== undefined && existing.frequency !== frequency) {
      existing.frequency = frequency;
      existing.updatedAt = new Date().toISOString();
      await kv.put(key, JSON.stringify(existing));
    }
    return json({ ok: true, already: true, status: existing.status ?? 'confirmed' });
  }

  const record = {
    email: raw,
    source: typeof body.source === 'string' && body.source.length <= 64 ? body.source : 'website',
    ts: new Date().toISOString(),
    status: 'pending',
    subscribed: false,
    frequency,
  };
  await kv.put(key, JSON.stringify(record));

  // 双确认：签发确认 token 并经 Resend 发送确认邮件（env 未配置时静默 no-op）
  const secret = ctx.env?.AUTH_SECRET;
  if (secret) {
    const exp = Math.floor(Date.now() / 1000) + CONFIRM_TOKEN_TTL_SEC;
    const token = await createConfirmToken(raw, exp, secret);
    const baseUrl = new URL(ctx.request.url).origin;
    await sendConfirmationEmail(ctx.env ?? {}, raw, token, baseUrl);
  }

  return json({ ok: true, status: 'pending', pendingConfirmation: true });
}
