/**
 * 邮件队列调度 tick（Cloudflare Pages Functions，边缘运行）
 * 路由：GET|POST /api/v1/mail/dispatch
 *
 * 为什么是 HTTP tick 而不是 cron：Cloudflare Pages Functions 不支持 scheduled 事件，
 * 「定时」交给外部触发器打这个端点（Cloudflare Cron Triggers / UptimeRobot /
 * GitHub Actions schedule，建议每 1~5 分钟一次）。端点本身幂等，多打无害：
 * 终态任务不重发，未到期任务跳过，processing 带租约。
 *
 * 鉴权（fail-closed）：必须配置 MAIL_DISPATCH_TOKEN，请求须带
 *   `x-dispatch-token: <token>` 或 `Authorization: Bearer <token>`。
 *   未配置 token → 503，绝不开放匿名触发（否则等于公开代发邮件）。
 */

import { drainDue, type MailSchedulerEnv } from '../../../../src/lib/server/mail/scheduler';

type PagesContext = {
  request: Request;
  env?: MailSchedulerEnv & { MAIL_DISPATCH_TOKEN?: string };
  waitUntil?(promise: Promise<unknown>): void;
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
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
  const header = req.headers.get('x-dispatch-token');
  if (header) return header.trim();
  const auth = req.headers.get('Authorization') ?? '';
  return auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
}

export async function onRequest(ctx: PagesContext): Promise<Response> {
  const method = ctx.request.method.toUpperCase();
  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  }
  if (method !== 'GET' && method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  const expected = ctx.env?.MAIL_DISPATCH_TOKEN ?? '';
  if (!expected) {
    return json({ error: 'dispatch_unavailable', hint: 'set MAIL_DISPATCH_TOKEN' }, 503);
  }
  if (!safeEqual(providedToken(ctx.request), expected)) {
    return json({ error: 'unauthorized' }, 401);
  }

  const url = new URL(ctx.request.url);
  const rawMax = url.searchParams.get('max');
  let maxTasks: number | undefined;
  if (rawMax !== null) {
    const n = Number(rawMax);
    if (Number.isFinite(n)) maxTasks = Math.floor(n);
  }

  const result = await drainDue(ctx.env ?? {}, maxTasks ? { maxTasks } : {});
  return json({ ok: true, ...result });
}
