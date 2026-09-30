/**
 * T14 轻量商店 · 契约层
 *
 * 金额口径：**内部一律「分」（整数）**，与 T06 促销引擎一致；对外同时给出
 * `priceYuan` / `amountYuan` 便于展示，禁止浮点参与计价。
 *
 * 存储口径：KV（AUTH_KV）为唯一事实源，D1 orders 表（T04）为可选写入副本；
 * 订单主键语义与 T04 完全兼容：一行订单 = 一个 SKU（数量折算进 amount）。
 */

import type { PromoCategory } from '../promo/types.ts';

// ────────────────────────────── 商品 ──────────────────────────────

/** 上架状态：draft（未上架）/ active（在售）/ archived（已下架，不再售卖但保留历史） */
export type ProductStatus = 'draft' | 'active' | 'archived';

/** 商品分类与 T06 促销适用域对齐，规则 / 券按此粒度圈定范围 */
export type ProductCategory = PromoCategory;

export interface ProductInput {
  sku: string;
  title: string;
  description?: string;
  /** 单价（分，整数） */
  priceCents: number;
  currency?: string;
  category?: ProductCategory;
  status?: ProductStatus;
  /** null = 不限库存；数字 = 可售件数 */
  stock?: number | null;
  tags?: string[];
}

export interface Product {
  sku: string;
  title: string;
  description: string;
  /** 单价（分，整数） */
  priceCents: number;
  /** 展示用单价（元，priceCents/100） */
  priceYuan: number;
  currency: string;
  category: ProductCategory;
  status: ProductStatus;
  stock: number | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ────────────────────────────── 购物车 ──────────────────────────────

export interface CartItem {
  sku: string;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  updatedAt: string;
}

/** 购物车视图：带上商品快照，供前端直接渲染 */
export interface CartView extends Cart {
  lines: Array<{
    sku: string;
    title: string;
    unitPriceCents: number;
    unitPriceYuan: number;
    quantity: number;
    subtotalCents: number;
    subtotalYuan: number;
    available: boolean;
  }>;
  subtotalCents: number;
  subtotalYuan: number;
  currency: string;
}

// ────────────────────────────── 订单 ──────────────────────────────

/**
 * 订单状态机：pending → completed（支付成功）| cancelled（未支付取消）
 * completed → refunded（退款，本卡不实现退款流程，仅保留状态位）
 * `completed` 与 T04 activatePremium 落库口径一致。
 */
export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface ShopOrder {
  id: string;
  userId: string;
  /** → orders.product_id（T04） */
  sku: string;
  quantity: number;
  currency: string;
  /** 原价（分） */
  listAmountCents: number;
  /** 实付（分），已扣除规则优惠 + 积分抵扣 */
  amountCents: number;
  /** 规则优惠分摊（分） */
  ruleDiscountCents: number;
  /** 积分抵扣分摊（分） */
  pointsDiscountCents: number;
  /** 本单分摊的积分（整数） */
  pointsUsed: number;
  status: OrderStatus;
  checkoutId: string;
  provider: string;
  transactionId?: string;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
  /** 展示用实付（元） */
  amountYuan: number;
}

export interface CheckoutRecord {
  id: string;
  userId: string;
  orderIds: string[];
  currency: string;
  subtotalCents: number;
  ruleDiscountCents: number;
  couponDiscountCents: number;
  pointsDiscountCents: number;
  pointsUsed: number;
  payableCents: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  provider: string;
  transactionId?: string;
  appliedRuleIds: string[];
  /** 结算审计轨迹（T06 输出 + 积分抵扣说明） */
  trace: string[];
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
  payableYuan: number;
}

// ────────────────────────────── 积分 ──────────────────────────────

export interface PointsEntry {
  /** 由 (userId, action, refId) 稳定派生 → 重复提交天然幂等 */
  id: string;
  userId: string;
  /** 正 = 获得，负 = 消耗 */
  delta: number;
  action: string;
  /** 关联业务单号（orderId / 日期 / 任务名），幂等依据之一 */
  refId: string;
  label: string;
  createdAt: string;
}

export interface PointsAccount {
  userId: string;
  /** 余额 = 全部流水 delta 之和（不做读改写，天然抗并发） */
  balance: number;
  entries: PointsEntry[];
}

// ────────────────────────────── 支付 ──────────────────────────────

export type PaymentProviderName = 'mock' | 'paypal_live';

export interface PaymentIntent {
  transactionId: string;
  provider: PaymentProviderName;
  status: 'created' | 'completed' | 'failed';
  amountCents: number;
  currency: string;
  checkoutId: string;
  /** live 模式下为收银台跳转地址；mock 模式为本地支付确认地址 */
  approveUrl?: string;
  raw?: Record<string, unknown>;
}

export interface PaymentProvider {
  readonly name: PaymentProviderName;
  createPayment(input: {
    checkoutId: string;
    orderIds: string[];
    amountCents: number;
    currency: string;
    userId: string;
  }): Promise<PaymentIntent>;
  capturePayment(transactionId: string): Promise<PaymentIntent>;
}

// ────────────────────────────── 运行时环境 ──────────────────────────────

export interface ShopEnv {
  AUTH_KV: KVNamespace;
  /** T04 orders 表；未绑定时只写 KV（与 orders.ts 一致：KV 为唯一事实源） */
  D1?: D1Database;
  /** 积分抵扣策略 JSON（覆盖代码默认值），非法值自动回退默认，不阻断下单 */
  SHOP_POINTS_POLICY_JSON?: string;
  /** T06 促销规则 JSON（透传给 settleOrder） */
  PROMO_RULES_JSON?: string;
  /** 'paypal_live' 切换真实支付（#3 到位后启用）；默认 / 其它值 = mock */
  PAYMENT_PROVIDER?: string;
  PUBLIC_SITE_URL?: string;
}
