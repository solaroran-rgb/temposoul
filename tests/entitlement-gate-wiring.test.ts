/**
 * LLM 调用点接线测试（修复批次2 P1-②）
 * decideDeepInterpretation：放行 LLM 前「权益校验 + 配额扣减」；无权益/用尽/匿名 → 降级 buildFreeSkeleton（0 LLM）。
 * 场景：
 *  a) 有权益 → allowed，配额扣减；
 *  b) 无权益（空包 / 匿名）→ 降级骨架（llmCalls=0）；
 *  c) 配额耗尽 → 降级骨架（llmCalls=0）；
 *  d) KV 未绑定 → 向后兼容放行（deducted=false）。
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { grantEntitlement, type EntitlementKv } from '../src/lib/entitlement/store';
import { decideDeepInterpretation } from '../src/lib/entitlement/wiring';

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

test('a) 有权益 → allowed 且配额扣减', async () => {
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
  const d = await decideDeepInterpretation({ kv, userId: 'u1' });
  assert.equal(d.allowed, true);
  if (d.allowed) {
    assert.equal(d.deducted, true);
    assert.equal(d.remainingCount, 1); // 2 - 1
  }
});

test('b) 无权益（空包）→ 降级骨架；匿名同样降级', async () => {
  const kv = memKv();
  const d = await decideDeepInterpretation({ kv, userId: 'nobody' });
  assert.equal(d.allowed, false);
  if (!d.allowed) {
    assert.equal(d.reason, 'no_entitlement');
    assert.equal(d.skeleton.llmCalls, 0);
  }
  const d2 = await decideDeepInterpretation({ kv, userId: null });
  assert.equal(d2.allowed, false);
  if (!d2.allowed) assert.equal(d2.skeleton.llmCalls, 0);
});

test('c) 配额耗尽 → 降级骨架', async () => {
  const kv = memKv();
  const now = Date.now();
  await grantEntitlement(kv, 'u1', {
    key: 'report.deep',
    quotaType: 'count',
    quotaValue: 1,
    remaining: 0,
    resetCycle: 'none',
    source: 'single',
    grantedAt: new Date(now - DAY).toISOString(),
    ref: 'ord-1',
  });
  const d = await decideDeepInterpretation({ kv, userId: 'u1' });
  assert.equal(d.allowed, false);
  if (!d.allowed) {
    assert.equal(d.reason, 'quota_exhausted');
    assert.equal(d.skeleton.llmCalls, 0);
  }
});

test('d) KV 未绑定 → 向后兼容放行（不扣减）', async () => {
  const d = await decideDeepInterpretation({ kv: null, userId: 'u1' });
  assert.equal(d.allowed, true);
  if (d.allowed) assert.equal(d.deducted, false);
});
