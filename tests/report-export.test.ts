// 报告导出闸门验收：未登录 401 / 超限 429 / 类型非法 400 / 正常 200
import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { onRequestPost } from '../functions/api/v1/report/export';

const SECRET = 'test-secret';

const kv = new Map<string, string>();
const env = {
  AUTH_SECRET: SECRET,
  GEO_CACHE: {
    async get(k: string) {
      return kv.get(k) ?? null;
    },
    async put(k: string, v: string) {
      kv.set(k, v);
    },
  },
};

function sign(sub: string): string {
  const b64 = (buf: Buffer) => Buffer.from(buf).toString('base64url');
  const head = b64(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payload = b64(
    Buffer.from(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 600 })),
  );
  const sig = crypto.createHmac('sha256', SECRET).update(`${head}.${payload}`).digest('base64url');
  return `${head}.${payload}.${sig}`;
}

function req(body: unknown, token?: string): Request {
  return new Request('https://example.com/api/v1/report/export', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify(body),
  });
}

async function call(body: unknown, token?: string): Promise<Response> {
  return onRequestPost({
    request: req(body, token),
    env: env as never,
  } as never);
}

test('未登录（无 Authorization）→ 401', async () => {
  const res = await call({ type: 'liunian' });
  assert.equal(res.status, 401);
  assert.equal((await res.json()).error, 'unauthorized');
});

test('登录 + 非法报告类型 → 400', async () => {
  const res = await call({ type: 'nope' }, sign('user-1'));
  assert.equal(res.status, 400);
  assert.equal((await res.json()).error, 'bad_report_type');
});

test('登录 + 合法类型 → 200', async () => {
  const res = await call({ type: 'hehun' }, sign('user-1'));
  assert.equal(res.status, 200);
  assert.equal((await res.json()).type, 'hehun');
});

test('限流：同用户超过 10 次/分钟 → 429', async () => {
  const sub = 'user-rl';
  for (let i = 0; i < 10; i++) {
    const res = await call({ type: 'naming' }, sign(sub));
    assert.equal(res.status, 200, `第 ${i + 1} 次应放行`);
  }
  const blocked = await call({ type: 'naming' }, sign(sub));
  assert.equal(blocked.status, 429);
  assert.equal((await blocked.json()).error, 'rate_limit_exceeded');
});
