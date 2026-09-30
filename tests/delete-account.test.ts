/**
 * T20 · 隐私一键删除 API 测试
 * 覆盖：未鉴权拒绝 / 二次确认（重输密码 + 短时 token）/
 *       全数据面级联清理（账号、会话、订阅、报告、星空事件、邮件订阅、
 *       邮件队列、社区 UGC、订单脱敏）/ 幂等重试 / 他人数据不受影响。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { onRequest as deleteEndpoint } from '../functions/api/v1/me/delete';
import {
  issueDeleteConfirmToken,
  purgeUserData,
  verifyDeleteConfirmToken,
} from '../src/lib/server/privacy/delete-account';
import { saveReportResult, updateTaskStatus } from '../src/lib/server/report/store';
import { createSkyEvent } from '../functions/api/v1/sky-events/_store';
import { enqueueMail } from '../src/lib/server/mail/scheduler';
import { createCommunityKVStore } from '../src/lib/server/community/kv-store';
import { KV_PREFIXES, type Post, type Comment, type Report, type ReviewRecord } from '../src/lib/server/community/models';

/* ────────────────────────── 内存 KV 桩 ────────────────────────── */

interface MemoryKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(opts?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ keys: Array<{ name: string }>; list_complete: boolean; cursor?: string }>;
}

function createMemoryKV(): { kv: MemoryKV; store: Map<string, { v: string; exp?: number }> } {
  const store = new Map<string, { v: string; exp?: number }>();
  const live = (key: string): { v: string; exp?: number } | undefined => {
    const hit = store.get(key);
    if (!hit) return undefined;
    if (hit.exp !== undefined && hit.exp <= Date.now()) {
      store.delete(key);
      return undefined;
    }
    return hit;
  };
  const kv: MemoryKV = {
    async get(key) {
      return live(key)?.v ?? null;
    },
    async put(key, value, opts) {
      store.set(key, { v: value, exp: opts?.expirationTtl ? Date.now() + opts.expirationTtl * 1000 : undefined });
    },
    async delete(key) {
      store.delete(key);
    },
    async list(opts) {
      const prefix = opts?.prefix ?? '';
      const limit = opts?.limit ?? 1000;
      const names = [...store.keys()].filter((k) => k.startsWith(prefix)).sort();
      const start = opts?.cursor ? names.indexOf(opts.cursor) + 1 : 0;
      const slice = names.slice(start, start + limit);
      const complete = start + slice.length >= names.length;
      return {
        keys: slice.map((name) => ({ name })),
        list_complete: complete,
        cursor: complete ? undefined : slice[slice.length - 1],
      };
    },
  };
  return { kv, store };
}

function asKV(kv: MemoryKV): KVNamespace {
  return kv as unknown as KVNamespace;
}

/* ────────────────────────── 假 D1（orders 表） ────────────────────────── */

type OrderRow = { id: string; user_id: string; amount: number; status: string };

function createFakeD1(rows: OrderRow[]): { db: D1Database; rows: OrderRow[] } {
  // 直接持有调用方数组引用：purge 的 UPDATE 会反映到 rows（断言用）
  const data: OrderRow[] = rows;
  const db: D1Database = {
    prepare(sql: string) {
      const stmt = {
        _params: [] as unknown[],
        bind(...params: unknown[]) {
          this._params = params;
          return stmt;
        },
        async first() {
          const sel = /WHERE\s+user_id\s*=\s*\?(\d+)/i.exec(sql);
          if (!sel) return null;
          const idx = Number(sel[1]) - 1;
          const target = this._params[idx];
          return data.find((r) => r.user_id === target) ?? null;
        },
        async all() {
          const sel = /WHERE\s+user_id\s*=\s*\?(\d+)/i.exec(sql);
          if (!sel) return { results: data, success: true };
          const idx = Number(sel[1]) - 1;
          const target = this._params[idx];
          return {
            results: data.filter((r) => r.user_id === target).map((r) => ({ ...r })),
            success: true,
          };
        },
        async run() {
          const upd = /UPDATE\s+orders\s+SET\s+([\s\S]*?)\s+WHERE\s+id\s*=\s*\?(\d+)/i.exec(sql);
          if (upd) {
            const idIdx = Number(upd[2]) - 1;
            const id = this._params[idIdx] as string;
            const row = data.find((r) => r.id === id);
            if (row) {
              const sets = upd[1];
              const m1 = /user_id\s*=\s*\?(\d+)/i.exec(sets);
              if (m1) row.user_id = this._params[Number(m1[1]) - 1] as string;
              const m2 = /updated_at\s*=\s*\?(\d+)/i.exec(sets);
              if (m2) row.updated_at = this._params[Number(m2[1]) - 1] as number;
            }
          }
          return { success: true, results: [], meta: { changes: 1 } };
        },
        async batch() {
          return [{ success: true, results: [] }];
        },
      };
      return stmt;
    },
    async dump() {
      return new ArrayBuffer(0);
    },
    async batch() {
      return [{ success: true, results: [] }];
    },
    async exec() {
      return { count: 0, duration: 0 };
    },
  };
  return { db, rows: data };
}

/* ────────────────────────── 密码/JWT 工具（与 auth 实现同构） ────────────────────────── */

function bufToB64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/_/g, '/').replace(/=+$/, '');
}

async function pbkdf2Hash(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 100_000, hash: 'SHA-256' },
    key,
    256,
  );
  return bufToB64url(bits);
}

async function signJwt(payload: Record<string, unknown>, secret: string): Promise<string> {
  const enc = (o: unknown) => bufToB64url(new TextEncoder().encode(JSON.stringify(o)));
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const data = `${enc({ alg: 'HS256', typ: 'JWT' })}.${enc(payload)}`;
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${bufToB64url(sig)}`;
}

/* ────────────────────────── 造数与环境 ────────────────────────── */

const SECRET = 'test-secret-0123456789abcdef';
const EMAIL = 'alice@example.com';
const OTHER = 'bob@example.com';
const PASSWORD = 'password-123';

async function seedUser(kv: MemoryKV): Promise<void> {
  const salt = bufToB64url(crypto.getRandomValues(new Uint8Array(16)));
  const pwHash = await pbkdf2Hash(PASSWORD, salt);
  await kv.put(`user:${EMAIL}`, JSON.stringify({ email: EMAIL, nickname: 'alice', salt, pwHash, createdAt: Date.now() }));
  await kv.put(`session:sid-alice-1`, EMAIL);
  await kv.put(`session:sid-alice-2`, EMAIL);
  await kv.put(`session:sid-bob-1`, OTHER);
  await kv.put(`sub:${EMAIL}`, JSON.stringify({ tier: 'premium', chartCompleted: true, orders: [{ productId: 'event_9_9', ts: '2026-09-30T00:00:00.000Z' }] }));
}

async function seedContent(
  authKv: MemoryKV,
  queueKv: MemoryKV,
  newsletterKv: MemoryKV,
  d1Rows: OrderRow[],
): Promise<void> {
  const env = { AUTH_KV: asKV(authKv) } as unknown as Env;

  // 报告（任务 + 结果 + 逆向索引）
  const task: any = {
    id: 't1',
    userId: EMAIL,
    status: 'done',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resultKey: `report:result:${EMAIL}:t1`,
  };
  await updateTaskStatus(env, task, 'done', task.resultKey);
  await saveReportResult(env, task, { tenDim: 'x' } as any);

  // 星空纪念事件（数据 + 分享映射 + skyevt_index + user_assets）
  await createSkyEvent(env, EMAIL, {
    title: '我的纪念',
    note: '备注',
    eventTime: '2026-09-30T12:00:00.000Z',
    lat: 36.65,
    lng: 117.12,
    locationName: '济南',
    skySnapshot: { lst: 12.3 },
  });

  // 邮件订阅 + 邮件队列
  await newsletterKv.put(`email:${EMAIL}`, JSON.stringify({ email: EMAIL, status: 'confirmed', frequency: 'weekly' }));
  await newsletterKv.put(`email:${OTHER}`, JSON.stringify({ email: OTHER, status: 'confirmed', frequency: 'daily' }));
  await enqueueMail({ MAIL_QUEUE_KV: asKV(queueKv), newsletter_emails: asKV(newsletterKv) } as unknown as any, {
    flow: 'register_welcome',
    to: EMAIL,
    payload: { nickname: 'alice' },
    dedupeKey: `register_welcome:${EMAIL}`,
  });
  await enqueueMail({ MAIL_QUEUE_KV: asKV(queueKv), newsletter_emails: asKV(newsletterKv) } as unknown as any, {
    flow: 'register_welcome',
    to: OTHER,
    payload: { nickname: 'bob' },
    dedupeKey: `register_welcome:${OTHER}`,
  });
  await queueKv.put(`mq:rl:otp_code:${EMAIL}:12345`, '1', { expirationTtl: 600 });

  // 社区 UGC（帖子/评论/举报/审核，含他人内容）
  const store = createCommunityKVStore(asKV(authKv));
  const now = new Date().toISOString();
  const alicePost: Post = { id: 'post-1', boardId: 'bazi', title: '贴', authorId: EMAIL, excerpt: 'x', content: '内容', status: 'approved', replyCount: 0, createdAt: now };
  const bobPost: Post = { id: 'post-2', boardId: 'bazi', title: 'bob 帖', authorId: OTHER, excerpt: 'y', content: 'bob 内容', status: 'approved', replyCount: 0, createdAt: now };
  await store.createPost(alicePost);
  await store.createPost(bobPost);
  await store.createComment({ id: 'cmt-1', postId: 'post-1', authorId: EMAIL, content: '评论', status: 'approved', createdAt: now });
  await store.createComment({ id: 'cmt-2', postId: 'post-1', authorId: OTHER, content: '他人评论', status: 'approved', createdAt: now });
  await store.createReport({ id: 'rep-1', reporterId: EMAIL, targetId: 'post-2', targetType: 'post', reason: '垃圾', status: 'pending', createdAt: now });
  await store.createReview({ id: 'rev-1', targetType: 'post', targetId: 'post-2', action: 'approve', reviewerId: EMAIL, reason: '', createdAt: now });
  await store.createReview({ id: 'rev-2', targetType: 'post', targetId: 'post-1', action: 'approve', reviewerId: OTHER, reason: '', createdAt: now });

  // 订单表（alice 2 行、bob 1 行）
  d1Rows.push(
    { id: 'o1', user_id: EMAIL, amount: 990, status: 'completed' },
    { id: 'o2', user_id: EMAIL, amount: 3980, status: 'completed' },
    { id: 'o3', user_id: OTHER, amount: 990, status: 'completed' },
  );
}

type Harness = {
  authKv: MemoryKV;
  queueKv: MemoryKV;
  newsletterKv: MemoryKV;
  geoKv: MemoryKV;
  d1Rows: OrderRow[];
  db: D1Database;
};

async function buildHarness(): Promise<Harness> {
  const authKv = createMemoryKV().kv;
  const queueKv = createMemoryKV().kv;
  const newsletterKv = createMemoryKV().kv;
  const geoKv = createMemoryKV().kv;
  const d1Rows: OrderRow[] = [];
  await seedUser(authKv);
  await seedContent(authKv, queueKv, newsletterKv, d1Rows);
  const { db } = createFakeD1(d1Rows);
  return { authKv, queueKv, newsletterKv, geoKv, d1Rows, db };
}

function makeEnv(h: Harness): Env {
  return {
    AUTH_SECRET: SECRET,
    AUTH_KV: asKV(h.authKv),
    newsletter_emails: asKV(h.newsletterKv),
    MAIL_QUEUE_KV: asKV(h.queueKv),
    GEO_CACHE: asKV(h.geoKv),
    D1: h.db,
  } as unknown as Env;
}

function endpointCtx(request: Request, h: Harness) {
  return {
    request,
    env: makeEnv(h),
    params: {},
    waitUntil: () => undefined,
    next: async () => new Response(null, { status: 404 }),
  } as unknown as EventContext<Env>;
}

function post(body: unknown, token?: string): Request {
  return new Request('https://temposoul.pages.dev/api/v1/me/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

/* ────────────────────────── 测试 ────────────────────────── */

test('未鉴权请求被拒绝（401）', async () => {
  const h = await buildHarness();
  const res = await deleteEndpoint(endpointCtx(post({ password: PASSWORD }), undefined));
  assert.equal(res.status, 401);
  const body = await res.json();
  assert.equal(body.error, 'unauthorized');
});

test('缺少二次确认 → 400', async () => {
  const h = await buildHarness();
  const token = await signJwt({ sub: EMAIL, sid: 'sid-alice-1', exp: Date.now() + 60_000 }, SECRET);
  const res = await deleteEndpoint(endpointCtx(post({}), token));
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, 'missing_confirmation');
});

test('密码错误 → 403', async () => {
  const h = await buildHarness();
  const token = await signJwt({ sub: EMAIL, sid: 'sid-alice-1', exp: Date.now() + 60_000 }, SECRET);
  const res = await deleteEndpoint(endpointCtx(post({ password: 'wrong-password' }), token));
  assert.equal(res.status, 403);
  assert.equal((await res.json()).error, 'invalid_confirmation');
});

test('二次确认 token：他人 token 不可用（403）', async () => {
  const h = await buildHarness();
  const token = await signJwt({ sub: EMAIL, sid: 'sid-alice-1', exp: Date.now() + 60_000 }, SECRET);
  const otherToken = await issueDeleteConfirmToken(SECRET, OTHER);
  const res = await deleteEndpoint(endpointCtx(post({ confirmToken: otherToken }), token));
  assert.equal(res.status, 403);
});

test('二次确认 token：过期 token 不可用（403）', async () => {
  const h = await buildHarness();
  const token = await signJwt({ sub: EMAIL, sid: 'sid-alice-1', exp: Date.now() + 60_000 }, SECRET);
  const past = Math.floor(Date.now() / 1000) - 60;
  const expired = await issueDeleteConfirmToken(SECRET, EMAIL, 1, past);
  const res = await deleteEndpoint(endpointCtx(post({ confirmToken: expired }), token));
  assert.equal(res.status, 403);
  assert.equal((await res.json()).error, 'invalid_confirmation');
});

test('GET challenge 签发 token，POST 携带 token 删除成功', async () => {
  const h = await buildHarness();
  const token = await signJwt({ sub: EMAIL, sid: 'sid-alice-1', exp: Date.now() + 60_000 }, SECRET);

  const challengeReq = new Request(
    'https://temposoul.pages.dev/api/v1/me/delete?stage=challenge',
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const challenge = await deleteEndpoint(endpointCtx(challengeReq, h));
  assert.equal(challenge.status, 200);
  const { confirmToken } = await challenge.json();

  const verify = await verifyDeleteConfirmToken(SECRET, confirmToken);
  assert.equal(verify.ok, true);

  const res = await deleteEndpoint(endpointCtx(post({ confirmToken }, token), h));
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.alreadyDeleted, false);
  assert.ok(body.receiptId);
  assert.equal(await h.authKv.get(`user:${EMAIL}`), null);
});

test('重输密码 → 全数据面级联清理 + 幂等重试返回已删除', async () => {
  const h = await buildHarness();
  const token = await signJwt({ sub: EMAIL, sid: 'sid-alice-1', exp: Date.now() + 60_000 }, SECRET);

  const res = await deleteEndpoint(endpointCtx(post({ password: PASSWORD }), token), h);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.success, true);
  assert.equal(body.alreadyDeleted, false);

  // ── 数据面逐一验证 ──
  // 账号 / 会话 / 订阅
  assert.equal(await h.authKv.get(`user:${EMAIL}`), null);
  assert.equal(await h.authKv.get(`session:sid-alice-1`), null);
  assert.equal(await h.authKv.get(`session:sid-alice-2`), null);
  assert.equal(await h.authKv.get(`sub:${EMAIL}`), null);
  // 他人会话不受影响
  assert.equal(await h.authKv.get(`session:sid-bob-1`), OTHER);

  // 报告（任务/结果/逆向索引）
  assert.equal(await h.authKv.get(`report:task:${EMAIL}:t1`), null);
  assert.equal(await h.authKv.get(`report:result:${EMAIL}:t1`), null);
  assert.equal(await h.authKv.get(`user_assets:${EMAIL}`), null);

  // 星空事件（数据/分享/索引均注册进 user_assets + skyevt_index，全部应清空）
  const skyKeys = (await h.authKv.list({ prefix: 'skyevt:' })).keys.map((k) => k.name);
  const skyIdx = (await h.authKv.list({ prefix: 'skyevt_index:' })).keys.map((k) => k.name);
  assert.equal(skyKeys.length, 0, 'skyevt:* 键应全部删除');
  assert.equal(skyIdx.length, 0, 'skyevt_index:* 键应全部删除');

  // 邮件订阅 + 邮件队列
  assert.equal(await h.newsletterKv.get(`email:${EMAIL}`), null);
  assert.ok(await h.newsletterKv.get(`email:${OTHER}`), '他人订阅记录保留');
  const jobs = (await h.queueKv.list({ prefix: 'mq:job:' })).keys.map((k) => k.name);
  assert.equal(jobs.length, 1, '仅剩他人任务');
  assert.equal((await h.queueKv.list({ prefix: 'mq:dedupe:' })).keys.length, 1, '仅剩他人去重键');
  assert.equal((await h.queueKv.list({ prefix: 'mq:rl:' })).keys.length, 0, '频控键（含本用户邮箱）清空');

  // 社区 UGC：本人帖子/评论/举报/审核已匿名化，他人内容不动
  const post1 = JSON.parse((await h.authKv.get('community:post:post-1'))!);
  const post2 = JSON.parse((await h.authKv.get('community:post:post-2'))!);
  assert.equal(post1.authorId, 'deleted-user');
  assert.equal(post2.authorId, OTHER, '他人帖子作者不变');
  const cmt1 = JSON.parse((await h.authKv.get('community:comment:cmt-1'))!);
  const cmt2 = JSON.parse((await h.authKv.get('community:comment:cmt-2'))!);
  assert.equal(cmt1.authorId, 'deleted-user');
  assert.equal(cmt2.authorId, OTHER, '他人评论作者不变');
  const rep1 = JSON.parse((await h.authKv.get('community:report:rep-1'))!);
  assert.equal(rep1.reporterId, 'deleted-user');
  const rev1 = JSON.parse((await h.authKv.get('community:review:rev-1'))!);
  const rev2 = JSON.parse((await h.authKv.get('community:review:rev-2'))!);
  assert.equal(rev1.reviewerId, 'deleted-user');
  assert.equal(rev2.reviewerId, OTHER, '他人审核记录不变');

  // 订单表：本人行保留但脱敏，他人行不动；行数不变
  const aliceOrders = h.d1Rows.filter((r) => r.user_id === EMAIL);
  const bobOrders = h.d1Rows.filter((r) => r.user_id === OTHER);
  assert.equal(aliceOrders.length, 0, '本人 user_id 全部脱敏');
  assert.equal(h.d1Rows.length, 3, '订单行数不变（保留策略）');
  const anonRows = h.d1Rows.filter((r) => r.user_id.startsWith('deleted:'));
  assert.equal(anonRows.length, 2, '本人 2 行订单已脱敏保留');
  assert.equal(bobOrders.length, 1, '他人订单不受影响');
  assert.equal(h.d1Rows.find((r) => r.id === 'o1')!.status, 'completed');

  // 删除回执
  assert.ok(await h.authKv.get(`deletion_receipt:${EMAIL}`));

  // ── 幂等重试：返回 alreadyDeleted ──
  const retry = await deleteEndpoint(endpointCtx(post({ password: PASSWORD }), token), h);
  assert.equal(retry.status, 200);
  const retryBody = await retry.json();
  assert.equal(retryBody.success, true);
  assert.equal(retryBody.alreadyDeleted, true);
  assert.ok(retryBody.receiptId);
});

test('purgeUserData 直接调用：重复调用返回 alreadyDeleted', async () => {
  const h = await buildHarness();
  const first = await purgeUserData(makeEnv(h), EMAIL);
  assert.equal(first.ok, true);
  assert.equal(first.alreadyDeleted, undefined);
  assert.ok(first.receipt);

  const second = await purgeUserData(makeEnv(h), EMAIL);
  assert.equal(second.ok, true);
  assert.equal(second.alreadyDeleted, true);
});

test('不存在的用户：删除同样成功（幂等语义）', async () => {
  const h = await buildHarness();
  const res = await purgeUserData(makeEnv(h), 'nobody@example.com');
  assert.equal(res.ok, true);
  assert.equal(res.errors.length, 0);
  assert.ok(res.receipt);
});
