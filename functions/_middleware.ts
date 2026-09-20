// 修正标注：本文件为 functions/_middleware.ts
// 复用 IT 表已有的 GEO_CACHE 进行限流；安全头注入逻辑保持
// 限流检查前置到 next() 之前，否则请求已处理完限流失效

import { getAiRuntimeConfigScript } from '../src/lib/ai/runtime-config';

/** 运行时配置脚本入口（生产契约：deploy-runbook 要求返回 no-store 的 JS） */
const RUNTIME_CONFIG_PATH = '/temposoul-runtime-config.js';

export async function onRequest(context: EventContext<Env>) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 0. 运行时配置入口：直接返回脚本，不走 next()/静态资源
  if (url.pathname === RUNTIME_CONFIG_PATH) {
    return new Response(getAiRuntimeConfigScript(env ?? {}), {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  }

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

  // 1b. 认证端点速率限制（F-001 修复：register/login 无限流 → 撞库/邮箱轰炸风险）
  // 复用 GEO_CACHE，按 IP+端点 5 次/分钟；失败退避由客户端侧处理（见 auth/[[path]].ts 审计日志）
  if (
    url.pathname === '/api/auth/register' ||
    url.pathname === '/api/auth/login'
  ) {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const minute = Math.floor(Date.now() / 60000);
    const rateLimitKey = `rl:auth:${ip}:${url.pathname}:${minute}`;

    if (env.GEO_CACHE) {
      const current = parseInt((await env.GEO_CACHE.get(rateLimitKey)) || '0');
      if (current > 5) {
        // 5 次/分钟（register+login 各自独立计数）
        return new Response(JSON.stringify({ error: 'rate_limit_exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
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
