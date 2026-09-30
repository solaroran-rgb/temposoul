/**
 * 命律 · 解盘引擎主入口
 *
 * 对外接口：输入命盘数据 → 输出三路径白话解盘
 *
 * CIR v2：runSolution 在每个关键步骤向 process_log 推送 ProcessEvent，
 * 并为每个原子结论标注 canonical_factors / time_scope / rule_trace 等 CIR 字段。
 */
import { TOP50_REGISTRY } from './index';
import { disambiguate } from './disambiguation';
import {
  runGates,
  calcBarnumRatio,
  polarityGate,
  confidenceGate,
  specificityGate,
  type WhiteTalkSentence,
  type WhiteTalkLayer,
} from './gates';
import { confidenceToModality, netConfidence } from './confidence';
import { compositePolarity } from './kg';
import { canonicalFactorsOfTerm, defaultTimeScopeOfFactor } from './factor_mapping';
import type { FactPolarity, AtomicConclusion } from './types';
import type { SolutionOutput, DisplayVariant, ProcessEvent } from './api';
import { generateProsePoem } from './prose_generator';
import { translate, type TranslatorReport } from './translator';

// ============================================================
// 1. 解盘输入
// ============================================================

export interface SolutionInput {
  /** 命盘上下文（BaziChartResult 子集） */
  context: Record<string, unknown>;
  /** 要分析的术语 ID 列表（空=全量 Top50） */
  termIds?: string[];
  /** 用户画像（D-3：只影响展示层，不进置信度/极性/规则） */
  profile?: UserProfile;
  /** 时间戳 */
  timestamp?: number;
}

/** 用户画像（D-3：只进展示层） */
export interface UserProfile {
  ageRange?: '18-25' | '26-35' | '36-45' | '46-55' | '56+';
  gender?: 'male' | 'female';
  lifeStage?: 'student' | 'career' | 'family' | 'retired';
  focusArea?: 'career' | 'wealth' | 'relationship' | 'health' | 'family' | 'study';
  displayVariant?: DisplayVariant;
  detailLevel?: 'brief' | 'standard' | 'detailed' | 'pro';
}

// ============================================================
// 2. 解盘主流程
// ============================================================

export function runSolution(input: SolutionInput): SolutionOutput {
  const { context, termIds } = input;
  const ts = input.timestamp || Date.now();
  const snapshotId = `snap-${ts}`;

  // —— CIR v2：process_log 采集 ——
  const events: ProcessEvent[] = [];
  let flowPrev = Date.now();
  const emit = (
    step: string,
    engine: string,
    detail: Record<string, unknown>,
    ref_ids?: string[]
  ): void => {
    const now = Date.now();
    events.push({
      step,
      engine,
      detail,
      cost_ms: now - flowPrev,
      timestamp: new Date(now).toISOString(),
      ref_ids,
    });
    flowPrev = now;
  };

  emit('input_validation', 'core', {
    termFilter: termIds ? termIds.length : 'all',
    hasContext: Boolean(context && Object.keys(context).length > 0),
  });

  // 真太阳时校正：本引擎接收的 context 已假定为校正后输入
  emit('time_correction', 'chrono', { assumedCorrected: true, note: 'context 已为真太阳时校正输入' });

  // 选择要分析的术语
  const termsToAnalyze = termIds
    ? termIds.map((id) => TOP50_REGISTRY[id]).filter(Boolean)
    : Object.values(TOP50_REGISTRY);

  emit('bazi_chart', 'bazi', { candidateTerms: termsToAnalyze.length });

  // 逐条消歧
  const allSentences: WhiteTalkSentence[] = [];
  const allAtoms: AtomicConclusion[] = [];
  const allTermIds: string[] = [];
  const allComboIds: string[] = [];
  const hitTermIds: string[] = [];

  for (const term of termsToAnalyze) {
    const result = disambiguate(term, context, 3);
    const netConf = netConfidence(result.confidence);

    // 跳过低置信度（0.2 及以下视为噪音，不渲染）
    if (Math.abs(netConf) <= 0.2) continue;

    hitTermIds.push(term.id);
    allTermIds.push(term.id);

    // 该术语命中的归一化因子（CIR v2）
    const canonical = canonicalFactorsOfTerm(term.id);
    const primaryTimeScope = canonical[0]
      ? defaultTimeScopeOfFactor(canonical[0])
      : 'general';

    // 生成白话句子
    for (const combo of result.combos) {
      allComboIds.push(combo.id);
      const template = term.templates.find((t) => t.comboId === combo.id);
      if (!template) continue;

      // 三道闸（用于 rule_trace 追溯）
      const rep: WhiteTalkSentence = {
        text: template.pro,
        layer: 'L0' as WhiteTalkLayer,
        polarity: template.polarity,
        modality: template.modality,
        atomicId: template.atomicId,
      };
      const gate_results = [
        { gate: 'polarity', ...polarityGate(rep) },
        { gate: 'confidence', ...confidenceGate(rep) },
        { gate: 'specificity', ...specificityGate(rep) },
      ].map((g) => ({ gate: g.gate, passed: g.pass, reason: g.reason ?? '' }));

      allAtoms.push({
        atomicId: template.atomicId,
        termId: term.id,
        comboId: combo.id,
        polarity: template.polarity,
        confidence: netConf,
        modality: confidenceToModality(netConf),
        evidence: context,
        time_scope: primaryTimeScope,
        canonical_factors: canonical,
        schema_version: 'cir_v2.0',
        rule_trace: {
          rule_id: combo.id,
          rule_version: 'r1',
          scorecard_version: 'sc1',
          decision_table_version: 'dt1',
          gate_results,
        },
        suppressible: confidenceToModality(netConf) === 'unknown',
      });

      // L0 事实句（专业层）
      allSentences.push({
        text: template.pro,
        layer: 'L0' as WhiteTalkLayer,
        polarity: template.polarity,
        modality: template.modality,
        atomicId: template.atomicId,
      });

      // L2 通用句（混合层/普通层）
      allSentences.push({
        text: template.mix,
        layer: 'L2' as WhiteTalkLayer,
        polarity: template.polarity,
        modality: 'likely',
        atomicId: template.atomicId,
      });
      allSentences.push({
        text: template.lay,
        layer: 'L2' as WhiteTalkLayer,
        polarity: template.polarity,
        modality: 'tend',
        atomicId: template.atomicId,
      });
    }
  }

  emit('disambiguation', 'd1', {
    candidateTerms: termsToAnalyze.length,
    hitTerms: hitTermIds.length,
    atoms: allAtoms.length,
  });

  // 同源依赖标记：同术语下的原子互为 evidence_dependency
  const byTerm = new Map<string, string[]>();
  for (const a of allAtoms) {
    const list = byTerm.get(a.termId) ?? [];
    list.push(a.atomicId);
    byTerm.set(a.termId, list);
  }
  for (const a of allAtoms) {
    const siblings = byTerm.get(a.termId) ?? [];
    a.evidence_dependency_ids = siblings.filter((id) => id !== a.atomicId);
  }
  emit('dependency_check', 'core', {
    atoms: allAtoms.length,
    termsWithDeps: byTerm.size,
  });

  // 因子映射（CIR v2）：原子生成阶段已完成标注，此处汇总
  const factorHit = new Set<string>();
  for (const a of allAtoms) {
    for (const f of a.canonical_factors ?? []) factorHit.add(f);
  }
  emit('factor_mapping', 'core', {
    atomsAnnotated: allAtoms.filter((a) => (a.canonical_factors?.length ?? 0) > 0).length,
    distinctFactors: factorHit.size,
  });

  // 三道闸校验
  const passedSentences = allSentences.filter((s) => runGates(s).pass);
  const barnumRatio = calcBarnumRatio(passedSentences);

  emit('gate_check', 'core', {
    totalSentences: allSentences.length,
    passedSentences: passedSentences.length,
    barnumRatio: Number(barnumRatio.toFixed(3)),
  });

  // 汇总极性：聚合命中 atom 自身极性（修正 task1：原按 atomicId 反查 KG 边表会正负相消恒为 0）
  const overallPolarity = compositePolarity(
    allAtoms
      .filter((a) => Math.abs(a.confidence) > 0.5)
      .map((a) => a.polarity as FactPolarity)
  );

  // 汇总置信度
  const avgConfidence =
    allAtoms.length > 0
      ? allAtoms.reduce((sum, a) => sum + Math.abs(a.confidence), 0) / allAtoms.length
      : 0;

  emit('ds_fusion', 'd2', {
    avgConfidence: Number(avgConfidence.toFixed(3)),
    atoms: allAtoms.length,
  });

  const overallModality = confidenceToModality(avgConfidence);

  // G02 散文诗核心摘要：每命盘一首专属（同盘同诗 —— 不传 seed，走 defaultSeed(atomicIds+profile)）
  const l0TextByAtomic = new Map<string, string>();
  for (const s of passedSentences) {
    const aid = s.atomicId;
    if (s.layer === 'L0' && aid && !l0TextByAtomic.has(aid)) {
      l0TextByAtomic.set(aid, s.text);
    }
  }
  const proseAtoms = allAtoms.map((a) => {
    const t = l0TextByAtomic.get(a.atomicId);
    return t === undefined ? a : { ...a, text: t };
  });
  const prose = generateProsePoem(proseAtoms, input.profile ?? {}, {});
  emit('prose_generation', 'g02', {
    lines: prose.lines.length,
    archetype: prose.archetype,
    degraded: prose.degraded,
    degradation_reason: prose.degradation_reason ?? '',
    barnumPassed: prose.passed_barnum_check,
  });

  // R3-15 三级转译：对同一批 proseAtoms 做 词→句→分域报告 三级转译。
  // 与上方 prose 同 atoms/profile（generateProsePoem 的 archetypeProfile/options 默认 {}），
  // 故 translated.l2_poem 与 prose 内容一致。
  // 优雅降级：无原子结论 / translator 抛错 → degraded 空报告，绝不阻断主流程；
  // 不新增 process_log 事件，对既有 pro/mix/lay/prose/meta/process_log 字段零影响。
  const translated: TranslatorReport = (() => {
    try {
      if (proseAtoms.length === 0) {
        return {
          l1_terms: [],
          l2_poem: prose,
          l3_sections: [],
          l3_anchor: prose.anchor_line,
          degraded: true,
          degradation_reason: 'no_atoms',
          anti_barnum_passed: false,
          generated_at: new Date().toISOString(),
        };
      }
      return translate({ atoms: proseAtoms, userProfile: input.profile ?? {} });
    } catch (err) {
      return {
        l1_terms: [],
        l2_poem: prose,
        l3_sections: [],
        l3_anchor: prose.anchor_line,
        degraded: true,
        degradation_reason: `translator_error: ${err instanceof Error ? err.message : String(err)}`,
        anti_barnum_passed: false,
        generated_at: new Date().toISOString(),
      };
    }
  })();

  // 三路径输出
  const pathBase = {
    overallPolarity,
    overallConfidence: avgConfidence,
    overallModality,
    barnumRatio,
  };

  return {
    snapshotId,
    timestamp: ts,
    pro: {
      ...pathBase,
      sentences: passedSentences.filter((s) => s.layer === 'L0' || s.layer === 'L3'),
    },
    mix: {
      ...pathBase,
      sentences: passedSentences.filter((s) => s.layer !== 'L0'),
    },
    lay: {
      ...pathBase,
      sentences: passedSentences.filter((s) => s.layer === 'L2'),
    },
    prose,
    translated,
    meta: {
      termIds: allTermIds,
      comboIds: allComboIds,
      atoms: allAtoms.map((a) => ({
        atomicId: a.atomicId,
        termId: a.termId,
        polarity: a.polarity,
        confidence: a.confidence,
        modality: a.modality,
        evidence: a.evidence,
        ...(a.canonical_factors ? { canonical_factors: a.canonical_factors } : {}),
        ...(a.time_scope ? { time_scope: a.time_scope } : {}),
        ...(a.evidence_dependency_ids ? { evidence_dependency_ids: a.evidence_dependency_ids } : {}),
        ...(a.schema_version ? { schema_version: a.schema_version } : {}),
        ...(a.rule_trace ? { rule_trace: a.rule_trace } : {}),
        ...(a.suppressible !== undefined ? { suppressible: a.suppressible } : {}),
      })),
      version: 'cir_v2.0',
    },
    process_log: events,
  };
}
