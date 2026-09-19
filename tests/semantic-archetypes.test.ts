/**
 * R3-12 双轨原型 + 意象词典 · 回归测试
 *
 * 覆盖：映射表完整性（与 TEN_GOD_REGISTRY 交叉校验）/ 意象词典契约 /
 *       selectArchetype 三级规则（状态轴 · 轨道轴 · 意象轴）/ 红线 / 兜底
 */
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { TEN_GOD_REGISTRY, TEN_GOD_NAMES } from '../packages/core/src/solution/semantic/index.ts';
import {
  ARCHETYPE_MAPPINGS,
  ARCHETYPE_BY_SHISHEN,
  TEN_GOD_ID_LIST,
  normalizeShishenId,
  validateArchetypeMappings,
} from '../packages/core/src/solution/semantic/archetypes.ts';
import { FORBIDDEN_CONTEXTS } from '../packages/core/src/solution/semantic/archetype_types.ts';
import {
  IMAGERY_DICTIONARY,
  FORBIDDEN_IMAGERY,
  listImagery,
  validateImageryDictionary,
} from '../packages/core/src/solution/semantic/imagery.ts';
import { selectArchetype } from '../packages/core/src/solution/semantic/archetype_select.ts';

test('原型映射表：10 个十神全覆盖，且与 TEN_GOD_REGISTRY 同源', () => {
  const tenGodIds = Object.keys(TEN_GOD_REGISTRY);
  assert.equal(tenGodIds.length, 10);

  for (const id of tenGodIds) {
    const mapping = ARCHETYPE_BY_SHISHEN[id];
    assert.ok(mapping, `十神 ${id} 缺原型映射`);
    assert.equal(mapping.shishen_name, TEN_GOD_NAMES[id], `十神 ${id} 中文名不一致`);
    assert.equal(mapping.shishen_id, TEN_GOD_REGISTRY[id].id, `十神 ${id} ID 与术语本体不一致`);
  }

  assert.deepEqual(
    [...TEN_GOD_ID_LIST].sort(),
    [...tenGodIds].sort(),
    'TEN_GOD_ID_LIST 与 TEN_GOD_REGISTRY 键集不一致',
  );
});

test('原型映射表：双轨 × 旺为用/旺为忌 四态齐全，意象域非空', () => {
  const check = validateArchetypeMappings();
  assert.deepEqual(check.errors, []);
  assert.ok(check.ok);

  for (const m of ARCHETYPE_MAPPINGS) {
    for (const track of [m.eastern_archetype, m.dynamic_archetype]) {
      assert.ok(
        track.name.length > 0 && track.description.length > 0,
        `${m.shishen_id} 主原型不完整`,
      );
      assert.ok(
        track.shadow_name.length > 0 && track.shadow_description.length > 0,
        `${m.shishen_id} 失衡态原型不完整`,
      );
      assert.ok(track.suitable_domains.length > 0, `${m.shishen_id} 适用领域为空`);
      assert.ok(track.shadow_domains.length > 0, `${m.shishen_id} 失衡态适用领域为空`);
    }
    assert.ok(m.safe_imagery.length >= 4, `${m.shishen_id} 正向意象不足`);
    assert.ok(m.lifecycle_evolution.liunian_shift.length === 3, `${m.shishen_id} 流年序列非 3 段`);
    for (const ctx of m.forbidden_contexts) {
      assert.ok(
        (FORBIDDEN_CONTEXTS as readonly string[]).includes(ctx),
        `${m.shishen_id} 出现未受控禁忌语境 ${ctx}`,
      );
    }
  }
});

test('意象词典：每十神 ≥5 条，body_target 全覆盖，无禁忌意象混入', () => {
  const check = validateImageryDictionary();
  assert.deepEqual(check.errors, []);
  assert.ok(check.ok);

  assert.equal(Object.keys(IMAGERY_DICTIONARY).length, 10);

  const total = Object.values(IMAGERY_DICTIONARY).flat();
  assert.ok(total.length >= 50, `意象总数应 ≥50，实际 ${total.length}`);
  for (const e of total) {
    assert.ok(e.body_target.trim().length > 0, `${e.image} 缺身体目标感受`);
    assert.ok(!FORBIDDEN_IMAGERY.includes(e.image), `${e.image} 命中全局禁忌意象`);
    assert.ok(e.suitable_domains.length > 0, `${e.image} 缺适用领域`);
  }
});

test('意象查询：按领域过滤，且默认不返回 forbidden 级意象', () => {
  const career = listImagery('QS', { domains: ['career'] });
  assert.ok(career.length > 0);
  assert.ok(career.every((e) => e.suitable_domains.includes('career')));
  assert.ok(career.every((e) => e.cultural_safety !== 'forbidden'));

  // 别名字面量同样可用
  assert.deepEqual(listImagery('qi_sha', { domains: ['career'] }), career);

  // 未知十神返回空，不抛错
  assert.deepEqual(listImagery('not_a_ten_god'), []);
});

test('selectArchetype：旺衰 × 用忌 → 四态映射正确', () => {
  const strongYong = selectArchetype('QS', 'strong', 'yong', { nfc_level: 'high' });
  assert.equal(strongYong.state, 'primary');
  assert.equal(strongYong.activation, 'active');
  assert.equal(strongYong.name, '侠客');

  const strongJi = selectArchetype('QS', 'strong', 'ji', { nfc_level: 'high' });
  assert.equal(strongJi.state, 'shadow');
  assert.equal(strongJi.activation, 'active');
  assert.equal(strongJi.name, '囚徒');

  const weakYong = selectArchetype('QS', 'weak', 'yong', { nfc_level: 'high' });
  assert.equal(weakYong.state, 'primary');
  assert.equal(weakYong.activation, 'latent');
  assert.equal(weakYong.name, '侠客');
  assert.ok(weakYong.description.includes('尚未显化'), '休眠态描述须带未显化提示');

  const weakJi = selectArchetype('QS', 'weak', 'ji', { nfc_level: 'high' });
  assert.equal(weakJi.state, 'shadow');
  assert.equal(weakJi.activation, 'latent');
});

test('selectArchetype：NFC 决定轨道，缺省落东方轨', () => {
  const high = selectArchetype('QS', 'strong', 'yong', { nfc_level: 'high' });
  assert.equal(high.track, 'eastern');
  assert.equal(high.name, '侠客');

  const low = selectArchetype('QS', 'strong', 'yong', { nfc_level: 'low' });
  assert.equal(low.track, 'dynamic');
  assert.equal(low.name, '破壁者');

  const none = selectArchetype('QS', 'strong', 'yong');
  assert.equal(none.track, 'eastern');
  assert.ok(none.trace.matched_rules.some((r) => r.startsWith('R2_track_default')));
});

test('selectArchetype：领域过滤生效，无交集时放宽并留痕', () => {
  const careerOnly = selectArchetype('QS', 'strong', 'yong', {
    nfc_level: 'high',
    domains_of_interest: ['career'],
  });
  assert.deepEqual(careerOnly.suitable_domains, ['career']);
  assert.ok(careerOnly.imagery.every((e) => e.suitable_domains.includes('career')));
  assert.ok(careerOnly.imagery.length > 0);

  // 正官原型领域不含 children → 交集为空，应放宽且留痕
  const voided = selectArchetype('ZG', 'strong', 'yong', {
    nfc_level: 'high',
    domains_of_interest: ['children'],
  });
  assert.ok(voided.suitable_domains.length > 0);
  assert.ok(
    voided.trace.matched_rules.some((r) => r.startsWith('R3_domain_filter_relaxed')),
    '无交集时应留痕',
  );
});

test('selectArchetype：禁忌语境触发红线，未知十神走兜底不抛错', () => {
  const redline = selectArchetype('ZY', 'strong', 'yong', { context: 'health_crisis' });
  assert.equal(redline.redline, true);
  assert.ok(redline.trace.matched_rules.some((r) => r.startsWith('REDLINE:')));

  const clean = selectArchetype('ZY', 'strong', 'yong', { context: 'pregnancy' });
  assert.equal(clean.redline, false);

  const fallback = selectArchetype('unknown_x', 'strong', 'yong', { nfc_level: 'low' });
  assert.equal(fallback.fallback, true);
  assert.equal(fallback.track, 'dynamic');
  assert.ok(fallback.name.length > 0);
  assert.deepEqual(fallback.imagery, []);
});

test('normalizeShishenId：三种写法归一', () => {
  assert.equal(normalizeShishenId('QS'), 'QS');
  assert.equal(normalizeShishenId('qi_sha'), 'QS');
  assert.equal(normalizeShishenId('七杀'), 'QS');
  assert.equal(normalizeShishenId('偏官'), 'QS');
  assert.equal(normalizeShishenId('  shang_guan '), 'SG');
  assert.equal(normalizeShishenId('not_a_ten_god'), undefined);
});
