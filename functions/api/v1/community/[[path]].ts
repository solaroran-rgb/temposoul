/**
 * N-09 社区端点（canonical 命名空间）
 *
 *   GET    /api/v1/community/boards                 版块列表
 *   GET    /api/v1/community/threads                帖子流（?board=&limit=&cursor=，keyset 分页）
 *   POST   /api/v1/community/threads                发帖（需登录）
 *   GET    /api/v1/community/threads/:id            帖子详情
 *   PATCH  /api/v1/community/threads/:id            编辑（本人）
 *   DELETE /api/v1/community/threads/:id            软删（本人/管理员）
 *   GET    /api/v1/community/threads/:id/replies    回复列表
 *   POST   /api/v1/community/threads/:id/replies    回复（需登录）
 *   GET    /api/v1/community/bounty                 悬赏列表（?status=&limit=&cursor=）
 *   POST   /api/v1/community/bounty                 发悬赏（需登录 + 积分冻结）
 *   GET    /api/v1/community/bounty/:id             悬赏详情（含回答）
 *   GET    /api/v1/community/bounty/:id/answers     回答列表
 *   POST   /api/v1/community/bounty/:id/answers     回答（需登录，非本人）
 *   POST   /api/v1/community/bounty/:id/accept      采纳（作者，释放积分）
 *   POST   /api/v1/community/bounty/:id/cancel      撤单（作者，退回积分）
 *   GET    /api/v1/community/wall                   分享墙（?type=&limit=&cursor=）
 *   POST   /api/v1/community/wall                   投稿分享（需登录）
 *   POST   /api/v1/community/wall/:id/like          点赞/取消点赞（幂等切换）
 *   GET    /api/v1/community/cases                  真实案例列表（?category=）
 *   POST   /api/v1/community/cases                  提交案例（需登录，默认 pending 待审）
 *   GET    /api/v1/community/cases/:id              案例详情
 *   GET    /api/v1/community/cases/:id/feedback     案例反馈列表
 *   POST   /api/v1/community/cases/:id/feedback     提交反馈（需登录，1~5 分）
 *
 * 纪律：
 *   - 复用既有 forum 存储层（Post/Comment/Board），与 /api/v1/forum 数据同源、行为零变更；
 *   - 新增实体（悬赏/分享墙/案例）走 ext-store，只新增 KV 前缀；
 *   - 反假红线：无真实数据时返回空数组，绝不伪造内容（ready 字段显式标注）。
 */

import {
  requireAuth,
  jsonResponse,
  errorResponse,
  readJsonBody,
} from '../../../../src/lib/server/community/auth';
import { moderateContent } from '../../../../src/lib/server/community/moderation';
import {
  LENGTH_LIMITS,
  type Post,
  type PostStatus,
  type Comment,
} from '../../../../src/lib/server/community/models';
import { createCommunityKVStore, genId } from '../../../../src/lib/server/community/kv-store';
import {
  createCommunityExtStore,
  StoreError,
  EXT_RATE_LIMITS,
} from '../../../../src/lib/server/community/ext-store';
import {
  BOUNTY_STATUSES,
  WALL_TYPES,
  CASE_CATEGORIES,
  BOUNTY_REWARD_MIN,
  BOUNTY_REWARD_MAX,
  EXT_KV_PREFIXES,
  type BountyStatus,
  type WallShareType,
  type CaseCategory,
} from '../../../../src/lib/server/community/entities';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
  GEO_CACHE?: KVNamespace;
}

type Ctx = { request: Request; env: Env; params?: { path?: string | string[] } };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Admin-Token',
  'Access-Control-Max-Age': '600',
} as const;

function segmentsOf(context: Ctx): string[] {
  const p = context.params?.path;
  const raw = Array.isArray(p) ? p : typeof p === 'string' ? p.split('/') : [];
  return raw.filter(Boolean).map(decodeURIComponent);
}

function ok(data: unknown, status = 200): Response {
  return jsonResponse(data, status);
}

function page<T>(items: T[], cursor?: string) {
  return { items, cursor: cursor ?? null };
}

export async function onRequest(context: Ctx): Promise<Response> {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS });
  }

  // fail-closed：未绑 KV / 未设 secret 时明确 503，不静默造假数据
  if (!env.AUTH_KV || !env.AUTH_SECRET) {
    return errorResponse('community_unavailable', 503);
  }

  const seg = segmentsOf(context);
  const url = new URL(request.url);
  const kv = env.AUTH_KV!;
  const base = createCommunityKVStore(kv as never);
  const ext = createCommunityExtStore(kv as never);

  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '20', 10) || 20, 1), 50);
  const cursor = url.searchParams.get('cursor') || undefined;

  try {
    // ── boards ────────────────────────────────────────────────────────────
    if (seg.length === 0 || (seg.length === 1 && seg[0] === 'boards')) {
      if (method !== 'GET') return errorResponse('method_not_allowed', 405);
      const boards = await base.listBoards();
      return ok({ boards });
    }

    // ── threads ───────────────────────────────────────────────────────────
    if (seg[0] === 'threads') {
      // /threads
      if (seg.length === 1) {
        if (method === 'GET') {
          const boardId = url.searchParams.get('board') || undefined;
          const boards = await base.listBoards();
          if (boardId && !boards.some(b => b.id === boardId)) {
            return errorResponse('unknown_board', 400);
          }
          const { items, cursor: next } = await base.listPosts(boardId, limit, cursor);
          const approved = items.filter(p => p.status === 'approved');
          return ok({
            board: boardId ?? null,
            ...page(approved.map(toThreadListItem), next),
          });
        }
        if (method === 'POST') return createThread(request, env, base);
        return errorResponse('method_not_allowed', 405);
      }

      // /threads/:id
      if (seg.length === 2) {
        const id = seg[1];
        if (method === 'GET') {
          const post = await base.getPost(id);
          if (!post || post.status === 'deleted') return errorResponse('thread_not_found', 404);
          return ok(toThreadDetail(post));
        }
        if (method === 'PATCH' || method === 'DELETE') {
          let identity;
          try {
            identity = await requireAuth(request, env.AUTH_SECRET);
          } catch (e) {
            return e as Response;
          }
          const post = await base.getPost(id);
          if (!post || post.status === 'deleted') return errorResponse('thread_not_found', 404);
          if (post.authorId !== identity.sub) return errorResponse('forbidden', 403);

          if (method === 'PATCH') {
            const body = await readJsonBody(request);
            const patch: Partial<Post> = {};
            if (typeof body.title === 'string') {
              const title = body.title.trim();
              if (!title || title.length > LENGTH_LIMITS.TITLE_MAX) {
                return errorResponse('invalid_title', 400);
              }
              patch.title = title;
            }
            if (typeof body.content === 'string') {
              const content = body.content.trim();
              if (!content || content.length > LENGTH_LIMITS.CONTENT_MAX) {
                return errorResponse('invalid_content', 400);
              }
              const m = moderateContent({ content });
              patch.content = m.filteredText || content;
              patch.excerpt = content.slice(0, LENGTH_LIMITS.EXCERPT_MAX);
              patch.status = m.safe ? 'approved' : 'pending';
            }
            await base.updatePost(id, patch);
            return ok(toThreadDetail({ ...post, ...patch }));
          }

          await base.updatePost(id, { status: 'deleted' as PostStatus });
          return ok({ id, deleted: true });
        }
        return errorResponse('method_not_allowed', 405);
      }

      // /threads/:id/replies
      if (seg.length === 3 && seg[2] === 'replies') {
        const id = seg[1];
        const post = await base.getPost(id);
        if (!post || post.status === 'deleted') return errorResponse('thread_not_found', 404);

        if (method === 'GET') {
          const { items, cursor: next } = await base.listComments(id, limit, cursor);
          const approved = items.filter(c => c.status === 'approved');
          return ok(page(approved.map(toReplyItem), next));
        }
        if (method === 'POST') {
          let identity;
          try {
            identity = await requireAuth(request, env.AUTH_SECRET);
          } catch (e) {
            return e as Response;
          }
          const { allowed } = await ext.checkRateLimit(
            `reply:${identity.sub}`,
            EXT_RATE_LIMITS.ANSWER_PER_MINUTE
          );
          if (!allowed) return errorResponse('rate_limit_exceeded', 429);

          const body = await readJsonBody(request);
          const content = typeof body.content === 'string' ? body.content.trim() : '';
          if (!content || content.length > LENGTH_LIMITS.COMMENT_MAX) {
            return errorResponse('invalid_content', 400);
          }
          const m = moderateContent({ content });
          const comment: Comment = {
            id: genId('cmt'),
            postId: id,
            authorId: identity.sub,
            content: m.filteredText || content,
            status: m.safe ? 'approved' : 'pending',
            createdAt: new Date().toISOString(),
          };
          await base.createComment(comment);
          await base.updatePost(id, { replyCount: post.replyCount + 1 });
          return ok(toReplyItem(comment), 201);
        }
        return errorResponse('method_not_allowed', 405);
      }

      return errorResponse('not_found', 404);
    }

    // ── bounty ────────────────────────────────────────────────────────────
    if (seg[0] === 'bounty') {
      // /bounty
      if (seg.length === 1) {
        if (method === 'GET') {
          const statusParam = url.searchParams.get('status');
          const status = BOUNTY_STATUSES.includes(statusParam as BountyStatus)
            ? (statusParam as BountyStatus)
            : undefined;
          if (statusParam && !status) return errorResponse('invalid_status', 400);
          const { items, cursor: next } = await ext.listBounties(status, limit, cursor);
          return ok(page(items, next));
        }
        if (method === 'POST') {
          let identity;
          try {
            identity = await requireAuth(request, env.AUTH_SECRET);
          } catch (e) {
            return e as Response;
          }
          const { allowed } = await ext.checkRateLimit(
            `bounty:${identity.sub}`,
            EXT_RATE_LIMITS.BOUNTY_PER_MINUTE
          );
          if (!allowed) return errorResponse('rate_limit_exceeded', 429);

          const body = await readJsonBody(request);
          const title = typeof body.title === 'string' ? body.title.trim() : '';
          const description = typeof body.description === 'string' ? body.description.trim() : '';
          const reward = Number(body.rewardPoints);

          if (!title || title.length > LENGTH_LIMITS.TITLE_MAX) {
            return errorResponse('invalid_title', 400);
          }
          if (!description || description.length > LENGTH_LIMITS.CONTENT_MAX) {
            return errorResponse('invalid_description', 400);
          }
          if (!Number.isFinite(reward) || reward < BOUNTY_REWARD_MIN || reward > BOUNTY_REWARD_MAX) {
            return errorResponse('invalid_reward_points', 400);
          }
          const m = moderateContent({ title, description });
          if (!m.safe) return errorResponse('content_pending_review', 202);

          const bounty = await ext.createBounty({
            title,
            description: m.filteredText || description,
            rewardPoints: reward,
            authorId: identity.sub,
          });
          return ok(bounty, 201);
        }
        return errorResponse('method_not_allowed', 405);
      }

      // /bounty/:id
      if (seg.length === 2) {
        if (method !== 'GET') return errorResponse('method_not_allowed', 405);
        const bounty = await ext.getBounty(seg[1]);
        if (!bounty) return errorResponse('bounty_not_found', 404);
        const { items: answers } = await ext.listAnswers(bounty.id, 50);
        return ok({ ...bounty, answers });
      }

      // /bounty/:id/{answers|accept|cancel}
      if (seg.length === 3) {
        const [id, action] = [seg[1], seg[2]];
        const bounty = await ext.getBounty(id);
        if (!bounty) return errorResponse('bounty_not_found', 404);

        if (action === 'answers') {
          if (method === 'GET') {
            const { items, cursor: next } = await ext.listAnswers(id, limit, cursor);
            return ok(page(items, next));
          }
          if (method === 'POST') {
            let identity;
            try {
              identity = await requireAuth(request, env.AUTH_SECRET);
            } catch (e) {
              return e as Response;
            }
            // 异常分支 1：已关闭/已解决的悬赏不可再回答
            if (bounty.status !== 'open') return errorResponse('bounty_not_open', 409);
            // 异常分支 2：作者不可回答自己的悬赏
            if (bounty.authorId === identity.sub) return errorResponse('cannot_answer_own_bounty', 409);

            const { allowed } = await ext.checkRateLimit(
              `answer:${identity.sub}`,
              EXT_RATE_LIMITS.ANSWER_PER_MINUTE
            );
            if (!allowed) return errorResponse('rate_limit_exceeded', 429);

            const body = await readJsonBody(request);
            const content = typeof body.content === 'string' ? body.content.trim() : '';
            if (!content || content.length > LENGTH_LIMITS.COMMENT_MAX) {
              return errorResponse('invalid_content', 400);
            }
            const m = moderateContent({ content });
            if (!m.safe) return errorResponse('content_pending_review', 202);
            const answer = await ext.createAnswer({
              bountyId: id,
              authorId: identity.sub,
              content: m.filteredText || content,
            });
            return ok(answer, 201);
          }
          return errorResponse('method_not_allowed', 405);
        }

        if (action === 'accept') {
          if (method !== 'POST') return errorResponse('method_not_allowed', 405);
          let identity;
          try {
            identity = await requireAuth(request, env.AUTH_SECRET);
          } catch (e) {
            return e as Response;
          }
          // 异常分支 3：非作者采纳
          if (bounty.authorId !== identity.sub) return errorResponse('forbidden', 403);
          // 异常分支 4：非 open 态采纳
          if (bounty.status !== 'open') return errorResponse('bounty_not_open', 409);
          // 异常分支 5：已结算悬赏重复采纳
          if (bounty.settled) return errorResponse('bounty_already_settled', 409);

          const body = await readJsonBody(request);
          const answerId = typeof body.answerId === 'string' ? body.answerId.trim() : '';
          if (!answerId) return errorResponse('invalid_answer_id', 400);
          const answer = await ext.getAnswer(answerId);
          // 异常分支 6：回答不存在 / 不属于该悬赏
          if (!answer || answer.bountyId !== id) return errorResponse('answer_not_found', 404);
          // 异常分支 7：采纳自己对自己的回答（作者即回答者）
          if (answer.authorId === bounty.authorId) {
            return errorResponse('cannot_accept_own_answer', 409);
          }

          await ext.updateAnswer(answerId, { status: 'accepted' });
          await ext.settleEscrow({
            bountyId: id,
            action: 'release',
            points: bounty.rewardPoints,
            userId: answer.authorId,
            note: '采纳释放',
          });
          const balance = (await ext.getBalance(answer.authorId)) + bounty.rewardPoints;
          await kv.put(`${EXT_KV_PREFIXES.POINTS}${answer.authorId}`, String(balance));
          const updated = await ext.updateBounty(id, {
            status: 'solved',
            acceptedAnswerId: answerId,
            settled: true,
          });
          return ok(updated);
        }

        if (action === 'cancel') {
          if (method !== 'POST') return errorResponse('method_not_allowed', 405);
          let identity;
          try {
            identity = await requireAuth(request, env.AUTH_SECRET);
          } catch (e) {
            return e as Response;
          }
          if (bounty.authorId !== identity.sub) return errorResponse('forbidden', 403);
          if (bounty.status !== 'open') return errorResponse('bounty_not_open', 409);
          if (bounty.settled) return errorResponse('bounty_already_settled', 409);

          await ext.settleEscrow({
            bountyId: id,
            action: 'refund',
            points: bounty.rewardPoints,
            userId: bounty.authorId,
            note: '作者撤单退回',
          });
          const balance = (await ext.getBalance(bounty.authorId)) + bounty.rewardPoints;
          await kv.put(`${EXT_KV_PREFIXES.POINTS}${bounty.authorId}`, String(balance));
          const updated = await ext.updateBounty(id, { status: 'closed', settled: true });
          return ok(updated);
        }

        return errorResponse('not_found', 404);
      }

      return errorResponse('not_found', 404);
    }

    // ── wall（分享墙） ────────────────────────────────────────────────────
    if (seg[0] === 'wall') {
      if (seg.length === 1) {
        if (method === 'GET') {
          const typeParam = url.searchParams.get('type');
          const type = WALL_TYPES.includes(typeParam as WallShareType)
            ? (typeParam as WallShareType)
            : undefined;
          if (typeParam && !type) return errorResponse('invalid_type', 400);
          const { items, cursor: next } = await ext.listWallShares(type, limit, cursor);
          return ok(page(items.map(toWallItem), next));
        }
        if (method === 'POST') {
          let identity;
          try {
            identity = await requireAuth(request, env.AUTH_SECRET);
          } catch (e) {
            return e as Response;
          }
          const { allowed } = await ext.checkRateLimit(
            `wall:${identity.sub}`,
            EXT_RATE_LIMITS.WALL_PER_MINUTE
          );
          if (!allowed) return errorResponse('rate_limit_exceeded', 429);

          const body = await readJsonBody(request);
          const type = String(body.type ?? '') as WallShareType;
          const refId = typeof body.refId === 'string' ? body.refId.trim() : '';
          const title = typeof body.title === 'string' ? body.title.trim() : '';
          const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
          if (!WALL_TYPES.includes(type)) return errorResponse('invalid_type', 400);
          if (!refId || !title) return errorResponse('invalid_share_payload', 400);
          if (title.length > LENGTH_LIMITS.TITLE_MAX) return errorResponse('invalid_title', 400);
          if (summary.length > 500) return errorResponse('invalid_summary', 400);

          const m = moderateContent({ title, summary });
          if (!m.safe) return errorResponse('content_pending_review', 202);

          const share = await ext.createWallShare({
            userId: identity.sub,
            type,
            refId,
            title: m.filteredText || title,
            summary: summary ? (m.filteredText || summary) : '',
          });
          return ok(toWallItem(share), 201);
        }
        return errorResponse('method_not_allowed', 405);
      }

      if (seg.length === 3 && seg[2] === 'like' && method === 'POST') {
        let identity;
        try {
          identity = await requireAuth(request, env.AUTH_SECRET);
        } catch (e) {
          return e as Response;
        }
        const result = await ext.toggleLike(seg[1], identity.sub);
        return ok({ id: seg[1], ...result });
      }

      return errorResponse('not_found', 404);
    }

    // ── cases（真实案例） ─────────────────────────────────────────────────
    if (seg[0] === 'cases') {
      if (seg.length === 1) {
        if (method === 'GET') {
          const catParam = url.searchParams.get('category');
          const category = CASE_CATEGORIES.includes(catParam as CaseCategory)
            ? (catParam as CaseCategory)
            : undefined;
          if (catParam && !category) return errorResponse('invalid_category', 400);
          const { items, cursor: next } = await ext.listCases(category, limit, cursor);
          return ok(page(items.map(toCaseItem), next));
        }
        if (method === 'POST') {
          let identity;
          try {
            identity = await requireAuth(request, env.AUTH_SECRET);
          } catch (e) {
            return e as Response;
          }
          const { allowed } = await ext.checkRateLimit(
            `case:${identity.sub}`,
            EXT_RATE_LIMITS.CASE_PER_MINUTE
          );
          if (!allowed) return errorResponse('rate_limit_exceeded', 429);

          const body = await readJsonBody(request);
          const category = String(body.category ?? '') as CaseCategory;
          const title = typeof body.title === 'string' ? body.title.trim() : '';
          const summary = typeof body.summary === 'string' ? body.summary.trim() : '';
          const content = typeof body.content === 'string' ? body.content.trim() : '';
          if (!CASE_CATEGORIES.includes(category)) return errorResponse('invalid_category', 400);
          if (!title || title.length > LENGTH_LIMITS.TITLE_MAX) {
            return errorResponse('invalid_title', 400);
          }
          if (!content || content.length > LENGTH_LIMITS.CONTENT_MAX) {
            return errorResponse('invalid_content', 400);
          }
          const m = moderateContent({ title, content });
          const row = await ext.createCase({
            authorId: identity.sub,
            category,
            title,
            summary: summary.slice(0, 200),
            content: m.filteredText || content,
          });
          return ok(toCaseItem(row), 201);
        }
        return errorResponse('method_not_allowed', 405);
      }

      if (seg.length === 2) {
        if (method !== 'GET') return errorResponse('method_not_allowed', 405);
        const row = await ext.getCase(seg[1]);
        if (!row || row.status === 'deleted') return errorResponse('case_not_found', 404);
        const { items: feedback } = await ext.listCaseFeedback(row.id, 50);
        return ok({ ...toCaseItem(row), feedback });
      }

      if (seg.length === 3 && seg[2] === 'feedback') {
        const row = await ext.getCase(seg[1]);
        if (!row) return errorResponse('case_not_found', 404);
        if (method === 'GET') {
          const { items, cursor: next } = await ext.listCaseFeedback(seg[1], limit, cursor);
          return ok(page(items, next));
        }
        if (method === 'POST') {
          let identity;
          try {
            identity = await requireAuth(request, env.AUTH_SECRET);
          } catch (e) {
            return e as Response;
          }
          const body = await readJsonBody(request);
          const rating = Number(body.rating);
          const comment = typeof body.comment === 'string' ? body.comment.trim() : '';
          if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
            return errorResponse('invalid_rating', 400);
          }
          if (comment.length > LENGTH_LIMITS.COMMENT_MAX) {
            return errorResponse('invalid_comment', 400);
          }
          const fb = await ext.createCaseFeedback({
            caseId: seg[1],
            authorId: identity.sub,
            rating,
            comment,
          });
          if (!fb) return errorResponse('case_not_found', 404);
          return ok(fb, 201);
        }
        return errorResponse('method_not_allowed', 405);
      }

      return errorResponse('not_found', 404);
    }

    return errorResponse('not_found', 404);
  } catch (e) {
    if (e instanceof StoreError) return errorResponse(e.message, e.status);
    const message = e instanceof Error ? e.message : 'internal_error';
    return errorResponse(message === 'unauthorized' ? 'unauthorized' : 'internal_error', message === 'unauthorized' ? 401 : 500);
  }
}

// ── 序列化器（对外只暴露契约字段，不泄漏内部索引键） ──────────────────────

function toThreadListItem(p: Post) {
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

function toThreadDetail(p: Post) {
  return {
    ...toThreadListItem(p),
    content: p.content,
    updatedAt: p.updatedAt ?? null,
  };
}

function toReplyItem(c: Comment) {
  return {
    id: c.id,
    threadId: c.postId,
    authorId: c.authorId,
    content: c.content,
    status: c.status,
    createdAt: c.createdAt,
  };
}

function toWallItem(s: {
  id: string;
  userId: string;
  type: string;
  refId: string;
  title: string;
  summary: string;
  shareToken: string;
  likeCount: number;
  status: string;
  createdAt: string;
  ready: boolean;
}) {
  return {
    id: s.id,
    userId: s.userId,
    type: s.type,
    refId: s.refId,
    title: s.title,
    summary: s.summary,
    shareToken: s.shareToken,
    likeCount: s.likeCount,
    status: s.status,
    createdAt: s.createdAt,
    ready: s.ready,
  };
}

/**
 * 发帖：与 /api/v1/forum 的 POST 行为一致（同源同字段），保证两条路径数据互通。
 */
async function createThread(
  request: Request,
  env: Env,
  base: ReturnType<typeof createCommunityKVStore>
): Promise<Response> {
  let identity;
  try {
    identity = await requireAuth(request, env.AUTH_SECRET);
  } catch (e) {
    return e as Response;
  }

  const boards = await base.listBoards();
  const body = await readJsonBody(request);
  const boardId = typeof body.boardId === 'string' ? body.boardId.trim() : '';
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';

  if (!boardId || !boards.some(b => b.id === boardId)) return errorResponse('invalid_board', 400);
  if (!title || title.length > LENGTH_LIMITS.TITLE_MAX) return errorResponse('invalid_title', 400);
  if (!content || content.length > LENGTH_LIMITS.CONTENT_MAX) {
    return errorResponse('invalid_content', 400);
  }

  const moderation = moderateContent({ title, content });
  const status: PostStatus = moderation.safe ? 'approved' : 'pending';
  const post: Post = {
    id: genId('post'),
    boardId,
    title,
    authorId: identity.sub,
    excerpt: content.slice(0, LENGTH_LIMITS.EXCERPT_MAX),
    content: moderation.filteredText || content,
    status,
    replyCount: 0,
    createdAt: new Date().toISOString(),
  };
  await base.createPost(post);
  return ok(toThreadListItem(post), 201);
}

function toCaseItem(c: {
  id: string;
  authorId: string;
  category: string;
  title: string;
  summary: string;
  content: string;
  status: string;
  feedbackCount: number;
  ratingSum: number;
  createdAt: string;
  ready: boolean;
}) {
  return {
    id: c.id,
    authorId: c.authorId,
    category: c.category,
    title: c.title,
    summary: c.summary,
    content: c.content,
    status: c.status,
    feedbackCount: c.feedbackCount,
    ratingAvg: c.feedbackCount > 0 ? Number((c.ratingSum / c.feedbackCount).toFixed(2)) : null,
    createdAt: c.createdAt,
    ready: c.ready,
  };
}
