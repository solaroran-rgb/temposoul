/**
 * 命律 · 前端对接接口契约
 *
 * 三路径输出格式（D-5：同 snapshot 切换不重算）
 * 前端根据 display_variant 选择渲染哪一路
 */
import type { FactPolarity, EpistemicModality, AtomicConclusion } from './types';
import type { WhiteTalkSentence } from './gates';

// ============================================================
// 1. 解盘输出结构
// ============================================================

export interface SolutionOutput {
  /** 命盘快照 ID（同 snapshot 切换不重算） */
  snapshotId: string;
  /** 时间戳 */
  timestamp: number;
  /** 专业路径（带术语+证据链） */
  pro: PathOutput;
  /** 混合路径（白话+术语标注） */
  mix: PathOutput;
  /** 普通路径（纯白话+吉凶+建议） */
  lay: PathOutput;
  /** 元数据 */
  meta: SolutionMeta;
}

export interface PathOutput {
  /** 白话句子列表 */
  sentences: WhiteTalkSentence[];
  /** 吉凶等级（汇总极性） */
  overallPolarity: FactPolarity;
  /** 整体置信度 */
  overallConfidence: number;
  /** 整体模态 */
  overallModality: EpistemicModality;
  /** 巴纳姆比例 */
  barnumRatio: number;
}

export interface SolutionMeta {
  /** 术语 ID 列表 */
  termIds: string[];
  /** 组合 ID 列表 */
  comboIds: string[];
  /** 原子结论列表 */
  atoms: AtomicConclusion[];
  /** 版本号 */
  version: string;
}

// ============================================================
// 2. 路径切换（D-5）
// ============================================================

/**
 * 同 snapshot 切换路径，不重算
 * 前端只需选择 display_variant，后端不重新执行消歧/置信度
 */
export type DisplayVariant = 'pro' | 'mix' | 'lay';

export function selectPath(output: SolutionOutput, variant: DisplayVariant): PathOutput {
  switch (variant) {
    case 'pro':
      return output.pro;
    case 'mix':
      return output.mix;
    case 'lay':
      return output.lay;
  }
}

// ============================================================
// 3. 前端渲染规则
// ============================================================

/**
 * 三路径渲染差异：
 * - pro：L0 事实句全量，带术语+公式+证据链
 * - mix：L0+L3 为主，术语可展开
 * - lay：L1+L2 为主，白话+吉凶+建议
 */
export const PATH_RENDER_RULES = {
  pro: {
    maxBarnumRatio: 0.2, // 巴纳姆句最少
    showEvidence: true, // 显示证据链
    showTerminology: true, // 显示术语
    showFormula: true, // 显示公式
  },
  mix: {
    maxBarnumRatio: 0.4,
    showEvidence: false,
    showTerminology: true, // 术语标注
    showFormula: false,
  },
  lay: {
    maxBarnumRatio: 0.5, // 巴纳姆句最多（用户感知准确）
    showEvidence: false,
    showTerminology: false,
    showFormula: false,
  },
} as const;
