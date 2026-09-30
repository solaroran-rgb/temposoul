/**
 * G02 回归测试：散文诗核心摘要接线
 *
 * 覆盖（对应任务卡验收「功能正常运行」）：
 *   - runSolution 输出携带 prose 核心摘要（每命盘一首）
 *   - 同盘同诗：同一命盘 context 两次求解 → 散文诗文本完全一致（seed 稳定）
 *   - 异盘异诗：不同命盘 → 散文诗不同（「专属」成立）
 *   - 降级：信息不足的命盘 → degraded 陪伴短句，不产「假装懂你」的诗
 *   - 可回溯：prose 每行 atom_id 均可回溯到 meta.atoms
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { runSolution, type SolutionInput } from '@core/solution/semantic/solution';
import type { ProsePoem } from '@core/solution/semantic/prose_generator';

/** 完整命盘 A：正官/正印主导（参照 demo_full.mockBaziContext） */
const CTX_A: Record<string, unknown> = {
  tenGods: { year: '正官', month: '正印', day: '日主', hour: '偏财' },
  hiddenStems: { year: ['正官'], month: ['正印'], day: ['比肩'], hour: ['偏财'] },
  wuxingStrength: {
    missing: [],
    present: ['金', '木', '水', '火', '土'],
    dominantByRule: '金',
    ruleBasis: '月令',
  },
  analysis: {
    usefulGod: { favorable: ['火', '土'], unfavorable: ['水', '木'], useful: '火', avoid: '水' },
  },
  pillars: {
    year: { gan: '甲', zhi: '子', ganZhi: '甲子' },
    month: { gan: '丙', zhi: '寅', ganZhi: '丙寅' },
    day: { gan: '甲', zhi: '午', ganZhi: '甲午' },
    hour: { gan: '丁', zhi: '卯', ganZhi: '丁卯' },
  },
  luckInfo: {
    cycles: [
      { tenGod: '正官', ganZhi: '戊辰' },
      { tenGod: '正印', ganZhi: '己巳' },
    ],
  },
  liunian: [{ tenGod: '正官', ganZhi: '甲午' }],
  shensha: ['天乙贵人', '文昌'],
  baziShenSha: ['天乙贵人'],
  kongWang: [],
};

/** 完整命盘 B：七杀/劫财主导（与 A 结构同、主导十神异） */
const CTX_B: Record<string, unknown> = {
  ...CTX_A,
  tenGods: { year: '七杀', month: '劫财', day: '日主', hour: '伤官' },
  hiddenStems: { year: ['七杀'], month: ['劫财'], day: ['比肩'], hour: ['伤官'] },
  liunian: [{ tenGod: '七杀', ganZhi: '庚午' }],
  shensha: ['驿马', '羊刃'],
  baziShenSha: ['羊刃'],
};

function solve(context: Record<string, unknown>): ReturnType<typeof runSolution> {
  return runSolution({ context });
}

function poemText(p: ProsePoem): string {
  return p.lines.map((l) => l.text).join('|') + '||' + p.anchor_line;
}

test('runSolution 输出携带散文诗核心摘要（结构完整）', () => {
  const out = solve(CTX_A);
  assert.ok(out.prose, 'prose 字段必须存在');
  const p = out.prose;
  assert.ok(Array.isArray(p.lines), 'lines 为数组');
  assert.equal(typeof p.anchor_line, 'string');
  assert.equal(typeof p.archetype, 'string');
  assert.equal(typeof p.ig_score, 'number');
  assert.equal(typeof p.passed_barnum_check, 'boolean');
  assert.equal(typeof p.degraded, 'boolean');
  assert.ok(Array.isArray(p.gloss), 'gloss 为数组');
  assert.ok(p.lines.length > 0, '完整命盘应产出至少 1 行诗');
});

test('同盘同诗：同一命盘两次求解 → 散文诗完全一致', () => {
  const a = solve(CTX_A);
  const b = solve(CTX_A);
  assert.equal(poemText(a.prose), poemText(b.prose), '同命盘应产出同一首诗（稳定专属）');
  assert.equal(a.prose.ig_score, b.prose.ig_score);
});

test('异盘异诗：不同命盘 → 散文诗不同（专属成立）', () => {
  const a = solve(CTX_A);
  const b = solve(CTX_B);
  // 至少诗行文本不同（十神主导不同 → 原型/意象不同）
  assert.notEqual(
    poemText(a.prose),
    poemText(b.prose),
    '不同命盘的散文诗应不同',
  );
});

test('降级：信息不足命盘 → 陪伴短句而非「假装懂你」的诗', () => {
  const out = solve({});
  assert.ok(out.prose.degraded, '空 context 应降级');
  assert.equal(out.prose.lines.length, 0, '降级时不得产出诗行');
  assert.equal(out.prose.archetype, 'none');
  assert.equal(out.prose.ig_score, 0);
  assert.equal(out.prose.passed_barnum_check, false);
  assert.ok(out.prose.anchor_line.length > 0, '应给出通用陪伴短句');
  assert.equal(out.prose.degradation_reason, 'insufficient_atoms');
});

test('可回溯：prose 每行 atom_id 均存在于 meta.atoms', () => {
  const out = solve(CTX_A);
  const atomIds = new Set((out.meta?.atoms ?? []).map((a) => a.atomicId));
  for (const line of out.prose.lines) {
    assert.ok(atomIds.has(line.atom_id), `atom_id ${line.atom_id} 应可回溯到 meta.atoms`);
  }
  for (const g of out.prose.gloss) {
    assert.ok(atomIds.has(g.atom_id), `gloss atom_id ${g.atom_id} 应可回溯到 meta.atoms`);
  }
});

test('散文诗不触三道闸：诗文本经禁词扫描后仍可展示', () => {
  const out = solve(CTX_A);
  const full = poemText(out.prose);
  const banned = ['死亡', '灾祸', '绝症', '血光', '杀身'];
  for (const w of banned) {
    assert.ok(!full.includes(w), `散文诗不得包含禁词「${w}」`);
  }
});
