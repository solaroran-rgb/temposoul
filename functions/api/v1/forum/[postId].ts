/**
 * 帖子详情 API
 *   GET /api/v1/forum/:postId → { post, comments }
 *   DELETE /api/v1/forum/:postId → 删除帖子（本人或管理员）
 */

import { requireAuth, requireAdmin, jsonResponse, errorResponse } from '../../../../src/lib/server/community/auth';
import { createCommunityKVStore } from '../../../../src/lib/server/community/kv-store';
import { type Post, type Comment } from '../../../../src/lib/server/community/models';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
}

function toPostDetail(p: Post, comments: Comment[]) {
  return {
    ...p,
    comments: comments
      .filter(c => c.status === 'approved')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  };
}

export async function onRequest(context: EventContext<Env, unknown, unknown>) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();
  const store = createCommunityKVStore(env.AUTH_KV!);
  const postId = params.postId;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Admin-Token',
    }});
  }

  // GET - 帖子详情
  if (method === 'GET') {
    const post = await store.getPost(postId);
    if (!post) return errorResponse('post_not_found', 404);
    const { items: comments } = await store.listComments(postId, 100);
    return jsonResponse(toPostDetail(post, comments));
  }

  // DELETE - 删除帖子
  if (method === 'DELETE') {
    const post = await store.getPost(postId);
    if (!post) return errorResponse('post_not_found', 404);

    let identity;
    try {
      identity = await requireAuth(request, env.AUTH_SECRET);
    } catch (e) {
      return e as Response;
    }

    let isAdmin = false;
    try {
      await requireAdmin(request, env.AUTH_SECRET);
      isAdmin = true;
    } catch {}

    if (!isAdmin && post.authorId !== identity.sub) {
      return errorResponse('forbidden', 403);
    }

    await store.updatePost(postId, { status: 'deleted' });
    return jsonResponse({ ok: true });
  }

  return errorResponse('method_not_allowed', 405);
}
