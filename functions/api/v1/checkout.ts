import { createCheckoutSession, resolveProductId } from '../../../src/lib/server/payment';
import { readIdentity } from '../../../src/lib/server/auth';

interface Env {
  AUTH_SECRET?: string;
  AUTH_KV?: KVNamespace;
  PAYMENT_PROVIDER?: string;
  LEMONSQUEEZY_API_KEY?: string;
  LEMONSQUEEZY_STORE_ID?: string;
  LEMONSQUEEZY_VARIANT_ID?: string;
  LEMONSQUEEZY_VARIANTS?: string;
  LEMONSQUEEZY_WEBHOOK_SECRET?: string;
  LEMONSQUEEZY_API_URL?: string;
  PUBLIC_SITE_URL?: string;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  // OPTIONS → 204（CORS 预检）
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  // 非 POST → 405
  if (request.method !== 'POST') {
    return Response.json({ error: 'method_not_allowed' }, { status: 405 });
  }

  try {
    // 解析 JWT（可选）
    const authHeader = request.headers.get('Authorization') || '';
    let userId = 'anonymous';
    let email: string | undefined;

    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      try {
        const identity = await readIdentity(token, env.AUTH_SECRET || '');
        userId = identity.sub || 'anonymous';
        email = typeof identity.email === 'string' ? identity.email : undefined;
      } catch {
        // JWT 无效则视为匿名
      }
    }

    // 解析请求体
    let productId: string | undefined;
    let abBucket: Record<string, number> | undefined;
    const contentType = request.headers.get('Content-Type') || '';

    if (contentType.includes('application/json')) {
      const body = (await request.json().catch(() => null)) as {
        productId?: string;
        abBucket?: Record<string, number>;
      } | null;
      productId = body?.productId;
      abBucket = body?.abBucket;
    } else {
      const url = new URL(request.url);
      productId = url.searchParams.get('productId') || undefined;
    }

    const resolvedProductId = resolveProductId(productId);
    const baseUrl = env.PUBLIC_SITE_URL || new URL(request.url).origin;

    const result = await createCheckoutSession(env, {
      userId,
      email,
      baseUrl,
      productId: resolvedProductId,
      abBucket,
    });

    if (result.ok) {
      return Response.json({ url: result.url }, { status: 200 });
    }

    // 防羊毛拒绝 → 403
    if (
      [
        'login_required',
        'chart_not_completed',
        'purchase_limit_reached',
        'refunded_no_repurchase',
      ].includes(result.error)
    ) {
      return Response.json({ error: result.error }, { status: 403 });
    }

    if (result.error === 'commerce_unavailable') {
      return Response.json({ error: 'commerce_unavailable' }, { status: 503 });
    }

    return Response.json({ error: result.error, detail: result.detail }, { status: 502 });
  } catch (err) {
    return Response.json(
      { error: 'internal_error', detail: err instanceof Error ? err.message : 'unknown' },
      { status: 500 },
    );
  }
};
