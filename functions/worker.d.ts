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
    D1?: D1Database;
    newsletter_emails?: KVNamespace;
    GEO_CACHE?: KVNamespace;
    PAYMENT_PROVIDER?: string;
    /** T14 商店：积分抵扣策略 JSON（覆盖代码默认值，非法值回退默认） */
    SHOP_POINTS_POLICY_JSON?: string;
    /** T06 促销规则集 JSON（透传 settleOrder） */
    PROMO_RULES_JSON?: string;
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
    /** 邮件发送队列专用 KV；未绑定时调度器回退 newsletter_emails */
    MAIL_QUEUE_KV?: KVNamespace;
    /** /api/v1/mail/dispatch 的调度令牌；未配置时端点 503（fail-closed） */
    MAIL_DISPATCH_TOKEN?: string;
    /** 错误统一落点 KV（T16） */
    ERRLOG_KV?: KVNamespace;
    /** /api/v1/errlog 写入令牌（公开、仅写）；未配置时端点 503（fail-closed） */
    ERRLOG_INGEST_TOKEN?: string;
    /** /api/v1/errlog 管理令牌（机密，GET 聚合/确认）；未配置时 503 */
    ERRLOG_ADMIN_TOKEN?: string;
    /** 5 分钟内 error/fatal 达到此数即告警（默认 3） */
    ERRLOG_ALERT_THRESHOLD?: string;
    /** 聚合超阈值时 POST 该 URL 触发告警；未配置则写 pending 由监控脚本轮询 */
    ALERT_WEBHOOK?: string;
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
