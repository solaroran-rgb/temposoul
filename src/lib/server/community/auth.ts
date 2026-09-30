/**
 * 社区模块鉴权辅助
 * - 复用现有 JWT 解析 (readIdentity)
 * - 提供统一的身份提取、可选/必选鉴权、管理员校验
 */

import { readIdentity, type Identity } from '../auth';

export interface AuthResult {
  identity: Identity | null;
  error?: Response;
}

/** 从请求中提取 Bearer Token 并解析身份 */
export async function getIdentityFromRequest(
  request: Request,
  secret: string | undefined
): Promise<AuthResult> {
  const auth = request.headers.get('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  
  if (!token || !secret) {
    return { identity: null };
  }
  
  try {
    const identity = await readIdentity(token, secret);
    return { identity };
  } catch {
    return { 
      identity: null,
      error: jsonError('unauthorized', 401)
    };
  }
}

/** 必须登录：返回 identity 或直接抛出可返回的 Response */
export async function requireAuth(
  request: Request,
  secret: string | undefined
): Promise<Identity> {
  const { identity, error } = await getIdentityFromRequest(request, secret);
  if (error || !identity) {
    throw error ?? jsonError('unauthorized', 401);
  }
  return identity;
}

/** 可选登录：不抛错，identity 可能为 null */
export async function optionalAuth(
  request: Request,
  secret: string | undefined
): Promise<Identity | null> {
  const { identity } = await getIdentityFromRequest(request, secret);
  return identity;
}

/** 管理员校验：通过 X-Admin-Token header，基于 AUTH_SECRET 派生 */
export async function requireAdmin(
  request: Request,
  secret: string | undefined
): Promise<void> {
  const adminToken = request.headers.get('X-Admin-Token') ?? '';
  if (!adminToken || !secret) {
    throw jsonError('admin_unauthorized', 401);
  }
  
  const expectedToken = await generateAdminToken(secret);
  if (adminToken !== expectedToken) {
    throw jsonError('admin_unauthorized', 401);
  }
}

async function generateAdminToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode('community-admin'));
  return [...new Uint8Array(sigBuf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/** 统一 JSON 响应 */
export function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Admin-Token',
      'Cache-Control': 'no-store',
    },
  });
}

/** 统一错误响应 */
export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}

/** 读取并校验 JSON body */
export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}