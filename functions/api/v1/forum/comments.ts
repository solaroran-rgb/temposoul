/**
 * 评论 API
 *   POST /api/v1/forum/:postId/comments → 新增评论（需登录）
 */

import { requireAuth, jsonResponse, errorResponse, readJsonBody } from '../../../../src/lib/server/community/auth';
import { moderateContent } from '../../../../src/lib/server/community/moderation';
import { LENGTH_LIMITS, RATE_LIMITS, type Comment, type CommentStatus } from '../../../../src/lib/server/community/models';
import { createCommunityKVStore, genId } from '../../../../src/lib/server/community/kv-store';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
  GEO_CACHE?: KVNamespace;
}

export async function onRequest(context: EventContext<Env, unknown, unknown>) {
  const { request, env, params } = context;
  const method = request.method.toUpperCase();
  const store = createCommunityKVStore(env.AUTH_KV!);
  const postId = params.postId;

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    }});
  }

  if (method !== 'POST') {
    return errorResponse('method_not_allowed', 405);
  }

  // 检查帖子是否存在
  const post = await store.getPost(postId);
  if (!post) return errorResponse('post_not_found', 404);

  // 限流
  if (env.GEO_CACHE) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const { allowed } = await store.checkRateLimit(`comment:${ip}`, RATE_LIMITS.COMMENT_PER_MINUTE);
    if (!allowed) return errorResponse('rate_limit_exceeded', 429);
  }

  // 鉴权
  let identity;
  try {
    identity = await requireAuth(request, env.AUTH_SECRET);
  } catch (e) {
    return e as Response;
  }

  const body = await readJsonBody(request);
  const content = typeof body.content === 'string' ? body.content.trim() : '';

  if (!content || content.length > LENGTH_LIMITS.COMMENT_MAX) {
    return errorResponse('invalid_content', 400);
  }

  // 敏感词过滤
  const moderation = moderateContent({ content });
  const status: CommentStatus = moderation.safe ? 'approved' : 'pending';

  const comment: Comment = {
    id: genId('comment'),
    postId,
    authorId: identity.sub,
    content: moderation.filteredText || content,
    status,
    createdAt: new Date().toISOString(),
  };

  await store.createComment(comment);

  // 更新帖子的回复数
  const updatedPost = await store.getPost(postId);
  if (updatedPost) {
    await store.updatePost(postId, { replyCount: updatedPost.replyCount + 1 });
  }

  return jsonResponse(comment, 201);
}
