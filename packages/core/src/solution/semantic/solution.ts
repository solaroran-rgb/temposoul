/**
 * 命律 · 解盘引擎主入口
 *
 * 对外接口：输入命盘数据 → 输出三路径白话解盘
 */
import { TOP50_REGISTRY } from './index';
import { disambiguate } from './disambiguation';
import { runGates, calcBarnumRatio, type WhiteTalkSentence, type WhiteTalkLayer } from './gates';
import { confidenceToModality, netConfidence } from './confidence';
import { compositePolarity } from './kg';
import type { SolutionOutput, DisplayVariant } from './api';

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

  // 选择要分析的术语
  const termsToAnalyze = termIds
    ? termIds.map((id) => TOP50_REGISTRY[id]).filter(Boolean)
    : Object.values(TOP50_REGISTRY);

  // 逐条消歧
  const allSentences: WhiteTalkSentence[] = [];
  const allAtoms: Array<{ atomicId: string; termId: string; polarity: string; confidence: number; modality: string }> = [];
  const allTermIds: string[] = [];
  const allComboIds: string[] = [];

  for (const term of termsToAnalyze) {
    const result = disambiguate(term, context, 3);
    const netConf = netConfidence(result.confidence);

    // 跳过低置信度
    if (Math.abs(netConf) < 0.2) continue;

    allTermIds.push(term.id);

    // 生成白话句子
    for (const combo of result.combos) {
      allComboIds.push(combo.id);
      const template = term.templates.find((t) => t.comboId === combo.id);
      if (!template) continue;

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

      allAtoms.push({
        atomicId: template.atomicId,
        termId: term.id,
        polarity: template.polarity,
        confidence: netConf,
        modality: confidenceToModality(netConf),
      });
    }
  }

  // 三道闸校验
  const passedSentences = allSentences.filter((s) => runGates(s).pass);
  const barnumRatio = calcBarnumRatio(passedSentences);

  // 汇总极性
  const overallPolarity = compositePolarity(
    allAtoms.filter((a) => Math.abs(a.confidence) > 0.5).map((a) => a.atomicId.split('-')[1] + '-1')
  );

  // 汇总置信度
  const avgConfidence =
    allAtoms.length > 0
      ? allAtoms.reduce((sum, a) => sum + Math.abs(a.confidence), 0) / allAtoms.length
      : 0;

  const overallModality = confidenceToModality(avgConfidence);

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
    meta: {
      termIds: allTermIds,
      comboIds: allComboIds,
      atoms: allAtoms.map((a) => ({
        atomicId: a.atomicId,
        termId: a.termId,
        polarity: a.polarity as any,
        confidence: a.confidence,
        modality: a.modality as any,
        evidence: context,
      })),
      version: '1.0.0',
    },
  };
}
