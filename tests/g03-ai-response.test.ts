/**
 * G03 · AI 回答标准化结构 · 回归测试
 *
 * 覆盖：置信度档位映射 / 四段式构建（结论+依据+置信度+建议）/
 *       极性→建议规则 / 低置信兜底 / 空结果兜底 / 仲裁张力建议 / 散文诗收尾 / 文本渲染
 */
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  confidenceToLevel,
  confidenceLabel,
  toAiConfidence,
  buildAiResponse,
  formatAiResponse,
  type AiResponse,
} from '../packages/core/src/solution/aiResponse.ts';
import type { SolutionOutput, PathOutput } from '../packages/core/src/solution/semantic/api.ts';
import type { AtomicConclusion } from '../packages/core/src/solution/semantic/types.ts';
import type { ArbitrationResult } from '../packages/core/src/solution/semantic/arbitration.ts';

// ============================================================
// 构造工具
// ============================================================

function makeAtom(
  id: string,
  termId: string,
  polarity: '+' | '-' | '0',
  confidence: number,
  extra: Partial<AtomicConclusion> = {},
): AtomicConclusion {
  const modality =
    confidence >= 0.75
      ? 'assert'
      : confidence >= 0.6
        ? 'likely'
        : confidence >= 0.45
          ? 'tend'
          : confidence >= 0.25
            ? 'possible'
            : 'unknown';
  return {
    atomicId: id,
    termId,
    polarity,
    confidence,
    modality,
    evidence: { rule: `${termId}-rule` },
    ...extra,
  };
}

function makePath(extra: Partial<PathOutput> = {}): PathOutput {
  return {
    sentences: [
      {
        text: '正官与伤官并见，原则性与创造力互相拉锯，宜以稳定框架承载创新。',
        layer: 'L2',
        polarity: '+',
        modality: 'likely',
        atomicId: 'ATOM-ZG-JSG-001',
      },
      {
        text: '正官见伤官，原则性与表达欲并存。',
        layer: 'L1',
        polarity: '+',
        modality: 'assert',
        atomicId: 'ATOM-ZG-JSG-001',
      },
    ],
    overallPolarity: '+',
    overallConfidence: 0.72,
    overallModality: 'likely',
    barnumRatio: 0.21,
    ...extra,
  };
}

function makeOutput(extra: Partial<SolutionOutput> = {}): SolutionOutput {
  return {
    snapshotId: 'snap-test-1',
    timestamp: 1780000000000,
    pro: makePath(),
    mix: makePath(),
    lay: makePath(),
    meta: {
      termIds: ['ZG', 'ZC'],
      comboIds: ['COMBO-ZG-JSG'],
      atoms: [
        makeAtom('ATOM-ZG-JSG-001', 'ZG', '+', 0.82, {
          comboId: 'COMBO-ZG-JSG',
          canonical_factors: ['career:authority'],
          time_scope: 'long_term',
          schema_version: 'cir_v2.0',
          rule_trace: {
            rule_id: 'COMBO-ZG-JSG',
            rule_version: 'r1',
            scorecard_version: 'sc1',
            decision_table_version: 'dt1',
            gate_results: [],
          },
        }),
        makeAtom('ATOM-ZC-001', 'ZC', '+', 0.66, {
          canonical_factors: ['wealth:flow'],
        }),
      ],
      version: 'cir_v2.0',
    },
    ...extra,
  };
}

// ============================================================
// 1. 置信度档位映射
// ============================================================

test('confidenceToLevel：与 D-2 五档对齐', () => {
  assert.equal(confidenceToLevel(0.82), 'high');
  assert.equal(confidenceToLevel(0.75), 'high');
  assert.equal(confidenceToLevel(0.6), 'medium');
  assert.equal(confidenceToLevel(0.45), 'medium');
  assert.equal(confidenceToLevel(0.3), 'low');
  assert.equal(confidenceToLevel(0.25), 'low');
  assert.equal(confidenceToLevel(0.1), 'unknown');
  assert.equal(confidenceToLevel(-0.82), 'high'); // 取绝对值
});

test('confidenceLabel / toAiConfidence：数值 → 标签与模态', () => {
  assert.equal(confidenceLabel(0.8), '高');
  assert.equal(confidenceLabel(0.6), '中');
  assert.equal(confidenceLabel(0.3), '低');
  assert.equal(confidenceLabel(0.1), '不足以判断');

  const c = toAiConfidence(0.72);
  assert.equal(c.level, 'medium');
  assert.equal(c.label, '中');
  assert.equal(c.modality, 'likely');
  assert.ok(c.value >= 0 && c.value <= 1);

  const clamped = toAiConfidence(1.5);
  assert.equal(clamped.value, 1);
  assert.equal(toAiConfidence(-0.9).value, 0.9);
});

// ============================================================
// 2. 四段式构建
// ============================================================

test('buildAiResponse：四段齐全（结论/依据/置信度/建议）', () => {
  const resp = buildAiResponse({ output: makeOutput() });

  assert.equal(resp.schema_version, 'ai_response_v1');
  assert.equal(resp.id, 'snap-test-1');
  assert.ok(resp.conclusion.length > 0, '结论非空');
  assert.ok(resp.evidence.length >= 1, '依据非空');
  assert.ok(resp.confidence.value > 0, '置信度非空');
  assert.ok(resp.suggestions.length >= 1, '建议非空');
  assert.ok(resp.source?.snapshotId === 'snap-test-1', '来源可追溯');
  assert.ok(typeof resp.created_at === 'string' && resp.created_at.length > 0);
});

test('buildAiResponse：结论反映正向极性且为主句', () => {
  const resp = buildAiResponse({ output: makeOutput() });
  assert.ok(
    resp.conclusion.includes('稳中向好') || resp.conclusion.includes('正官'),
    `结论应体现正向极性或主句内容：${resp.conclusion}`,
  );
});

test('buildAiResponse：依据按置信度排序且带溯源 refs', () => {
  const resp = buildAiResponse({ output: makeOutput() });
  assert.ok(resp.evidence.length >= 1);
  const weights = resp.evidence
    .filter((e) => typeof e.weight === 'number')
    .map((e) => e.weight as number);
  for (let i = 1; i < weights.length; i++) {
    assert.ok(weights[i - 1] >= weights[i], '依据应按置信度降序');
  }
  const top = resp.evidence[0];
  assert.ok(top.refs.includes('ATOM-ZG-JSG-001'), 'refs 含原子 ID');
  assert.ok(top.refs.includes('ZG'), 'refs 含术语 ID');
});

test('buildAiResponse：正极性高置信 → 行动建议', () => {
  const resp = buildAiResponse({ output: makeOutput() });
  const types = resp.suggestions.map((s) => s.type);
  assert.ok(types.includes('action'), `正极性应含行动建议：${types.join(',')}`);
});

test('buildAiResponse：负极性 → 谨慎建议', () => {
  const out = makeOutput();
  out.lay = { ...out.lay, overallPolarity: '-', overallConfidence: 0.6 };
  const resp = buildAiResponse({ output: out });
  const types = resp.suggestions.map((s) => s.type);
  assert.ok(types.includes('caution'), `负极性应含谨慎建议：${types.join(',')}`);
});

test('buildAiResponse：低置信 → 咨询/谨慎建议', () => {
  const out = makeOutput();
  out.lay = { ...out.lay, overallConfidence: 0.3, overallModality: 'possible' };
  const resp = buildAiResponse({ output: out });
  const texts = resp.suggestions.map((s) => s.text).join('');
  assert.ok(
    resp.suggestions.some((s) => s.type === 'caution' || s.type === 'growth'),
    '低置信应含谨慎或成长建议',
  );
  assert.ok(resp.confidence.level === 'low', '低置信档位正确');
});

test('buildAiResponse：空 output 兜底（不崩溃、有结论文案）', () => {
  const resp = buildAiResponse({});
  assert.ok(resp.conclusion.includes('不足以形成明确判断'), `兜底结论：${resp.conclusion}`);
  assert.equal(resp.confidence.level, 'unknown');
  assert.ok(resp.evidence.length >= 1);
  assert.ok(resp.suggestions.length >= 1);
});

// ============================================================
// 3. 仲裁与散文诗集成
// ============================================================

test('buildAiResponse：仲裁存在张力 → 综合权衡建议', () => {
  const arbitration: ArbitrationResult = {
    consensus: [
      {
        domain: 'career',
        canonical_factor: 'career:authority',
        polarity: '+',
        modality: 'likely',
        sources: ['bazi', 'ziwei'],
        confidence: 0.8,
        summary: '八字与紫微一致指向事业发展',
      },
    ],
    tension: [
      {
        domain: 'wealth',
        perspectives: [
          { system: 'bazi', claim: '财星有力', polarity: '+', modality: 'assert', confidence: 0.8 },
          { system: 'liuyao', claim: '财爻受克', polarity: '-', modality: 'likely', confidence: 0.7 },
        ],
        explanation: '两体系对财运判断相反',
      },
    ],
    condition: [],
  };
  const resp = buildAiResponse({ output: makeOutput(), arbitration });

  const hasTradeoff = resp.suggestions.some((s) => s.text.includes('说法不一'));
  assert.ok(hasTradeoff, '张力存在时应给出综合权衡建议');
  assert.equal(resp.source?.arbitration?.tension, 1, '来源记录张力条数');
});

test('buildAiResponse：散文诗作结论收尾', () => {
  const resp = buildAiResponse({ output: makeOutput() }, { prose: '云开月现，气象一新' });
  assert.ok(resp.conclusion.includes('云开月现'), `散文诗应进入结论：${resp.conclusion}`);
});

// ============================================================
// 4. 文本渲染
// ============================================================

test('formatAiResponse：输出四段标记', () => {
  const resp: AiResponse = buildAiResponse({ output: makeOutput() });
  const text = formatAiResponse(resp);
  assert.ok(text.includes('【结论】'), '含结论段');
  assert.ok(text.includes('【依据】'), '含依据段');
  assert.ok(text.includes('【置信度】'), '含置信度段');
  assert.ok(text.includes('【建议】'), '含建议段');
  assert.ok(text.includes('中'), '置信度标签出现');
});

test('formatAiResponse：空回答也能渲染', () => {
  const text = formatAiResponse(buildAiResponse({}));
  assert.ok(text.includes('【结论】'));
  assert.ok(text.includes('【建议】'));
});
