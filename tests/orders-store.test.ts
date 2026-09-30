/**
 * T04 订单落库测试
 * 设计前提：D1 为可选写入副本，未绑定时 KV 仍为唯一事实源。
 * 用内存 Mock D1 + 内存 KV 覆盖：
 *   1. 金额按「分」(整数) 落库 / 读回还原为元
 *   2. 指定同一 id 重复写入（主键幂等，不产生第二条）
 *   3. D1 未绑定(undefined) 时为空操作，KV 主流程不受影响
 *   4. updateOrderStatus 状态与扩展字段写入
 *   5. activatePremium 回调落库：KV sub 记录 + D1 orders 表双写
 *   6. activatePremium D1 未绑定：仅写 KV，不抛错
 *   7. ls-webhook 端到端：验签通过后 order_created → KV + D1 落库
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { OrdersStore, type Order } from '../src/lib/server/orders';
import { activatePremium } from '../src/lib/server/payment';
import { onRequestPost } from '../functions/api/v1/ls-webhook';

// ---------- 内存 KV 桩 ----------
interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
}

function createMemoryKV(): { kv: KV; store: Map<string, string> } {
  const store = new Map<string, string>();
  const kv: KV = {
    async get(key) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    async delete(key) {
      store.delete(key);
    },
  };
  return { kv, store };
}

// ---------- 内存 D1 桩 ----------
interface D1Call {
  sql: string;
  params: unknown;
}

interface MockRow {
  id: string;
  user_id: string;
  product_id: string;
  amount: number; // 分（整数）
  currency: string;
  status: string;
  created_at: number;
  updated_at: number | null;
  [k: string]: unknown;
}

function createMockD1() {
  const rows = new Map<string, MockRow>();
  const calls: D1Call[] = [];

  function makeStmt(sql: string) {
    let bound: unknown;
    return {
      bind(params: unknown) {
        bound = params;
        return this;
      },
      async run() {
        calls.push({ sql, params: bound });
        if (/^\s*INSERT/i.test(sql)) {
          const p = bound as Record<string, unknown>;
          rows.set(p.id as string, p as unknown as MockRow); // 主键幂等：同 id 覆盖
        } else if (/^\s*UPDATE/i.test(sql)) {
          const p = bound as Record<string, unknown>;
          const existing = rows.get(p.id as string);
          if (existing) Object.assign(existing, p);
        }
        return { success: true, results: [], meta: {} };
      },
      async first<T>(): Promise<T | null> {
        calls.push({ sql, params: bound });
        const id = Array.isArray(bound)
          ? bound[0]
          : bound && typeof bound === 'object'
            ? (bound as Record<string, unknown>).id
            : bound;
        return (rows.get(String(id)) ?? null) as T;
      },
      async all<T>(): Promise<{ results: T[]; success: boolean; meta: unknown }> {
        calls.push({ sql, params: bound });
        const userId = Array.isArray(bound)
          ? bound[0]
          : bound && typeof bound === 'object'
            ? (bound as Record<string, unknown>).user_id
            : bound;
        const matched = [...rows.values()].filter((r) => r.user_id === String(userId));
        return { results: matched as unknown as T[], success: true, meta: {} };
      },
    };
  }

  const db = {
    prepare(sql: string) {
      return makeStmt(sql);
    },
  } as unknown as D1Database;

  return { db, rows, calls };
}

// ---------- 工具：HMAC-SHA256 十六进制签名 ----------
async function sign(body: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ================= 测试用例 =================

test('1. createOrder：金额按分(整数)落库，getOrderById 读回还原为元', async () => {
  const { db, rows } = createMockD1();
  const store = new OrdersStore(db);

  const created = await store.createOrder({
    user_id: 'u-1',
    product_id: 'event_9_9',
    amount: 9.9, // 元
    currency: 'CNY',
    status: 'pending',
  });

  assert.ok(created);
  assert.equal(rows.size, 1);
  // 落库应为分：9.9 元 → 990 分
  const stored = [...rows.values()][0];
  assert.equal(stored.amount, 990);

  // 读回应还原为元
  const fetched = await store.getOrderById(stored.id);
  assert.ok(fetched);
  assert.equal(fetched!.amount, 9.9);
});

test('2. 幂等写入：同一 id 重复 createOrder 不产生第二条记录', async () => {
  const { db, rows } = createMockD1();
  const store = new OrdersStore(db);

  const base = {
    user_id: 'u-2',
    product_id: 'report_39_9',
    amount: 39.9,
    currency: 'CNY',
    status: 'pending' as const,
  };
  await store.createOrder({ ...base, id: 'order-fixed-1' });
  await store.createOrder({ ...base, id: 'order-fixed-1', status: 'completed' });

  assert.equal(rows.size, 1); // 主键幂等，仅一行
  assert.equal(rows.get('order-fixed-1')!.status, 'completed');
});

test('3. D1 未绑定(undefined)：OrdersStore 为空操作，不抛错', async () => {
  const store = new OrdersStore(undefined);

  const created = await store.createOrder({
    user_id: 'u-3',
    product_id: 'event_9_9',
    amount: 9.9,
    currency: 'CNY',
    status: 'pending',
  });
  assert.equal(created, null);
  assert.equal(await store.getOrderById('any'), null);
  assert.deepEqual(await store.getOrdersByUserId('u-3'), []);
  // updateOrderStatus 不应抛错
  await store.updateOrderStatus('any', 'refunded');
});

test('4. updateOrderStatus：状态与扩展字段写入 UPDATE binding', async () => {
  const { db, rows, calls } = createMockD1();
  const store = new OrdersStore(db);

  await store.createOrder({
    id: 'order-upd',
    user_id: 'u-4',
    product_id: 'sub_monthly_19_9',
    amount: 19.9,
    currency: 'CNY',
    status: 'pending',
  });

  await store.updateOrderStatus('order-upd', 'paid', {
    live_trade_id: 'trade-77',
    live_status: 'captured',
  });

  const updCall = calls.find((c) => /^\s*UPDATE/i.test(c.sql));
  assert.ok(updCall, '应产生一条 UPDATE 语句');
  const params = updCall!.params as Record<string, unknown>;
  assert.equal(params.id, 'order-upd');
  assert.equal(params.status, 'paid');
  assert.equal(params.live_trade_id, 'trade-77');
  assert.equal(params.live_status, 'captured');
  assert.ok(typeof params.updated_at === 'number');

  // 行内状态已更新
  assert.equal(rows.get('order-upd')!.status, 'paid');
});

test('5. 回调落库：activatePremium 在 D1 绑定时双写 KV + orders 表', async () => {
  const { kv, store: kvMap } = createMemoryKV();
  const { db, rows } = createMockD1();

  await activatePremium(kv as unknown as KVNamespace, 'u-5', 'lemonsqueezy', {
    productId: 'event_9_9',
    orderType: 'one_time',
    amount: 9.9,
    currency: 'CNY',
  }, db);

  // KV 主记录
  const raw = kvMap.get('sub:u-5');
  assert.ok(raw);
  const rec = JSON.parse(raw!) as Record<string, unknown>;
  assert.equal(rec.tier, 'premium');
  assert.ok(Array.isArray(rec.orders));

  // D1 orders 表落库（completed，金额 990 分）
  assert.equal(rows.size, 1);
  const orderRow = [...rows.values()][0];
  assert.equal(orderRow.user_id, 'u-5');
  assert.equal(orderRow.product_id, 'event_9_9');
  assert.equal(orderRow.status, 'completed');
  assert.equal(orderRow.amount, 990);
});

test('6. 回调落库：activatePremium 在 D1 未绑定时仅写 KV，不抛错', async () => {
  const { kv, store: kvMap } = createMemoryKV();

  await activatePremium(kv as unknown as KVNamespace, 'u-6', 'lemonsqueezy', {
    productId: 'report_39_9',
    orderType: 'one_time',
    amount: 39.9,
    currency: 'CNY',
  }, undefined); // d1 未绑定

  const raw = kvMap.get('sub:u-6');
  assert.ok(raw);
  const rec = JSON.parse(raw!) as Record<string, unknown>;
  assert.equal(rec.tier, 'premium');
});

test('7. ls-webhook 端到端：验签通过后 order_created → KV + D1 落库', async () => {
  const SECRET = 'whsec-test-0123456789abcdef';
  const { kv, store: kvMap } = createMemoryKV();
  const { db, rows } = createMockD1();

  const payload = {
    meta: {
      event_name: 'order_created',
      custom_data: {
        user_id: 'u-web',
        product_id: 'report_39_9',
        order_type: 'one_time',
      },
    },
    data: { id: 'tx-abc' },
  };
  const rawBody = JSON.stringify(payload);
  const signature = await sign(rawBody, SECRET);

  const req = new Request('https://example.com/api/v1/ls-webhook', {
    method: 'POST',
    body: rawBody,
    headers: { 'X-Signature': signature },
  });

  const res = await onRequestPost({
    request: req,
    env: { LEMONSQUEEZY_WEBHOOK_SECRET: SECRET, AUTH_KV: kv, D1: db },
    params: {},
  } as Parameters<typeof onRequestPost>[0]);

  assert.equal(res.status, 200);
  const body = (await res.json()) as { event: string };
  assert.equal(body.event, 'order_created');

  // KV 已激活
  const raw = kvMap.get('sub:u-web');
  assert.ok(raw);
  assert.equal((JSON.parse(raw!) as Record<string, unknown>).tier, 'premium');

  // D1 已落库
  assert.equal(rows.size, 1);
  assert.equal([...rows.values()][0].product_id, 'report_39_9');
});

test('8. ls-webhook：错误签名不落库（fail-closed）', async () => {
  const SECRET = 'whsec-test-0123456789abcdef';
  const { kv, store: kvMap } = createMemoryKV();
  const { db, rows } = createMockD1();

  const rawBody = JSON.stringify({
    meta: { event_name: 'order_created', custom_data: { user_id: 'u-bad', product_id: 'event_9_9' } },
  });
  const signature = await sign(rawBody, 'attacker-secret');

  const req = new Request('https://example.com/api/v1/ls-webhook', {
    method: 'POST',
    body: rawBody,
    headers: { 'X-Signature': signature },
  });
  const res = await onRequestPost({
    request: req,
    env: { LEMONSQUEEZY_WEBHOOK_SECRET: SECRET, AUTH_KV: kv, D1: db },
    params: {},
  } as Parameters<typeof onRequestPost>[0]);

  assert.equal(res.status, 200);
  assert.equal(kvMap.get('sub:u-bad'), undefined);
  assert.equal(rows.size, 0);
});
