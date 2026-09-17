/**
 * Cloudflare Pages Functions 全局类型声明
 * （本项目 functions/ 与 src/lib/server/ 共用，避免每个文件重复声明局部 interface）
 */

declare global {
  interface KVNamespace {
    get(key: string): Promise<string | null>;
    put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
    delete(key: string): Promise<void>;
    list(options?: {
      prefix?: string;
      limit?: number;
      cursor?: string;
    }): Promise<{
      keys: Array<{ name: string; metadata?: unknown; value?: string }>;
      list_complete: boolean;
      cursor?: string;
    }>;
  }

  interface PagesFunction<Env = unknown> {
    (context: {
      request: Request;
      env: Env;
      params: Record<string, string>;
      waitUntil(promise: Promise<unknown>): void;
      next(input?: Request | string, init?: RequestInit): Promise<Response>;
    }): Promise<Response> | Response;
  }

  interface EventContext<Env = unknown, Cf = unknown, Data = unknown> {
    request: Request;
    env: Env;
    params: Record<string, string>;
    waitUntil(promise: Promise<unknown>): void;
    next(input?: Request | string, init?: RequestInit): Promise<Response>;
    data: Data;
  }

  interface Env {
    AUTH_SECRET: string;
    AUTH_KV: KVNamespace;
    newsletter_emails?: KVNamespace;
    GEO_CACHE?: KVNamespace;
    PAYMENT_PROVIDER?: string;
    LEMONSQUEEZY_API_KEY?: string;
    LEMONSQUEEZY_STORE_ID?: string;
    LEMONSQUEEZY_VARIANT_ID?: string;
    LEMONSQUEEZY_VARIANTS?: string;
    LEMONSQUEEZY_WEBHOOK_SECRET?: string;
    LEMONSQUEEZY_API_URL?: string;
    PUBLIC_SITE_URL?: string;
    RESEND_API_KEY?: string;
    MAIL_FROM?: string;
    MAIL_FROM_NAME?: string;
    ANALYTICS_PROVIDER?: string;
    ANALYTICS_SITE_ID?: string;
    // AiEnv 兼容字段（handleAiAnalyze 的 weak-type 检查要求共同属性）
    AI_API_KEY?: string;
    AI_BASE_URL?: string;
    AI_MODEL?: string;
    AI_PROVIDER_NAME?: string;
    AI_BUILTIN_ENABLED?: string;
    AI_DEFAULT_ENABLED?: string;
    I18N_ENABLED_LOCALES?: string;
  }
}

export {};
