/**
 * 命律 · R3-13 Demo：散文诗生成 + 反巴纳姆校验
 * ============================================================
 * 运行：npx tsx packages/core/src/solution/semantic/prose_demo.ts
 *
 * 覆盖：
 *   1. 三个十神示例散文诗（七杀 / 正官 / 伤官）—— 原型由 R3-12 selectArchetype 提供
 *   2. 反巴纳姆校验（IG 分数 + 具体化元素明细）
 *   3. 负样本对照（通用鸡汤 / 伪个性化 / 证据锚定救回）
 *   4. 降级逻辑（低置信 / 高负极性集中 / 无原型）
 *   5. 意象新鲜度衰减
 */
import { generateProsePoem, type ProseAtom, type ProsePoem } from './prose_generator';
import { validateAntiBarnum, generalizePoem } from './anti_barnum';
import type { EpistemicModality, FactPolarity } from './types';
import type { ArchetypeDomain } from './archetype_types';
import type { UserProfile } from './solution';

const profile: UserProfile = {
  ageRange: '26-35',
  gender: 'male',
  lifeStage: 'career',
  focusArea: 'career',
  detailLevel: 'standard',
};

function mk(
  atomicId: string,
  termId: string,
  polarity: FactPolarity,
  confidence: number,
  modality: EpistemicModality,
  domain: ArchetypeDomain,
  evidence: Record<string, unknown>
): ProseAtom {
  return { atomicId, termId, polarity, confidence, modality, domain, evidence };
}

function divider(text: string): void {
  console.log(`\n${'='.repeat(64)}\n${text}\n${'='.repeat(64)}`);
}

function printPoem(title: string, poem: ProsePoem): void {
  divider(`【${title}】`);
  if (poem.degraded) {
    console.log(`降级（${poem.degradation_reason}）`);
    console.log(`输出：${poem.anchor_line}`);
    console.log(`IG = ${poem.ig_score}｜通过 = ${poem.passed_barnum_check}`);
    console.log(`判定：${poem.anti_barnum.reason}`);
    return;
  }
  console.log(`原型：${poem.archetype}（${poem.archetype_track} 轨）｜${poem.archetype_description}`);
  console.log(`新鲜度：${poem.freshness_factor}`);
  console.log('\n--- 诗骨 ---');
  poem.lines.forEach((l, i) => console.log(`  ${i + 1}. ${l.text}      [${l.atom_id}]`));
  console.log(`  ·  ${poem.anchor_line}`);
  console.log('\n--- 白话注解 ---');
  for (const g of poem.gloss) console.log(`  [${g.atom_id}] ${g.term_name}：${g.text}`);
  console.log('\n--- 反巴纳姆校验 ---');
  console.log(`  IG = ${poem.ig_score.toFixed(2)}｜通过 = ${poem.passed_barnum_check}｜待复核 = ${poem.needs_review}`);
  const elems = poem.anti_barnum.elements
    .map((e) => `${e.type}:${e.value}${e.is_personal ? '(命盘锚定)' : ''}`)
    .join(' / ');
  console.log(`  具体化元素：${elems || '（无）'}`);
  console.log(`  判定：${poem.anti_barnum.reason}`);
}

// ============================================================
// ① 七杀（事业为主，命盘含西北方位 + 立秋节点）
// ============================================================

const QS_ATOMS: ProseAtom[] = [
  mk('ATOM-QS-SZ-001', 'QS', '+', 0.86, 'assert', 'career', {
    tenGods: { month: '七杀' },
    pillars: { month: { ganZhi: '庚申' } },
    anchor: { direction: '西北', solarTerm: '立秋' },
  }),
  mk('ATOM-QS-PY-001', 'QS', '+', 0.72, 'likely', 'timing', {
    luckInfo: { cycles: [{ tenGod: '七杀', ganZhi: '庚申' }] },
    anchor: { direction: '西北' },
  }),
  mk('ATOM-QS-CF-014', 'QS', '+', 0.64, 'likely', 'relationship', {
    evidence_note: '日支见杀，关系里习惯先退半步再判断',
  }),
  mk('ATOM-QS-HL-021', 'QS', '+', 0.58, 'tend', 'health', {
    evidence_note: '金气偏旺，肩颈负荷偏高',
  }),
];

// ============================================================
// ② 正官（含正南方位 + 霜降节点）
// ============================================================

const ZG_ATOMS: ProseAtom[] = [
  mk('ATOM-ZG-SZ-001', 'ZG', '+', 0.81, 'assert', 'career', {
    tenGods: { month: '正官' },
    anchor: { direction: '正南', solarTerm: '霜降' },
  }),
  mk('ATOM-ZG-WL-003', 'ZG', '+', 0.69, 'likely', 'wealth', {
    evidence_note: '官星护财，收入结构偏稳定',
  }),
  mk('ATOM-ZG-RT-007', 'ZG', '+', 0.55, 'tend', 'timing', {
    evidence_note: '月令主气循常规节律推进',
  }),
];

// ============================================================
// ③ 伤官（关系 + 自我表达）
// ============================================================

const SG_ATOMS: ProseAtom[] = [
  mk('ATOM-SG-SZ-001', 'SG', '+', 0.78, 'assert', 'relationship', {
    tenGods: { month: '伤官' },
    anchor: { direction: '东南' },
  }),
  mk('ATOM-SG-CF-011', 'SG', '+', 0.66, 'likely', 'career', {
    evidence_note: '伤官见官要表达空间，宜走创作 / 顾问型路径',
  }),
  mk('ATOM-SG-HL-018', 'SG', '+', 0.52, 'tend', 'mind', {
    evidence_note: '火气偏旺，言语消耗后喉咙易紧',
  }),
];

// ============================================================
// 主流程
// ============================================================

console.log('命律 · R3-13 反巴纳姆校验与散文诗生成 · Demo');
console.log(`画像：${profile.ageRange} / ${profile.gender} / ${profile.focusArea}`);

printPoem(
  '示例 1 · 七杀',
  generateProsePoem(QS_ATOMS, profile, { nfc_level: 'low' }, { seed: 'qs-2026-09-19' })
);
printPoem(
  '示例 1b · 七杀（NFC high，东方轨）',
  generateProsePoem(QS_ATOMS, profile, { nfc_level: 'high' }, { seed: 'qs-eastern' })
);
printPoem(
  '示例 2 · 正官',
  generateProsePoem(ZG_ATOMS, profile, { nfc_level: 'low' }, { seed: 'zg-2026-09-19' })
);
printPoem(
  '示例 3 · 伤官',
  generateProsePoem(SG_ATOMS, profile, { nfc_level: 'low' }, { seed: 'sg-2026-09-19' })
);

// ============================================================
// 负样本对照（判别力验证）
// ============================================================

divider('负样本对照 · 判别力验证');

const soup = '你是一个有潜力的人，未来会有转机，身边的人会支持你，你会越来越好。';
const fakePersonal = '西北方向有你的贵人，三次机会将到来，你会闻到铁与盐的气味，那是第二个秋天的风。';
const anchored = '风从西北来，带着铁与盐的气味。';

const cases: Array<{ name: string; text: string; atoms: ProseAtom[] }> = [
  { name: 'A. 通用鸡汤（无具体元素）', text: soup, atoms: [] },
  { name: 'B. 伪个性化（全是可泛化套话，且无命盘证据）', text: fakePersonal, atoms: [] },
  { name: 'C. 同文本 + 命盘证据含「西北」（锚定救回）', text: anchored, atoms: QS_ATOMS },
];

for (const c of cases) {
  const r = validateAntiBarnum(c.text, c.atoms);
  console.log(`\n${c.name}`);
  console.log(`  文本：${c.text}`);
  console.log(`  IG = ${r.ig_score.toFixed(2)}｜通过 = ${r.passed}｜待复核 = ${r.needs_review}`);
  console.log(
    `  元素：${r.elements.map((e) => `${e.type}:${e.value}${e.is_personal ? '(锚定)' : ''}`).join(' / ') || '（无）'}`
  );
  console.log(`  判定：${r.reason}`);
}

console.log('\n--- 泛化对照版（对照版生成） ---');
console.log(`  个性化：${anchored}`);
console.log(`  通用化：${generalizePoem(anchored)}`);

// ============================================================
// 降级逻辑验证
// ============================================================

divider('降级逻辑验证');

printPoem(
  '降级 ①· 全量低置信（unknown）',
  generateProsePoem(
    [mk('ATOM-QS-SZ-001', 'QS', '0', 0.12, 'unknown', 'career', {})],
    profile,
    {},
    { seed: 'dg-1' }
  )
);

const NEG_ATOMS: ProseAtom[] = [
  mk('ATOM-QS-HL-021', 'QS', '-', 0.72, 'likely', 'health', { evidence_note: '金旺克木，肩颈长期负荷' }),
  mk('ATOM-QS-CF-014', 'QS', '-', 0.68, 'likely', 'relationship', { evidence_note: '关系里易硬扛' }),
  mk('ATOM-QS-WK-009', 'QS', '-', 0.61, 'likely', 'career', { evidence_note: '竞争压力集中' }),
  mk('ATOM-QS-RT-007', 'QS', '-', 0.55, 'tend', 'timing', { evidence_note: '节律被外部牵引' }),
];

printPoem('降级 ②· 高负极性集中（≥60% 负）', generateProsePoem(NEG_ATOMS, profile, {}, { seed: 'dg-2' }));

printPoem(
  '降级 ③· 无原型映射（非十神术语）',
  generateProsePoem(
    [mk('ATOM-WX-JS-001', 'WX', '+', 0.7, 'likely', 'career', { evidence_note: '金气偏旺' })],
    profile,
    {},
    { seed: 'dg-3' }
  )
);

printPoem(
  '降级 ④· 命中禁忌语境（grief → R3-12 redline）',
  generateProsePoem(QS_ATOMS, profile, { context: 'grief' }, { seed: 'dg-4' })
);

// ============================================================
// 意象新鲜度衰减验证
// ============================================================

divider('意象新鲜度衰减验证（连续 2 次相同主象 → 0.7）');

const first = generateProsePoem(QS_ATOMS, profile, { nfc_level: 'low' }, { seed: 'fresh-1' });
const mainImage = first.lines[0]?.image ?? '';
const second = generateProsePoem(QS_ATOMS, profile, { nfc_level: 'low' }, {
  seed: 'fresh-1',
  history: { last_images: [mainImage, mainImage], month_images: [] },
});

console.log(`  首轮主象：${mainImage}｜新鲜度：${first.freshness_factor}`);
console.log(
  `  复现主象：${second.lines[0]?.image ?? ''}｜新鲜度：${second.freshness_factor}｜待复核：${second.needs_review}`
);

console.log('\n=== Demo 完成 ===');
