/**
 * T06 ｜ 促销规则引擎 + 权益券模型 · 契约层
 *
 * 硬约束：
 * - 金额一律以「分」为单位（整数），展示层自行换算为 ¥；任何浮点单价在进入引擎前必须先转分。
 * - 规则与券都是**纯数据**（可 JSON 序列化），引擎本身无状态、无随机、无 Date.now()，
 *   所有时间由调用方以 `now`（ms）注入，保证结算可重放 / 可审计。
 * - 业务口径（是否同 SKU、能否跨报告组合、适用域）**尚未最终确认**，一律走配置，默认值见 rules.ts。
 */

// ────────────────────────────── 适用域 ──────────────────────────────

/** 商品分类：规则 / 券按此粒度圈定适用范围 */
export type PromoCategory = 'report' | 'service' | 'subscription';

/** 'all' = 不限制分类 */
export type PromoScopeKind = PromoCategory | 'all';

export interface PromoScope {
  /** 分类范围；'all' 表示不限分类 */
  kind: PromoScopeKind;
  /** SKU 白名单；空数组 = 该分类内全部 SKU 均可 */
  skus: string[];
  /** SKU 黑名单，优先级高于白名单 */
  excludeSkus: string[];
}

// ────────────────────────────── 行项与「件」 ──────────────────────────────

/** 结算入参行项（quantity 会被展开为「件」，规则按件计数） */
export interface PromoLineItem {
  sku: string;
  category: PromoCategory;
  /** 单价（分） */
  unitPrice: number;
  /** 件数，>= 1 */
  quantity: number;
  title?: string;
}

/** 展开后的最小计价单位——规则计数与免单的作用对象 */
export interface PromoUnit {
  sku: string;
  category: PromoCategory;
  /** 该件价格（分） */
  price: number;
  /** 订单内稳定序号，同价时的确定性取舍依据 */
  index: number;
}

// ────────────────────────────── 规则 ──────────────────────────────

/** 规则触发条件；字段缺省即不做该项限制 */
export interface PromoRuleCondition {
  /** 合格商品最少件数（缺省取 action.n） */
  minQualifiedUnits?: number;
  /** 订单小计下限（分） */
  minSubtotal?: number;
  /** 适用域，缺省 = 不限 */
  scope?: PromoScope;
  /** 限定用户标签；空数组 / 缺省 = 不限 */
  userTags?: string[];
}

/** 规则动作（可 JSON 序列化的判别联合） */
export type PromoRuleAction =
  | {
      type: 'buy_n_get_m_free';
      /** 每满 n 件 */
      n: number;
      /** 免除 m 件 */
      m: number;
      /** 免哪几件 */
      pick: 'cheapest' | 'most_expensive';
      /** true = 必须同一 SKU 满 n 才免；false = 允许跨 SKU / 跨报告组合 */
      requireSameSku: boolean;
      /** 单笔最多免几件，0 = 不限 */
      maxFreeUnits: number;
    }
  | {
      type: 'percent_off';
      /** 减免百分比，10 = 减 10% */
      percentOff: number;
      /** 计算基数 */
      applyOn: 'subtotal' | 'qualified_subtotal';
      /** 封顶金额（分），0 = 不封顶 */
      maxDiscount: number;
    };

export interface PromoRule {
  id: string;
  name: string;
  enabled: boolean;
  /** 数字小者先应用 */
  priority: number;
  /** 是否允许与权益券叠加；false = 与券二选一，取更优惠者 */
  stackableWithCoupon: boolean;
  condition: PromoRuleCondition;
  action: PromoRuleAction;
}

/** 单条规则的命中结果 */
export interface PromoRuleOutcome {
  ruleId: string;
  label: string;
  /** 本规则产生的优惠（分） */
  discount: number;
  /** 被免单的 SKU（percent_off 为空数组） */
  freeSkus: string[];
  /** 被免单的件（percent_off 为空数组） */
  freeUnits: PromoUnit[];
  /** 命中时参与计数的合格件数 */
  qualifiedUnitCount: number;
}

// ────────────────────────────── 权益券 ──────────────────────────────

export type CouponType = 'amount_off' | 'percent_off';

/** issued 未核销 / used 已核销 / expired 已过期 / revoked 已作废 */
export type CouponStatus = 'issued' | 'used' | 'expired' | 'revoked';

export interface Coupon {
  code: string;
  type: CouponType;
  status: CouponStatus;
  scope: PromoScope;
  /** type=amount_off 时生效：抵扣金额（分） */
  amountOff?: number;
  /** type=percent_off 时生效：减免百分比，10 = 减 10% */
  percentOff?: number;
  /** percent_off 封顶（分），0 / 缺省 = 不封顶 */
  maxDiscount?: number;
  /** 最低消费门槛（分），按**原价小计**判定；0 / 缺省 = 无门槛 */
  minSpend?: number;
  /** 计算基数：全单小计 或 仅适用域内商品小计 */
  applyOn: 'subtotal' | 'qualified_subtotal';
  /** 生效时间（ms） */
  validFrom: number;
  /** 失效时间（ms） */
  validTo: number;
  /** 归属用户；空 = 不记名券 */
  ownerUserId?: string;
  // ── 以下为核销后回填，构成幂等依据 ──
  usedAt?: number;
  usedByOrderId?: string;
  usedByUser?: string;
}

export type CouponRejectReason =
  | 'not_found'
  | 'already_used'
  | 'revoked'
  | 'expired'
  | 'not_started'
  | 'not_owner'
  | 'scope_not_match'
  | 'below_min_spend'
  | 'invalid_config';

export interface CouponRedeemContext {
  orderId: string;
  userId: string;
  now: number;
}

export type CouponRedeemResult =
  { ok: true; coupon: Coupon; idempotent: boolean } | { ok: false; reason: CouponRejectReason };

/** 券仓储抽象：T04 orders 表落库后，换成 D1 / KV 实现即可，引擎侧零改动 */
export interface CouponStore {
  get(code: string): Promise<Coupon | null>;
  save(coupon: Coupon): Promise<void>;
  /** 核销必须幂等：同一订单重复提交返回结果一致，不同订单重复核销返回 already_used */
  redeem(code: string, ctx: CouponRedeemContext): Promise<CouponRedeemResult>;
}

// ────────────────────────────── 结算 ──────────────────────────────

export interface PromoConfig {
  version: string;
  rules: PromoRule[];
}

export interface SettlementInput {
  orderId: string;
  userId: string;
  items: PromoLineItem[];
  /** 结算时刻（ms），由调用方注入，禁止引擎内部取当前时间 */
  now: number;
  couponCode?: string;
  userTags?: string[];
  /** 规则集覆盖；缺省用 DEFAULT_PROMO_CONFIG */
  config?: PromoConfig;
  /** 传了才会真正核销券；不传则只算不用（用于试算） */
  couponStore?: CouponStore;
}

/** 优惠明细行——写入订单，保证事后可追溯 */
export interface PromoDiscountLine {
  source: 'rule' | 'coupon';
  /** 规则 id 或券码 */
  sourceId: string;
  label: string;
  /** 优惠金额（分） */
  amount: number;
  affectedSkus: string[];
  meta: Record<string, string | number>;
}

export interface SettlementResult {
  orderId: string;
  /** 原价小计（分） */
  subtotal: number;
  discountLines: PromoDiscountLine[];
  ruleDiscount: number;
  couponDiscount: number;
  totalDiscount: number;
  /** 应付（分），不会低于 0 */
  payable: number;
  appliedRuleIds: string[];
  coupon?: {
    code: string;
    applied: boolean;
    reason?: CouponRejectReason;
    idempotent?: boolean;
  };
  /** 人类可读审计轨迹 */
  trace: string[];
}
