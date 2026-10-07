/**
 * readIdentity 时间声明校验 + readIdentityWithSession 会话双查测试（批次2 任务7）
 *
 * 覆盖：
 *  - 合法令牌通过（毫秒 exp，与登录端 signJwt 实测单位一致）
 *  - exp 过期 → expired_token；exp 缺失 → invalid_token: missing_exp
 *  - iat 未来 → invalid_iat；iat 缺失 → 通过（向后兼容）；iat>exp 畸形 → invalid_iat
 *  - nbf 未来 → not_yet_valid；nbf 在 60s 偏斜内 → 通过
 *  - 签名错 → invalid_signature
 *  - session 键缺失 → session_revoked；session 值不匹配 → session_revoked
 *  - 未传 kv / 无 sid → 跳过会话双查（向后兼容）
 *  - exp 秒级单位自动识别（toEpochMs 固化）
 *
 * 测试侧 signJwt 只读复刻 functions/api/auth/[[path]].ts 的 HMAC-SHA256 实现（不修改原文件）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  readIdentity,
  readIdentityWithSession,
  toEpochMs,
  CLOCK_SKEW_MS,
  type SessionKV,
} from '../src/lib/server/auth';

const SECRET = 'sec_batch2_task7';

// ── 测试侧 HMAC-SHA256 JWT 签发（与登录端 signJwt 同构，只读复刻）──
function b64urlEncode(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function signJwtTest(payload: Record<string, unknown>, secret: string): Promise<string> {
  const header = b64urlEncode(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const body = b64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const data = `${header}.${body}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${b64urlEncode(new Uint8Array(sig))}`;
}

/** 内存 KV 桩：仅 get，满足 SessionKV 结构 */
function createKV(initial: Record<string, string> = {}): { store: Map<string, string>; kv: SessionKV } {
  const store = new Map(Object.entries(initial));
  return {
    store,
    kv: { async get(key: string) { return store.has(key) ? (store.get(key) as string) : null; } },
  };
}

const FUTURE = () => Date.now() + 3_600_000; // 1h 后（毫秒，与登录端一致）

// ── 1. 合法令牌通过 ──
test('合法令牌（毫秒 exp + sid + sub）通过；会话 KV 匹配则双查通过', async () => {
  const token = await signJwtTest(
    { sub: 'u@x.com', sid: 'sid1', exp: FUTURE(), email: 'u@x.com' },
    SECRET,
  );
  const id = await readIdentity(token, SECRET);
  assert.equal(id.sub, 'u@x.com');
  assert.equal(id.sid, 'sid1');

  const { kv } = createKV({ 'session:sid1': 'u@x.com' });
  const id2 = await readIdentityWithSession(token, SECRET, kv);
  assert.equal(id2.sub, 'u@x.com');
});

// ── 2. exp 过期 → expired_token ──
test('exp 已过期 → 拒绝 expired_token', async () => {
  const token = await signJwtTest({ sub: 'u@x.com', exp: Date.now() - 1000 }, SECRET);
  await assert.rejects(readIdentity(token, SECRET), /expired_token/);
});

// ── 3. exp 缺失 → invalid_token: missing_exp ──
test('exp 缺失 → 拒绝 invalid_token: missing_exp', async () => {
  const token = await signJwtTest({ sub: 'u@x.com', sid: 's1' }, SECRET);
  await assert.rejects(readIdentity(token, SECRET), /invalid_token: missing_exp/);
});

// ── 4. iat 未来（>now+60s）→ invalid_iat ──
test('iat 远在未来 → 拒绝 invalid_iat', async () => {
  const token = await signJwtTest(
    { sub: 'u@x.com', exp: FUTURE(), iat: Date.now() + 600_000 },
    SECRET,
  );
  await assert.rejects(readIdentity(token, SECRET), /invalid_iat/);
});

// ── 5. iat 缺失 → 通过（向后兼容；登录端当前不发 iat）──
test('iat 缺失 → 通过（向后兼容）', async () => {
  const token = await signJwtTest({ sub: 'u@x.com', sid: 's1', exp: FUTURE() }, SECRET);
  const id = await readIdentity(token, SECRET);
  assert.equal(id.sub, 'u@x.com');
});

// ── 5b. iat 在 60s 偏斜内（未来 30s）→ 通过 ──
test('iat 在 60s 时钟偏斜内（未来 30s）→ 通过', async () => {
  const token = await signJwtTest(
    { sub: 'u@x.com', exp: FUTURE(), iat: Date.now() + 30_000 },
    SECRET,
  );
  const id = await readIdentity(token, SECRET);
  assert.equal(id.sub, 'u@x.com');
});

// ── 5c. iat > exp（畸形）→ invalid_iat ──
test('iat 晚于 exp（畸形令牌）→ 拒绝 invalid_iat', async () => {
  const token = await signJwtTest(
    { sub: 'u@x.com', exp: FUTURE(), iat: FUTURE() + 60_000 },
    SECRET,
  );
  await assert.rejects(readIdentity(token, SECRET), /invalid_iat/);
});

// ── 6. nbf 远在未来 → not_yet_valid ──
test('nbf 远在未来（>now+60s）→ 拒绝 not_yet_valid', async () => {
  const token = await signJwtTest(
    { sub: 'u@x.com', exp: FUTURE(), nbf: Date.now() + 600_000 },
    SECRET,
  );
  await assert.rejects(readIdentity(token, SECRET), /not_yet_valid/);
});

// ── 6b. nbf 在 60s 偏斜内 → 通过 ──
test('nbf 在 60s 偏斜内（未来 30s）→ 通过', async () => {
  const token = await signJwtTest(
    { sub: 'u@x.com', exp: FUTURE(), nbf: Date.now() + 30_000 },
    SECRET,
  );
  const id = await readIdentity(token, SECRET);
  assert.equal(id.sub, 'u@x.com');
});

// ── 7. 签名错 → invalid_signature ──
test('签名被篡改 → 拒绝 invalid_signature', async () => {
  const token = await signJwtTest({ sub: 'u@x.com', exp: FUTURE() }, SECRET);
  const tampered = token.slice(0, -4) + 'aaaa';
  await assert.rejects(readIdentity(tampered, SECRET), /invalid_signature/);
  // 错误密钥同样拒
  await assert.rejects(readIdentity(token, 'wrong-secret'), /invalid_signature/);
});

// ── 8. session 键缺失 → session_revoked ──
test('会话双查：session:<sid> 键不存在 → 拒绝 session_revoked', async () => {
  const token = await signJwtTest(
    { sub: 'u@x.com', sid: 'sid-gone', exp: FUTURE() },
    SECRET,
  );
  const { kv } = createKV({}); // 空 KV，无 session:sid-gone
  await assert.rejects(readIdentityWithSession(token, SECRET, kv), /session_revoked/);
});

// ── 9. session 值不匹配 → session_revoked ──
test('会话双查：session:<sid> 值 ≠ sub → 拒绝 session_revoked', async () => {
  const token = await signJwtTest(
    { sub: 'u@x.com', sid: 'sid-x', exp: FUTURE() },
    SECRET,
  );
  const { kv } = createKV({ 'session:sid-x': 'someone-else@x.com' });
  await assert.rejects(readIdentityWithSession(token, SECRET, kv), /session_revoked/);
});

// ── 10. 未传 kv → 跳过会话双查（向后兼容）──
test('未传 kv → 跳过会话双查，合法令牌仍通过', async () => {
  const token = await signJwtTest(
    { sub: 'u@x.com', sid: 'sid-nokv', exp: FUTURE() },
    SECRET,
  );
  const id = await readIdentityWithSession(token, SECRET, undefined);
  assert.equal(id.sub, 'u@x.com');
});

// ── 11. 无 sid 的合法令牌 → 跳过会话双查（向后兼容）──
test('payload 无 sid → 跳过会话双查，合法令牌仍通过', async () => {
  const token = await signJwtTest({ sub: 'u@x.com', exp: FUTURE() }, SECRET);
  const { kv } = createKV({});
  const id = await readIdentityWithSession(token, SECRET, kv);
  assert.equal(id.sub, 'u@x.com');
});

// ── 12. exp 单位固化：登录端为毫秒；秒级自动识别兼容 ──
test('toEpochMs：秒级 ×1000，毫秒级原样；登录端毫秒 exp 校验正确', () => {
  assert.equal(toEpochMs(1_700_000_000), 1_700_000_000_000); // epoch 秒 → 毫秒
  assert.equal(toEpochMs(1_700_000_000_000), 1_700_000_000_000); // 毫秒原样
  assert.equal(CLOCK_SKEW_MS, 60_000);
});

test('秒级 exp（标准 JWT 格式）也能被正确校验', async () => {
  const expSec = Math.floor(Date.now() / 1000) + 3600; // epoch 秒
  const token = await signJwtTest({ sub: 'u@x.com', sid: 's1', exp: expSec }, SECRET);
  const id = await readIdentity(token, SECRET);
  assert.equal(id.sub, 'u@x.com');
});

// ── 13. 既有错误名不被破坏 ──
test('既有错误保持：missing_sub / invalid_signature 不被新校验吞掉', async () => {
  // 无 sub
  const noSub = await signJwtTest({ exp: FUTURE() }, SECRET);
  await assert.rejects(readIdentity(noSub, SECRET), /missing_sub/);
});
