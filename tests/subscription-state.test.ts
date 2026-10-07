/**
 * 订阅状态机测试（A9 P0③）
 * 覆盖：全状态迁移矩阵 + D+1/D+3/D+7 重试 + 宽限期 + 三次失败转待续费 + 取消期末生效
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  nextStateOnEvent,
  evaluateEffectiveState,
  hasActiveAccess,
  retryAt,
  graceEndsFrom,
  type SubscriptionRecord,
} from '../src/lib/server/subscription/state-machine';

const DAY = 86_400_000;
const now = new Date('2026-10-07T12:00:00Z').getTime();

function rec(over: Partial<SubscriptionRecord>): SubscriptionRecord {
  return { tier: 'premium', state: 'active', startedAt: new Date(now - 10 * DAY).toISOString(), ...over };
}

test('迁移矩阵：trial → active（首扣成功）', () => {
  assert.equal(nextStateOnEvent('trial', 'payment_success'), 'active');
  assert.equal(nextStateOnEvent('trial', 'trial_convert'), 'active');
});

test('迁移矩阵：active → past_due（扣款失败）', () => {
  assert.equal(nextStateOnEvent('active', 'payment_failed'), 'past_due');
});

test('迁移矩阵：active → canceled（用户取消，期末生效）', () => {
  assert.equal(nextStateOnEvent('active', 'user_cancel'), 'canceled');
});

test('迁移矩阵：past_due → active（重试成功）', () => {
  assert.equal(nextStateOnEvent('past_due', 'retry_success'), 'active');
  assert.equal(nextStateOnEvent('past_due', 'payment_success'), 'active');
});

test('迁移矩阵：past_due → canceled（三次失败转待续费，不直接停权）', () => {
  assert.equal(nextStateOnEvent('past_due', 'retries_exhausted'), 'canceled');
});

test('迁移矩阵：canceled → active（重新订阅/复购）', () => {
  assert.equal(nextStateOnEvent('canceled', 'resubscribe'), 'active');
});

test('迁移矩阵：任何态周期结束 → expired', () => {
  for (const s of ['trial', 'active', 'past_due', 'canceled'] as const) {
    assert.equal(nextStateOnEvent(s, 'period_end'), 'expired');
  }
});

test('迁移矩阵：expired → active（重新订阅）', () => {
  assert.equal(nextStateOnEvent('expired', 'resubscribe'), 'active');
});

test('重试计划：D+1 / D+3 / D+7', () => {
  const base = now;
  assert.equal(retryAt(base, 1) - base, DAY * 1);
  assert.equal(retryAt(base, 2) - base, DAY * 3);
  assert.equal(retryAt(base, 3) - base, DAY * 7);
});

test('宽限期：默认 5 天（区间 3-7）', () => {
  assert.equal(graceEndsFrom(now, 5) - now, DAY * 5);
});

test('宽限期内保留权益（past_due 未过 graceEndsAt → hasActiveAccess true）', () => {
  const r = rec({
    state: 'past_due',
    graceEndsAt: new Date(now + 3 * DAY).toISOString(),
    expiresAt: new Date(now + 5 * DAY).toISOString(),
  });
  assert.equal(hasActiveAccess(r, now), true);
  assert.equal(evaluateEffectiveState(r, now), 'past_due');
});

test('宽限期耗尽 → expired（停权）', () => {
  const r = rec({
    state: 'past_due',
    graceEndsAt: new Date(now - DAY).toISOString(),
    expiresAt: new Date(now - 2 * DAY).toISOString(),
  });
  assert.equal(evaluateEffectiveState(r, now), 'expired');
  assert.equal(hasActiveAccess(r, now), false);
});

test('取消期末生效：cancelAt 未到 → 仍按 active 保留权益', () => {
  const r = rec({
    state: 'canceled',
    cancelRequested: true,
    cancelAt: new Date(now + 4 * DAY).toISOString(),
    expiresAt: new Date(now + 4 * DAY).toISOString(),
  });
  assert.equal(evaluateEffectiveState(r, now), 'active'); // 缓冲期保留
  assert.equal(hasActiveAccess(r, now), true);
});

test('取消期末到点 → expired（不即时断供，到期才停）', () => {
  const r = rec({
    state: 'canceled',
    cancelRequested: true,
    cancelAt: new Date(now - DAY).toISOString(),
    expiresAt: new Date(now - DAY).toISOString(),
  });
  assert.equal(evaluateEffectiveState(r, now), 'expired');
  assert.equal(hasActiveAccess(r, now), false);
});

test('active 但已过到期日 → expired', () => {
  const r = rec({ state: 'active', expiresAt: new Date(now - DAY).toISOString() });
  assert.equal(evaluateEffectiveState(r, now), 'expired');
});
