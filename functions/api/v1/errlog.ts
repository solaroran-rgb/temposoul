/**
 * 应用错误统一落点（Cloudflare Pages Functions，边缘运行）
 * 路由：POST /api/v1/errlog   接收前端/服务端错误（ingest，写入 KV + 5 分钟聚合）
 *       GET  /api/v1/errlog   运维拉取聚合 + 待告警清单（admin，独立令牌）
 *       POST /api/v1/errlog   带 ?ack=1 清除 pending 告警（admin）
 *
 * 鉴权（fail-closed，风格同 T03 dispatch）：
 *   - ingest 用 ERRLOG_INGEST_TOKEN（可公开嵌入前端，仅写权限，无法读/删）；
 *     未配置 → 503，绝不匿名开放错误写入。
 *   - admin 用 ERRLOG_ADMIN_TOKEN（机密，仅运维拉取/确认）。未配置 → 503。
 *
 * 聚合与告警：
 *   - 同一 (scope + level) 在 5 分钟窗口内计数；error/fatal 级达到阈值（默认 3）
 *     即触发 ALERT_WEBHOOK（若配置）→ waitUntil 异步发送；未配置则写 pending 记录，
 *     由 alert-5xx.sh 轮询后以 mock 日志形式呈现，避免静默丢失。
 *   - 每窗口仅告警一次（alerted:<bucket> 去重标记）。
 */

interface ErrlogKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ keys: Array<{ name: string }>; list_complete: boolean; cursor?: string }>;
}

interface ErrlogEnv {
  ERRLOG_KV?: ErrlogKV;
  ERRLOG_INGEST_TOKEN?: string;
  ERRLOG_ADMIN_TOKEN?: string;
  ALERT_WEBHOOK?: string;
  ERRLOG_ALERT_THRESHOLD?: string;
}

const NO_STORE = { 'Cache-Control': 'no-store' };
const LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;
type Level = (typeof LEVELS)[number];

/** 5 分钟聚合窗口（秒） */
const WINDOW_MS = 5 * 60 * 1000;
const ALERT_EXEMPT_LEVELS: Level[] = ['error', 'fatal'];
const MAX_MSG_LEN = 2000;
const MAX_STACK_LEN = 4000;
const MAX_CTX_LEN = 2000;

function json(data: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...NO_STORE, ...headers },
  });
}

/** 常量时间比较，避免通过响应时间侧信道逐字节猜 token */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function providedToken(req: Request): string {
  const header = req.headers.get('x-errlog-token');
  if (header) return header.trim();
  const auth = req.headers.get('Authorization') ?? '';
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
}

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…[truncated]' : s;
}

interface ErrEntry {
  level: Level;
  scope: string;
  message: string;
  stack?: string;
  ctx?: unknown;
  ts?: string;
  origin?: string;
}

/** 服务端内调便捷封装：把一条 error/fatal 写进 errlog（供 _middleware 全局 5xx 捕获复用） */
export async function logError(
  env: ErrlogEnv,
  entry: { level: Level; scope: string; message: string; stack?: string; ctx?: unknown },
): Promise<void> {
  await ingest(env, {
    level: entry.level,
    scope: entry.scope,
    message: entry.message,
    stack: entry.stack,
    ctx: entry.ctx,
    origin: 'server',
  });
}

async function ingest(env: ErrlogEnv, raw: ErrEntry): Promise<{ status: number; body: unknown }> {
  const kv = env.ERRLOG_KV;
  if (!kv) {
    // KV 未绑定：生产必须绑定 ERRLOG_KV；缺省时静默丢弃（不阻塞业务）
    return { status: 503, body: { error: 'errlog_unavailable', hint: 'bind ERRLOG_KV' } };
  }

  const entry: ErrEntry = {
    level: LEVELS.includes(raw.level as Level) ? (raw.level as Level) : 'error',
    scope: truncate(String(raw.scope || 'unknown').slice(0, 120), 120),
    message: truncate(String(raw.message ?? ''), MAX_MSG_LEN),
    stack: raw.stack ? truncate(String(raw.stack), MAX_STACK_LEN) : undefined,
    ctx: raw.ctx !== undefined ? truncate(JSON.stringify(raw.ctx ?? null), MAX_CTX_LEN) : undefined,
    ts: new Date().toISOString(),
    origin: raw.origin ?? 'client',
  };

  // 1) 原始条目落库
  const id = `err:${entry.ts}:${Math.random().toString(36).slice(2, 10)}`;
  await kv.put(id, JSON.stringify(entry), { expirationTtl: 60 * 60 * 24 * 7 }); // 保留 7 天

  // 2) 5 分钟聚合（仅对 error/fatal 评估告警）
  if (ALERT_EXEMPT_LEVELS.includes(entry.level)) {
    const window = Math.floor(Date.now() / WINDOW_MS);
    const bucket = `${entry.scope}::${entry.level}::${window}`;
    const aggKey = `agg:${bucket}`;
    let agg = { scope: entry.scope, level: entry.level, window, count: 0, firstMsg: entry.message, firstAt: entry.ts, lastAt: entry.ts };
    const existing = await kv.get(aggKey);
    if (existing) {
      try {
        agg = { ...agg, ...(JSON.parse(existing) as object) };
      } catch {
        // 损坏则重建
      }
    }
    agg.count += 1;
    agg.lastAt = entry.ts;
    if (agg.count === 1) agg.firstMsg = entry.message;
    await kv.put(aggKey, JSON.stringify(agg), { expirationTtl: Math.ceil(WINDOW_MS / 1000) + 60 });

    // 3) 阈值判定 + 告警（每窗口一次）
    const threshold = Math.max(1, Number.parseInt(env.ERRLOG_ALERT_THRESHOLD ?? '3', 10) || 3);
    if (agg.count >= threshold) {
      const alertedKey = `alerted:${bucket}`;
      const already = await kv.get(alertedKey);
      if (!already) {
        await kv.put(alertedKey, new Date().toISOString(), { expirationTtl: Math.ceil(WINDOW_MS / 1000) });
        const payload = {
          text: `[TempoSoul 5xx/error 告警] scope=${entry.scope} level=${entry.level} count=${agg.count}/5min`,
          scope: entry.scope,
          level: entry.level,
          count: agg.count,
          firstMsg: agg.firstMsg,
          firstAt: agg.firstAt,
          window,
        };
        if (env.ALERT_WEBHOOK) {
          // 异步发送，不阻塞请求
          void fetch(env.ALERT_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }).catch(() => undefined);
        } else {
          // 未配 webhook：写 pending，由 alert-5xx.sh 以 mock 日志呈现
          const pendingKey = `pending:${bucket}`;
          await kv.put(
            pendingKey,
            JSON.stringify({ ...payload, pendingAt: new Date().toISOString() }),
            { expirationTtl: Math.ceil(WINDOW_MS / 1000) },
          );
        }
      }
    }
  }

  return { status: 200, body: { ok: true, id } };
}

async function handlePost(req: Request, env: ErrlogEnv): Promise<Response> {
  const expected = env.ERRLOG_INGEST_TOKEN ?? '';
  if (!expected) return json({ error: 'errlog_unavailable', hint: 'set ERRLOG_INGEST_TOKEN' }, 503);
  if (!safeEqual(providedToken(req), expected)) return json({ error: 'unauthorized' }, 401);

  // ?ack=1 → 运维确认，清除所有 pending
  const url = new URL(req.url);
  if (url.searchParams.get('ack') === '1') {
    const adminExpected = env.ERRLOG_ADMIN_TOKEN ?? '';
    if (!adminExpected) return json({ error: 'admin_required' }, 503);
    if (!safeEqual(providedToken(req), adminExpected)) return json({ error: 'unauthorized' }, 401);
    const kv = env.ERRLOG_KV;
    if (kv) {
      let cursor: string | undefined;
      do {
        const page = await kv.list({ prefix: 'pending:', limit: 100, cursor });
        for (const k of page.keys) await kv.delete(k.name);
        cursor = page.list_complete ? undefined : page.cursor;
      } while (cursor);
    }
    return json({ ok: true, cleared: 'pending' });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) ?? {};
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const { status, body: out } = await ingest(env, {
    level: (body.level as Level) ?? 'error',
    scope: (body.scope as string) ?? 'unknown',
    message: (body.message as string) ?? '',
    stack: body.stack as string | undefined,
    ctx: body.ctx,
    origin: 'client',
  });
  return json(out, status);
}

async function handleGet(req: Request, env: ErrlogEnv): Promise<Response> {
  const adminExpected = env.ERRLOG_ADMIN_TOKEN ?? '';
  if (!adminExpected) return json({ error: 'admin_required', hint: 'set ERRLOG_ADMIN_TOKEN' }, 503);
  if (!safeEqual(providedToken(req), adminExpected)) return json({ error: 'unauthorized' }, 401);

  const kv = env.ERRLOG_KV;
  const aggregations: unknown[] = [];
  const pending: unknown[] = [];
  if (kv) {
    let cursor: string | undefined;
    do {
      const page = await kv.list({ prefix: 'agg:', limit: 100, cursor });
      for (const k of page.keys) {
        const v = await kv.get(k.name);
        if (v) {
          try {
            aggregations.push(JSON.parse(v));
          } catch {
            /* skip */
          }
        }
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);

    cursor = undefined;
    do {
      const page = await kv.list({ prefix: 'pending:', limit: 100, cursor });
      for (const k of page.keys) {
        const v = await kv.get(k.name);
        if (v) {
          try {
            pending.push(JSON.parse(v));
          } catch {
            /* skip */
          }
        }
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
  }

  return json({ ok: true, aggregations, pending, alertWebhookConfigured: Boolean(env.ALERT_WEBHOOK) });
}

export async function onRequest(ctx: { request: Request; env?: ErrlogEnv }): Promise<Response> {
  const method = ctx.request.method.toUpperCase();
  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: NO_STORE });
  if (method === 'POST') return handlePost(ctx.request, ctx.env ?? {});
  if (method === 'GET') return handleGet(ctx.request, ctx.env ?? {});
  return json({ error: 'method_not_allowed' }, 405);
}
