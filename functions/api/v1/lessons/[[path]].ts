/**
 * N-14 课时端点
 *
 *   GET /api/v1/lessons/:id   课时详情（正文 + 要点 + 合规标记 + 免责声明）
 *
 * 权益闸门：所属课程 access=member 时需登录，未登录 401；
 *          鉴权未配置（AUTH_SECRET 缺失）时 fail-closed 返回 503，绝不匿名放行。
 * 纪律：正文来自 src/data/content/learn 单一真值源，端点不改写、不伪造内容。
 */

import { findLesson, toLessonDetail } from '../../../../src/lib/server/learn/catalog';
import { optionalAuth } from '../../../../src/lib/server/community/auth';

interface Env {
  AUTH_SECRET?: string;
}

type Ctx = { request: Request; env: Env; params?: { path?: string | string[] } };

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
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (method !== 'GET') return err('method_not_allowed', 405);

  const seg = segmentsOf(context);
  if (seg.length !== 1) return err('not_found', 404);

  const found = findLesson(seg[0]);
  if (!found) return err('lesson_not_found', 404);

  if (found.course.access === 'member') {
    if (!env.AUTH_SECRET) return err('entitlement_unavailable', 503);
    const identity = await optionalAuth(request, env.AUTH_SECRET);
    if (!identity) return err('unauthorized', 401);
    return json({
      ...toLessonDetail(found.lesson),
      courseId: found.course.id,
      gated: true,
      entitlementRequired: true,
    });
  }

  return json({
    ...toLessonDetail(found.lesson),
    courseId: found.course.id,
    gated: false,
    entitlementRequired: false,
  });
}
