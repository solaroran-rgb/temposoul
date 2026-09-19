/**
 * 命律 · 双轨原型与意象词典 · 验证 Demo（R3-12）
 *
 * 运行：pnpm tsx packages/core/src/solution/semantic/archetype_demo.ts
 * 或：node_modules/.bin/tsx packages/core/src/solution/semantic/archetype_demo.ts
 *
 * 验证内容：
 * 1. 映射表完整性（10 十神 × 双轨 × 旺为用/旺为忌）
 * 2. 意象词典（10 × 6 条，全部带 body_target）
 * 3. selectArchetype 三级规则：状态轴 / 轨道轴 / 意象轴 + 红线 + 兜底
 */
import { validateArchetypeMappings, ARCHETYPE_MAPPINGS } from './archetypes';
import { validateImageryDictionary, IMAGERY_DICTIONARY, listImagery } from './imagery';
import { selectArchetype } from './archetype_select';

const line = (s = '') => console.log(s);

line('=== R3-12 双轨原型映射表 + 意象词典 · 验证 ===\n');

// ── 1. 映射表自检 ──
const mapCheck = validateArchetypeMappings();
line(`[1] 映射表自检：${mapCheck.ok ? '通过 ✅' : '失败 ❌'}`);
if (!mapCheck.ok) mapCheck.errors.forEach((e) => line(`    - ${e}`));
line('    十神 | 东方轨(用/忌) | 动力学轨(用/忌) | 正意象 | 反意象 | 禁忌语境');
for (const m of ARCHETYPE_MAPPINGS) {
  line(
    `    ${m.shishen_id.padEnd(3)} ${m.shishen_name.padEnd(3)} | ${m.eastern_archetype.name}/${m.eastern_archetype.shadow_name} | ` +
      `${m.dynamic_archetype.name}/${m.dynamic_archetype.shadow_name} | ${m.safe_imagery.length} | ` +
      `${m.caution_imagery.length} | ${m.forbidden_contexts.join(',') || '—'}`,
  );
}

// ── 2. 意象词典自检 ──
const imgCheck = validateImageryDictionary();
line(`\n[2] 意象词典自检：${imgCheck.ok ? '通过 ✅' : '失败 ❌'}`);
if (!imgCheck.ok) imgCheck.errors.forEach((e) => line(`    - ${e}`));

let totalImagery = 0;
let taggedImagery = 0;
for (const entries of Object.values(IMAGERY_DICTIONARY)) {
  totalImagery += entries.length;
  taggedImagery += entries.filter((e) => e.body_target.trim().length > 0).length;
}
line(
  `    十神 ${Object.keys(IMAGERY_DICTIONARY).length} 个，意象 ${totalImagery} 条，` +
    `body_target 覆盖 ${taggedImagery}/${totalImagery}`,
);

line('\n    样例（七杀 · 事业域）：');
for (const e of listImagery('QS', { domains: ['career'] })) {
  line(`      ${e.image} → ${e.body_target} [${e.cultural_safety}]`);
}

// ── 3. 选择规则 ──
line('\n[3] selectArchetype 三级规则：\n');

const cases: Array<Parameters<typeof selectArchetype>> = [
  ['QS', 'strong', 'yong', { nfc_level: 'high', domains_of_interest: ['career', 'decision'] }],
  ['QS', 'strong', 'ji', { nfc_level: 'low', domains_of_interest: ['career'] }],
  ['SG', 'weak', 'yong', { nfc_level: 'low', domains_of_interest: ['career'] }],
  ['ZG', 'strong', 'yong', {}],
  [
    'ZY',
    'strong',
    'yong',
    { nfc_level: 'high', domains_of_interest: ['career'], context: 'health_crisis' },
  ],
  ['七杀', 'weak', 'ji', { nfc_level: 'low' }],
  ['unknown_x', 'strong', 'yong', { nfc_level: 'low' }],
];

for (const [id, strength, useType, profile] of cases) {
  const r = selectArchetype(id, strength, useType, profile);
  line(
    `    ${String(id).padEnd(10)} ${strength}/${useType} → [${r.track}] ${r.name} ` +
      `(${r.state}/${r.activation}) 意象 ${r.imagery.length} | redline=${r.redline} | fallback=${r.fallback}`,
  );
  line(`      领域：${r.suitable_domains.join(',')}`);
  line(`      描述：${r.description}`);
  line(`      规则：${r.trace.matched_rules.join(' · ')}`);
  line('');
}

// ── 4. 汇总 ──
const ok = mapCheck.ok && imgCheck.ok;
line('=== 验证结论 ===');
line(
  `映射表 ${mapCheck.ok ? '✅' : '❌'} | 意象词典 ${imgCheck.ok ? '✅' : '❌'} | ` +
    `意象 ${totalImagery} 条 / body_target ${taggedImagery} 条`,
);
line(ok ? '\nR3-12 数据层验证通过。' : '\n存在失败项，见上方明细。');
