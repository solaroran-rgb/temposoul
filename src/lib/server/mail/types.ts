/**
 * 邮件五流调度器 · 类型契约
 *
 * 五流（以仓库现有代码为准）：
 *   1. newsletter_confirm  订阅确认信（双确认第一步）— 既有：functions/api/v1/newsletter-confirm.ts
 *   2. register_welcome    注册欢迎信               — 触发点：functions/api/auth/[[path]].ts#register
 *   3. otp_code            OTP 验证码               — 触发端点：functions/api/auth/[[path]].ts#otp
 *   4. password_reset      找回密码                 — 触发端点：functions/api/auth/[[path]].ts#forgot
 *   5. report_delivery     深度报告投递             — 既有：src/lib/server/report/email.ts
 *
 * 设计约束：
 *   - 调度层只做「何时发、发不发、失败怎么办」，不改模板文案（render 入参复用既有渲染函数）；
 *   - 一律经过既有闸门（成本闸门）/ 频控 / 退订过滤，不绕过；
 *   - provider 未配置时走 mock 日志，配置 RESEND_API_KEY + MAIL_FROM 后零改动切真实发送。
 */

/** 五流标识 */
export type MailFlowId =
  | 'newsletter_confirm'
  | 'register_welcome'
  | 'otp_code'
  | 'password_reset'
  | 'report_delivery';

/**
 * 邮件性质。
 *   transactional：事务邮件（凭证 / 安全 / 已付费交付物），不受营销退订影响；
 *   marketing：营销触达，退订名单命中即取消。
 */
export type MailKind = 'transactional' | 'marketing';

/** 任务状态机：pending → processing → sent | failed | cancelled */
export type MailJobStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'cancelled';

/** 终态：不再参与调度（保留 7 天后随 KV TTL 自动清理） */
export const TERMINAL_STATUSES: readonly MailJobStatus[] = ['sent', 'failed', 'cancelled'];

export interface RenderedMail {
  subject: string;
  html: string;
  text: string;
}

/** 渲染所需的最小环境（避免把整个 Env 拖进模板层） */
export interface MailRenderEnv {
  MAIL_FROM_NAME?: string;
}

export interface MailRenderInput {
  to: string;
  payload: Record<string, unknown>;
  env: MailRenderEnv;
}

/** 单流策略 */
export interface FlowPolicy {
  id: MailFlowId;
  kind: MailKind;
  /** 是否受退订名单约束。事务邮件置 false（退订营销 ≠ 拒收安全凭证） */
  respectUnsubscribe: boolean;
  /** 默认最大尝试次数（含首次） */
  defaultMaxAttempts: number;
  render(input: MailRenderInput): RenderedMail;
}

/** 队列任务（KV 持久化，重启不丢） */
export interface MailJob {
  id: string;
  flow: MailFlowId;
  /** 已归一化的收件邮箱（小写、去空格） */
  to: string;
  payload: Record<string, unknown>;
  status: MailJobStatus;
  /** 已尝试次数（首次发送前为 0） */
  attempts: number;
  maxAttempts: number;
  /** 最早可发送时间（epoch ms）；重试 / 频控命中后推后 */
  notBefore: number;
  /** processing 租约到期时间（epoch ms），用于崩溃 / 并发 reclaim */
  leaseUntil: number;
  createdAt: number;
  updatedAt: number;
  sentAt?: number;
  lastError?: string;
  cancelReason?: string;
}

export interface EnqueueInput {
  flow: MailFlowId;
  to: string;
  payload?: Record<string, unknown>;
  /** 延迟发送（ms）；缺省立即进入可发送态 */
  delayMs?: number;
  /** 幂等键：同键在 TTL 内重复入队只保留一条 */
  dedupeKey?: string;
  /** 幂等键有效期（秒），缺省 24h */
  dedupeTtlSec?: number;
  maxAttempts?: number;
}

export type EnqueueResult =
  | { ok: true; jobId: string; deduped: boolean }
  | { ok: false; reason: EnqueueRejectReason };

export type EnqueueRejectReason =
  /** 未绑定任何可用 KV → 调用方应回退到既有直发路径（本报告投递信的兼容分支） */
  | 'queue_unavailable'
  | 'invalid_flow'
  | 'invalid_recipient';

/** 单流频控规则（固定窗口，与 functions/_middleware.ts 的限流风格一致） */
export interface RateLimitRule {
  /** 窗口内最多发送封数 */
  limit: number;
  windowMs: number;
}

export interface DrainOptions {
  /** 注入当前时间便于测试；缺省 Date.now() */
  now?: number;
  /** 本次最多认领（尝试发送）的任务数 */
  maxTasks?: number;
  /** 本次扫描的 deadline（ms），到点即停，避免长尾拖垮请求 */
  deadlineMs?: number;
  /** 单次 KV list 翻页上限 */
  listLimit?: number;
}

export interface DrainResult {
  scanned: number;
  reclaimed: number;
  sent: number;
  retried: number;
  failed: number;
  cancelled: number;
  skippedUnsubscribed: number;
  skippedRateLimited: number;
  skippedGate: number;
  /** 本轮实际产出（sent+failed+cancelled+retried 去重后的处理数） */
  processed: number;
}
