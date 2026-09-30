/**
 * 星空纪念事件 · 鉴权助手
 * 复用 src/lib/server/auth 的 readIdentity（AUTH_SECRET 签名的 JWT，sub = 邮箱 = userId）。
 */
import { readIdentity, type Identity } from '../../../../src/lib/server/auth';

export interface AuthedUser {
  userId: string;
  identity: Identity;
}

/** 从请求提取并校验身份。失败（无 token / 签名无效 / secret 缺失）返回 null。 */
export async function authUser(
  request: Request,
  secret?: string,
): Promise<AuthedUser | null> {
  if (!secret) return null;
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  try {
    const identity = await readIdentity(token, secret);
    if (!identity?.sub) return null;
    return { userId: identity.sub, identity };
  } catch {
    return null;
  }
}
