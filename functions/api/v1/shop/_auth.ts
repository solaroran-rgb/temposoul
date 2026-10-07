/**
 * 轻量商店 · 鉴权助手
 * - 用户身份：复用 src/lib/server/auth 的 readIdentity（JWT，sub = 邮箱 = userId）
 * - 管理员：复用社区模块的 requireAdmin（X-Admin-Token = HMAC(AUTH_SECRET,'community-admin')）
 */

import { readIdentityWithSession, type Identity, type SessionKV } from '../../../../src/lib/server/auth.ts';
import { requireAdmin } from '../../../../src/lib/server/community/auth.ts';

export interface AuthedUser {
  userId: string;
  identity: Identity;
}

/** 提取并校验用户身份；失败返回 null（调用方回 401）。
 *  传 kv 时启用 session:<sid> 双查（登出/吊销生效）；不传则仅令牌校验。 */
export async function authUser(request: Request, secret?: string, kv?: SessionKV): Promise<AuthedUser | null> {
  if (!secret) return null;
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  try {
    const identity = await readIdentityWithSession(token, secret, kv);
    if (!identity?.sub) return null;
    return { userId: identity.sub, identity };
  } catch {
    return null;
  }
}

/** 管理员校验；未通过返回可直接下发的 401 Response，通过返回 null。 */
export async function adminGuard(request: Request, secret?: string): Promise<Response | null> {
  try {
    await requireAdmin(request, secret);
    return null;
  } catch (err) {
    return err as Response;
  }
}

/** 幂等键：优先 X-Idempotency-Key 头，其次请求体 idempotencyKey。 */
export function readIdempotencyKey(request: Request, body?: Record<string, unknown> | null): string | undefined {
  const fromHeader = request.headers.get('X-Idempotency-Key');
  const raw = (fromHeader ?? (typeof body?.idempotencyKey === 'string' ? body.idempotencyKey : '')) || '';
  const key = raw.trim();
  return key ? key.slice(0, 128) : undefined;
}
