/**
 * 审核队列 API (管理员专用)
 *   GET    /api/v1/admin/reviews          → 待审核列表
 *   POST   /api/v1/admin/reviews/:id/approve → 通过
 *   POST   /api/v1/admin/reviews/:id/reject  → 拒绝
 *   POST   /api/v1/admin/reviews/:id/delete  → 删除
 */

import { requireAdmin, jsonResponse, errorResponse } from '../../../../src/lib/server/community/auth';
import { createCommunityKVStore } from '../../../../src/lib/server/community/kv-store';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
}

export async function onRequest(context: EventContext<Env, unknown, unknown>) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();
  const store = createCommunityKVStore(env.AUTH_KV!);

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Admin-Token',
    }});
  }

  // 管理员鉴权
  let reviewerId;
  try {
    await requireAdmin(request, env.AUTH_SECRET);
    // 管理员ID从token中提取，这里简化处理
    const auth = request.headers.get('Authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    // 简化：管理员ID使用固定值，实际应从token解析
    reviewerId = 'admin';
  } catch (e) {
    return e as Response;
  }

  const id = params.id;

  // GET - 待审核列表
  if (method === 'GET') {
    const url = new URL(request.url);
    const targetType = url.searchParams.get('type') || undefined;
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
    const cursor = url.searchParams.get('cursor') || undefined;

    const { items } = await store.listReports('pending', limit, cursor);
    
    // 根据类型过滤
    const filtered = targetType 
      ? items.filter(r => r.targetType === targetType)
      : items;

    return jsonResponse({ reports: filtered });
  }

  // 需要ID的操作
  if (!id) return errorResponse('missing_id', 400);

  const report = await store.getReport(id);
  if (!report) return errorResponse('report_not_found', 404);

  // POST /approve - 通过
  if (method === 'POST') {
    const body = await request.json().catch(() => ({}));
    const action = body.action as string;

    if (action === 'approve') {
      // 通过：将被审核内容设为 approved
      if (report.targetType === 'post') {
        await store.updatePost(report.targetId, { status: 'approved' });
      } else if (report.targetType === 'comment') {
        await store.updateComment(report.targetId, { status: 'approved' });
      }
      await store.updateReport(id, { status: 'resolved', resolvedAt: new Date().toISOString(), resolvedBy: reviewerId, actionTaken: 'approved' });
      return jsonResponse({ ok: true, action: 'approved' });
    }

    if (action === 'reject') {
      // 拒绝：将被审核内容标记为 rejected
      if (report.targetType === 'post') {
        await store.updatePost(report.targetId, { status: 'rejected' });
      } else if (report.targetType === 'comment') {
        await store.updateComment(report.targetId, { status: 'rejected' });
      }
      await store.updateReport(id, { status: 'resolved', resolvedAt: new Date().toISOString(), resolvedBy: reviewerId, actionTaken: 'rejected' });
      return jsonResponse({ ok: true, action: 'rejected' });
    }

    if (action === 'delete') {
      // 删除：软删除
      if (report.targetType === 'post') {
        await store.updatePost(report.targetId, { status: 'deleted' });
      } else if (report.targetType === 'comment') {
        await store.updateComment(report.targetId, { status: 'deleted' });
      }
      await store.updateReport(id, { status: 'resolved', resolvedAt: new Date().toISOString(), resolvedBy: reviewerId, actionTaken: 'deleted' });
      return jsonResponse({ ok: true, action: 'deleted' });
    }

    return errorResponse('invalid_action', 400);
  }

  return errorResponse('method_not_allowed', 405);
}
