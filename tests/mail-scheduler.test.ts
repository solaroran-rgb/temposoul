/**
 * 邮件五流调度器测试
 * 覆盖：五流入队 / mock 发送 / 指数退避重试 / 重试上限 / 频控顺延 /
 *       退订过滤（营销拦、事务放行）/ 幂等去重 / 重启恢复 / 租约回收 / dispatch 鉴权
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { drainDue, enqueueMail, retryDelayMs, LEASE_MS } from '../src/lib/server/mail/scheduler';
import { MAIL_FLOW_IDS, renderMail } from '../src/lib/server/mail/flows';
import { JOB_KEY_PREFIX, decodeJob, jobKey } from '../src/lib/server/mail/store';
import { onRequest as dispatchRequest } from '../functions/api/v1/mail/dispatch';
import { onRequest as unsubscribeRequest } from '../functions/api/v1/newsletter/unsubscribe';
import { onRequest as authRequest } from '../functions/api/auth/[[path]]';
import type { MailFlowId } from '../src/lib/server/mail/types';

// ── 内存 KV 桩（模拟 Cloudflare KV：get/put/delete/list + expirationTtl）──
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
      store.set(key, {
        v: value,
        exp: opts?.expirationTtl ? Date.now() + opts.expirationTtl * 1000 : undefined,
      });
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

/** 把内存 KV 伪装成全局 KVNamespace（Pages Functions 的类型面） */
function asKV(kv: MemoryKV): KVNamespace {
  return kv as unknown as KVNamespace;
}

function makeEnv(opts: { queueKv?: MemoryKV; subKv?: MemoryKV; resend?: boolean } = {}) {
  const env: Record<string, unknown> = {};
  if (opts.queueKv) env.MAIL_QUEUE_KV = asKV(opts.queueKv);
  if (opts.subKv) env.newsletter_emails = asKV(opts.subKv);
  if (opts.resend) {
    env.RESEND_API_KEY = 're_test_key';
    env.MAIL_FROM = 'TempoSoul <noreply@example.com>';
  }
  return env as Parameters<typeof enqueueMail>[0];
}

const FLOW_PAYLOAD: Record<MailFlowId, Record<string, unknown>> = {
  newsletter_confirm: { confirmUrl: 'https://x.test/confirm?token=abc' },
  register_welcome: { nickname: '小林', homeUrl: 'https://x.test/' },
  otp_code: { code: '482913', ttlMinutes: '10' },
  password_reset: { resetUrl: 'https://x.test/reset?t=abc' },
  report_delivery: { reportUrl: 'https://x.test/report/1' },
};

/** 让 provider 失败：临时把 fetch 换成恒 500 */
async function withFailingFetch<T>(fn: () => Promise<T>): Promise<T> {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => new Response('boom', { status: 500 })) as typeof fetch;
  try {
    return await fn();
  } finally {
    globalThis.fetch = original;
  }
}

// ── 1. 五流入队 ──
test('五流均能按触发条件入队（pending 落库）', async () => {
  const { kv, store } = createMemoryKV();
  const env = makeEnv({ queueKv: kv });

  for (const flow of MAIL_FLOW_IDS) {
    const r = await enqueueMail(env, {
      flow,
      to: 'Lover@Example.com',
      payload: FLOW_PAYLOAD[flow],
      dedupeKey: `t1:${flow}`,
    });
    assert.equal(r.ok, true, `${flow} 入队失败`);
  }
  // 收件邮箱归一化
  const jobs = [...store.keys()].filter((k) => k.startsWith(JOB_KEY_PREFIX));
  assert.equal(jobs.length, MAIL_FLOW_IDS.length);
  const first = decodeJob(store.get(jobs[0] as string)?.v);
  assert.ok(first);
  assert.equal(first?.to, 'lover@example.com');
  assert.equal(first?.status, 'pending');
});

test('入队参数校验：非法流 / 非法收件人被拒', async () => {
  const { kv } = createMemoryKV();
  const env = makeEnv({ queueKv: kv });
  const badFlow = await enqueueMail(env, { flow: 'no_such_flow' as MailFlowId, to: 'a@b.com' });
  assert.deepEqual(badFlow, { ok: false, reason: 'invalid_flow' });
  const badTo = await enqueueMail(env, { flow: 'otp_code', to: 'not-an-email' });
  assert.deepEqual(badTo, { ok: false, reason: 'invalid_recipient' });
});

test('无 KV 绑定时入队返回 queue_unavailable（调用方回退直发，不静默丢信）', async () => {
  const r = await enqueueMail(makeEnv(), { flow: 'otp_code', to: 'a@b.com' });
  assert.deepEqual(r, { ok: false, reason: 'queue_unavailable' });
  const drained = await drainDue(makeEnv());
  assert.equal(drained.processed, 0);
});

// ── 2. mock 模式发送 ──
test('mock 模式：drain 后任务置 sent（未配 RESEND 时走日志通道）', async () => {
  const { kv } = createMemoryKV();
  const env = makeEnv({ queueKv: kv });
  await enqueueMail(env, { flow: 'register_welcome', to: 'a@b.com', payload: { nickname: '小林' } });

  const result = await drainDue(env);
  assert.equal(result.sent, 1);
  assert.equal(result.processed, 1);
  assert.equal(result.failed, 0);

  // 二次 drain 幂等：终态不重发
  const again = await drainDue(env);
  assert.equal(again.sent, 0);
  assert.equal(again.processed, 0);
});

test('模板渲染：五流均产出 subject/html/text，既有两流文案未被改写', async () => {
  for (const flow of MAIL_FLOW_IDS) {
    const mail = renderMail(flow, 'a@b.com', FLOW_PAYLOAD[flow], {});
    assert.ok(mail.subject.length > 0, `${flow} 缺 subject`);
    assert.ok(mail.html.includes('<div'), `${flow} 缺 HTML 外壳`);
    assert.ok(mail.text.length > 0, `${flow} 缺 text`);
    if (flow !== 'otp_code') {
      // 带链接的四流必须把 URL 渲染进正文（html 与 text 双通道）
      const url = String(
        FLOW_PAYLOAD[flow].confirmUrl ??
          FLOW_PAYLOAD[flow].homeUrl ??
          FLOW_PAYLOAD[flow].resetUrl ??
          FLOW_PAYLOAD[flow].reportUrl,
      );
      assert.ok(mail.html.includes(url), `${flow} html 未渲染 URL`);
      assert.ok(mail.text.includes(url), `${flow} text 未渲染 URL`);
    }
  }
  const confirm = renderMail('newsletter_confirm', 'a@b.com', FLOW_PAYLOAD.newsletter_confirm, {});
  assert.equal(confirm.subject, '[TempoSoul] 请确认订阅 / Confirm your subscription');
  const report = renderMail('report_delivery', 'a@b.com', FLOW_PAYLOAD.report_delivery, {});
  assert.equal(report.subject, '您的命律十维深度报告已生成');
});

// ── 3. 重试与退避 ──
test('指数退避：间隔随尝试次数翻倍且有上限', () => {
  const d1 = retryDelayMs(1);
  const d2 = retryDelayMs(2);
  const d3 = retryDelayMs(3);
  assert.ok(Math.abs(d1 - 30_000) <= 6_000, `d1=${d1}`);
  assert.ok(d2 > d1 * 1.4, `d2=${d2} 未翻倍`);
  assert.ok(d3 > d2 * 1.4, `d3=${d3} 未翻倍`);
  assert.ok(retryDelayMs(30) <= 6 * 60 * 60 * 1000 * 1.2, '退避未封顶');
});

test('发送失败：顺延重试，达到上限后转 failed', async () => {
  const { kv } = createMemoryKV();
  // 配 RESEND → 真实通道；fetch 恒 500 → 发送失败
  const env = makeEnv({ queueKv: kv, resend: true });
  await enqueueMail(env, {
    flow: 'password_reset',
    to: 'a@b.com',
    payload: FLOW_PAYLOAD.password_reset,
    maxAttempts: 2,
  });

  const r1 = await withFailingFetch(() => drainDue(env));
  assert.equal(r1.retried, 1);
  assert.equal(r1.sent, 0);

  // 时间推进 1 小时，越过退避窗口（30s 级）
  const later = Date.now() + 60 * 60 * 1000;
  const r2 = await withFailingFetch(() => drainDue(env, { now: later }));
  assert.equal(r2.failed, 1, '达到最大重试次数应转 failed');
  assert.equal(r2.retried, 0);
});

test('重试成功：第二次 drain 发送成功', async () => {
  const { kv } = createMemoryKV();
  const env = makeEnv({ queueKv: kv, resend: true });
  await enqueueMail(env, {
    flow: 'otp_code',
    to: 'a@b.com',
    payload: FLOW_PAYLOAD.otp_code,
    maxAttempts: 3,
  });

  const r1 = await withFailingFetch(() => drainDue(env));
  assert.equal(r1.retried, 1);

  // 真实通道恢复：fetch 返回 200
  const original = globalThis.fetch;
  globalThis.fetch = (async () => new Response('{}', { status: 200 })) as typeof fetch;
  try {
    const r2 = await drainDue(env, { now: Date.now() + 60 * 60 * 1000 });
    assert.equal(r2.sent, 1);
  } finally {
    globalThis.fetch = original;
  }
});

// ── 4. 频控 ──
test('频控：超出窗口额度时顺延到下一窗口，不消耗重试次数', async () => {
  const { kv } = createMemoryKV();
  const env = makeEnv({ queueKv: kv });
  // otp_code：10 分钟 5 封
  for (let i = 0; i < 6; i++) {
    await enqueueMail(env, { flow: 'otp_code', to: 'a@b.com', payload: FLOW_PAYLOAD.otp_code });
  }
  const r = await drainDue(env, { maxTasks: 20 });
  assert.equal(r.sent, 5, '窗口内应只发 5 封');
  assert.equal(r.skippedRateLimited, 1);

  // 推进到下一窗口（>10min）后剩下那封应被发出
  const later = Date.now() + 11 * 60 * 1000;
  const r2 = await drainDue(env, { now: later, maxTasks: 20 });
  assert.equal(r2.sent, 1);
});

// ── 5. 退订过滤 ──
test('退订过滤：营销流被取消，事务流不受营销退订影响', async () => {
  const { kv: queueKv } = createMemoryKV();
  const { kv: subKv } = createMemoryKV();
  const env = makeEnv({ queueKv, subKv });

  // 走真实退订端点，确保与线上同一份数据口径
  const unsubRes = await unsubscribeRequest({
    request: new Request('https://x.test/api/v1/newsletter/unsubscribe', {
      method: 'POST',
      body: JSON.stringify({ email: 'a@b.com' }),
    }),
    env: { newsletter_emails: asKV(subKv) } as never,
  });
  assert.equal(unsubRes.status, 200);
  // 端点对未知邮箱幂等返回，这里手动落一条 unsubscribe 态记录
  await subKv.put(
    'email:a@b.com',
    JSON.stringify({ email: 'a@b.com', status: 'unsubscribed', subscribed: false }),
  );

  await enqueueMail(env, { flow: 'register_welcome', to: 'a@b.com', payload: { nickname: 'x' } });
  await enqueueMail(env, { flow: 'otp_code', to: 'a@b.com', payload: FLOW_PAYLOAD.otp_code });

  const r = await drainDue(env, { maxTasks: 10 });
  assert.equal(r.skippedUnsubscribed, 1, '营销流应被退订拦截');
  assert.equal(r.cancelled, 1);
  assert.equal(r.sent, 1, '事务流应正常发送');
});

// ── 6. 幂等去重 ──
test('幂等：同 dedupeKey 重复入队只保留一条待发任务', async () => {
  const { kv } = createMemoryKV();
  const env = makeEnv({ queueKv: kv });
  const a = await enqueueMail(env, { flow: 'report_delivery', to: 'a@b.com', dedupeKey: 'task-1' });
  const b = await enqueueMail(env, { flow: 'report_delivery', to: 'a@b.com', dedupeKey: 'task-1' });
  assert.ok(a.ok && b.ok);
  assert.equal(b.ok ? b.deduped : false, true);
  assert.equal(a.ok ? a.jobId : '', b.ok ? b.jobId : 'x');
});

// ── 7. 重启恢复 & 租约回收 ──
test('重启恢复：未发送任务在新建 env（同一 KV）后仍可发出', async () => {
  const { kv, store } = createMemoryKV();
  await enqueueMail(makeEnv({ queueKv: kv }), {
    flow: 'register_welcome',
    to: 'a@b.com',
    payload: { nickname: 'x' },
  });
  // 模拟进程重启：丢弃旧 env，用同一份 KV 重新构造
  assert.ok([...store.keys()].some((k) => k.startsWith(JOB_KEY_PREFIX)));
  const revived = await drainDue(makeEnv({ queueKv: kv }));
  assert.equal(revived.sent, 1, '重启后未发任务不应丢失');
});

test('租约回收：processing 且租约过期的任务被 reclaim 并重投', async () => {
  const { kv, store } = createMemoryKV();
  const env = makeEnv({ queueKv: kv });
  const now = Date.now();
  const stuck = {
    id: 'stuck-1',
    flow: 'report_delivery',
    to: 'a@b.com',
    payload: { reportUrl: 'https://x.test/r' },
    status: 'processing',
    attempts: 1,
    maxAttempts: 3,
    notBefore: now - 1000,
    leaseUntil: now - LEASE_MS - 1,
    createdAt: now - 5000,
    updatedAt: now - 5000,
  };
  await kv.put(jobKey('stuck-1'), JSON.stringify(stuck));
  const r = await drainDue(env, { now });
  assert.equal(r.reclaimed, 1);
  assert.equal(r.sent, 1);
  const after = decodeJob(store.get(jobKey('stuck-1'))?.v);
  assert.equal(after?.status, 'sent');
});

// ── 8. dispatch 端点鉴权 ──
test('dispatch：未配 token→503，错 token→401，正确 token→200', async () => {
  const { kv } = createMemoryKV();
  const env = { MAIL_QUEUE_KV: asKV(kv) } as never;

  const noToken = await dispatchRequest({
    request: new Request('https://x.test/api/v1/mail/dispatch', { method: 'POST' }),
    env,
  });
  assert.equal(noToken.status, 503);

  const envWithToken = { MAIL_QUEUE_KV: asKV(kv), MAIL_DISPATCH_TOKEN: 's3cret' } as never;
  const bad = await dispatchRequest({
    request: new Request('https://x.test/api/v1/mail/dispatch', {
      method: 'POST',
      headers: { 'x-dispatch-token': 'wrong' },
    }),
    env: envWithToken,
  });
  assert.equal(bad.status, 401);

  await enqueueMail({ MAIL_QUEUE_KV: asKV(kv) } as never, {
    flow: 'otp_code',
    to: 'a@b.com',
    payload: FLOW_PAYLOAD.otp_code,
  });
  const ok = await dispatchRequest({
    request: new Request('https://x.test/api/v1/mail/dispatch', {
      method: 'POST',
      headers: { 'x-dispatch-token': 's3cret' },
    }),
    env: envWithToken,
  });
  assert.equal(ok.status, 200);
  const body = (await ok.json()) as { ok: boolean; sent: number };
  assert.equal(body.ok, true);
  assert.equal(body.sent, 1);
});

// ── 9. otp_code / password_reset 两流接入（T17）──
test('otp_code / password_reset 入队→drain 发送（事务流不受退订影响）且幂等去重', async () => {
  const { kv } = createMemoryKV();
  const env = makeEnv({ queueKv: kv });
  await enqueueMail(env, { flow: 'otp_code', to: 'a@b.com', payload: FLOW_PAYLOAD.otp_code });
  await enqueueMail(env, { flow: 'password_reset', to: 'b@b.com', payload: FLOW_PAYLOAD.password_reset });
  const r = await drainDue(env, { maxTasks: 10 });
  assert.equal(r.sent, 2, '两事务流均应发送');

  // 幂等：同 dedupeKey 重复入队只保留一条待发任务
  const d1 = await enqueueMail(env, { flow: 'otp_code', to: 'a@b.com', payload: FLOW_PAYLOAD.otp_code, dedupeKey: 'otp-k1' });
  const d2 = await enqueueMail(env, { flow: 'otp_code', to: 'a@b.com', payload: FLOW_PAYLOAD.otp_code, dedupeKey: 'otp-k1' });
  assert.ok(d1.ok && d2.ok);
  assert.equal(d2.ok ? d2.deduped : false, true, '同幂等键应去重');
});

test('端点 /api/auth/otp：存在账户 → 入队 otp_code 并立即 drain 发送，验证码写入 AUTH_KV', async () => {
  const { kv: queueKv, store } = createMemoryKV();
  const { kv: authKv } = createMemoryKV();
  await authKv.put('user:a@b.com', JSON.stringify({ email: 'a@b.com', nickname: 'x', salt: 's', pwHash: 'h' }));
  const env = { AUTH_KV: asKV(authKv), AUTH_SECRET: 'sec', MAIL_QUEUE_KV: asKV(queueKv) } as never;
  const res = await authRequest({
    request: new Request('https://x.test/api/auth/otp', { method: 'POST', body: JSON.stringify({ email: 'a@b.com' }) }),
    env,
  });
  assert.equal(res.status, 200);
  const jobs = [...store.keys()].filter((k) => k.startsWith(JOB_KEY_PREFIX));
  assert.equal(jobs.length, 1, '应入队一封 otp_code');
  const job = decodeJob(store.get(jobs[0] as string)?.v);
  assert.equal(job?.flow, 'otp_code');
  assert.equal(job?.status, 'sent', '端点内立即 drain 应已发出');
  assert.ok(await authKv.get('otp:a@b.com'), '验证码应写入 AUTH_KV');
});

test('端点 /api/auth/forgot：存在账户 → 入队 password_reset 并落重置 token，resetUrl 渲染进正文', async () => {
  const { kv: queueKv, store } = createMemoryKV();
  const { kv: authKv } = createMemoryKV();
  await authKv.put('user:a@b.com', JSON.stringify({ email: 'a@b.com', nickname: 'x', salt: 's', pwHash: 'h' }));
  const env = { AUTH_KV: asKV(authKv), AUTH_SECRET: 'sec', MAIL_QUEUE_KV: asKV(queueKv) } as never;
  const res = await authRequest({
    request: new Request('https://x.test/api/auth/forgot', { method: 'POST', body: JSON.stringify({ email: 'a@b.com' }) }),
    env,
  });
  assert.equal(res.status, 200);
  const jobs = [...store.keys()].filter((k) => k.startsWith(JOB_KEY_PREFIX));
  assert.equal(jobs.length, 1);
  const job = decodeJob(store.get(jobs[0] as string)?.v);
  assert.equal(job?.flow, 'password_reset');
  assert.equal(job?.status, 'sent');
  const tokenList = await authKv.list({ prefix: 'pwreset:' });
  assert.equal(tokenList.keys.length, 1, '重置 token 应写入 AUTH_KV');
});

test('端点 /api/auth/otp：不存在账户亦返回 200 且不入队（防邮箱枚举）', async () => {
  const { kv: queueKv, store } = createMemoryKV();
  const { kv: authKv } = createMemoryKV();
  const env = { AUTH_KV: asKV(authKv), AUTH_SECRET: 'sec', MAIL_QUEUE_KV: asKV(queueKv) } as never;
  const res = await authRequest({
    request: new Request('https://x.test/api/auth/otp', { method: 'POST', body: JSON.stringify({ email: 'nobody@b.com' }) }),
    env,
  });
  assert.equal(res.status, 200);
  const jobs = [...store.keys()].filter((k) => k.startsWith(JOB_KEY_PREFIX));
  assert.equal(jobs.length, 0, '不存在账户不应入队');
});

test('端点 /api/auth/otp：队列不可用时回退直发路径不抛错（mock 未配 RESEND 静默 no-op）', async () => {
  const { kv: authKv } = createMemoryKV();
  await authKv.put('user:a@b.com', JSON.stringify({ email: 'a@b.com', nickname: 'x', salt: 's', pwHash: 'h' }));
  // 仅绑 AUTH_KV / AUTH_SECRET，不绑 MAIL_QUEUE_KV → enqueueMail 返回 queue_unavailable → 回退直发
  const env = { AUTH_KV: asKV(authKv), AUTH_SECRET: 'sec' } as never;
  const res = await authRequest({
    request: new Request('https://x.test/api/auth/otp', { method: 'POST', body: JSON.stringify({ email: 'a@b.com' }) }),
    env,
  });
  assert.equal(res.status, 200);
});

