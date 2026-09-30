import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  DEFAULT_PROMO_CONFIG,
  applyRule,
  applyRules,
  expandUnits,
  resolvePromoConfig,
  sumUnits,
} from '../src/lib/commerce/promo/rules.ts';
import type { PromoLineItem, PromoRule } from '../src/lib/commerce/promo/types.ts';

/** 报告类 SKU 行项构造器（金额单位：分） */
const report = (sku: string, unitPrice: number, quantity = 1): PromoLineItem => ({
  sku,
  category: 'report',
  unitPrice,
  quantity,
});

const sub = (sku: string, unitPrice: number): PromoLineItem => ({
  sku,
  category: 'subscription',
  unitPrice,
  quantity: 1,
});

const defaultRule: PromoRule = DEFAULT_PROMO_CONFIG.rules[0];

function evalDefault(items: PromoLineItem[]) {
  const units = expandUnits(items);
  return applyRule(defaultRule, { units, subtotal: sumUnits(units), userTags: [] });
}

// ───────────────── 默认规则边界：买三免一 ─────────────────

test('买三免一：2 件不触发免单', () => {
  assert.equal(evalDefault([report('report_39_9', 3990), report('premium_88', 8800)]), null);
});

test('买三免一：3 件免除最低价 1 件', () => {
  const out = evalDefault([
    report('report_39_9', 3990),
    report('event_9_9', 990),
    report('premium_88', 8800),
  ]);
  assert.ok(out);
  assert.equal(out.discount, 990, '免的是最低价那一件');
  assert.deepEqual(out.freeSkus, ['event_9_9']);
  assert.equal(out.qualifiedUnitCount, 3);
});

test('买三免一：4 件仍只免 1 件（floor(4/3)=1）', () => {
  const out = evalDefault([
    report('report_39_9', 3990),
    report('event_9_9', 990),
    report('premium_88', 8800),
    report('event_9_9', 990),
  ]);
  assert.ok(out);
  assert.equal(out.freeUnits.length, 1);
  assert.equal(out.discount, 990);
});

test('买三免一：6 件免 2 件（取最便宜的两件）', () => {
  const out = evalDefault([
    report('event_9_9', 990),
    report('event_9_9', 990),
    report('event_9_9', 990),
    report('report_39_9', 3990),
    report('premium_88', 8800),
    report('report_39_9', 3990),
  ]);
  assert.ok(out);
  assert.equal(out.freeUnits.length, 2);
  assert.equal(out.discount, 1980);
});

test('买三免一：价格完全相同的 3 件，免单金额等于单价且结果确定', () => {
  const out = evalDefault([
    report('report_39_9', 3990),
    report('report_39_9', 3990),
    report('report_39_9', 3990),
  ]);
  assert.ok(out);
  assert.equal(out.discount, 3990);
  assert.deepEqual(
    out.freeUnits.map((u) => u.index),
    [0],
    '同价按 index 升序取第一件，保证可重放',
  );
});

test('买三免一：quantity>1 的行项按件展开计数', () => {
  const out = evalDefault([report('event_9_9', 990, 3)]);
  assert.ok(out);
  assert.equal(out.qualifiedUnitCount, 3);
  assert.equal(out.discount, 990);
});

test('买三免一：默认适用域只含报告类，订阅类不参与计数', () => {
  const out = evalDefault([
    report('report_39_9', 3990),
    report('event_9_9', 990),
    sub('sub_monthly_19_9', 1990),
  ]);
  assert.equal(out, null, '合格件数只有 2，不触发');
});

// ───────────────── 配置化：动作参数 ─────────────────

test('配置生效：requireSameSku=true 时，3 个不同 SKU 各 1 件不免', () => {
  const rule: PromoRule = {
    ...defaultRule,
    action: { ...defaultRule.action, requireSameSku: true } as PromoRule['action'],
  };
  const units = expandUnits([
    report('event_9_9', 990),
    report('report_39_9', 3990),
    report('premium_88', 8800),
  ]);
  assert.equal(applyRule(rule, { units, subtotal: sumUnits(units), userTags: [] }), null);
});

test('配置生效：requireSameSku=true 时，同一 SKU 3 件免 1 件', () => {
  const rule: PromoRule = {
    ...defaultRule,
    action: { ...defaultRule.action, requireSameSku: true } as PromoRule['action'],
  };
  const units = expandUnits([report('event_9_9', 990, 3)]);
  const out = applyRule(rule, { units, subtotal: sumUnits(units), userTags: [] });
  assert.ok(out);
  assert.equal(out.discount, 990);
});

test('配置生效：maxFreeUnits 限制单笔免单件数', () => {
  const rule: PromoRule = {
    ...defaultRule,
    action: { ...defaultRule.action, maxFreeUnits: 1 } as PromoRule['action'],
  };
  const units = expandUnits([report('event_9_9', 990, 9)]);
  const out = applyRule(rule, { units, subtotal: sumUnits(units), userTags: [] });
  assert.ok(out);
  assert.equal(out.freeUnits.length, 1, '9 件本应免 3 件，被上限压到 1 件');
});

test('配置生效：pick=most_expensive 改为免最高价一件', () => {
  const rule: PromoRule = {
    ...defaultRule,
    action: { ...defaultRule.action, pick: 'most_expensive' } as PromoRule['action'],
  };
  const units = expandUnits([
    report('event_9_9', 990),
    report('report_39_9', 3990),
    report('premium_88', 8800),
  ]);
  const out = applyRule(rule, { units, subtotal: sumUnits(units), userTags: [] });
  assert.ok(out);
  assert.equal(out.discount, 8800);
});

test('配置生效：enabled=false 的规则直接跳过', () => {
  const units = expandUnits([report('event_9_9', 990, 3)]);
  assert.equal(
    applyRule(
      { ...defaultRule, enabled: false },
      { units, subtotal: sumUnits(units), userTags: [] },
    ),
    null,
  );
});

test('配置生效：minSubtotal 门槛未达不触发', () => {
  const rule: PromoRule = {
    ...defaultRule,
    condition: { ...defaultRule.condition, minSubtotal: 100000 },
  };
  const units = expandUnits([report('event_9_9', 990, 3)]);
  assert.equal(applyRule(rule, { units, subtotal: sumUnits(units), userTags: [] }), null);
});

test('配置生效：userTags 不匹配时不触发', () => {
  const rule: PromoRule = {
    ...defaultRule,
    condition: { ...defaultRule.condition, userTags: ['vip'] },
  };
  const units = expandUnits([report('event_9_9', 990, 3)]);
  assert.equal(applyRule(rule, { units, subtotal: sumUnits(units), userTags: [] }), null);
  assert.ok(applyRule(rule, { units, subtotal: sumUnits(units), userTags: ['vip'] }));
});

// ───────────────── 多规则串行：防重复免单 ─────────────────

test('多规则串行：同一件不会被两条规则重复免单', () => {
  const buy3: PromoRule = { ...defaultRule, id: 'r1', priority: 10 };
  const buy2: PromoRule = {
    ...defaultRule,
    id: 'r2',
    priority: 20,
    action: {
      type: 'buy_n_get_m_free',
      n: 2,
      m: 1,
      pick: 'cheapest',
      requireSameSku: false,
      maxFreeUnits: 0,
    },
  };
  const items = [report('event_9_9', 990, 2), report('premium_88', 8800)];
  const units = expandUnits(items);
  const res = applyRules([buy3, buy2], { units, subtotal: sumUnits(units), userTags: [] });
  const discount = res.outcomes.reduce((a, o) => a + o.discount, 0);
  assert.equal(discount, 990, '第二条规则只能免剩下未被占用的件');
  const claimed = [...res.claimedIndexes].sort();
  assert.deepEqual(claimed, [...new Set(claimed)], '被占用的件序号不重复');
});

// ───────────────── 外部配置装载 ─────────────────

test('规则配置：JSON 覆盖生效（改成买二免一）', () => {
  const raw = JSON.stringify({
    version: 'test.v1',
    rules: [
      {
        id: 'buy2_get1_free',
        name: '买二免一',
        enabled: true,
        priority: 100,
        stackableWithCoupon: false,
        condition: { minQualifiedUnits: 2, scope: { kind: 'all', skus: [], excludeSkus: [] } },
        action: {
          type: 'buy_n_get_m_free',
          n: 2,
          m: 1,
          pick: 'cheapest',
          requireSameSku: false,
          maxFreeUnits: 0,
        },
      },
    ],
  });
  const config = resolvePromoConfig(raw);
  assert.equal(config.version, 'test.v1');
  const units = expandUnits([report('event_9_9', 990), report('premium_88', 8800)]);
  const out = applyRule(config.rules[0], { units, subtotal: sumUnits(units), userTags: [] });
  assert.ok(out, '买二免一：2 件即触发');
  assert.equal(out.discount, 990);
});

test('规则配置：非法 JSON / 空值回退默认配置，不阻断下单', () => {
  assert.equal(resolvePromoConfig('{ 坏 JSON').version, DEFAULT_PROMO_CONFIG.version);
  assert.equal(resolvePromoConfig(undefined).version, DEFAULT_PROMO_CONFIG.version);
  assert.equal(resolvePromoConfig('{"rules":[]}').version, DEFAULT_PROMO_CONFIG.version);
});

test('规则配置：SKU 黑名单生效', () => {
  const raw = JSON.stringify({
    version: 'test.blacklist',
    rules: [
      {
        id: 'r',
        name: '买三免一（排除特价）',
        enabled: true,
        priority: 100,
        stackableWithCoupon: false,
        condition: {
          minQualifiedUnits: 3,
          scope: { kind: 'report', skus: [], excludeSkus: ['event_9_9'] },
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
  });
  const config = resolvePromoConfig(raw);
  const units = expandUnits([
    report('event_9_9', 990),
    report('report_39_9', 3990),
    report('premium_88', 8800),
  ]);
  assert.equal(
    applyRule(config.rules[0], { units, subtotal: sumUnits(units), userTags: [] }),
    null,
    'event_9_9 被排除后只剩 2 件合格',
  );
});
