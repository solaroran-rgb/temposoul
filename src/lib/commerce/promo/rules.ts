/**
 * T06 ｜ 规则引擎（条件 + 动作）
 *
 * 设计要点：
 * - 纯函数：无 IO、无随机、无 Date.now()，同一入参必得同一结果。
 * - 多条规则串行应用，先命中的规则会**占用**被免单的件，后续规则不得重复免同一件（防叠加漏洞）。
 * - 默认规则 = buy3-get1-free（买三免一，免最低价 1 件），口径待业务最终确认，全部参数可配。
 */

import type {
  PromoCategory,
  PromoConfig,
  PromoLineItem,
  PromoRule,
  PromoRuleAction,
  PromoRuleCondition,
  PromoRuleOutcome,
  PromoScope,
  PromoUnit,
} from './types.ts';

/** SKU → 分类的默认映射；与 src/lib/server/payment.ts 的 PRODUCT_CATALOG 保持一致，新增 SKU 时两边同步 */
export const DEFAULT_SKU_CATEGORY: Readonly<Record<string, PromoCategory>> = {
  event_9_9: 'report',
  report_39_9: 'report',
  premium_88: 'report',
  sub_monthly_19_9: 'subscription',
  sub_yearly_168: 'subscription',
};

export const DEFAULT_PROMO_RULE_ID = 'buy3_get1_free_v1';

/**
 * 默认规则集（保守口径）：
 * - 适用域 = report（仅报告类，订阅 / 服务类不参与）
 * - requireSameSku = false（允许跨 SKU / 跨报告组合）
 * - stackableWithCoupon = false（免单与权益券二选一，取更优惠者）
 * ⚠️ 以上三条均为**待业务确认项**，改动入口见 docs/commerce 配置说明文档。
 */
export const DEFAULT_PROMO_CONFIG: PromoConfig = {
  version: '2026-09-30.v1',
  rules: [
    {
      id: DEFAULT_PROMO_RULE_ID,
      name: '买三免一（免最低价 1 件）',
      enabled: true,
      priority: 100,
      stackableWithCoupon: false,
      condition: {
        minQualifiedUnits: 3,
        scope: { kind: 'report', skus: [], excludeSkus: [] },
      },
      action: {
        type: 'buy_n_get_m_free',
        n: 3,
        m: 1,
        pick: 'cheapest',
        requireSameSku: false,
        maxFreeUnits: 0,
      },
    },
  ],
};

// ────────────────────────────── 基础工具 ──────────────────────────────

/** 行项 → 件（规则计数与免单的最小单位） */
export function expandUnits(items: readonly PromoLineItem[]): PromoUnit[] {
  const units: PromoUnit[] = [];
  let index = 0;
  for (const item of items) {
    const qty = Math.max(0, Math.floor(item.quantity));
    for (let i = 0; i < qty; i += 1) {
      units.push({
        sku: item.sku,
        category: item.category,
        price: Math.max(0, Math.round(item.unitPrice)),
        index,
      });
      index += 1;
    }
  }
  return units;
}

export function sumUnits(units: readonly PromoUnit[]): number {
  return units.reduce((acc, u) => acc + u.price, 0);
}

export function isInScope(category: PromoCategory, sku: string, scope?: PromoScope): boolean {
  if (!scope) return true;
  if (scope.kind !== 'all' && scope.kind !== category) return false;
  if (scope.excludeSkus.includes(sku)) return false;
  if (scope.skus.length > 0 && !scope.skus.includes(sku)) return false;
  return true;
}

function scopeLabel(scope?: PromoScope): string {
  if (!scope) return '全部商品';
  if (scope.kind === 'all') return '全部商品';
  return scope.kind === 'report' ? '报告类' : scope.kind === 'service' ? '服务类' : '订阅类';
}

/** 按条件筛出合格件：适用域 → 用户标签 → 小计门槛 */
export function filterQualifiedUnits(
  units: readonly PromoUnit[],
  condition: PromoRuleCondition,
  ctx: { subtotal: number; userTags: readonly string[] },
): PromoUnit[] {
  const scope = condition.scope;
  const qualified = units.filter((u) => isInScope(u.category, u.sku, scope));
  if (qualified.length === 0) return [];
  if (condition.userTags && condition.userTags.length > 0) {
    const hit = condition.userTags.some((tag) => ctx.userTags.includes(tag));
    if (!hit) return [];
  }
  if (condition.minSubtotal && ctx.subtotal < condition.minSubtotal) return [];
  return qualified;
}

/** 确定性取件：同价时按 index 升序，保证同一订单多次结算结果一致 */
function pickUnits(
  units: readonly PromoUnit[],
  count: number,
  pick: 'cheapest' | 'most_expensive',
): PromoUnit[] {
  const sorted = [...units].sort((a, b) => {
    if (a.price !== b.price) return pick === 'cheapest' ? a.price - b.price : b.price - a.price;
    return a.index - b.index;
  });
  return sorted.slice(0, Math.max(0, count));
}

// ────────────────────────────── 动作求值 ──────────────────────────────

function evalBuyNGetMFree(
  rule: PromoRule,
  action: Extract<PromoRuleAction, { type: 'buy_n_get_m_free' }>,
  units: readonly PromoUnit[],
): PromoRuleOutcome | null {
  const n = Math.max(1, Math.floor(action.n));
  const m = Math.max(0, Math.floor(action.m));
  const min = rule.condition.minQualifiedUnits ?? n;
  if (units.length < min || m === 0) return null;

  let free: PromoUnit[] = [];
  if (action.requireSameSku) {
    const groups = new Map<string, PromoUnit[]>();
    for (const u of units) {
      const list = groups.get(u.sku);
      if (list) list.push(u);
      else groups.set(u.sku, [u]);
    }
    for (const group of groups.values()) {
      const count = Math.floor(group.length / n) * m;
      if (count > 0) free = free.concat(pickUnits(group, count, action.pick));
    }
  } else {
    const count = Math.floor(units.length / n) * m;
    if (count > 0) free = pickUnits(units, count, action.pick);
  }

  if (action.maxFreeUnits > 0 && free.length > action.maxFreeUnits) {
    free = pickUnits(free, action.maxFreeUnits, action.pick);
  }
  if (free.length === 0) return null;

  const discount = sumUnits(free);
  if (discount <= 0) return null;

  return {
    ruleId: rule.id,
    label: `${rule.name}（满 ${n} 件免 ${m} 件 · ${action.pick === 'cheapest' ? '免最低价' : '免最高价'}）`,
    discount,
    freeSkus: free.map((u) => u.sku),
    freeUnits: free,
    qualifiedUnitCount: units.length,
  };
}

function evalPercentOff(
  rule: PromoRule,
  action: Extract<PromoRuleAction, { type: 'percent_off' }>,
  units: readonly PromoUnit[],
  subtotal: number,
): PromoRuleOutcome | null {
  if (units.length === 0) return null;
  const base = action.applyOn === 'qualified_subtotal' ? sumUnits(units) : subtotal;
  if (base <= 0) return null;
  // 向下取整到「分」：让利取小，避免向上取整放大优惠
  let discount = Math.floor((base * action.percentOff) / 100);
  if (action.maxDiscount > 0) discount = Math.min(discount, action.maxDiscount);
  if (discount <= 0) return null;
  return {
    ruleId: rule.id,
    label: `${rule.name}（${action.percentOff}% off · 基数 ${action.applyOn === 'qualified_subtotal' ? '适用域小计' : '全单小计'}）`,
    discount,
    freeSkus: [],
    freeUnits: [],
    qualifiedUnitCount: units.length,
  };
}

/** 对单条规则求值；不命中返回 null */
export function applyRule(
  rule: PromoRule,
  ctx: { units: readonly PromoUnit[]; subtotal: number; userTags: readonly string[] },
): PromoRuleOutcome | null {
  if (!rule.enabled) return null;
  const qualified = filterQualifiedUnits(ctx.units, rule.condition, ctx);
  if (qualified.length === 0) return null;
  if (rule.action.type === 'buy_n_get_m_free') {
    return evalBuyNGetMFree(rule, rule.action, qualified);
  }
  return evalPercentOff(rule, rule.action, qualified, ctx.subtotal);
}

export interface ApplyRulesResult {
  outcomes: PromoRuleOutcome[];
  /** 规则优惠合计（分） */
  discount: number;
  /** 被免单 / 已被占用的件序号，供券计算跳过 */
  claimedIndexes: Set<number>;
  /** 是否存在不可与券叠加的命中规则 */
  hasNonStackableRule: boolean;
  trace: string[];
}

/**
 * 串行应用规则集：按 priority 升序，命中即占用对应件，避免同一件被两条规则重复免单。
 */
export function applyRules(
  rules: readonly PromoRule[],
  ctx: { units: readonly PromoUnit[]; subtotal: number; userTags: readonly string[] },
): ApplyRulesResult {
  const outcomes: PromoRuleOutcome[] = [];
  const claimed = new Set<number>();
  const trace: string[] = [];
  let discount = 0;
  let hasNonStackableRule = false;

  const ordered = [...rules].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));

  for (const rule of ordered) {
    const remaining = ctx.units.filter((u) => !claimed.has(u.index));
    const outcome = applyRule(rule, { ...ctx, units: remaining });
    if (!outcome) {
      trace.push(`规则 ${rule.id} 未命中`);
      continue;
    }
    outcomes.push(outcome);
    discount += outcome.discount;
    for (const u of outcome.freeUnits) claimed.add(u.index);
    if (!rule.stackableWithCoupon) hasNonStackableRule = true;
    trace.push(
      `规则 ${rule.id} 命中：合格 ${outcome.qualifiedUnitCount} 件，优惠 ${outcome.discount} 分` +
        (outcome.freeSkus.length ? `，免单 SKU=${outcome.freeSkus.join(',')}` : ''),
    );
  }

  return { outcomes, discount, claimedIndexes: claimed, hasNonStackableRule, trace };
}

// ────────────────────────────── 配置装载 ──────────────────────────────

/**
 * 解析外部规则配置（JSON 字符串）。
 * 每次调用实时解析、不做进程内缓存 —— 配置改动**下一次请求即生效**（热更）。
 * 写在代码里的 DEFAULT_PROMO_CONFIG 则需重新构建部署。
 * 解析失败 / 结构非法一律回退默认配置，绝不让促销故障阻断下单。
 */
export function resolvePromoConfig(raw?: string | null): PromoConfig {
  if (!raw) return DEFAULT_PROMO_CONFIG;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const config = normalizeConfig(parsed);
    return config ?? DEFAULT_PROMO_CONFIG;
  } catch {
    return DEFAULT_PROMO_CONFIG;
  }
}

function normalizeConfig(input: unknown): PromoConfig | null {
  if (typeof input !== 'object' || input === null) return null;
  const obj = input as Record<string, unknown>;
  if (!Array.isArray(obj.rules)) return null;
  const rules: PromoRule[] = [];
  for (const item of obj.rules) {
    const rule = normalizeRule(item);
    if (rule) rules.push(rule);
  }
  if (rules.length === 0) return null;
  return {
    version: typeof obj.version === 'string' ? obj.version : 'custom',
    rules,
  };
}

function normalizeRule(input: unknown): PromoRule | null {
  if (typeof input !== 'object' || input === null) return null;
  const r = input as Record<string, unknown>;
  if (typeof r.id !== 'string' || !r.id) return null;
  const action = normalizeAction(r.action);
  if (!action) return null;
  const cond = (
    typeof r.condition === 'object' && r.condition !== null ? r.condition : {}
  ) as Record<string, unknown>;
  return {
    id: r.id,
    name: typeof r.name === 'string' ? r.name : r.id,
    enabled: r.enabled !== false,
    priority: Number.isFinite(r.priority) ? Number(r.priority) : 100,
    stackableWithCoupon: r.stackableWithCoupon === true,
    condition: {
      minQualifiedUnits: Number.isFinite(cond.minQualifiedUnits)
        ? Number(cond.minQualifiedUnits)
        : undefined,
      minSubtotal: Number.isFinite(cond.minSubtotal) ? Number(cond.minSubtotal) : undefined,
      scope: normalizeScope(cond.scope),
      userTags: Array.isArray(cond.userTags)
        ? cond.userTags.filter((t) => typeof t === 'string')
        : [],
    },
    action,
  };
}

function normalizeAction(input: unknown): PromoRuleAction | null {
  if (typeof input !== 'object' || input === null) return null;
  const a = input as Record<string, unknown>;
  if (a.type === 'buy_n_get_m_free') {
    return {
      type: 'buy_n_get_m_free',
      n: Number.isFinite(a.n) ? Math.max(1, Number(a.n)) : 3,
      m: Number.isFinite(a.m) ? Math.max(0, Number(a.m)) : 1,
      pick: a.pick === 'most_expensive' ? 'most_expensive' : 'cheapest',
      requireSameSku: a.requireSameSku === true,
      maxFreeUnits: Number.isFinite(a.maxFreeUnits) ? Math.max(0, Number(a.maxFreeUnits)) : 0,
    };
  }
  if (a.type === 'percent_off') {
    return {
      type: 'percent_off',
      percentOff: Number.isFinite(a.percentOff) ? Math.max(0, Number(a.percentOff)) : 0,
      applyOn: a.applyOn === 'qualified_subtotal' ? 'qualified_subtotal' : 'subtotal',
      maxDiscount: Number.isFinite(a.maxDiscount) ? Math.max(0, Number(a.maxDiscount)) : 0,
    };
  }
  return null;
}

function normalizeScope(input: unknown): PromoScope | undefined {
  if (typeof input !== 'object' || input === null) return undefined;
  const s = input as Record<string, unknown>;
  const kind =
    s.kind === 'report' || s.kind === 'service' || s.kind === 'subscription' ? s.kind : 'all';
  return {
    kind,
    skus: Array.isArray(s.skus) ? s.skus.filter((x) => typeof x === 'string') : [],
    excludeSkus: Array.isArray(s.excludeSkus)
      ? s.excludeSkus.filter((x) => typeof x === 'string')
      : [],
  };
}

export { scopeLabel };
