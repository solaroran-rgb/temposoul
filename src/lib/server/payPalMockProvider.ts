// mock PayPal provider – only keeps in-memory order records
export interface PayPalOrder {
  id: string;
  invoice_id: string;
  status: string;
  amount: { total: number; currency: string };
  create_time: string;
  update_time: string;
}
export class PayPalMockProvider {
  private orders: PayPalOrder[] = [];

  /** generate a mock order and record it
   * @param invoiceId invoice identifier used in frontend/webhook
   * @param amount total amount in Yuan
   * @param status status string → 'COMPLETED', 'PENDING', 'REFUNDED', etc
   */
  createOrder(invoiceId: string, amount: number, status: string = 'COMPLETED'): PayPalOrder {
    const id = `I-${Math.random().toString(16).slice(2, 12)}`;
    const now = new Date().toISOString();
    const order: PayPalOrder = {
      id,
      invoice_id: invoiceId,
      status,
      amount: { total: amount, currency: 'CNY' },
      create_time: now,
      update_time: now,
    };
    this.orders.push(order);
    return order;
  }

  listOrders(): PayPalOrder[] {
    return [...this.orders];
  }
}
