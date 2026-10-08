/**
 * N-13 知识库总览端点
 *
 *   GET /api/v1/knowledge            知识库总览（等价 /overview）
 *   GET /api/v1/knowledge/overview   词典分类 + 命理典籍目录
 *
 * 纪律：只读内置静态目录，不读写 DB、不改写内容、不伪造正文就绪状态。
 */

import { getKnowledgeOverview } from '../../../../src/lib/server/knowledge/catalog';

type Ctx = { request: Request; params?: { path?: string | string[] } };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Max-Age': '600',
} as const;

function segmentsOf(context: Ctx): string[] {
  const p = context.params?.path;
  const raw = Array.isArray(p) ? p : typeof p === 'string' ? p.split('/') : [];
  return raw.filter(Boolean).map(decodeURIComponent);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}

function err(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export async function onRequest(context: Ctx): Promise<Response> {
  const { request } = context;
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (method !== 'GET') return err('method_not_allowed', 405);

  const seg = segmentsOf(context);

  // ── GET /api/v1/knowledge[/overview] ─────────────────────────────────────
  if (seg.length === 0 || (seg.length === 1 && seg[0] === 'overview')) {
    return json(getKnowledgeOverview());
  }

  return err('not_found', 404);
}
