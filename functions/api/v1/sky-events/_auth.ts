/**
 * 星空纪念事件 · 鉴权助手
 * 复用 src/lib/server/auth 的 readIdentity（AUTH_SECRET 签名的 JWT，sub = 邮箱 = userId）。
 */
import { readIdentityWithSession, type Identity, type SessionKV } from '../../../../src/lib/server/auth';

export interface AuthedUser {
  userId: string;
  identity: Identity;
}

/** 从请求提取并校验身份。失败（无 token / 签名无效 / secret 缺失 / 会话被吊销）返回 null。
 *  传 kv 时启用 session:<sid> 双查（登出/吊销生效）；不传则仅令牌校验（向后兼容）。 */
export async function authUser(
  request: Request,
  secret?: string,
  kv?: SessionKV,
): Promise<AuthedUser | null> {
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
