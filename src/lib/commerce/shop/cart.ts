/**
 * T14 轻量商店 · 购物车
 *
 * 存储：单键 `shop:cart:<userId>`（读改写，最后一次写入生效；并发同 SKU 修改以最后写入为准，
 * 这在购物车语义下可接受，README 已标注）。结算时以**服务端商品快照价**计价，
 * 购物车只记 (sku, quantity)，不信任前端传价。
 */

import { DEFAULT_CURRENCY, MAX_CART_LINES, MAX_QUANTITY_PER_LINE } from './config.ts';
import { getCatalogItem } from './catalog.ts';
import { ShopError } from './catalog.ts';
import { clearCart, getCart, putCart } from './store.ts';
import type { Cart, CartView, Product, ShopEnv } from './types.ts';

function nowIso(): string {
  return new Date().toISOString();
}

/** 购物车视图：带商品快照与小计，缺货 / 下架标 available=false（下单时会被拒绝）。 */
export async function getCartView(env: ShopEnv, userId: string): Promise<CartView> {
  const cart = await getCart(env, userId);
  const lines: CartView['lines'] = [];
  let subtotalCents = 0;

  for (const item of cart.items) {
    const product = await getCatalogItem(env, item.sku);
    if (!product) {
      lines.push({
        sku: item.sku,
        title: item.sku,
        unitPriceCents: 0,
        unitPriceYuan: 0,
        quantity: item.quantity,
        subtotalCents: 0,
        subtotalYuan: 0,
        available: false,
      });
      continue;
    }
    const subtotal = product.priceCents * item.quantity;
    subtotalCents += subtotal;
    lines.push({
      sku: product.sku,
      title: product.title,
      unitPriceCents: product.priceCents,
      unitPriceYuan: product.priceYuan,
      quantity: item.quantity,
      subtotalCents: subtotal,
      subtotalYuan: subtotal / 100,
      available: product.status === 'active' && (product.stock === null || product.stock >= item.quantity),
    });
  }

  return {
    ...cart,
    lines,
    subtotalCents,
    subtotalYuan: subtotalCents / 100,
    currency: DEFAULT_CURRENCY,
  };
}

function assertQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) {
    throw new ShopError('invalid_quantity');
  }
}

/** 加入购物车：同 SKU 累加数量（受单行上限约束）。 */
export async function addItem(
  env: ShopEnv,
  userId: string,
  sku: string,
  quantity: number,
): Promise<Cart> {
  assertQuantity(quantity);
  const product = await getCatalogItem(env, sku);
  if (!product) throw new ShopError('product_not_found', 404);
  if (product.status !== 'active') throw new ShopError('product_off_shelf', 409);
  if (product.stock !== null && product.stock < quantity) throw new ShopError('out_of_stock', 409);

  const cart = await getCart(env, userId);
  const existing = cart.items.find((i) => i.sku === product.sku);
  if (existing) {
    const next = existing.quantity + quantity;
    if (next > MAX_QUANTITY_PER_LINE) throw new ShopError('invalid_quantity');
    if (product.stock !== null && product.stock < next) throw new ShopError('out_of_stock', 409);
    existing.quantity = next;
  } else {
    if (cart.items.length >= MAX_CART_LINES) throw new ShopError('cart_limit_exceeded', 409);
    cart.items.push({ sku: product.sku, quantity, addedAt: nowIso() });
  }
  cart.updatedAt = nowIso();
  return putCart(env, cart);
}

/** 设置某 SKU 数量（quantity <= 0 视为删除该行）。 */
export async function setItemQuantity(
  env: ShopEnv,
  userId: string,
  sku: string,
  quantity: number,
): Promise<Cart> {
  const cart = await getCart(env, userId);
  const item = cart.items.find((i) => i.sku === sku.toLowerCase());
  if (!item) throw new ShopError('item_not_found', 404);

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => i.sku !== item.sku);
  } else {
    assertQuantity(quantity);
    const product = await getCatalogItem(env, item.sku);
    if (!product) throw new ShopError('product_not_found', 404);
    if (product.status !== 'active') throw new ShopError('product_off_shelf', 409);
    if (product.stock !== null && product.stock < quantity) throw new ShopError('out_of_stock', 409);
    item.quantity = quantity;
  }
  cart.updatedAt = nowIso();
  return putCart(env, cart);
}

export async function removeItem(env: ShopEnv, userId: string, sku: string): Promise<Cart> {
  const cart = await getCart(env, userId);
  const target = sku.toLowerCase();
  if (!cart.items.some((i) => i.sku === target)) throw new ShopError('item_not_found', 404);
  cart.items = cart.items.filter((i) => i.sku !== target);
  cart.updatedAt = nowIso();
  return putCart(env, cart);
}

export async function clearUserCart(env: ShopEnv, userId: string): Promise<void> {
  await clearCart(env, userId);
}

/** 结算取货：把购物车行项解析为商品快照（下架 / 缺货直接抛错，不静默跳过）。 */
export async function resolveCartProducts(
  env: ShopEnv,
  cart: Cart,
): Promise<Array<{ product: Product; quantity: number }>> {
  const resolved: Array<{ product: Product; quantity: number }> = [];
  for (const item of cart.items) {
    const product = await getCatalogItem(env, item.sku);
    if (!product) throw new ShopError(`product_not_found:${item.sku}`, 404);
    if (product.status !== 'active') throw new ShopError(`product_off_shelf:${item.sku}`, 409);
    if (product.stock !== null && product.stock < item.quantity) {
      throw new ShopError(`out_of_stock:${item.sku}`, 409);
    }
    resolved.push({ product, quantity: item.quantity });
  }
  return resolved;
}
