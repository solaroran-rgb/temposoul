/**
 * T14 轻量商店 · 商品目录
 *
 * 目录存 KV（`shop:product:<sku>`），首次访问时按 SEED_PRODUCTS 播种，管理 API 可增删改 / 上下架。
 * 商品分类沿用 T06 的 PromoCategory（report / service / subscription），规则与券直接按分类圈范围。
 */

import { DEFAULT_CURRENCY, MAX_QUANTITY_PER_LINE } from './config.ts';
import { getProduct, listProducts, putProduct, stableHash } from './store.ts';
import type { Product, ProductCategory, ProductInput, ProductStatus, ShopEnv } from './types.ts';

const CATEGORIES: ProductCategory[] = ['report', 'service', 'subscription'];
const STATUSES: ProductStatus[] = ['draft', 'active', 'archived'];

/** 播种目录（仅在目录为空时写入，管理员后续改动不会被覆盖） */
export const SEED_PRODUCTS: ProductInput[] = [
  {
    sku: 'report_bazi_full',
    title: '八字全解报告',
    description: '四柱排盘 + 大运流年 + 用神喜忌，含 10 年运势走势。',
    priceCents: 3900,
    category: 'report',
    status: 'active',
  },
  {
    sku: 'report_ziwei_full',
    title: '紫微斗数全盘报告',
    description: '十二宫星曜布局 + 四化解读 + 关键流年提示。',
    priceCents: 4900,
    category: 'report',
    status: 'active',
  },
  {
    sku: 'report_hehun',
    title: '合婚配对报告',
    description: '双方命盘合参，给出相处建议与关键年份提醒。',
    priceCents: 2900,
    category: 'report',
    status: 'active',
  },
  {
    sku: 'service_consult_30',
    title: '命理咨询 30 分钟',
    description: '一对一在线答疑，可指定八字 / 斗数 / 起名方向。',
    priceCents: 19900,
    category: 'service',
    status: 'active',
    stock: 20,
  },
  {
    sku: 'subscription_monthly',
    title: '命律月度会员',
    description: '全站报告无限次生成 + 优先算力队列。',
    priceCents: 1900,
    category: 'subscription',
    status: 'draft',
  },
];

export interface ParseResult<T> {
  ok: boolean;
  value?: T;
  error?: string;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function isValidSku(sku: string): boolean {
  return /^[a-z0-9][a-z0-9_-]{1,63}$/i.test(sku);
}

/** 校验并归一化商品输入（创建 / 更新共用；更新允许部分字段）。 */
export function parseProductInput(
  body: Record<string, unknown>,
  mode: 'create' | 'patch',
): ParseResult<ProductInput> {
  const rawSku = typeof body.sku === 'string' ? body.sku.trim() : '';
  const sku = rawSku.toLowerCase();
  if (mode === 'create') {
    if (!sku || !isValidSku(sku)) return { ok: false, error: 'invalid_sku' };
  } else if (body.sku !== undefined && (!sku || !isValidSku(sku))) {
    return { ok: false, error: 'invalid_sku' };
  }

  const patch: Record<string, unknown> = {};
  if (sku) patch.sku = sku;

  if (body.title !== undefined) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title || title.length > 120) return { ok: false, error: 'invalid_title' };
    patch.title = title;
  } else if (mode === 'create') {
    return { ok: false, error: 'invalid_title' };
  }

  if (body.description !== undefined) {
    const description = typeof body.description === 'string' ? body.description : '';
    if (description.length > 2000) return { ok: false, error: 'invalid_description' };
    patch.description = description;
  }

  if (body.priceCents !== undefined) {
    const price = Number(body.priceCents);
    if (!Number.isInteger(price) || price <= 0 || price > 100_000_000) {
      return { ok: false, error: 'invalid_price' };
    }
    patch.priceCents = price;
  } else if (mode === 'create') {
    return { ok: false, error: 'invalid_price' };
  }

  if (body.currency !== undefined) {
    const currency = typeof body.currency === 'string' ? body.currency.trim().toUpperCase() : '';
    if (!/^[A-Z]{3}$/.test(currency)) return { ok: false, error: 'invalid_currency' };
    patch.currency = currency;
  }

  if (body.category !== undefined) {
    const category = body.category as ProductCategory;
    if (!CATEGORIES.includes(category)) return { ok: false, error: 'invalid_category' };
    patch.category = category;
  }

  if (body.status !== undefined) {
    const status = body.status as ProductStatus;
    if (!STATUSES.includes(status)) return { ok: false, error: 'invalid_status' };
    patch.status = status;
  }

  if (body.stock !== undefined) {
    if (body.stock === null) {
      patch.stock = null;
    } else {
      const stock = Number(body.stock);
      if (!Number.isInteger(stock) || stock < 0 || stock > MAX_QUANTITY_PER_LINE * 1000) {
        return { ok: false, error: 'invalid_stock' };
      }
      patch.stock = stock;
    }
  }

  if (body.tags !== undefined) {
    if (!Array.isArray(body.tags) || body.tags.some((t) => typeof t !== 'string')) {
      return { ok: false, error: 'invalid_tags' };
    }
    patch.tags = (body.tags as string[]).slice(0, 20).map((t) => t.trim()).filter(Boolean);
  }

  return { ok: true, value: patch as ProductInput };
}

function toProduct(input: ProductInput, base?: Product): Product {
  const ts = nowIso();
  const priceCents = input.priceCents;
  return {
    sku: (input.sku ?? base?.sku ?? '').toLowerCase(),
    title: input.title ?? base?.title ?? '',
    description: input.description ?? base?.description ?? '',
    priceCents,
    priceYuan: priceCents / 100,
    currency: input.currency ?? base?.currency ?? DEFAULT_CURRENCY,
    category: input.category ?? base?.category ?? 'report',
    status: input.status ?? base?.status ?? 'draft',
    stock: input.stock !== undefined ? input.stock : (base?.stock ?? null),
    tags: input.tags ?? base?.tags ?? [],
    createdAt: base?.createdAt ?? ts,
    updatedAt: ts,
  };
}

/** 目录为空时播种（幂等：已存在同 sku 不覆盖）。 */
export async function ensureSeedProducts(env: ShopEnv): Promise<number> {
  const existing = await listProducts(env);
  if (existing.length > 0) return 0;
  let seeded = 0;
  for (const input of SEED_PRODUCTS) {
    await putProduct(env, toProduct(input));
    seeded += 1;
  }
  return seeded;
}

export async function listCatalog(
  env: ShopEnv,
  opts: { includeInactive?: boolean; category?: ProductCategory } = {},
): Promise<Product[]> {
  await ensureSeedProducts(env);
  const all = await listProducts(env);
  return all.filter((p) => {
    if (!opts.includeInactive && p.status !== 'active') return false;
    if (opts.category && p.category !== opts.category) return false;
    return true;
  });
}

export async function getCatalogItem(env: ShopEnv, sku: string): Promise<Product | null> {
  await ensureSeedProducts(env);
  return getProduct(env, sku.toLowerCase());
}

export async function createProduct(env: ShopEnv, input: ProductInput): Promise<Product> {
  const sku = input.sku.toLowerCase();
  const exists = await getProduct(env, sku);
  if (exists) throw new ShopError('sku_exists', 409);
  return putProduct(env, toProduct({ ...input, sku }));
}

export async function updateProduct(
  env: ShopEnv,
  sku: string,
  patch: ProductInput,
): Promise<Product | null> {
  const existing = await getProduct(env, sku.toLowerCase());
  if (!existing) return null;
  return putProduct(env, toProduct({ ...patch, sku: existing.sku }, existing));
}

/** 上下架快捷入口（status 只允许 draft / active / archived）。 */
export async function setProductStatus(
  env: ShopEnv,
  sku: string,
  status: ProductStatus,
): Promise<Product | null> {
  return updateProduct(env, sku, { sku, status });
}

/** 库存扣减（下单成功调用；stock 为 null 表示不限，跳过）。 */
export async function decreaseStock(
  env: ShopEnv,
  sku: string,
  quantity: number,
): Promise<Product | null> {
  const product = await getProduct(env, sku);
  if (!product || product.stock === null) return product;
  const next = Math.max(0, product.stock - quantity);
  return putProduct(env, { ...product, stock: next, updatedAt: nowIso() });
}

/** 库存回滚（取消订单）。 */
export async function increaseStock(
  env: ShopEnv,
  sku: string,
  quantity: number,
): Promise<Product | null> {
  const product = await getProduct(env, sku);
  if (!product || product.stock === null) return product;
  return putProduct(env, {
    ...product,
    stock: product.stock + quantity,
    updatedAt: nowIso(),
  });
}

/** 稳定派生：用于把 SKU 折叠进订单 id（同键重复写 = 幂等）。 */
export function skuHash(sku: string): string {
  return stableHash(sku.toLowerCase());
}

export class ShopError extends Error {
  constructor(
    message: string,
    readonly status: number = 400,
  ) {
    super(message);
    this.name = 'ShopError';
  }
}
