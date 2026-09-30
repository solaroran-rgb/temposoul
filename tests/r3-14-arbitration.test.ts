/**
 * R3-14 冲突仲裁引擎 v2 · 回归测试
 *
 * 覆盖：时间层分离 / 同域归一去重 / 相关性标定 / 高冲突检测（D-S K）/
 *       三层仲裁（共识/张力/条件）/ 体系权重矩阵
 * 示例：3体系一致1体系相反 / 2体系相反高置信→高冲突 / 全低置信→信息不足
 */
import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  SYSTEM_WEIGHTS,
  systemWeight,
  separateByTimeScope,
  dedupByCanonicalFactor,
  checkDependencies,
  detectConflicts,
  arbitrate,
  type ArbitratedAtom,
} from '../packages/core/src/solution/semantic/arbitration.ts';

// ============================================================
// 构造工具
// ============================================================

function makeAtom(
  id: string,
  termId: string,
  polarity: ArbitratedAtom['polarity'],
  confidence: number,
  extra: Partial<ArbitratedAtom> = {},
): ArbitratedAtom {
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

// ============================================================
// 体系权重矩阵（任务6）
// ============================================================

test('SYSTEM_WEIGHTS：6 体系 × 6 领域完整', () => {
  const systems = ['bazi', 'ziwei', 'qimen', 'liuyao', 'tarot', 'western'];
  const domains = ['career', 'wealth', 'relationship', 'health', 'decision', 'timing'];
  for (const s of systems) {
    for (const d of domains) {
      const w = systemWeight(s, d);
      assert.ok(typeof w === 'number' && w >= 0 && w <= 1, `${s}.${d} 权重非法：${w}`);
    }
  }
  // 抽查任务卡初始值
  assert.equal(systemWeight('qimen', 'timing'), 0.95);
  assert.equal(systemWeight('liuyao', 'decision'), 0.95);
  assert.equal(systemWeight('bazi', 'wealth'), 0.9);
});

// ============================================================
// 任务1：时间层分离
// ============================================================

test('separateByTimeScope：按 time_scope 分四层，缺省归 general', () => {
  const atoms: ArbitratedAtom[] = [
    makeAtom('A1', 'ZC', '+', 0.8, { time_scope: 'long_term' }),
    makeAtom('A2', 'PC', '+', 0.7, { time_scope: 'current' }),
    makeAtom('A3', 'SG', '-', 0.65, { time_scope: 'event' }),
    makeAtom('A4', 'BJ', '+', 0.5, {}), // 无 time_scope → general
  ];
  const t = separateByTimeScope(atoms);
  assert.equal(t.long_term.length, 1);
  assert.equal(t.current.length, 1);
  assert.equal(t.event.length, 1);
  assert.equal(t.general.length, 1);
  assert.equal(t.general[0].atomicId, 'A4');
});

// ============================================================
// 任务2：同域归一 + 去重
// ============================================================

test('dedupByCanonicalFactor：同(time_scope,domain,factor,极性)合并为一条', () => {
  const atoms: ArbitratedAtom[] = [
    makeAtom('B1', 'ZC', '+', 0.7, {
      time_scope: 'general',
      domain: 'wealth',
      canonical_factors: ['wealth:structural_wealth'],
      source: 'bazi',
      evidence: { rule: 'bazi-wealth', source: 'bazi' },
    }),
    makeAtom('B2', 'ZC', '++', 0.85, {
      time_scope: 'general',
      domain: 'wealth',
      canonical_factors: ['wealth:structural_wealth'],
      source: 'ziwei',
      evidence: { rule: 'ziwei-wealth', source: 'ziwei' },
    }),
    // 不同极性方向 → 不合并
    makeAtom('B3', 'ZC', '-', 0.8, {
      time_scope: 'general',
      domain: 'wealth',
      canonical_factors: ['wealth:structural_wealth'],
      source: 'tarot',
      evidence: { rule: 'tarot-wealth', source: 'tarot' },
    }),
  ];
  const { atoms: out, audit } = dedupByCanonicalFactor(atoms);
  // B1 + B2 同正方向合并（B2 置信最高保留），B3 负方向独立
  assert.equal(out.length, 2);
  const kept = out.find((a) => a.atomicId === 'B2');
  assert.ok(kept, '应保留置信最高的 B2');
  // 合并后来源合并为数组
  const mergedSources = (kept.evidence as { source?: string[] }).source;
  assert.ok(Array.isArray(mergedSources));
  assert.deepEqual(mergedSources.slice().sort(), ['bazi', 'ziwei']);
  // 审计记录被合并的 atom_id
  const auditEntry = audit.find((e) => e.atomicId === 'B2');
  assert.ok(auditEntry);
  assert.deepEqual(auditEntry!.merged_ids, ['B1']);
});

// ============================================================
// 任务3：相关性标定
// ============================================================

test('checkDependencies：heavy / light / independent 三级', () => {
  const atoms: ArbitratedAtom[] = [
    // heavy：同体系同规则同极性
    makeAtom('C1', 'ZG', '+', 0.8, { source: 'bazi', rule_trace: { rule_id: 'R1', rule_version: '1', scorecard_version: '1', decision_table_version: '1', gate_results: [] } }),
    makeAtom('C2', 'ZG', '+', 0.7, { source: 'bazi', rule_trace: { rule_id: 'R1', rule_version: '1', scorecard_version: '1', decision_table_version: '1', gate_results: [] } }),
    // light：干支源头（bazi vs qimen）
    makeAtom('C3', 'Q1', '+', 0.7, { source: 'qimen' }),
    // independent：bazi vs tarot
    makeAtom('C4', 'T1', '+', 0.7, { source: 'tarot' }),
  ];
  const results = checkDependencies(atoms);
  const levels = results.map((r) => r.dependency_level);
  assert.ok(levels.includes('heavy'), '应有 heavy（同体系同规则）');
  assert.ok(levels.includes('independent'), '应有 independent（bazi vs tarot）');
  // bazi(C1) vs qimen(C3) 干支源头 → light
  const baziQimen = results.find((r) =>
    (r.atom_a === 'C1' && r.atom_b === 'C3') || (r.atom_a === 'C3' && r.atom_b === 'C1'),
  );
  assert.equal(baziQimen?.dependency_level, 'light');
});

// ============================================================
// 示例1：3体系一致 + 1体系相反 → 共识 + 张力 + 条件
// ============================================================

test('示例1：career 域 3体系一致 + 1体系相反', () => {
  const atoms: ArbitratedAtom[] = [
    makeAtom('D1', 'ZC', '+', 0.85, { time_scope: 'general', domain: 'career', canonical_factors: ['career:authority'], source: 'bazi' }),
    makeAtom('D2', 'XY', '+', 0.72, { time_scope: 'general', domain: 'career', canonical_factors: ['career:authority'], source: 'ziwei' }),
    makeAtom('D3', 'TR', '+', 0.78, { time_scope: 'general', domain: 'career', canonical_factors: ['career:authority'], source: 'tarot' }),
    makeAtom('D4', 'Q1', '-', 0.65, { time_scope: 'general', domain: 'career', canonical_factors: ['career:authority'], source: 'qimen' }),
  ];
  const t = separateByTimeScope(atoms);
  const result = arbitrate(t);

  // 共识：career 正向，多体系互验（bazi/ziwei/tarot），模态 assert
  const consensus = result.consensus.find((c) => c.domain === 'career');
  assert.ok(consensus, '应有 career 共识');
  assert.equal(consensus!.polarity, '+');
  assert.equal(consensus!.modality, 'assert');
  assert.deepEqual(consensus!.sources.slice().sort(), ['bazi', 'tarot', 'ziwei']);
  assert.equal(consensus!.confidence, 0.85);

  // 张力：正向(3) 与 负向(qimen) 相反且 ≥likely → 至少一条张力
  assert.ok(result.tension.length >= 1, '应有张力（qimen 与其余相反）');
  const tension = result.tension.find((x) => x.domain === 'career');
  assert.ok(tension, 'career 张力应存在');
  const sysSet = new Set(tension!.perspectives.map((p) => p.system));
  assert.ok(sysSet.has('qimen'), '张力应含 qimen');

  // 条件：非命令式（不含 一定/必须/不要）
  assert.ok(result.condition.length >= 1, '应有条件层');
  for (const c of result.condition) {
    const text = c.condition + c.recommendation;
    assert.ok(!text.includes('一定'), '条件层禁用「一定」');
    assert.ok(!text.includes('必须'), '条件层禁用「必须」');
    assert.ok(!text.includes('不要'), '条件层禁用「不要」');
  }
});

// ============================================================
// 示例2：2体系极性相反高置信 → 高冲突（D-S K > 0.35）
// ============================================================

test('示例2：decision 域 bazi(+) vs liuyao(-) 高置信 → 高冲突', () => {
  const atoms: ArbitratedAtom[] = [
    makeAtom('E1', 'BJ', '+', 0.82, { time_scope: 'event', domain: 'decision', canonical_factors: ['decision:go_through'], source: 'bazi', input_completeness: 0.9 }),
    makeAtom('E2', 'L1', '-', 0.78, { time_scope: 'event', domain: 'decision', canonical_factors: ['decision:go_through'], source: 'liuyao', input_completeness: 0.9 }),
  ];
  const t = separateByTimeScope(atoms);
  const res = detectConflicts(t);

  // bazi.decision=0.6 / liuyao.decision=0.95 均 ≥0.6；模态 assert ≥likely；完整度 0.9 ≥0.7
  assert.equal(res.has_high_conflict, true, '应判为高冲突');
  assert.equal(res.conflict_type, 'high');
  // K = 0.82*0.78 = 0.6396
  assert.ok(res.conflict_index_K > 0.35, `K=${res.conflict_index_K} 应 > 0.35`);
  assert.equal(res.conflict_atoms.length, 2);
});

test('示例2b：低完整度 → 不触发高冲突（条件3失败）', () => {
  const atoms: ArbitratedAtom[] = [
    makeAtom('E3', 'BJ', '+', 0.82, { time_scope: 'event', domain: 'decision', canonical_factors: ['decision:go_through'], source: 'bazi', input_completeness: 0.5 }),
    makeAtom('E4', 'L1', '-', 0.78, { time_scope: 'event', domain: 'decision', canonical_factors: ['decision:go_through'], source: 'liuyao', input_completeness: 0.5 }),
  ];
  const t = separateByTimeScope(atoms);
  const res = detectConflicts(t);
  assert.equal(res.has_high_conflict, false, '输入完整度 <0.7 不应触发高冲突');
  assert.equal(res.conflict_type, 'none');
});

// ============================================================
// 示例3：全低置信 → 降级为「信息不足」
// ============================================================

test('示例3：全低置信（<0.45）→ 三层输出为空（信息不足）', () => {
  const atoms: ArbitratedAtom[] = [
    makeAtom('F1', 'ZC', '+', 0.3, { time_scope: 'general', domain: 'wealth', canonical_factors: ['wealth:x'], source: 'bazi' }),
    makeAtom('F2', 'ZC', '-', 0.2, { time_scope: 'general', domain: 'wealth', canonical_factors: ['wealth:x'], source: 'tarot' }),
    makeAtom('F3', 'PC', '+', 0.15, { time_scope: 'general', domain: 'wealth', canonical_factors: ['wealth:y'], source: 'ziwei' }),
  ];
  const t = separateByTimeScope(atoms);
  const result = arbitrate(t);
  // 共识需 ≥tend(0.45)、张力需 ≥likely(0.6)、条件需 ≥likely(0.6)
  assert.equal(result.consensus.length, 0, '低置信不应产生共识');
  assert.equal(result.tension.length, 0, '低置信不应产生张力');
  assert.equal(result.condition.length, 0, '低置信不应产生条件');
  // 冲突检测也不应触发
  const res = detectConflicts(t);
  assert.equal(res.conflict_type, 'none');
});
