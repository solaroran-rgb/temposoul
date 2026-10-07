/**
 * Entitlement 权益层测试（A9 P0①）
 * 覆盖：授予 / 次数扣减 / 用尽拒绝 / 过期拒绝 / period-once 不扣 / 周期重置 / 匿名拒绝 / 查询不扣减
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  grantEntitlement,
  evaluateAccess,
  consumeEntitlement,
  type EntitlementKv,
} from '../src/lib/entitlement';

function memKv(): EntitlementKv {
  const store = new Map<string, string>();
  return {
    async get(k) {
      return store.has(k) ? (store.get(k) as string) : null;
    },
    async put(k, v) {
      store.set(k, v);
    },
  };
}

const DAY = 86_400_000;

test('count 权益：扣减成功且 remaining 递减', async () => {
  const kv = memKv();
  const now = Date.now();
  await grantEntitlement(kv, 'u1', {
    key: 'report.deep',
    quotaType: 'count',
    quotaValue: 2,
    remaining: 2,
    resetCycle: 'none',
    source: 'single',
    grantedAt: new Date(now - DAY).toISOString(),
    ref: 'ord-1',
  });
  const r1 = await consumeEntitlement(kv, 'u1', 'report.deep', now);
  assert.equal(r1.allowed, true);
  if (r1.allowed) assert.equal(r1.remainingCount, 1);
  const r2 = await consumeEntitlement(kv, 'u1', 'report.deep', now);
  assert.equal(r2.allowed, true);
  if (r2.allowed) assert.equal(r2.remainingCount, 0);
});

test('count 权益：用尽后拒绝 quota_exhausted', async () => {
  const kv = memKv();
  const now = Date.now();
  await grantEntitlement(kv, 'u1', {
    key: 'report.deep',
    quotaType: 'count',
    quotaValue: 1,
    remaining: 1,
    resetCycle: 'none',
    source: 'single',
    grantedAt: new Date(now - DAY).toISOString(),
    ref: 'ord-1',
  });
  await consumeEntitlement(kv, 'u1', 'report.deep', now);
  const r = await consumeEntitlement(kv, 'u1', 'report.deep', now);
  assert.equal(r.allowed, false);
  if (!r.allowed) assert.equal(r.reason, 'quota_exhausted');
});

test('无权益：no_entitlement', async () => {
  const kv = memKv();
  const r = await consumeEntitlement(kv, 'nobody', 'report.deep');
  assert.equal(r.allowed, false);
  if (!r.allowed) assert.equal(r.reason, 'no_entitlement');
});

test('匿名用户：invalid_user（闸门拒放 LLM）', async () => {
  const kv = memKv();
  const r = await consumeEntitlement(kv, 'anonymous', 'report.deep');
  assert.equal(r.allowed, false);
  if (!r.allowed) assert.equal(r.reason, 'invalid_user');
});

test('过期 grant：expired', async () => {
  const kv = memKv();
  const now = Date.now();
  await grantEntitlement(kv, 'u1', {
    key: 'report.deep',
    quotaType: 'count',
    quotaValue: 3,
    remaining: 3,
    resetCycle: 'none',
    source: 'single',
    grantedAt: new Date(now - 10 * DAY).toISOString(),
    expiresAt: new Date(now - DAY).toISOString(), // 昨天过期
    ref: 'ord-1',
  });
  const r = await evaluateAccess(kv, 'u1', 'report.deep', now);
  assert.equal(r.allowed, false);
  if (!r.allowed) assert.equal(r.reason, 'expired');
});

test('period 权益：窗口内放行且不扣次数', async () => {
  const kv = memKv();
  const now = Date.now();
  await grantEntitlement(kv, 'u1', {
    key: 'skymap.pro',
    quotaType: 'period',
    quotaValue: 30,
    resetCycle: 'none',
    source: 'subscription',
    grantedAt: new Date(now - DAY).toISOString(),
    expiresAt: new Date(now + 29 * DAY).toISOString(),
    ref: 'sub-1',
  });
  const r1 = await consumeEntitlement(kv, 'u1', 'skymap.pro', now);
  assert.equal(r1.allowed, true);
  const r2 = await consumeEntitlement(kv, 'u1', 'skymap.pro', now);
  assert.equal(r2.allowed, true); // 第二次仍放行（period 不消耗）
});

test('once 权益：永久放行', async () => {
  const kv = memKv();
  const now = Date.now();
  await grantEntitlement(kv, 'u1', {
    key: 'report.pdf',
    quotaType: 'once',
    quotaValue: 1,
    resetCycle: 'none',
    source: 'single',
    grantedAt: new Date(now - 5 * DAY).toISOString(),
    ref: 'ord-pdf',
  });
  const r = await evaluateAccess(kv, 'u1', 'report.pdf', now);
  assert.equal(r.allowed, true);
});

test('月周期重置：跨月后 remaining 回满再扣', async () => {
  const kv = memKv();
  const granted = Date.now() - 40 * DAY; // 40 天前授予（跨一个月周期）
  await grantEntitlement(kv, 'u1', {
    key: 'starmark.l2',
    quotaType: 'count',
    quotaValue: 3,
    remaining: 0, // 已用尽
    resetCycle: 'month',
    lastResetAt: new Date(granted).toISOString(),
    source: 'gift',
    grantedAt: new Date(granted).toISOString(),
    ref: 'gift-1',
  });
  const now = Date.now();
  const r = await consumeEntitlement(kv, 'u1', 'starmark.l2', now);
  assert.equal(r.allowed, true);
  if (r.allowed) assert.equal(r.remainingCount, 2); // 回满 3 再扣 1 = 2
});

test('evaluateAccess 不扣减（纯查询）', async () => {
  const kv = memKv();
  const now = Date.now();
  await grantEntitlement(kv, 'u1', {
    key: 'report.deep',
    quotaType: 'count',
    quotaValue: 2,
    remaining: 2,
    resetCycle: 'none',
    source: 'single',
    grantedAt: new Date(now - DAY).toISOString(),
    ref: 'ord-1',
  });
  await evaluateAccess(kv, 'u1', 'report.deep', now);
  await evaluateAccess(kv, 'u1', 'report.deep', now);
  const bag = await evaluateAccess(kv, 'u1', 'report.deep', now);
  assert.equal(bag.allowed, true);
  if (bag.allowed) assert.equal(bag.remainingCount, 2); // 未被查询消耗
});
