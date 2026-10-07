/**
 * 权益自含端点（A9 P0①）——路由挂接留波 2 M1
 *
 * 本文件为自含 handler（与既有 subscription.ts / checkout.ts 同构），
 * 不修改共享分发层 functions/api/v1/[[path]].ts、不动 App.tsx / wrangler.toml。
 * 波 2 收口时确认 Pages 文件路由挂载与鉴权头契约即可。
 *
 * 端点：
 *  GET  /api/v1/entitlement        → 六键权益状态（evaluateAccess 汇总，不扣减）
 *  POST /api/v1/entitlement/consume → 配额扣减闸门（放行 LLM 前调用；未授权/无配额 → 403）
 */
import { readIdentity } from '../../../src/lib/server/auth';
import {
  summarizeEntitlements,
  consumeEntitlement,
  type EntitlementKey,
} from '../../../src/lib/entitlement';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
}

async function bearerUserId(request: Request, secret: string): Promise<string | null> {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  try {
    const identity = await readIdentity(authHeader.slice(7), secret);
    return identity.sub || null;
  } catch {
    return null;
  }
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const userId = await bearerUserId(request, env.AUTH_SECRET || '');
  if (!userId) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!env.AUTH_KV) return Response.json({ error: 'kv_unavailable' }, { status: 503 });

  const summary = await summarizeEntitlements(env.AUTH_KV, userId);
  return Response.json({ userId, entitlements: summary }, { status: 200 });
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const userId = await bearerUserId(request, env.AUTH_SECRET || '');
  if (!userId) return Response.json({ error: 'unauthorized' }, { status: 401 });
  if (!env.AUTH_KV) return Response.json({ error: 'kv_unavailable' }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { key?: string } | null;
  const key = body?.key as EntitlementKey | undefined;
  if (!key) return Response.json({ error: 'missing_key' }, { status: 400 });

  const result = await consumeEntitlement(env.AUTH_KV, userId, key);
  if (!result.allowed) {
    // 免费层应回退规则骨架（buildFreeSkeleton），不得在此放行 LLM
    return Response.json({ allowed: false, key, reason: result.reason }, { status: 403 });
  }
  return Response.json(
    { allowed: true, key, remainingCount: result.remainingCount, source: result.source },
    { status: 200 },
  );
};
