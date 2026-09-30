/**
 * errlog 端点单测（T16）：覆盖 fail-closed 鉴权、落库、5 分钟聚合、阈值告警（webhook / pending 回落）。
 * 运行：pnpm test:errlog   （= tsx --test tests/errlog.test.ts）
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { onRequest, logError } from '../functions/api/v1/errlog';

// ---- 内存 KV mock（匹配 ErrlogKV 接口） ----
class MemKV {
  private m = new Map<string, string>();
  async get(k: string) {
    return this.m.get(k) ?? null;
  }
  async put(k: string, v: string) {
    this.m.set(k, v);
  }
  async delete(k: string) {
    this.m.delete(k);
  }
  async list(opts?: { prefix?: string }) {
    const prefix = opts?.prefix ?? '';
    const keys = [...this.m.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name }));
    return { keys, list_complete: true as const };
  }
  keysStartingWith(prefix: string) {
    return [...this.m.keys()].filter((k) => k.startsWith(prefix));
  }
}

function env(over: Record<string, unknown> = {}) {
  const kv = new MemKV();
  return { kv, env: { ERRLOG_KV: kv, ...over } as any };
}

function postErr(kv: MemKV, token: string, body: Record<string, unknown>) {
  const req = new Request('https://x/api/v1/errlog', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-errlog-token': token },
    body: JSON.stringify(body),
  });
  return { req, kv };
}

const INGEST = 'ingest-token';
const ADMIN = 'admin-token';

test('未配置 ERRLOG_INGEST_TOKEN → 503 (fail-closed)', async () => {
  const { kv, env: e } = env({ ERRLOG_INGEST_TOKEN: '' });
  const { req } = postErr(kv, INGEST, { level: 'error', scope: 't', message: 'm' });
  const res = await onRequest({ request: req, env: e });
  assert.equal(res.status, 503);
});

test('错误令牌 → 401', async () => {
  const { kv, env: e } = env({ ERRLOG_INGEST_TOKEN: INGEST });
  const { req } = postErr(kv, 'wrong', { level: 'error', scope: 't', message: 'm' });
  const res = await onRequest({ request: req, env: e });
  assert.equal(res.status, 401);
});

test('合法写入 → 200 且落库 err:*', async () => {
  const { kv, env: e } = env({ ERRLOG_INGEST_TOKEN: INGEST });
  const { req } = postErr(kv, INGEST, { level: 'error', scope: 'api/x', message: 'boom' });
  const res = await onRequest({ request: req, env: e });
  assert.equal(res.status, 200);
  assert.ok(kv.keysStartingWith('err:').length >= 1);
});

test('5 分钟聚合：error 达到阈值 3 → 未配 webhook 写 pending', async () => {
  const { kv, env: e } = env({ ERRLOG_INGEST_TOKEN: INGEST });
  for (let i = 0; i < 3; i++) {
    const { req } = postErr(kv, INGEST, { level: 'error', scope: 'api/checkout', message: 'db down' });
    await onRequest({ request: req, env: e });
  }
  const agg = await Promise.all(
    kv.keysStartingWith('agg:').map(async (k) => JSON.parse(await kv.get(k)!)),
  );
  assert.equal(agg.length, 1);
  assert.equal(agg[0].count, 3);
  assert.ok(kv.keysStartingWith('pending:').length >= 1, '应写 pending 待告警');
});

test('阈值超 3 仍只告警一次（alerted 去重）', async () => {
  let calls = 0;
  const origFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    calls++;
    return new Response('ok');
  }) as any;
  try {
    const { kv, env: e } = env({ ERRLOG_INGEST_TOKEN: INGEST, ALERT_WEBHOOK: 'https://hook' });
    for (let i = 0; i < 5; i++) {
      const { req } = postErr(kv, INGEST, { level: 'fatal', scope: 'api/report-task', message: 'gen fail' });
      await onRequest({ request: req, env: e });
    }
    assert.equal(calls, 1, '同窗口只触发一次 webhook');
  } finally {
    globalThis.fetch = origFetch;
  }
});

test('GET 聚合需 admin 令牌（未配 → 503 / 错令牌 → 401 / 正确 → 200）', async () => {
  // 未配 admin 令牌 → 503（fail-closed）
  const { kv: kv0, env: e0 } = env({ ERRLOG_ADMIN_TOKEN: '' });
  const noAdmin = new Request('https://x/api/v1/errlog', { method: 'GET' });
  assert.equal((await onRequest({ request: noAdmin, env: e0 })).status, 503);

  // 配了 admin 令牌
  const { kv, env: e } = env({ ERRLOG_ADMIN_TOKEN: ADMIN });
  // 先写一条
  const { req: pr } = postErr(kv, INGEST, { level: 'error', scope: 's', message: 'm' });
  await onRequest({ request: pr, env: { ...e, ERRLOG_INGEST_TOKEN: INGEST } });

  const badToken = new Request('https://x/api/v1/errlog', {
    method: 'GET',
    headers: { 'x-errlog-token': 'nope' },
  });
  assert.equal((await onRequest({ request: badToken, env: e })).status, 401);

  const ok = new Request('https://x/api/v1/errlog', {
    method: 'GET',
    headers: { 'x-errlog-token': ADMIN },
  });
  const res = await onRequest({ request: ok, env: e });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.aggregations));
});

test('logError（middleware 复用）写入并聚合', async () => {
  const { kv, env: e } = env({ ERRLOG_INGEST_TOKEN: INGEST });
  for (let i = 0; i < 3; i++) {
    await logError(e, { level: 'error', scope: '/api/v1/checkout', message: '500 from handler' });
  }
  assert.ok(kv.keysStartingWith('agg:').length >= 1);
  assert.ok(kv.keysStartingWith('err:').length >= 3);
});

test('非 error/fatal 级不计入告警聚合', async () => {
  const { kv, env: e } = env({ ERRLOG_INGEST_TOKEN: INGEST });
  for (let i = 0; i < 5; i++) {
    const { req } = postErr(kv, INGEST, { level: 'warn', scope: 'api/x', message: 'slow' });
    await onRequest({ request: req, env: e });
  }
  assert.equal(kv.keysStartingWith('agg:').length, 0, 'warn 不建聚合桶');
});
