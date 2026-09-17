// 修正标注：本文件为 functions/_middleware.ts
// 复用 IT 表已有的 GEO_CACHE 进行限流；安全头注入逻辑保持
// 限流检查前置到 next() 之前，否则请求已处理完限流失效

export async function onRequest(context: EventContext<Env>) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 1. 基础速率限制 (针对敏感 API，复用 GEO_CACHE)
  if (
    url.pathname.startsWith('/api/v1/checkout') ||
    url.pathname.startsWith('/api/v1/cancel') ||
    url.pathname.startsWith('/api/v1/refund')
  ) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const minute = Math.floor(Date.now() / 60000);
    const rateLimitKey = `rl:${ip}:${url.pathname}:${minute}`;

    if (env.GEO_CACHE) {
      const current = parseInt((await env.GEO_CACHE.get(rateLimitKey)) || '0');
      if (current > 10) {
        // 10 次/分钟
        return new Response(JSON.stringify({ error: 'rate_limit_exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      await env.GEO_CACHE.put(rateLimitKey, String(current + 1), { expirationTtl: 120 });
    }
  }

  const response = await next();

  // 2. 安全头注入
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}
