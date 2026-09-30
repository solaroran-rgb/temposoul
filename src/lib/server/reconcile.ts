/**
 * Payment reconciliation engine – comparing PayPal (mock data source) with orders table (D1/KV)
 * Outputs differences of four types: missing, extra, amount mismatch, status mismatch
 */
import { OrdersStore, type Order } from './orders.js';
import { PayPalMockProvider, type PayPalOrder } from './payPalMockProvider.js';

export type VarianceType = 'MISSING' | 'EXTRA' | 'AMOUNT_MISMATCH' | 'STATUS_MISMATCH';

export interface Variance {
  type: VarianceType;
  orderId: string; // orders.id
  paypalTransactionId?: string;
  orderBySource?: string; // 'paypal' | 'db'
  dbOrder?: Order;
  paypalOrder?: PayPalOrder;
  details?: string;
}

export interface ReconciliationReport {
  generatedAt: Date;
  totalDbOrders: number;
  totalPaypalOrders: number;
  variances: Variance[];
  summary: {
    missing: number;
    extra: number;
    amountMismatch: number;
    statusMismatch: number;
  };
}

/** map PayPal status string → orders.status string */
function mapStatus(paypalStatus: string): string {
  const map: Record<string, string> = {
    COMPLETED: 'completed',
    PENDING: 'pending',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    CHARGEBACK: 'disputed',
    DENIED: 'denied',
  };
  return map[paypalStatus] ?? paypalStatus.toLowerCase();
}

export class Reconciler {
  constructor(private store: OrdersStore, private paypal: PayPalMockProvider) {}

  async reconcile(): Promise<ReconciliationReport> {
    const dbOrders = await this.store.fetchAllOrders();
    const paypalOrders = this.paypal.listOrders();

    // Build map of PayPal orders keyed by transaction id
    const paypalByTxId = new Map<string, PayPalOrder>();
    for (const po of paypalOrders) {
      paypalByTxId.set(po.id, po);
    }

    // Track which PayPal orders have been matched
    const matchedPayPal = new Set<string>();

    const variances: Variance[] = [];

    // Scan DB orders
    for (const order of dbOrders) {
      const txId = order.paypal_transaction_id;

      if (!txId) {
        variances.push({
          type: 'MISSING',
          orderId: order.id,
          orderBySource: 'db',
          dbOrder: order,
          details: 'DB order has no paypal_transaction_id (pending / not synced)',
        });
        continue;
      }

      const po = paypalByTxId.get(txId);
      if (!po) {
        variances.push({
          type: 'MISSING',
          orderId: order.id,
          paypalTransactionId: txId,
          orderBySource: 'db',
          dbOrder: order,
          details: `PayPal transaction ${txId} not found`,
        });
        continue;
      }

      matchedPayPal.add(txId);

      // Check amount
      if (order.amount !== po.amount.total) {
        variances.push({
          type: 'AMOUNT_MISMATCH',
          orderId: order.id,
          paypalTransactionId: txId,
          orderBySource: 'both',
          dbOrder: order,
          paypalOrder: po,
          details: `DB ¥${order.amount} vs PayPal ¥${po.amount.total}`,
        });
        continue; // skip status check if amount differs
      }

      // Check status
      const expectedStatus = mapStatus(po.status);
      if (order.status !== expectedStatus) {
        variances.push({
          type: 'STATUS_MISMATCH',
          orderId: order.id,
          paypalTransactionId: txId,
          orderBySource: 'both',
          dbOrder: order,
          paypalOrder: po,
          details: `DB '${order.status}' vs PayPal '${po.status}'`,
        });
      }
    }

    // Find extra PayPal orders (not matched)
    for (const po of paypalOrders) {
      if (!matchedPayPal.has(po.id)) {
        variances.push({
          type: 'EXTRA',
          orderId: po.id,
          paypalTransactionId: po.id,
          orderBySource: 'paypal',
          paypalOrder: po,
          details: 'PayPal transaction without DB record (webhook missed)',
        });
      }
    }

    const summary = {
      missing: variances.filter((v) => v.type === 'MISSING').length,
      extra: variances.filter((v) => v.type === 'EXTRA').length,
      amountMismatch: variances.filter((v) => v.type === 'AMOUNT_MISMATCH').length,
      statusMismatch: variances.filter((v) => v.type === 'STATUS_MISMATCH').length,
    };

    return {
      generatedAt: new Date(),
      totalDbOrders: dbOrders.length,
      totalPaypalOrders: paypalOrders.length,
      variances,
      summary,
    };
  }
}