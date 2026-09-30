/**
 * R3-13 回归测试：反巴纳姆校验器 + 散文诗生成器
 *
 * 覆盖：
 *   - 具体化元素抽取（5 类 + 噪声过滤）
 *   - IG 计算与三档判定（通过 / 边界 / 鸡汤）
 *   - 泛化替换规则
 *   - 散文诗生成（原型接线 / 领域配额 / 降级 / 新鲜度 / 确定性）
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  extractImageryElements,
  calculateInformationGain,
  validateAntiBarnum,
  generalizePoem,
} from '@core/solution/semantic/anti_barnum';
import {
  generateProsePoem,
  GENERIC_COMPANION_LINE,
  type ProseAtom,
} from '@core/solution/semantic/prose_generator';
import type { UserProfile } from '@core/solution/semantic/solution';
import type { ArchetypeDomain } from '@core/solution/semantic/archetype_types';
import type { EpistemicModality, FactPolarity } from '@core/solution/semantic/types';

const PROFILE: UserProfile = { ageRange: '26-35', focusArea: 'career' };

function mk(
  atomicId: string,
  termId: string,
  polarity: FactPolarity,
  confidence: number,
  modality: EpistemicModality,
  domain: ArchetypeDomain,
  evidence: Record<string, unknown> = {}
): ProseAtom {
  return { atomicId, termId, polarity, confidence, modality, domain, evidence };
}

const QS_ATOMS: ProseAtom[] = [
  mk('ATOM-QS-SZ-001', 'QS', '+', 0.86, 'assert', 'career', {
    anchor: { direction: '西北', solarTerm: '立秋' },
  }),
  mk('ATOM-QS-PY-001', 'QS', '+', 0.72, 'likely', 'timing', { anchor: { direction: '西北' } }),
  mk('ATOM-QS-CF-014', 'QS', '+', 0.64, 'likely', 'relationship', { note: '日支见杀' }),
  mk('ATOM-QS-HL-021', 'QS', '+', 0.58, 'tend', 'health', { note: '金气偏旺' }),
];

// ============================================================
// 1. 具体化元素抽取
// ============================================================

test('extractImageryElements 能识别 5 类具体化元素', () => {
  const text = '风从西北来，第三次告别落在立秋，铁与盐的气味还在，胸口紧绷。';
  const types = new Set(extractImageryElements(text).map((e) => e.type));

  assert.ok(types.has('direction'), '应识别方位');
  assert.ok(types.has('number'), '应识别数字');
  assert.ok(types.has('time_node'), '应识别时间节点');
  assert.ok(types.has('sensory'), '应识别感官细节');
});

test('泛指数量词与兼类节气词不计入具体化元素', () => {
  const elems = extractImageryElements('你是一个有潜力的人，眼底清明。');

  assert.equal(elems.length, 0);
});

test('单独的身体部位词不构成感官细节（避免词汇级噪声）', () => {
  const elems = extractImageryElements('你的鼻腔和后背。');
  const sensory = elems.filter((e) => e.type === 'sensory');

  assert.equal(sensory.length, 0);
});

// ============================================================
// 2. IG 计算与三档判定
// ============================================================

test('通用鸡汤 IG = 0，判为巴纳姆', () => {
  const result = validateAntiBarnum('你是一个有潜力的人，未来会有转机，身边的人会支持你。', []);

  assert.equal(result.ig_score, 0);
  assert.equal(result.passed, false);
  assert.equal(result.needs_review, false);
});

test('伪个性化（全是可泛化套话）IG = 0，判为鸡汤', () => {
  const text = '西北方向有你的贵人，三次机会将到来，你会闻到铁与盐的气味，那是第二个秋天的风。';
  const result = validateAntiBarnum(text, []);

  assert.equal(result.ig_score, 0);
  assert.equal(result.passed, false);
});

test('命盘证据锚定可把套话救回为真信息', () => {
  const result = validateAntiBarnum('风从西北来。', QS_ATOMS);

  assert.ok(result.ig_score >= 0.3, `IG 应 ≥ 0.3，实际 ${result.ig_score}`);
  assert.equal(result.passed, true);
});

test('边界区（0.20 ≤ IG < 0.30）标记 needs_review', () => {
  const text = '风从西北来，铁与盐的气味、胸口的紧绷、三次机会、第二个秋天。';
  const result = validateAntiBarnum(text, QS_ATOMS);

  assert.ok(result.ig_score >= 0.2 && result.ig_score < 0.3, `实际 IG = ${result.ig_score}`);
  assert.equal(result.passed, false);
  assert.equal(result.needs_review, true);
});

test('calculateInformationGain 与字面公式口径一致（非锚定版）', () => {
  const generic = '你是一个有潜力的人，未来会有转机。';
  assert.equal(calculateInformationGain(generic, generic), 0);

  const poem = '风从西北来。';
  const score = calculateInformationGain(poem, generalizePoem(poem));
  assert.equal(score, 0, '无证据上下文时，纯可泛化元素不构成增量');
});

// ============================================================
// 3. 泛化替换
// ============================================================

test('泛化替换按任务卡规则生效', () => {
  const out = generalizePoem('风从西北来，三次告别，铁与盐的气味，第二个秋天。');

  assert.ok(out.includes('远方'), '方位应泛化为「远方」');
  assert.ok(out.includes('几次'), '序数应泛化为「几次」');
  assert.ok(out.includes('某种锐利的气息'), '感官套话应泛化');
  assert.ok(out.includes('某个季节'), '季节节点应泛化');
  assert.ok(!out.includes('西北') && !out.includes('秋天'));
});

// ============================================================
// 4. 散文诗生成
// ============================================================

test('generateProsePoem 生成 3-4 行诗骨并通过反巴纳姆校验', () => {
  const poem = generateProsePoem(QS_ATOMS, PROFILE, { nfc_level: 'low' }, { seed: 'test-1' });

  assert.equal(poem.degraded, false);
  assert.ok(poem.lines.length >= 3 && poem.lines.length <= 4, `实际行数 ${poem.lines.length}`);
  assert.equal(poem.passed_barnum_check, true);
  assert.ok(poem.ig_score >= 0.3);
  assert.equal(poem.archetype, '破壁者');
  assert.equal(poem.archetype_track, 'dynamic');
});

test('诗行与白话注解一一对应且可回溯到原子结论', () => {
  const poem = generateProsePoem(QS_ATOMS, PROFILE, {}, { seed: 'test-2' });
  const atomIds = QS_ATOMS.map((a) => a.atomicId);

  assert.equal(poem.lines.length, poem.gloss.length);
  for (const [i, line] of poem.lines.entries()) {
    assert.ok(atomIds.includes(line.atom_id), '诗行必须挂原子结论 ID');
    assert.equal(poem.gloss[i].atom_id, line.atom_id);
  }
});

test('NFC 水平切换表达轨道', () => {
  const eastern = generateProsePoem(QS_ATOMS, PROFILE, { nfc_level: 'high' }, { seed: 'test-3' });
  const dynamic = generateProsePoem(QS_ATOMS, PROFILE, { nfc_level: 'low' }, { seed: 'test-3' });

  assert.equal(eastern.archetype_track, 'eastern');
  assert.equal(dynamic.archetype_track, 'dynamic');
  assert.notEqual(eastern.archetype, dynamic.archetype);
});

test('领域配额：同一配额桶最多产 1 行', () => {
  const dup: ProseAtom[] = [
    mk('ATOM-QS-A-001', 'QS', '+', 0.9, 'assert', 'career', {}),
    mk('ATOM-QS-A-002', 'QS', '+', 0.8, 'assert', 'decision', {}),
    mk('ATOM-QS-A-003', 'QS', '+', 0.7, 'assert', 'direction', {}),
  ];
  const poem = generateProsePoem(dup, PROFILE, {}, { seed: 'test-4' });

  assert.equal(poem.lines.length, 1, '事业桶（career/decision/direction）应只取 1 行');
});

test('同 seed 输出确定（可复现）', () => {
  const a = generateProsePoem(QS_ATOMS, PROFILE, {}, { seed: 'stable' });
  const b = generateProsePoem(QS_ATOMS, PROFILE, {}, { seed: 'stable' });

  assert.deepEqual(
    a.lines.map((l) => l.text),
    b.lines.map((l) => l.text)
  );
});

// ============================================================
// 5. 降级逻辑
// ============================================================

test('降级①：全量 unknown 不出诗，只给通用陪伴短句', () => {
  const poem = generateProsePoem(
    [mk('ATOM-QS-SZ-001', 'QS', '0', 0.12, 'unknown', 'career', {})],
    PROFILE,
    {},
    { seed: 'dg' }
  );

  assert.equal(poem.degraded, true);
  assert.equal(poem.degradation_reason, 'insufficient_atoms');
  assert.equal(poem.lines.length, 0);
  assert.equal(poem.anchor_line, GENERIC_COMPANION_LINE);
  assert.equal(poem.ig_score, 0);
  assert.equal(poem.passed_barnum_check, false);
});

test('降级②：高负极性集中转写「需注意、可借力」且只用安全意象', () => {
  const neg: ProseAtom[] = [
    mk('ATOM-QS-HL-021', 'QS', '-', 0.72, 'likely', 'health', {}),
    mk('ATOM-QS-CF-014', 'QS', '-', 0.68, 'likely', 'relationship', {}),
    mk('ATOM-QS-WK-009', 'QS', '-', 0.61, 'likely', 'career', {}),
    mk('ATOM-QS-RT-007', 'QS', '-', 0.55, 'tend', 'timing', {}),
  ];
  const poem = generateProsePoem(neg, PROFILE, {}, { seed: 'dg-neg' });

  assert.equal(poem.degraded, false);
  assert.ok(poem.anchor_line.includes('需注意，也可借力'), '应转写为需注意/可借力');
  for (const line of poem.lines) {
    assert.ok(!/死亡|灾祸|绝症|分离|凶/.test(line.text), `不得出现恐惧意象：${line.text}`);
  }
});

test('降级③：非十神术语走 no_archetype 降级', () => {
  const poem = generateProsePoem(
    [mk('ATOM-WX-JS-001', 'WX', '+', 0.7, 'likely', 'career', {})],
    PROFILE,
    {},
    { seed: 'dg-3' }
  );

  assert.equal(poem.degraded, true);
  assert.equal(poem.degradation_reason, 'no_archetype');
});

test('红线条目（redline = true）不进入诗骨', () => {
  const atoms: ProseAtom[] = [
    { ...mk('ATOM-QS-RL-001', 'QS', '+', 0.9, 'assert', 'career', {}), redline: true },
    mk('ATOM-QS-SZ-001', 'QS', '+', 0.8, 'assert', 'career', {}),
  ];
  const poem = generateProsePoem(atoms, PROFILE, {}, { seed: 'rl' });

  assert.equal(poem.lines.length, 1);
  assert.equal(poem.lines[0].atom_id, 'ATOM-QS-SZ-001');
});

// ============================================================
// 6. 意象新鲜度
// ============================================================

test('连续 2 次相同主象 → 新鲜度衰减至 0.7 并标记待复核', () => {
  const first = generateProsePoem(QS_ATOMS, PROFILE, {}, { seed: 'fresh' });
  const mainImage = first.lines[0].image;
  const second = generateProsePoem(QS_ATOMS, PROFILE, {}, {
    seed: 'fresh',
    history: { last_images: [mainImage, mainImage] },
  });

  assert.equal(first.freshness_factor, 1);
  assert.equal(second.freshness_factor, 0.7);
  assert.equal(second.needs_review, true);
});

test('同月历史主象在池内可用时不被复用', () => {
  const first = generateProsePoem(QS_ATOMS, PROFILE, {}, { seed: 'month' });
  const blocked = first.lines[0].image;
  const second = generateProsePoem(QS_ATOMS, PROFILE, {}, {
    seed: 'month',
    history: { month_images: [blocked] },
  });

  for (const line of second.lines) {
    assert.ok(line.image !== blocked, `不应复用同月意象：${line.image}`);
  }
});

test('同月意象用尽时允许复用，但必须标记待复核', () => {
  const first = generateProsePoem(QS_ATOMS, PROFILE, {}, { seed: 'month2' });
  const used = first.lines.map((l) => l.image);
  const second = generateProsePoem(QS_ATOMS, PROFILE, {}, {
    seed: 'month2',
    history: { month_images: used },
  });

  assert.equal(second.needs_review, true, '同月池耗尽后的复用必须待复核');
});
