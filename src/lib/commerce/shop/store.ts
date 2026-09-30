/**
 * T14 轻量商店 · KV 数据层
 *
 * 并发设计要点（KV 无事务，故**全程避免读改写**）：
 *   - 订单 / 积分流水 / 幂等记录：一条记录一个键，键由业务主键稳定派生
 *     → 并发重复写入落到同一个键，内容一致，天然「不重」；不同业务单号互不覆盖，天然「不丢」。
 *   - 购物车：单键读改写（最后一次写入生效），语义上可接受，见 README 说明。
 *   - 用户订单索引：`shop:oidx:<userId>:<orderId>` 逐条写键，用 list(prefix) 聚合，避免索引数组读改写。
 *
 * KV key 布局：
 *   shop:product:<sku>              → Product
 *   shop:cart:<userId>              → Cart
 *   shop:order:<orderId>            → ShopOrder
 *   shop:oidx:<userId>:<orderId>    → orderId（列表用，按前缀聚合）
 *   shop:points:<userId>:<entryId>  → PointsEntry（余额 = 全部流水求和）
 *   shop:idem:<userId>:<key>        → checkoutId（幂等）
 *   shop:checkout:<checkoutId>      → CheckoutRecord
 *   shop:pay:<transactionId>        → PaymentIntent
 */

import type {
  Cart,
  CheckoutRecord,
  PaymentIntent,
  PointsEntry,
  Product,
  ShopEnv,
  ShopOrder,
} from './types.ts';

/** 保留期：购物车 90 天，订单 / 流水 5 年（对齐 sky-events 的 5 年留存口径） */
const CART_TTL = 86400 * 90;
const RECORD_TTL = 86400 * 365 * 5;

export const KEYS = {
  product: (sku: string) => `shop:product:${sku}`,
  productPrefix: 'shop:product:',
  cart: (userId: string) => `shop:cart:${userId}`,
  order: (orderId: string) => `shop:order:${orderId}`,
  orderIndex: (userId: string, orderId: string) => `shop:oidx:${userId}:${orderId}`,
  orderIndexPrefix: (userId: string) => `shop:oidx:${userId}:`,
  points: (userId: string, entryId: string) => `shop:points:${userId}:${entryId}`,
  pointsPrefix: (userId: string) => `shop:points:${userId}:`,
  idempotency: (userId: string, key: string) => `shop:idem:${userId}:${key}`,
  checkout: (checkoutId: string) => `shop:checkout:${checkoutId}`,
  payment: (transactionId: string) => `shop:pay:${transactionId}`,
  userAssets: (userId: string) => `user_assets:${userId}`,
};

// ────────────────────────────── 通用工具 ──────────────────────────────

/** 确定性哈希（djb2，32-bit hex）：用于从业务主键派生稳定 id，保证幂等。 */
export function stableHash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function randomToken(byteLength = 9): string {
  const buf = crypto.getRandomValues(new Uint8Array(byteLength));
  let binary = '';
  for (const b of buf) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function genOrderId(): string {
  return `ord_${randomToken(9)}`;
}

export function genCheckoutId(): string {
  return `ckt_${randomToken(9)}`;
}

export function genTransactionId(): string {
  return `txn_${randomToken(9)}`;
}

async function readJson<T>(kv: KVNamespace, key: string): Promise<T | null> {
  const raw = await kv.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** KV list 分页全量拉取（前缀扫描，兜底 1000/页）。 */
async function listKeys(kv: KVNamespace, prefix: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await kv.list({ prefix, limit: 1000, cursor });
    for (const k of page.keys) keys.push(k.name);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return keys;
}

/** 注册到 user_assets，使账号级联删除（me/data.ts）一并清理商店数据。 */
async function pushUserAsset(env: ShopEnv, userId: string, key: string): Promise<void> {
  const raw = await env.AUTH_KV.get(KEYS.userAssets(userId));
  const assets: string[] = raw ? JSON.parse(raw) : [];
  if (!assets.includes(key)) {
    assets.push(key);
    await env.AUTH_KV.put(KEYS.userAssets(userId), JSON.stringify(assets), {
      expirationTtl: RECORD_TTL,
    });
  }
}

// ────────────────────────────── 商品 ──────────────────────────────

export async function getProduct(env: ShopEnv, sku: string): Promise<Product | null> {
  return readJson<Product>(env.AUTH_KV, KEYS.product(sku));
}

export async function putProduct(env: ShopEnv, product: Product): Promise<Product> {
  await env.AUTH_KV.put(KEYS.product(product.sku), JSON.stringify(product), {
    expirationTtl: RECORD_TTL,
  });
  return product;
}

export async function deleteProduct(env: ShopEnv, sku: string): Promise<void> {
  await env.AUTH_KV.delete(KEYS.product(sku));
}

export async function listProducts(env: ShopEnv): Promise<Product[]> {
  const keys = await listKeys(env.AUTH_KV, KEYS.productPrefix);
  const products: Product[] = [];
  for (const key of keys) {
    const p = await readJson<Product>(env.AUTH_KV, key);
    if (p) products.push(p);
  }
  products.sort((a, b) => a.sku.localeCompare(b.sku));
  return products;
}

// ────────────────────────────── 购物车 ──────────────────────────────

export async function getCart(env: ShopEnv, userId: string): Promise<Cart> {
  const cart = await readJson<Cart>(env.AUTH_KV, KEYS.cart(userId));
  return cart ?? { userId, items: [], updatedAt: new Date().toISOString() };
}

export async function putCart(env: ShopEnv, cart: Cart): Promise<Cart> {
  await env.AUTH_KV.put(KEYS.cart(cart.userId), JSON.stringify(cart), {
    expirationTtl: CART_TTL,
  });
  await pushUserAsset(env, cart.userId, KEYS.cart(cart.userId));
  return cart;
}

export async function clearCart(env: ShopEnv, userId: string): Promise<void> {
  await env.AUTH_KV.delete(KEYS.cart(userId));
}

// ────────────────────────────── 订单 ──────────────────────────────

export async function putOrder(env: ShopEnv, order: ShopOrder): Promise<ShopOrder> {
  await env.AUTH_KV.put(KEYS.order(order.id), JSON.stringify(order), {
    expirationTtl: RECORD_TTL,
  });
  await env.AUTH_KV.put(KEYS.orderIndex(order.userId, order.id), order.id, {
    expirationTtl: RECORD_TTL,
  });
  await pushUserAsset(env, order.userId, KEYS.order(order.id));
  await pushUserAsset(env, order.userId, KEYS.orderIndex(order.userId, order.id));
  return order;
}

export async function getOrder(env: ShopEnv, orderId: string): Promise<ShopOrder | null> {
  return readJson<ShopOrder>(env.AUTH_KV, KEYS.order(orderId));
}

/** 本人订单（越权 id 一律过滤掉）；按创建时间倒序。 */
export async function listOrders(env: ShopEnv, userId: string): Promise<ShopOrder[]> {
  const keys = await listKeys(env.AUTH_KV, KEYS.orderIndexPrefix(userId));
  const orders: ShopOrder[] = [];
  for (const key of keys) {
    const id = await env.AUTH_KV.get(key);
    if (!id) continue;
    const order = await getOrder(env, id);
    if (order && order.userId === userId) orders.push(order);
  }
  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return orders;
}

// ────────────────────────────── 积分流水 ──────────────────────────────

/**
 * 写入一条流水。id 由 (userId, action, refId) 派生 → 同一业务事实重复提交覆盖同一键，
 * **不会重复计分**；不同 refId 各自成键，**不会互相覆盖**。
 */
export async function putPointsEntry(env: ShopEnv, entry: PointsEntry): Promise<PointsEntry> {
  const key = KEYS.points(entry.userId, entry.id);
  await env.AUTH_KV.put(key, JSON.stringify(entry), { expirationTtl: RECORD_TTL });
  return entry;
}

export async function listPointsEntries(env: ShopEnv, userId: string): Promise<PointsEntry[]> {
  const keys = await listKeys(env.AUTH_KV, KEYS.pointsPrefix(userId));
  const entries: PointsEntry[] = [];
  for (const key of keys) {
    const e = await readJson<PointsEntry>(env.AUTH_KV, key);
    if (e && e.userId === userId) entries.push(e);
  }
  return entries;
}

// ────────────────────────────── 幂等 / 结算单 / 支付单 ──────────────────────────────

/** 幂等键 → 结算单 id。已存在则返回已有 id（调用方直接回放原结果）。 */
export async function readIdempotency(
  env: ShopEnv,
  userId: string,
  key: string,
): Promise<string | null> {
  return env.AUTH_KV.get(KEYS.idempotency(userId, key));
}

export async function writeIdempotency(
  env: ShopEnv,
  userId: string,
  key: string,
  checkoutId: string,
): Promise<void> {
  await env.AUTH_KV.put(KEYS.idempotency(userId, key), checkoutId, {
    expirationTtl: RECORD_TTL,
  });
}

export async function putCheckout(env: ShopEnv, record: CheckoutRecord): Promise<CheckoutRecord> {
  await env.AUTH_KV.put(KEYS.checkout(record.id), JSON.stringify(record), {
    expirationTtl: RECORD_TTL,
  });
  await pushUserAsset(env, record.userId, KEYS.checkout(record.id));
  return record;
}

export async function getCheckout(env: ShopEnv, checkoutId: string): Promise<CheckoutRecord | null> {
  return readJson<CheckoutRecord>(env.AUTH_KV, KEYS.checkout(checkoutId));
}

export async function putPayment(env: ShopEnv, intent: PaymentIntent): Promise<PaymentIntent> {
  await env.AUTH_KV.put(KEYS.payment(intent.transactionId), JSON.stringify(intent), {
    expirationTtl: RECORD_TTL,
  });
  return intent;
}

export async function getPayment(
  env: ShopEnv,
  transactionId: string,
): Promise<PaymentIntent | null> {
  return readJson<PaymentIntent>(env.AUTH_KV, KEYS.payment(transactionId));
}

// ────────────────────────────── 账号级联清理 ──────────────────────────────

/** 清理某用户全部商店数据（购物车 / 订单 / 积分流水），返回清理条数。 */
export async function purgeUserShopData(env: ShopEnv, userId: string): Promise<number> {
  let count = 0;
  await env.AUTH_KV.delete(KEYS.cart(userId));

  const orderKeys = await listKeys(env.AUTH_KV, KEYS.orderIndexPrefix(userId));
  for (const key of orderKeys) {
    const id = await env.AUTH_KV.get(key);
    if (id) await env.AUTH_KV.delete(KEYS.order(id));
    await env.AUTH_KV.delete(key);
    count += 1;
  }

  const pointKeys = await listKeys(env.AUTH_KV, KEYS.pointsPrefix(userId));
  for (const key of pointKeys) {
    await env.AUTH_KV.delete(key);
    count += 1;
  }
  return count;
}
