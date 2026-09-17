/**
 * JWT 解析与身份读取
 * 格式：header.payload.signature（base64url），HMAC-SHA256
 */

export interface Identity {
  sub: string;
  email?: string;
  [key: string]: unknown;
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
    return payload;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    throw new Error(`invalid_payload: ${msg}`, { cause: err });
  }
}
