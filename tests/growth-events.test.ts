/**
 * 埋点 10 事件 schema + 服务端落库测试（A9 P0④）
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GROWTH_EVENTS,
  GROWTH_EVENT_SCHEMAS,
  validateGrowthEventProps,
} from '../src/lib/analytics/growth-events';
import { logGrowthEvent, isKnownGrowthEvent, type EventLogKv } from '../src/lib/server/event-log';

const EXPECTED_10 = [
  'chart_generated',
  'report_preview_view',
  'paywall_view',
  'purchase_success',
  'sub_start',
  'sub_renew_success',
  'sub_cancel',
  'starmark_share',
  'viral_landing',
  'refund_request',
] as const;

test('10 事件名齐全且与 A9 冻结清单一致', () => {
  for (const name of EXPECTED_10) {
    assert.ok(Object.values(GROWTH_EVENTS).includes(name), `missing event ${name}`);
  }
  assert.equal(Object.keys(GROWTH_EVENT_SCHEMAS).length, 10);
});

test('paywall_view 与既有 T3 funnel 事件同名（兼容不冲突）', () => {
  assert.equal(GROWTH_EVENTS.paywallView, 'paywall_view');
});

test('schema 校验：缺必填键 → missing', () => {
  const r = validateGrowthEventProps('viral_landing', {});
  assert.equal(r.ok, false);
  assert.ok(r.missing.includes('ref_code'));
  assert.ok(r.missing.includes('withinWindow'));
});

test('schema 校验：键齐全 → ok', () => {
  const r = validateGrowthEventProps('purchase_success', {
    productId: 'report_39_9',
    amount: 39,
    currency: 'CNY',
    orderType: 'one_time',
  });
  assert.equal(r.ok, true);
});

test('isKnownGrowthEvent 识别已知事件', () => {
  assert.equal(isKnownGrowthEvent('chart_generated'), true);
  assert.equal(isKnownGrowthEvent('not_a_real_event'), false);
});

test('服务端落库：写 KV 成功，key 含日期分片', async () => {
  const store = new Map<string, string>();
  const kv: EventLogKv = {
    async get(k) {
      return store.has(k) ? (store.get(k) as string) : null;
    },
    async put(k, v) {
      store.set(k, v);
    },
    async list(o) {
      const keys = [...store.keys()].filter((k) => k.startsWith(o?.prefix ?? ''));
      return { keys: keys.map((name) => ({ name })), list_complete: true };
    },
  };
  const r = await logGrowthEvent(kv, {
    name: 'purchase_success',
    ts: new Date('2026-10-07T12:00:00Z').toISOString(),
    userId: 'u1',
    props: { productId: 'report_39_9', amount: 39, currency: 'CNY', orderType: 'one_time' },
  });
  assert.equal(r.ok, true);
  assert.ok(r.key?.startsWith('evt:2026-10-07:'));
  // 落库内容可回读
  const raw = await kv.get(r.key as string);
  assert.ok(raw);
  const parsed = JSON.parse(raw as string);
  assert.equal(parsed.name, 'purchase_success');
  assert.equal(parsed.props.amount, 39);
});
