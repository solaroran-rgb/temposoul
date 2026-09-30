/**
 * 社区论坛 API
 *   GET  /api/v1/forum              → 版块列表 + 帖子流（?board=xxx &limit=20 &cursor=xxx）
 *   POST /api/v1/forum              → 发帖 { boardId, title, content }（需登录）
 *   DELETE /api/v1/forum/:id        → 删除帖子（本人或管理员）
 */

import { requireAuth, jsonResponse, errorResponse, readJsonBody } from '../../../../src/lib/server/community/auth';
import { moderateContent } from '../../../../src/lib/server/community/moderation';
import { LENGTH_LIMITS, RATE_LIMITS, type Post, type PostStatus } from '../../../../src/lib/server/community/models';
import { createCommunityKVStore, genId } from '../../../../src/lib/server/community/kv-store';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
  GEO_CACHE?: KVNamespace;
}

function toPostListItem(p: Post) {
  return {
    id: p.id,
    boardId: p.boardId,
    title: p.title,
    authorId: p.authorId,
    excerpt: p.excerpt,
    replyCount: p.replyCount,
    status: p.status,
    createdAt: p.createdAt,
  };
}

export async function onRequest(context: EventContext<Env, unknown, unknown>) {
  const { request, env } = context;
  const method = request.method.toUpperCase();
  const store = createCommunityKVStore(env.AUTH_KV!);
  const boards = await store.listBoards();

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Admin-Token',
        'Access-Control-Max-Age': '600',
      },
    });
  }

  // GET - 帖子列表
  if (method === 'GET') {
    const url = new URL(request.url);
    const boardId = url.searchParams.get('board') || undefined;
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 50);
    const cursor = url.searchParams.get('cursor') || undefined;

    if (boardId && !boards.some(b => b.id === boardId)) {
      return errorResponse('unknown_board', 400);
    }

    const { items, cursor: nextCursor } = await store.listPosts(boardId, limit, cursor);
    const approved = items.filter(p => p.status === 'approved');

    return jsonResponse({
      board: boardId ?? null,
      boards,
      posts: approved.map(toPostListItem),
      cursor: nextCursor,
    });
  }

  // POST - 发帖
  if (method === 'POST') {
    if (env.GEO_CACHE) {
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const { allowed } = await store.checkRateLimit(`post:${ip}`, RATE_LIMITS.POST_PER_MINUTE);
      if (!allowed) return errorResponse('rate_limit_exceeded', 429);
    }

    let identity;
    try {
      identity = await requireAuth(request, env.AUTH_SECRET);
    } catch (e) {
      return e as Response;
    }

    const body = await readJsonBody(request);
    const boardId = typeof body.boardId === 'string' ? body.boardId.trim() : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';

    if (!boardId || !boards.some(b => b.id === boardId)) {
      return errorResponse('invalid_board', 400);
    }
    if (!title || title.length > LENGTH_LIMITS.TITLE_MAX) {
      return errorResponse('invalid_title', 400);
    }
    if (!content || content.length > LENGTH_LIMITS.CONTENT_MAX) {
      return errorResponse('invalid_content', 400);
    }

    const moderation = moderateContent({ title, content });
    const status: PostStatus = moderation.safe ? 'approved' : 'pending';
    const now = new Date().toISOString();

    const post: Post = {
      id: genId('post'),
      boardId,
      title,
      authorId: identity.sub,
      excerpt: content.slice(0, LENGTH_LIMITS.EXCERPT_MAX),
      content: moderation.filteredText || content,
      status,
      replyCount: 0,
      createdAt: now,
    };

    await store.createPost(post);
    return jsonResponse(toPostListItem(post), 201);
  }

  return errorResponse('method_not_allowed', 405);
}
