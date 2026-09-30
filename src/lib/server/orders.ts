/**
 * Orders 表落库（T04）
 * 金额口径：对外（入参/返回）单位为「元」（CNY 浮点数），落库统一乘 100 转「分」
 * （整数 INTEGER）存储，对齐 T06 契约。D1 为可选写入副本；未绑定时 KV 仍为唯一事实源。
 */

// 仓库未安装 @cloudflare/workers-types，按 functions/worker.d.ts 的惯例在此补最小全局类型面
// （仅覆盖本仓库实际用到的 D1 方法：prepare / bind / run / first / all）。
declare global {
  interface D1Result<T = unknown> {
    results: T[];
    success: boolean;
    meta: unknown;
  }

  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
    all<T = unknown>(): Promise<D1Result<T>>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    dump(): Promise<ArrayBuffer>;
    batch(statements: D1PreparedStatement[]): Promise<D1Result<unknown>[]>;
    exec(query: string): Promise<{ count: number; duration: number }>;
  }
}

export interface Order {
  id: string;
  user_id: string;
  product_id: string;
  amount: number; // 对外单位：元（CNY）；落库统一换算为分（整数）存储
  currency: string;
  status: string;
  created_at: number; // epoch ms
  updated_at?: number;
  paypal_transaction_id?: string;
  paypal_status?: string;
  live_trade_id?: string;
  live_status?: string;
}

export class OrdersStore {
  /** @param db D1 绑定实例，可选；未绑定（undefined）时所有读写为空操作，KV 仍为唯一事实源 */
  constructor(private readonly db?: D1Database) {}

  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'> & { id?: string }) {
    if (!this.db) return null; // D1 未绑定：跳过落库，KV 主流程不受影响

    const id = order.id ?? crypto.randomUUID();
    const now = Date.now();
    const toInsert = {
      id,
      user_id: order.user_id,
      product_id: order.product_id,
      amount: Math.round(order.amount * 100), // store as cents（分，整数）
      currency: order.currency,
      status: order.status,
      created_at: now,
      updated_at: now,
      paypal_transaction_id: order.paypal_transaction_id ?? null,
      paypal_status: order.paypal_status ?? null,
      live_trade_id: order.live_trade_id ?? null,
      live_status: order.live_status ?? null,
    };

    // Insert into orders table
    const result = await this.db
      .prepare(
        `INSERT INTO orders (
          id, user_id, product_id, amount, currency, status, created_at, updated_at,
          paypal_transaction_id, paypal_status, live_trade_id, live_status
        ) VALUES (
          :id, :user_id, :product_id, :amount, :currency, :status, :created_at, :updated_at,
          :paypal_transaction_id, :paypal_status, :live_trade_id, :live_status
        )`,
      )
      .bind(toInsert)
      .run();

    if (!result.success) {
      throw new Error('Failed to insert order');
    }

    return { ...toInsert, amount: order.amount }; // return original amount (yuan) for convenience
  }

  async getOrderById(id: string): Promise<Order | null> {
    if (!this.db) return null;
    const result = await this.db
      .prepare('SELECT * FROM orders WHERE id = ?1')
      .bind(id)
      .first<Order>();

    if (!result) return null;

    // Convert amount back from cents to CNY
    return {
      ...result,
      amount: result.amount / 100,
    };
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    if (!this.db) return [];
    const results = await this.db
      .prepare('SELECT * FROM orders WHERE user_id = ?1 ORDER BY created_at DESC')
      .bind(userId)
      .all<Order>();

    return results.results.map((row) => ({
      ...row,
      amount: row.amount / 100,
    }));
  }

  async updateOrderStatus(
    id: string,
    status: string,
    extra?: Partial<
      Pick<Order, 'paypal_transaction_id' | 'paypal_status' | 'live_trade_id' | 'live_status'>
    >,
  ) {
    if (!this.db) return;
    const now = Date.now();
    const updates: Record<string, unknown> = {
      status,
      updated_at: now,
    };
    if (extra) {
      if (extra.paypal_transaction_id !== undefined)
        updates.paypal_transaction_id = extra.paypal_transaction_id;
      if (extra.paypal_status !== undefined) updates.paypal_status = extra.paypal_status;
      if (extra.live_trade_id !== undefined) updates.live_trade_id = extra.live_trade_id;
      if (extra.live_status !== undefined) updates.live_status = extra.live_status;
    }

    const setClauses = Object.keys(updates)
      .map((k) => `${k} = :${k}`)
      .join(', ');
    const sql = `UPDATE orders SET ${setClauses} WHERE id = :id`;

    const bindObj: Record<string, unknown> = { id };
    Object.assign(bindObj, updates);

    await this.db.prepare(sql).bind(bindObj).run();
  }

  // Idempotent upsert by unique key (user_id, product_id, created_at day) – we can use a separate method if needed

  /** Fetch all orders for reconciliation (returns raw rows with amount in cents) */
  async fetchAllOrders(): Promise<Order[]> {
    if (!this.db) return [];
    // Get all rows from orders table
    const result = await this.db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all<Order>();
    return result.results.map((row) => ({
      ...row,
      amount: row.amount / 100,
    }));
  }
}
