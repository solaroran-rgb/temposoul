// 报告 PDF 导出闸门
// 选型背景：站点跑在 Cloudflare Pages（edge runtime），跑不了无头浏览器（puppeteer/playwright
// 需要子进程与 CDP，edge 无此能力），所以正文 PDF 由客户端打印引擎产出。本端点是导出链路的
// 服务端闸门：鉴权 + 限流 + 类型校验，未登录一律 401（满足「导出接口未登录被拒」验收项）。
import { readIdentityWithSession } from '../../../../src/lib/server/auth';

export const REPORT_EXPORT_TYPES = ['liunian', 'hehun', 'naming'] as const;
export type ReportExportType = (typeof REPORT_EXPORT_TYPES)[number];

/** 每用户每分钟导出次数上限（防刷：打印/导出动作会打在这里） */
const RATE_LIMIT_MAX = 10;
/** KV 计数窗口 TTL，与 _middleware 已有限流一致的短窗口做法 */
const RATE_LIMIT_TTL = 120;

const NO_STORE = { 'Cache-Control': 'no-store' };

function json(body: unknown, status: number, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', ...NO_STORE, ...headers },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const bearer = context.request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const identity = bearer
    ? await readIdentityWithSession(bearer, context.env.AUTH_SECRET, context.env.AUTH_KV).catch(() => null)
    : null;
  if (!identity) return json({ error: 'unauthorized' }, 401);

  // 限流：按 sub + 分钟窗口，复用 GEO_CACHE（与 functions/_middleware.ts 同套路）
  if (context.env.GEO_CACHE) {
    const minute = Math.floor(Date.now() / 60000);
    const key = `rl:report-export:${identity.sub}:${minute}`;
    const current = Number.parseInt((await context.env.GEO_CACHE.get(key)) ?? '0', 10);
    if (current >= RATE_LIMIT_MAX) {
      return json({ error: 'rate_limit_exceeded' }, 429, { 'Retry-After': '60' });
    }
    await context.env.GEO_CACHE.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_TTL });
  }

  let body: { type?: unknown } = {};
  try {
    body = (await context.request.json()) ?? {};
  } catch {
    // 非 JSON body 走下面的类型校验 → 400
  }

  const type = body.type;
  if (!REPORT_EXPORT_TYPES.includes(type as ReportExportType)) {
    return json({ error: 'bad_report_type' }, 400);
  }

  return json({ ok: true, type, exportedAt: new Date().toISOString() }, 200);
};
