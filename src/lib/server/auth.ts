/**
 * JWT 解析与身份读取
 * 格式：header.payload.signature（base64url），HMAC-SHA256
 */

export interface Identity {
  sub: string;
  /** 会话 id（登录端签发），用于 session:<sid> KV 双查 */
  sid?: string;
  email?: string;
  /** 签发时间（登录端当前不发；存在则校验未来签发/畸形） */
  iat?: number;
  /** 生效时间（登录端当前不发；存在则校验未来生效） */
  nbf?: number;
  /** 过期时间（登录端必发，单位：毫秒，见 toEpochMs 自动识别秒/毫秒） */
  exp?: number;
  [key: string]: unknown;
}

/** session KV 的最小结构（Cloudflare KVNamespace 结构兼容） */
export interface SessionKV {
  get(key: string): Promise<string | null>;
}

/** 时钟偏斜容忍：60s */
export const CLOCK_SKEW_MS = 60_000;

/**
 * 把 JWT 时间戳统一换算为毫秒。
 * 登录端 signJwt 实测产出为毫秒（`Date.now() + TTL*1000`，见 functions/api/auth/[[path]].ts）。
 * 为兼容历史/标准秒级令牌，阈值 1e11：小于该值视为 epoch 秒（×1000），否则视为毫秒。
 * （秒级 1e11 ≈ 公元 5138 年；毫秒级最小有意义值 ≈ 1e12，区间干净无歧义。）
 */
export function toEpochMs(value: number): number {
  return value < 1e11 ? value * 1000 : value;
}

/**
 * JWT 时间声明校验（纯函数，便于单测）。错误名按派工约定：
 *  - exp 缺失            → invalid_token: missing_exp
 *  - now >= exp          → expired_token
 *  - iat 未来(>now+60s) 或 iat>exp（畸形）→ invalid_iat（iat 缺失放行，向后兼容）
 *  - nbf 远在未来(>now+60s) → not_yet_valid
 */
export function assertTokenTimeClaims(payload: Record<string, unknown>, nowMs: number): void {
  const exp = payload.exp;
  if (typeof exp !== 'number' || !Number.isFinite(exp)) {
    throw new Error('invalid_token: missing_exp');
  }
  const expMs = toEpochMs(exp);
  if (nowMs >= expMs) {
    throw new Error('expired_token');
  }

  const iat = payload.iat;
  if (typeof iat === 'number' && Number.isFinite(iat)) {
    const iatMs = toEpochMs(iat);
    if (iatMs > nowMs + CLOCK_SKEW_MS) {
      throw new Error('invalid_iat');
    }
    if (iatMs > expMs) {
      throw new Error('invalid_iat');
    }
  }

  const nbf = payload.nbf;
  if (typeof nbf === 'number' && Number.isFinite(nbf)) {
    const nbfMs = toEpochMs(nbf);
    if (nowMs + CLOCK_SKEW_MS < nbfMs) {
      throw new Error('not_yet_valid');
    }
  }
}

function base64UrlDecode(input: string): string {
  // base64url → base64
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  // 补齐 padding
  while (base64.length % 4 !== 0) base64 += '=';
  return atob(base64);
}

async function verifySignature(token: string, secret: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [headerB64, payloadB64, signatureB64] = parts;
  const data = `${headerB64}.${payloadB64}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const expectedSig = [...new Uint8Array(sigBuf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // 常量时间比较
  const actualSig = base64UrlDecode(signatureB64);
  const actualHex = [...new Uint8Array(actualSig.split('').map((c) => c.charCodeAt(0)))]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  if (expectedSig.length !== actualHex.length) return false;
  let result = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    result |= expectedSig.charCodeAt(i) ^ actualHex.charCodeAt(i);
  }
  return result === 0;
}

export async function readIdentity(token: string, secret: string): Promise<Identity> {
  if (!token || !secret) {
    throw new Error('missing_token_or_secret');
  }

  const valid = await verifySignature(token, secret);
  if (!valid) {
    throw new Error('invalid_signature');
  }

  const parts = token.split('.');
  const payloadB64 = parts[1];
  const payloadJson = base64UrlDecode(payloadB64);

  try {
    const payload = JSON.parse(payloadJson) as Identity;
    if (!payload.sub) {
      throw new Error('missing_sub');
    }
    // 时间声明校验（exp 必检；iat/nbf 存在才检）。抛出的错误不被下面的 catch 吞掉。
    assertTokenTimeClaims(payload as unknown as Record<string, unknown>, Date.now());
    return payload;
  } catch (err) {
    // assertTokenTimeClaims 抛出的鉴权错误原样上抛，不包成 invalid_payload
    if (
      err instanceof Error &&
      (err.message === 'expired_token' ||
        err.message === 'invalid_iat' ||
        err.message === 'not_yet_valid' ||
        err.message.startsWith('invalid_token:'))
    ) {
      throw err;
    }
    const msg = err instanceof Error ? err.message : 'unknown';
    throw new Error(`invalid_payload: ${msg}`, { cause: err });
  }
}

/**
 * 身份读取 + 会话 KV 双查（登出/吊销生效）。
 * 先 readIdentity（签名 + sub + exp/iat/nbf），再用 payload.sid 查 `session:<sid>`：
 * 键不存在 或 键值 !== payload.sub → 拒绝 session_revoked。
 * - kv 未传（端点未接 AUTH_KV）→ 跳过会话双查，仅令牌校验（向后兼容）。
 * - payload 无 sid（历史/非会话令牌）→ 无可吊销会话，放行（登录端必发 sid，不影响主流程）。
 */
export async function readIdentityWithSession(
  token: string,
  secret: string,
  kv?: SessionKV,
): Promise<Identity> {
  const identity = await readIdentity(token, secret);
  if (!kv) return identity;
  const sid = identity.sid;
  if (typeof sid !== 'string' || !sid) return identity;
  const current = await kv.get(`session:${sid}`);
  if (current === null || current !== identity.sub) {
    throw new Error('session_revoked');
  }
  return identity;
}
