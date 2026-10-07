/**
 * N-14 课程端点
 *
 *   GET /api/v1/courses               课程目录（keyset 分页，禁 OFFSET）
 *   GET /api/v1/courses/:id           课程详情（含课时清单）
 *   GET /api/v1/courses/:id/lessons   课时清单（?level=&limit=&cursor=）
 *
 * 纪律：价格/权益只从服务端读；无真实课程返回空数组，绝不伪造。
 */

import {
  COURSES,
  findCourse,
  sortedLessons,
  toCourseSummary,
  toLessonListItem,
  keysetSlice,
} from '../../../../src/lib/server/learn/catalog';
import { LEARN_DISCLAIMER } from '../../../../src/data/content/learn/types';

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

function limitOf(url: URL): number {
  return Math.min(Math.max(parseInt(url.searchParams.get('limit') || '20', 10) || 20, 1), 50);
}

export async function onRequest(context: Ctx): Promise<Response> {
  const { request } = context;
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (method !== 'GET') return err('method_not_allowed', 405);

  const seg = segmentsOf(context);
  const url = new URL(request.url);

  // ── GET /api/v1/courses ──────────────────────────────────────────────────
  if (seg.length === 0) {
    const sorted = [...COURSES].sort((a, b) => a.id.localeCompare(b.id));
    const { items, nextCursor } = keysetSlice(sorted, url.searchParams.get('cursor') || '', limitOf(url));
    return json({ items: items.map(toCourseSummary), cursor: nextCursor, total: COURSES.length });
  }

  // ── GET /api/v1/courses/:id ──────────────────────────────────────────────
  if (seg.length === 1) {
    const course = findCourse(seg[0]);
    if (!course) return err('course_not_found', 404);
    return json({
      ...toCourseSummary(course),
      lessons: sortedLessons(course).map(toLessonListItem),
      disclaimer: LEARN_DISCLAIMER,
    });
  }

  // ── GET /api/v1/courses/:id/lessons ──────────────────────────────────────
  if (seg.length === 2 && seg[1] === 'lessons') {
    const course = findCourse(seg[0]);
    if (!course) return err('course_not_found', 404);
    const level = url.searchParams.get('level');
    if (level && level !== 'beginner' && level !== 'elementary') return err('invalid_level', 400);
    const { items, nextCursor } = keysetSlice(
      sortedLessons(course, level),
      url.searchParams.get('cursor') || '',
      limitOf(url)
    );
    return json({
      courseId: course.id,
      items: items.map(toLessonListItem),
      cursor: nextCursor,
      total: sortedLessons(course, level).length,
    });
  }

  return err('not_found', 404);
}
