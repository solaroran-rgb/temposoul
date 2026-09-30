/**
 * T14 ｜ 轻量商店 · 对外出口
 *
 * ```ts
 * // 加购
 * await addItem(env, userId, 'report_bazi_full', 2);
 * // 下单（幂等键由前端生成，重复提交只会有 1 单）
 * const { checkout, orders, payment } = await checkoutFromCart(env, { userId, idempotencyKey });
 * // 支付确认（mock）→ 订单 pending → completed
 * await captureCheckout(env, userId, checkout.id);
 * ```
 */

export type {
  Cart,
  CartItem,
  CartView,
  CheckoutRecord,
  OrderStatus,
  PaymentIntent,
  PaymentProvider,
  PaymentProviderName,
  PointsAccount,
  PointsEntry,
  Product,
  ProductCategory,
  ProductInput,
  ProductStatus,
  ShopEnv,
  ShopOrder,
} from './types.ts';

/** 券仓接口（T06 预留）：注入真实券仓后，结算即可自动核销权益券 */
export type { CouponStore } from '../promo/types.ts';

export type { PointsPolicy, PointsQuote } from './config.ts';
export type { AppendInput } from './points.ts';
export type { CheckoutInput, CheckoutResult } from './checkout.ts';

export {
  DEFAULT_CURRENCY,
  DEFAULT_POINTS_POLICY,
  MAX_CART_LINES,
  MAX_QUANTITY_PER_LINE,
  quotePointsDeduction,
  resolvePointsPolicy,
} from './config.ts';

export {
  SEED_PRODUCTS,
  createProduct,
  decreaseStock,
  ensureSeedProducts,
  getCatalogItem,
  increaseStock,
  isValidSku,
  listCatalog,
  parseProductInput,
  setProductStatus,
  updateProduct,
  ShopError,
} from './catalog.ts';

export {
  addItem,
  clearUserCart,
  getCartView,
  removeItem,
  resolveCartProducts,
  setItemQuantity,
} from './cart.ts';

export {
  appendEntry,
  buildEntryId,
  getAccount,
  getBalance,
  grantPoints,
  refundPoints,
  spendPoints,
} from './points.ts';

export {
  MockPaymentProvider,
  PayPalLiveProvider,
  createPaymentProvider,
} from './payment.ts';

export {
  allocateAmounts,
  cancelOrder,
  captureCheckout,
  checkoutFromCart,
  getOwnOrder,
  loadOrders,
} from './checkout.ts';

export {
  KEYS,
  genCheckoutId,
  genOrderId,
  genTransactionId,
  getCart,
  getCheckout,
  getOrder,
  getPayment,
  getProduct,
  listOrders,
  listPointsEntries,
  listProducts,
  purgeUserShopData,
  putCart,
  putCheckout,
  putOrder,
  putPayment,
  putProduct,
  readIdempotency,
  stableHash,
  writeIdempotency,
} from './store.ts';
