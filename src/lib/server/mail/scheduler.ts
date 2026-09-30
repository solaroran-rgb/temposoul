/**
 * 邮件五流定时发送调度器
 *
 * 职责：入队 → 到期触发 → 退订/频控/闸门校验 → 发送 → 指数退避重试 → 终态归档。
 *
 * 定时触发的现实约束：Cloudflare Pages Functions 不支持 cron / scheduled 事件，
 * 因此「定时」由外部 tick 驱动 —— POST /api/v1/mail/dispatch（functions/api/v1/mail/dispatch.ts）。
 * 挂 Cloudflare Cron Triggers / 外部监控（UptimeRobot、GitHub Actions schedule）每 1~5 分钟打一次即可。
 *
 * 任务持久化在 KV，重启 / 新 isolate 不丢；processing 状态带租约，
 * 租约过期自动 reclaim 回 pending，覆盖「发送中进程挂掉」的恢复。
 */

import type { MailerEnv } from '../mailer';
import type {
  DrainOptions,
  DrainResult,
  EnqueueInput,
  EnqueueResult,
  MailJob,
  MailJobStatus,
} from './types';
import { TERMINAL_STATUSES } from './types';
import { getFlowPolicy, isMailFlowId, renderMail } from './flows';
import {
  DEFAULT_DEDUPE_TTL_SEC,
  DEDUPE_KEY_PREFIX,
  JOB_KEY_PREFIX,
  decodeJob,
  isValidEmail,
  normalizeEmail,
  readJob,
  resolveQueueStore,
  writeJob,
  type MailQueueStore,
} from './store';
import { checkFlowGate, checkRateLimit, checkUnsubscribed } from './gates';
import { createMailProvider, type MailProvider } from './provider';

/** 首次重试基准间隔：30s（≈ 30s / 60s / 2min / 4min …） */
export const RETRY_BASE_MS = 30_000;
/** 退避上限：6 小时 */
export const RETRY_MAX_MS = 6 * 60 * 60 * 1000;
/** processing 租约时长：超时未 ack 视为崩溃，回收重投 */
export const LEASE_MS = 60_000;
/** 单轮默认最多处理的任务数 */
export const DEFAULT_MAX_TASKS = 50;
/** 单轮默认时间预算 */
export const DEFAULT_DEADLINE_MS = 20_000;
/** 单轮最多翻页数（防异常数据把请求拖死） */
const MAX_LIST_PAGES = 20;

export interface MailSchedulerEnv extends MailerEnv {
  MAIL_QUEUE_KV?: KVNamespace;
  newsletter_emails?: KVNamespace;
}

/**
 * 指数退避 + ±20% 抖动（抖动避免同批失败任务在同一秒集体重试）。
 * @param attempts 已尝试次数（≥1）
 */
export function retryDelayMs(attempts: number): number {
  const raw = RETRY_BASE_MS * 2 ** Math.max(0, attempts - 1);
  const capped = Math.min(raw, RETRY_MAX_MS);
  const jitter = capped * 0.2 * (Math.random() * 2 - 1);
  return Math.max(1, Math.round(capped + jitter));
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function emptyResult(): DrainResult {
  return {
    scanned: 0,
    reclaimed: 0,
    sent: 0,
    retried: 0,
    failed: 0,
    cancelled: 0,
    skippedUnsubscribed: 0,
    skippedRateLimited: 0,
    skippedGate: 0,
    processed: 0,
  };
}

function isTerminal(status: MailJobStatus): boolean {
  return TERMINAL_STATUSES.includes(status);
}

/**
 * 入队一封邮件。
 * 幂等：传 dedupeKey 时，若同键任务仍处于非终态，直接复用原任务（返回 deduped:true）。
 * 返回 queue_unavailable 表示无任何可用 KV —— 调用方应回退既有直发路径，不要静默丢信。
 */
export async function enqueueMail(
  env: MailSchedulerEnv,
  input: EnqueueInput,
): Promise<EnqueueResult> {
  if (!isMailFlowId(input.flow)) return { ok: false, reason: 'invalid_flow' };
  const to = normalizeEmail(typeof input.to === 'string' ? input.to : '');
  if (!isValidEmail(to)) return { ok: false, reason: 'invalid_recipient' };

  const store = resolveQueueStore(env);
  if (!store) return { ok: false, reason: 'queue_unavailable' };

  const dedupeKey = typeof input.dedupeKey === 'string' ? input.dedupeKey.trim() : '';
  if (dedupeKey) {
    const existingId = await store.get(`${DEDUPE_KEY_PREFIX}${dedupeKey}`).catch(() => null);
    if (existingId) {
      const existing = await readJob(store, existingId).catch(() => null);
      if (existing && !isTerminal(existing.status)) {
        return { ok: true, jobId: existing.id, deduped: true };
      }
    }
  }

  const now = Date.now();
  const policy = getFlowPolicy(input.flow);
  const job: MailJob = {
    id: crypto.randomUUID(),
    flow: input.flow,
    to,
    payload: input.payload ?? {},
    status: 'pending',
    attempts: 0,
    maxAttempts: Math.max(1, Math.floor(input.maxAttempts ?? policy.defaultMaxAttempts)),
    notBefore: now + Math.max(0, Math.floor(input.delayMs ?? 0)),
    leaseUntil: 0,
    createdAt: now,
    updatedAt: now,
  };

  await writeJob(store, job);
  if (dedupeKey) {
    await store
      .put(
        `${DEDUPE_KEY_PREFIX}${dedupeKey}`,
        job.id,
        Math.floor(input.dedupeTtlSec ?? DEFAULT_DEDUPE_TTL_SEC),
      )
      .catch(() => undefined);
  }
  return { ok: true, jobId: job.id, deduped: false };
}

/** 取消任务（终态）：退订命中 / 闸门拦截时使用 */
async function cancelJob(
  store: MailQueueStore,
  job: MailJob,
  reason: string,
  now: number,
): Promise<void> {
  job.status = 'cancelled';
  job.cancelReason = reason;
  job.leaseUntil = 0;
  job.updatedAt = now;
  await writeJob(store, job);
}

async function processJob(
  env: MailSchedulerEnv,
  store: MailQueueStore,
  provider: MailProvider,
  job: MailJob,
  now: number,
  result: DrainResult,
): Promise<void> {
  const policy = getFlowPolicy(job.flow);

  // 1) 退订过滤（仅 marketing 流）
  if (policy.respectUnsubscribe) {
    const u = await checkUnsubscribed(env, job.to).catch(() => ({ unsubscribed: false }));
    if (u.unsubscribed) {
      await cancelJob(store, job, 'unsubscribed', now);
      result.cancelled++;
      result.skippedUnsubscribed++;
      result.processed++;
      return;
    }
  }

  // 2) 既有闸门（成本闸门）
  const gate = await checkFlowGate(env, job.flow, job.payload).catch(() => ({ ok: true as const }));
  if (!gate.ok) {
    await cancelJob(store, job, gate.reason, now);
    result.cancelled++;
    result.skippedGate++;
    result.processed++;
    return;
  }

  // 3) 频控：命中不消耗尝试次数，顺延到下一窗口
  const rate = await checkRateLimit(store, job.flow, job.to, now).catch(
    () => ({ ok: true }) as const,
  );
  if (!rate.ok) {
    job.notBefore = rate.retryAtMs;
    job.updatedAt = now;
    await writeJob(store, job);
    result.skippedRateLimited++;
    return;
  }

  // 4) 认领（带租约）并发送
  job.attempts += 1;
  job.status = 'processing';
  job.leaseUntil = now + LEASE_MS;
  job.updatedAt = now;
  await writeJob(store, job);

  const rendered = renderMail(job.flow, job.to, job.payload, env);
  let outcome: { ok: boolean; error?: string };
  try {
    outcome = await provider.send({ ...rendered, to: job.to, flow: job.flow });
  } catch (e) {
    outcome = { ok: false, error: e instanceof Error ? e.message : 'provider_threw' };
  }

  const at = Date.now();
  if (outcome.ok) {
    job.status = 'sent';
    job.sentAt = at;
    job.leaseUntil = 0;
    job.lastError = undefined;
    job.updatedAt = at;
    result.sent++;
  } else {
    job.lastError = outcome.error ?? 'unknown_error';
    if (job.attempts >= job.maxAttempts) {
      job.status = 'failed';
      job.leaseUntil = 0;
      job.updatedAt = at;
      result.failed++;
    } else {
      job.status = 'pending';
      job.leaseUntil = 0;
      job.notBefore = at + retryDelayMs(job.attempts);
      job.updatedAt = at;
      result.retried++;
    }
  }
  await writeJob(store, job);
  result.processed++;
}

/**
 * 拉取并执行到期任务。
 * 幂等安全：终态任务不重发；未到期任务跳过；processing 且租约未过期跳过。
 */
export async function drainDue(
  env: MailSchedulerEnv,
  opts: DrainOptions = {},
): Promise<DrainResult> {
  const result = emptyResult();
  const store = resolveQueueStore(env);
  if (!store) return result;

  const now = opts.now ?? Date.now();
  const maxTasks = clamp(Math.floor(opts.maxTasks ?? DEFAULT_MAX_TASKS), 1, 500);
  const deadline = Date.now() + clamp(Math.floor(opts.deadlineMs ?? DEFAULT_DEADLINE_MS), 1, 60_000);
  const provider = createMailProvider(env);

  let cursor: string | undefined;
  let pages = 0;
  do {
    const page = await store.list(JOB_KEY_PREFIX, cursor, opts.listLimit ?? 200);
    cursor = page.complete ? undefined : page.cursor;
    pages++;

    for (const key of page.keys) {
      if (result.processed >= maxTasks || Date.now() >= deadline) break;
      const job = decodeJob(await store.get(key).catch(() => null));
      if (!job) continue;
      result.scanned++;

      // 崩溃恢复：租约过期的 processing 回退 pending
      if (job.status === 'processing' && job.leaseUntil <= now) {
        job.status = 'pending';
        job.leaseUntil = 0;
        job.updatedAt = now;
        await writeJob(store, job);
        result.reclaimed++;
      }

      if (job.status !== 'pending' || job.notBefore > now) continue;
      await processJob(env, store, provider, job, now, result);
    }
  } while (cursor && result.processed < maxTasks && Date.now() < deadline && pages < MAX_LIST_PAGES);

  return result;
}
