/**
 * 隐私合规 · 账号一键删除（T20）
 *
 * 语义：登录用户一键发起删除 → 按数据面清单级联清理其全部个人数据
 *       （账号、会话、订阅状态、报告任务/结果、星空纪念事件、邮件订阅、
 *         邮件队列、社区 UGC、订单个人信息字段）→ 返回删除回执。
 *
 * 幂等：删除成功后写入 `deletion_receipt:{userId}`（90 天 TTL）；重复请求
 *       直接返回 alreadyDeleted。KV delete 本身幂等，重试安全。
 *
 * 保留策略（关键合规决策，同步见 docs/privacy/delete-account-data-surfaces.md）：
 *   - 支付/交易记录（D1 orders 表 + 第三方 PSP）：法律必需保留项。
 *     本模块将 D1 orders.user_id 脱敏为不可回链的 `deleted:<随机>` 标记后保留行，
 *     满足税务/账务/争议留痕（适用法律保留期通常 3~7 年，由平台定期清理）；
 *     第三方支付平台（Lemon Squeezy）的交易记录独立保留，我方无法代删。
 *   - 日志审计类数据（errlog / 平台日志）：不触碰（保留项，见任务卡边界）。
 *   - 社区公开内容（帖子/评论/举报/审核）：匿名化作者身份，保留内容
 *     （公开内容属他人可见，删除作者可识别信息即满足删除权最小化）。
 */

// 与 functions/api/v1/sky-events/_store.ts 的级联删除保持一致：
// 星空事件的数据/分享映射/逆向索引键均已注册进 user_assets 逆向索引，
// deleteUserData 会一并清掉；此处再按 skyevt_index 兜底一次，防索引残缺。
import { deleteUserData } from '../report/store';
import { purgeUserSkyEvents } from '../../../../functions/api/v1/sky-events/_store';
import {
  JOB_KEY_PREFIX,
  DEDUPE_KEY_PREFIX,
  RATE_KEY_PREFIX,
  decodeJob,
  resolveQueueStore,
  type MailQueueStore,
} from '../mail/store';

/* ────────────────────────── 常量 ────────────────────────── */

/** 删除回执保留期：90 天（足够覆盖「重复请求返回已删除」；之后账号数据已物理删除，无需回执） */
export const RECEIPT_TTL_SEC = 90 * 24 * 60 * 60;
/** 二次确认 token 有效期：15 分钟 */
export const CONFIRM_TOKEN_TTL_SEC = 15 * 60;
/** 匿名化社区内容时的作者占位 */
export const DELETED_AUTHOR = 'deleted-user';
/** 订单脱敏前缀（行保留，身份不可回链） */
export const ORDER_DELETED_PREFIX = 'deleted:';

/* ────────────────────────── 类型 ────────────────────────── */

export interface PrivacyEnv {
  AUTH_KV: KVNamespace;
  D1?: D1Database;
  newsletter_emails?: KVNamespace;
  MAIL_QUEUE_KV?: KVNamespace;
}

export interface DeletionReceipt {
  receiptId: string;
  userId: string;
  deletedAt: string;
  stats: PurgeStats;
  partial: boolean;
}

export interface PurgeStats {
  /** 报告任务 + 结果（含 user_assets 逆向索引） */
  reportTasks: number;
  reportResults: number;
  /** 星空纪念事件（数据 + 分享映射 + 逆向索引） */
  skyEvents: number;
  /** 账号订阅状态记录（sub:{userId}，含 KV 侧订单快照/防羊毛标记） */
  subscription: number;
  /** 会话（session:{sid}，按值匹配 userId 删除） */
  sessions: number;
  /** 账号记录（user:{email}，含昵称/口令哈希/盐） */
  account: number;
  /** 邮件订阅记录（email:{addr}） */
  newsletter: number;
  /** 邮件队列任务（mq:job:*，按收件人过滤） */
  mailJobs: number;
  /** 邮件去重键（mq:dedupe:*，键含收件人邮箱） */
  mailDedupe: number;
  /** 邮件频控键（mq:rl:*，键含收件人邮箱） */
  mailRate: number;
  /** 社区帖子匿名化条数 */
  communityPosts: number;
  /** 社区评论匿名化条数 */
  communityComments: number;
  /** 社区举报匿名化条数 */
  communityReports: number;
  /** 审核记录匿名化条数 */
  communityReviews: number;
  /** D1 orders 表脱敏行数（支付记录保留策略） */
  ordersAnonymized: number;
  /** 积分：当前为进程内内存 mock，无持久化面，恒为 0（见数据面清单 #13） */
  points: number;
}

export interface PurgeResult {
  ok: boolean;
  alreadyDeleted?: boolean;
  stats: PurgeStats;
  receipt?: DeletionReceipt;
  errors: string[];
}

/* ────────────────────── 密码与二次确认 ────────────────────── */

function bufToB64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/_/g, '/').replace(/=+$/, '');
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '===='.slice(0, pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function pbkdf2Hash(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100_000, hash: 'SHA-256' },
    key,
    256,
  );
  return bufToB64url(bits);
}

/**
 * 重输密码二次确认：校验口令哈希（格式与 functions/api/auth/[[path]].ts 注册/登录一致：
 * user:{email} = { email, nickname, salt, pwHash, createdAt }，PBKDF2-SHA256 100k 次）。
 */
export async function verifyAccountPassword(
  env: PrivacyEnv,
  email: string,
  password: string,
): Promise<boolean> {
  if (!email || !password) return false;
  const raw = await env.AUTH_KV.get(`user:${email}`).catch(() => null);
  if (!raw) return false;
  try {
    const user = JSON.parse(raw) as { salt?: string; pwHash?: string };
    if (typeof user.salt !== 'string' || typeof user.pwHash !== 'string') return false;
    return (await pbkdf2Hash(password, user.salt)) === user.pwHash;
  } catch {
    return false;
  }
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return bufToB64url(sig);
}

/**
 * 签发二次确认 token：HMAC-SHA256(AUTH_SECRET, `<userId>.<expSec>`)，base64url。
 * 由 GET /api/v1/me/delete?stage=challenge 下发，15 分钟内有效。
 */
export async function issueDeleteConfirmToken(
  secret: string,
  userId: string,
  ttlSec = CONFIRM_TOKEN_TTL_SEC,
  nowSec = Math.floor(Date.now() / 1000),
): Promise<string> {
  const exp = nowSec + ttlSec;
  const payload = `${userId}.${exp}`;
  const sig = await hmacSign(payload, secret);
  return `${bufToB64url(new TextEncoder().encode(payload))}.${sig}`;
}

export type ConfirmTokenVerify =
  | { ok: true; userId: string; exp: number }
  | { ok: false; reason: 'malformed' | 'bad_signature' | 'expired' };

/** 校验二次确认 token（格式 → 签名 → 未过期）。 */
export async function verifyDeleteConfirmToken(
  secret: string,
  token: string,
  nowSec = Math.floor(Date.now() / 1000),
): Promise<ConfirmTokenVerify> {
  const parts = token.split('.');
  if (parts.length !== 2) return { ok: false, reason: 'malformed' };
  const [payloadB64, sigB64] = parts;
  let payload: string;
  try {
    payload = new TextDecoder().decode(b64urlToBytes(payloadB64));
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  const expected = await hmacSign(payload, secret);
  if (expected !== sigB64) return { ok: false, reason: 'bad_signature' };
  const dot = payload.lastIndexOf('.');
  if (dot <= 0) return { ok: false, reason: 'malformed' };
  const userId = payload.slice(0, dot);
  const exp = Number(payload.slice(dot + 1));
  if (!userId || !Number.isFinite(exp)) return { ok: false, reason: 'malformed' };
  if (exp <= nowSec) return { ok: false, reason: 'expired' };
  return { ok: true, userId, exp };
}

/* ────────────────────────── 级联删除 ────────────────────────── */

function emptyStats(): PurgeStats {
  return {
    reportTasks: 0,
    reportResults: 0,
    skyEvents: 0,
    subscription: 0,
    sessions: 0,
    account: 0,
    newsletter: 0,
    mailJobs: 0,
    mailDedupe: 0,
    mailRate: 0,
    communityPosts: 0,
    communityComments: 0,
    communityReports: 0,
    communityReviews: 0,
    ordersAnonymized: 0,
    points: 0,
  };
}

/** 按值匹配删除全部会话（session:{sid} → userId）。 */
async function purgeSessions(kv: KVNamespace, userId: string): Promise<number> {
  let count = 0;
  let cursor: string | undefined;
  do {
    const page = await kv.list({ prefix: 'session:', limit: 500, cursor });
    for (const key of page.keys) {
      const value = await kv.get(key.name);
      if (value === userId) {
        await kv.delete(key.name);
        count++;
      }
    }
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return count;
}

/** 删除邮件订阅记录 + 按收件人过滤邮件队列（job/dedupe/rl）。 */
async function purgeMailData(env: PrivacyEnv, email: string): Promise<{
  newsletter: number;
  mailJobs: number;
  mailDedupe: number;
  mailRate: number;
}> {
  let newsletter = 0;
  let mailJobs = 0;
  let mailDedupe = 0;
  let mailRate = 0;

  // 订阅记录：newsletter_emails 的 email:{addr}
  if (env.newsletter_emails) {
    const key = `email:${email}`;
    if (await env.newsletter_emails.get(key)) {
      await env.newsletter_emails.delete(key);
      newsletter++;
    }
  }

  // 邮件队列：与调度器同款回落策略（MAIL_QUEUE_KV 优先，未绑定回落 newsletter_emails）
  const store = resolveQueueStore(env);
  if (store) {
    // 任务：mq:job:{id} → 解码后按 to 过滤
    mailJobs += await purgeQueueJobsByRecipient(store, email);
    // 去重键：mq:dedupe:{flow}:{email}（键尾含邮箱）
    mailDedupe += await purgeKeysContaining(store, DEDUPE_KEY_PREFIX, email);
    // 频控键：mq:rl:{flow}:{email}:{bucket}（键中含邮箱）
    mailRate += await purgeKeysContaining(store, RATE_KEY_PREFIX, email);
  }

  return { newsletter, mailJobs, mailDedupe, mailRate };
}

/** 扫描队列任务，删除收件人为该邮箱的全部任务（含 pending/processing/终态归档）。 */
async function purgeQueueJobsByRecipient(store: MailQueueStore, email: string): Promise<number> {
  let count = 0;
  let cursor: string | undefined;
  do {
    const page = await store.list(JOB_KEY_PREFIX, cursor, 500);
    for (const key of page.keys) {
      const job = decodeJob(await store.get(key).catch(() => null));
      if (job && job.to === email) {
        await store.delete(key);
        count++;
      }
    }
    cursor = page.complete ? undefined : page.cursor;
  } while (cursor);
  return count;
}

/** 扫描并删除键名中包含该邮箱的键（去重/频控键的邮箱在键名中，无独立值可读）。 */
async function purgeKeysContaining(store: MailQueueStore, prefix: string, email: string): Promise<number> {
  let count = 0;
  let cursor: string | undefined;
  do {
    const page = await store.list(prefix, cursor, 500);
    for (const key of page.keys) {
      if (key.includes(email)) {
        await store.delete(key);
        count++;
      }
    }
    cursor = page.complete ? undefined : page.cursor;
  } while (cursor);
  return count;
}

/** 社区 UGC 匿名化：作者/举报人/审核人身份替换为占位，内容保留。 */
async function purgeCommunityData(kv: KVNamespace, userId: string): Promise<{
  communityPosts: number;
  communityComments: number;
  communityReports: number;
  communityReviews: number;
}> {
  const out = { communityPosts: 0, communityComments: 0, communityReports: 0, communityReviews: 0 };

  // 数据键与索引键区分：数据键形如 community:post:{id}（只有一段后缀），
  // 索引键形如 community:post:board:{boardId}:{createdAt}:{id}（含 board:/post: 段）。
  const P = {
    post: 'community:post:',
    comment: 'community:comment:',
    report: 'community:report:',
    review: 'community:review:',
  };

  const isDataKey = (key: string, dataPrefix: string, indexMarker: string): boolean =>
    key.startsWith(dataPrefix) && !key.includes(indexMarker);

  async function anonymize(
    prefix: string,
    indexMarker: string,
    field: 'authorId' | 'reporterId' | 'reviewerId',
  ): Promise<number> {
    let count = 0;
    let cursor: string | undefined;
    do {
      const page = await kv.list({ prefix, limit: 500, cursor });
      for (const key of page.keys) {
        if (!isDataKey(key.name, prefix, indexMarker)) continue;
        const raw = await kv.get(key.name);
        if (!raw) continue;
        try {
          const rec = JSON.parse(raw) as Record<string, unknown>;
          if (rec[field] !== userId) continue;
          rec[field] = DELETED_AUTHOR;
          await kv.put(key.name, JSON.stringify(rec));
          count++;
        } catch {
          // 脏数据跳过（不阻塞清理）
        }
      }
      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);
    return count;
  }

  out.communityPosts = await anonymize(P.post, ':board:', 'authorId');
  out.communityComments = await anonymize(P.comment, ':post:', 'authorId');
  out.communityReports = await anonymize(P.report, ':target:', 'reporterId');
  out.communityReviews = await anonymize(P.review, ':target:', 'reviewerId');
  return out;
}

/**
 * D1 orders 表支付记录保留策略：行保留、user_id 脱敏。
 * 逐行写入不可回链的 `deleted:<随机>` 标记；保留满足税务/账务/争议留痕，
 * 保留期按适用法律（通常 3~7 年）由平台定期清理（见 docs/privacy/delete-account-data-surfaces.md #8）。
 */
async function purgeOrdersTable(db: D1Database, userId: string): Promise<number> {
  const rows = await db
    .prepare('SELECT id FROM orders WHERE user_id = ?1')
    .bind(userId)
    .all<{ id: string }>();
  let count = 0;
  for (const row of rows.results) {
    const anon = `${ORDER_DELETED_PREFIX}${Date.now().toString(36)}${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    await db
      .prepare('UPDATE orders SET user_id = ?1, updated_at = ?2 WHERE id = ?3')
      .bind(anon, Date.now(), row.id)
      .run();
    count++;
  }
  return count;
}

/** 读取既有删除回执（幂等判定）。 */
export async function readDeletionReceipt(
  kv: KVNamespace,
  userId: string,
): Promise<DeletionReceipt | null> {
  const raw = await kv.get(`deletion_receipt:${userId}`).catch(() => null);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DeletionReceipt;
  } catch {
    return null;
  }
}

/**
 * 全数据面级联删除（幂等）。
 * - 已存在回执 → { ok: true, alreadyDeleted: true, receipt }
 * - 无回执 → 执行全部步骤；任一硬错误返回 ok:false（不写回执，重试安全）；
 *   全部成功 → 写回执并返回统计。
 *
 * @param userId 登录身份 sub（= 邮箱，全库一致：账号/会话/订阅/星空事件均以它为键）
 */
export async function purgeUserData(
  env: PrivacyEnv,
  userId: string,
): Promise<PurgeResult> {
  const stats = emptyStats();
  const errors: string[] = [];

  const existing = await readDeletionReceipt(env.AUTH_KV, userId);
  if (existing) {
    return { ok: true, alreadyDeleted: true, stats: existing.stats, receipt: existing, errors: [] };
  }

  const email = userId; // sub = 邮箱（见 functions/api/auth/[[path]].ts 与 sky-events/_auth.ts）

  const run = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (err) {
      errors.push(`${name}: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // 1) 报告任务/结果 + user_assets 逆向索引（星空事件键已注册其中，一并清除）
  await run('report', async () => {
    const r = await deleteUserData(env.AUTH_KV, userId);
    stats.reportTasks = r.deletedTasks;
    stats.reportResults = r.deletedResults;
  });

  // 2) 星空纪念事件兜底（按 skyevt_index 独立清理，防索引残缺）
  await run('sky-events', async () => {
    stats.skyEvents = await purgeUserSkyEvents(env.AUTH_KV, userId);
  });

  // 3) 订阅状态（sub:{userId}，含 KV 侧订单快照/防羊毛标记；权威支付记录在 D1 orders + PSP）
  await run('subscription', async () => {
    if (await env.AUTH_KV.get(`sub:${userId}`)) {
      await env.AUTH_KV.delete(`sub:${userId}`);
      stats.subscription = 1;
    }
  });

  // 4) 会话（session:{sid} → email）
  await run('sessions', async () => {
    stats.sessions = await purgeSessions(env.AUTH_KV, email);
  });

  // 5) 账号记录（user:{email}）
  await run('account', async () => {
    if (await env.AUTH_KV.get(`user:${email}`)) {
      await env.AUTH_KV.delete(`user:${email}`);
      stats.account = 1;
    }
  });

  // 6) 邮件订阅记录 + 邮件队列（按收件人过滤）
  await run('mail', async () => {
    const m = await purgeMailData(env, email);
    stats.newsletter = m.newsletter;
    stats.mailJobs = m.mailJobs;
    stats.mailDedupe = m.mailDedupe;
    stats.mailRate = m.mailRate;
  });

  // 7) 社区 UGC 匿名化
  await run('community', async () => {
    const c = await purgeCommunityData(env.AUTH_KV, userId);
    stats.communityPosts = c.communityPosts;
    stats.communityComments = c.communityComments;
    stats.communityReports = c.communityReports;
    stats.communityReviews = c.communityReviews;
  });

  // 8) D1 orders 表脱敏（支付记录保留策略）
  await run('orders', async () => {
    if (env.D1) {
      stats.ordersAnonymized = await purgeOrdersTable(env.D1, userId);
    }
  });

  // 9) 积分：内存 mock，无持久化面
  stats.points = 0;

  if (errors.length > 0) {
    return { ok: false, stats, errors };
  }

  const receipt: DeletionReceipt = {
    receiptId: crypto.randomUUID(),
    userId,
    deletedAt: new Date().toISOString(),
    stats,
    partial: false,
  };
  await env.AUTH_KV.put(`deletion_receipt:${userId}`, JSON.stringify(receipt), {
    expirationTtl: RECEIPT_TTL_SEC,
  });

  return { ok: true, stats, receipt, errors };
}
