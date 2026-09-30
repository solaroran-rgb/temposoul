// reconciliation demo: create mock data, run reconciliation, print report
import { OrdersStore } from '../../src/lib/server/orders';
import { PayPalMockProvider } from '../../src/lib/server/payPalMockProvider';
import { Reconciler } from '../../src/lib/server/reconcile';

// Mock D1 (in-memory)
function createMockD1() {
  const rows = new Map<string, any>();
  const db = {
    prepare(sql: string) {
      let bound: unknown;
      return {
        bind(params: unknown) {
          bound = params;
          return this;
        },
        async run() {
          if (/^INSERT/i.test(sql)) {
            const p = bound as Record<string, unknown>;
            rows.set(p.id as string, p);
          } else if (/^UPDATE/i.test(sql)) {
            const p = bound as Record<string, unknown>;
            const existing = rows.get(p.id as string);
            if (existing) Object.assign(existing, p);
          }
          return { success: true, results: [], meta: {} };
        },
        async first<T>() {
          const id = (bound as Record<string, unknown>)?.id;
          return (rows.get(String(id)) ?? null) as T;
        },
        async all<T>() {
          // For SELECT * FROM orders, return all rows
          const matched = [...rows.values()];
          return { results: matched as unknown as T[], success: true, meta: {} };
        },
      };
    },
  } as unknown as D1Database;
  return { db, rows };
}

async function main() {
  // Create mock data
  const { db } = createMockD1();
  const store = new OrdersStore(db);
  const paypal = new PayPalMockProvider();

  // 1. Normal order: DB has it, PayPal has it → no diff
  const tx1 = paypal.createOrder('u-001|2026-09-30', 9.9, 'COMPLETED');
  await store.createOrder({
    id: 'order-normal-1',
    user_id: 'u-001',
    product_id: 'event_9_9',
    amount: 9.9,
    currency: 'CNY',
    status: 'completed',
    paypal_transaction_id: tx1.id,
  });

  // 2. Missing in PayPal (DB only - no paypal_transaction_id)
  await store.createOrder({
    id: 'order-missing-paypal',
    user_id: 'u-002',
    product_id: 'report_39_9',
    amount: 39.9,
    currency: 'CNY',
    status: 'completed',
  });

  // 3. Extra in PayPal (PayPal only - no DB record)
  const tx3 = paypal.createOrder('u-003|2026-09-30', 88, 'COMPLETED');

  // 4. Amount mismatch
  const tx4 = paypal.createOrder('u-004|2026-09-30', 85, 'COMPLETED'); // wrong amount
  await store.createOrder({
    id: 'order-amount-mismatch',
    user_id: 'u-004',
    product_id: 'premium_88',
    amount: 88,
    currency: 'CNY',
    status: 'completed',
    paypal_transaction_id: tx4.id,
  });

  // 5. Status mismatch
  const tx5 = paypal.createOrder('u-005|2026-09-30', 9.9, 'COMPLETED');
  await store.createOrder({
    id: 'order-status-mismatch',
    user_id: 'u-005',
    product_id: 'event_9_9',
    amount: 9.9,
    currency: 'CNY',
    status: 'refunded',
    paypal_transaction_id: tx5.id,
  });

  // Run reconciliation
  const reconciler = new Reconciler(store, paypal);
  const report = await reconciler.reconcile();

  // Print report
  console.log(JSON.stringify(report, null, 2));
}

main().catch(console.error);
