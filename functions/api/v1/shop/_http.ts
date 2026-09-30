/** 轻量商店 · HTTP 公共助手（JSON 响应 / CORS / 结构化错误 / 受限请求体读取）。 */

import { ShopError } from '../../../../src/lib/commerce/shop/index.ts';
import {
  DEFAULT_MAX_REQUEST_BODY_BYTES,
  readLimitedRequestText,
  RequestBodyTooLargeError,
} from '../../../../src/lib/http/request-body.ts';

export function json(data: unknown, status = 200, request?: Request): Response {
  const origin = request?.headers.get('Origin') ?? '';
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
      Vary: 'Origin',
    },
  });
}

export function options(request: Request): Response {
  const origin = request.headers.get('Origin') ?? '';
  return new Response(null, {
    status: 204,
    headers: {
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Admin-Token,X-Idempotency-Key',
      'Access-Control-Max-Age': '600',
      Vary: 'Origin',
    },
  });
}

export function fail(error: string, status = 400, request?: Request): Response {
  return json({ error }, status, request);
}

/** 统一错误出口：ShopError 带业务状态码，其余按 500 处理且不外泄堆栈。 */
export function handleError(err: unknown, request?: Request): Response {
  if (err instanceof ShopError) return fail(err.message, err.status, request);
  if (err instanceof RequestBodyTooLargeError) return fail('payload_too_large', 413, request);
  return fail('internal_error', 500, request);
}

/** 读取并解析 JSON 请求体（带体积上限）；非法 JSON 返回 null。 */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const text = await readLimitedRequestText(request, DEFAULT_MAX_REQUEST_BODY_BYTES);
    if (!text) return {};
    const parsed = JSON.parse(text) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : null;
  } catch (err) {
    if (err instanceof RequestBodyTooLargeError) throw err;
    return null;
  }
}
