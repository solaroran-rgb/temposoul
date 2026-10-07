/**
 * 隐私合规 · 一键删除端点（T20）
 * 路由：/api/v1/me/delete
 *
 *   GET  /api/v1/me/delete?stage=challenge
 *       → 需登录；签发 15 分钟有效的二次确认 token（供「确认 token」路径使用）
 *   POST /api/v1/me/delete
 *       → 需登录 + 二次确认（重输密码 或 confirmToken）→ 级联删除 → 删除回执
 *
 * 幂等：重复请求返回 { success:true, alreadyDeleted:true, receipt }（回执 90 天 TTL）。
 * 未鉴权：一律 401。二次确认失败：403。限流：每用户 5 次/分钟（复用 GEO_CACHE）。
 */

import { readIdentityWithSession, type SessionKV } from '../../../../src/lib/server/auth';
import {
  CONFIRM_TOKEN_TTL_SEC,
  issueDeleteConfirmToken,
  purgeUserData,
  readDeletionReceipt,
  verifyAccountPassword,
  verifyDeleteConfirmToken,
} from '../../../../src/lib/server/privacy/delete-account';

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_TTL = 120;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Max-Age': '600',
    },
  });
}

async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** 登录态校验：无效一律 null（调用方 401）。 */
async function authedUser(
  request: Request,
  secret: string,
  kv?: SessionKV,
): Promise<{ userId: string; email?: string } | null> {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  try {
    const identity = await readIdentityWithSession(token, secret, kv);
    if (!identity?.sub) return null;
    return { userId: identity.sub, email: identity.email };
  } catch {
    return null;
  }
}

/** 每用户限流：5 次/分钟（GET challenge 与 POST 删除共用计数）。 */
async function rateLimited(env: Env, userId: string): Promise<boolean> {
  if (!env.GEO_CACHE) return false;
  const minute = Math.floor(Date.now() / 60_000);
  const key = `rl:delete:${userId}:${minute}`;
  const current = Number.parseInt((await env.GEO_CACHE.get(key)) ?? '0', 10);
  if (current >= RATE_LIMIT_MAX) return true;
  await env.GEO_CACHE.put(key, String(current + 1), { expirationTtl: RATE_LIMIT_TTL });
  return false;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') return json({}, 204);

  if (!env.AUTH_KV || !env.AUTH_SECRET) {
    return json({ error: 'service_unavailable' }, 503);
  }

  const user = await authedUser(request, env.AUTH_SECRET, env.AUTH_KV);
  if (!user) return json({ error: 'unauthorized' }, 401);

  if (await rateLimited(env, user.userId)) {
    return json({ error: 'rate_limit_exceeded' }, 429);
  }

  // 幂等：已存在删除回执 → 直接返回已删除（账号记录已物理删除，二次确认无从验证）
  const existingReceipt = await readDeletionReceipt(env.AUTH_KV, user.userId);
  if (existingReceipt) {
    return json({
      success: true,
      alreadyDeleted: true,
      receiptId: existingReceipt.receiptId,
      deletedAt: existingReceipt.deletedAt,
      stats: existingReceipt.stats,
      message: '该账号此前已完成删除（幂等回执）',
    });
  }

  // ── GET：签发二次确认 token ──
  if (method === 'GET') {
    const stage = new URL(request.url).searchParams.get('stage');
    if (stage !== 'challenge') {
      return json({ error: 'method_not_allowed' }, 405);
    }
    const confirmToken = await issueDeleteConfirmToken(env.AUTH_SECRET, user.userId);
    return json({
      ok: true,
      confirmToken,
      expiresInSec: CONFIRM_TOKEN_TTL_SEC,
      message: '请在下一次请求中携带该 token（15 分钟内有效）',
    });
  }

  // ── POST：二次确认 + 级联删除 ──
  if (method === 'POST') {
    const body = await readJson(request);
    const password = typeof body.password === 'string' ? body.password : '';
    const confirmToken = typeof body.confirmToken === 'string' ? body.confirmToken : '';

    let confirmed = false;
    if (password) {
      // 路径 A：重输密码
      confirmed = await verifyAccountPassword(
        { AUTH_KV: env.AUTH_KV },
        user.userId,
        password,
      );
    } else if (confirmToken) {
      // 路径 B：短时确认 token（GET challenge 签发）
      const v = await verifyDeleteConfirmToken(env.AUTH_SECRET, confirmToken);
      confirmed = v.ok && v.userId === user.userId;
    } else {
      return json({ error: 'missing_confirmation' }, 400);
    }

    if (!confirmed) {
      return json({ error: 'invalid_confirmation' }, 403);
    }

    const result = await purgeUserData(env, user.userId);

    if (!result.ok) {
      // 部分清理失败：不写回执，返回 500 + 明细，客户端可安全重试（KV 删除幂等）
      return json({ error: 'purge_incomplete', stats: result.stats, errors: result.errors }, 500);
    }

    return json({
      success: true,
      alreadyDeleted: result.alreadyDeleted === true,
      receiptId: result.receipt?.receiptId,
      deletedAt: result.receipt?.deletedAt,
      stats: result.stats,
      message: result.alreadyDeleted
        ? '该账号此前已完成删除（幂等回执）'
        : '账号数据已级联删除；支付记录按保留策略脱敏留存',
    });
  }

  return json({ error: 'method_not_allowed' }, 405);
};
