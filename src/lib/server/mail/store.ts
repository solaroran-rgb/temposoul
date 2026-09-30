/**
 * 邮件队列持久化层（KV）
 *
 * 为什么用 KV 而不是内存：Cloudflare Pages Functions 按 isolate 执行、随调用启停，
 * 内存队列重启即丢。本仓库已绑定 AUTH_KV / newsletter_emails / GEO_CACHE 三个命名空间，
 * 队列沿用同一套约定：
 *   - 优先用专用命名空间 MAIL_QUEUE_KV（隔离队列高写入，避免与订阅记录互相挤占）；
 *   - 未绑定时回落到 newsletter_emails（同为邮件域、生产已绑定），保证零配置即可跑；
 *   - 两者都缺 → resolveQueueStore 返回 null，调用方回退既有直发路径（不静默丢信）。
 *
 * 若后续 T04 引入 D1，只需另实现 MailQueueStore（SQL 版）并在 resolveQueueStore 中
 * 增加分支，调度器代码零改动。
 */

import type { MailJob } from './types';
import { TERMINAL_STATUSES } from './types';

export const JOB_KEY_PREFIX = 'mq:job:';
export const DEDUPE_KEY_PREFIX = 'mq:dedupe:';
export const RATE_KEY_PREFIX = 'mq:rl:';

/** 终态任务保留期（秒）：够复盘，不至于无限膨胀 */
export const TERMINAL_RETENTION_SEC = 7 * 24 * 60 * 60;
/** 幂等键默认有效期（秒） */
export const DEFAULT_DEDUPE_TTL_SEC = 24 * 60 * 60;

export interface ListPage {
  keys: string[];
  cursor?: string;
  complete: boolean;
}

/** 队列存储的最小能力面（KV / D1 均可用此契约实现） */
export interface MailQueueStore {
  /** 读取原始值；不存在返回 null */
  get(key: string): Promise<string | null>;
  /** 写入原始值；ttlSec 省略则不过期 */
  put(key: string, value: string, ttlSec?: number): Promise<void>;
  /** 删除键 */
  delete(key: string): Promise<void>;
  /** 按前缀翻页列举键名 */
  list(prefix: string, cursor?: string, limit?: number): Promise<ListPage>;
}

export interface MailQueueEnv {
  MAIL_QUEUE_KV?: KVNamespace;
  newsletter_emails?: KVNamespace;
}

/** 按优先级挑选可用命名空间；都不可用返回 null */
export function resolveQueueStore(env: MailQueueEnv): MailQueueStore | null {
  const kv = env.MAIL_QUEUE_KV ?? env.newsletter_emails;
  return kv ? createKvQueueStore(kv) : null;
}

export function createKvQueueStore(kv: KVNamespace): MailQueueStore {
  return {
    async get(key) {
      return kv.get(key);
    },
    async put(key, value, ttlSec) {
      await kv.put(key, value, ttlSec ? { expirationTtl: ttlSec } : undefined);
    },
    async delete(key) {
      await kv.delete(key);
    },
    async list(prefix, cursor, limit) {
      const page = await kv.list({ prefix, cursor, limit: limit ?? 500 });
      return {
        keys: page.keys.map((k) => k.name),
        cursor: typeof page.cursor === 'string' && page.cursor ? page.cursor : undefined,
        complete: page.list_complete !== false,
      };
    },
  };
}

export function jobKey(id: string): string {
  return `${JOB_KEY_PREFIX}${id}`;
}

export function jobIdFromKey(key: string): string {
  return key.startsWith(JOB_KEY_PREFIX) ? key.slice(JOB_KEY_PREFIX.length) : key;
}

/** 终态任务写盘时带上保留期 TTL，避免队列无限增长 */
export function retentionSecFor(job: MailJob): number | undefined {
  return TERMINAL_STATUSES.includes(job.status) ? TERMINAL_RETENTION_SEC : undefined;
}

export function encodeJob(job: MailJob): string {
  return JSON.stringify(job);
}

/** 宽松解码：脏数据 / 版本不兼容一律返回 null（按不存在处理，不阻塞调度） */
export function decodeJob(raw: string | null | undefined): MailJob | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== 'object') return null;
    const job = v as Partial<MailJob>;
    if (typeof job.id !== 'string' || typeof job.flow !== 'string') return null;
    if (typeof job.to !== 'string' || typeof job.status !== 'string') return null;
    return job as MailJob;
  } catch {
    return null;
  }
}

export async function readJob(store: MailQueueStore, id: string): Promise<MailJob | null> {
  return decodeJob(await store.get(jobKey(id)));
}

export async function writeJob(store: MailQueueStore, job: MailJob): Promise<void> {
  await store.put(jobKey(job.id), encodeJob(job), retentionSecFor(job));
}

/** 归一化收件邮箱：小写 + 去空格。与 newsletter 系列端点的归一化口径一致。 */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

/** 与既有端点一致的邮箱格式校验 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_EMAIL_LEN = 254;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value) && value.length <= MAX_EMAIL_LEN;
}
