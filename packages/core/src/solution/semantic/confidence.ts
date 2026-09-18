/**
 * 命律 · Dempster-Shafer 置信度计算
 *
 * D-2 裁决：D-S 组合，Yager 回退 K≥1-ε
 * 五档：assert≥0.75 / likely 0.60-0.75 / tend 0.45-0.60 / possible 0.25-0.45 / unknown<0.25
 */
import type { EpistemicModality } from './types';

// ============================================================
// 1. D-S Mass
// ============================================================

/** D-S 证据体 */
export interface DsMass {
  /** 支持（belief for） */
  support: number;
  /** 反对（belief against） */
  oppose: number;
  /** 不确定性（remaining） */
  uncertain: number;
}

/** 校验 mass 合法性（加总=1.0） */
export function validateMass(m: DsMass): boolean {
  const sum = m.support + m.oppose + m.uncertain;
  return Math.abs(sum - 1.0) < 0.001;
}

// ============================================================
// 2. Dempster 组合规则（正交和）
// ============================================================

/**
 * Dempster 正交和：m ⊕ m2
 * K = 冲突质量（m1.support * m2.oppose + m1.oppose * m2.support）
 * 归一化：(m1 ⊕ m2) / (1 - K)
 */
export function dempsterCombine(m1: DsMass, m2: DsMass): DsMass {
  const K = m1.support * m2.oppose + m1.oppose * m2.support;
  const denominator = 1 - K;

  if (denominator <= 0) {
    // 完全冲突，走 Yager 回退
    return yagerFallback(m1, m2, K);
  }

  const support =
    (m1.support * m2.support + m1.support * m2.uncertain + m1.uncertain * m2.support) / denominator;
  const oppose =
    (m1.oppose * m2.oppose + m1.oppose * m2.uncertain + m1.uncertain * m2.oppose) / denominator;
  const uncertain = (m1.uncertain * m2.uncertain) / denominator;

  return { support, oppose, uncertain };
}

// ============================================================
// 3. Yager 回退（K ≥ 1-ε）
// ============================================================

/**
 * Yager 回退规则：当 Dempster 归一化因子过小（denominator → 0），
 * 将冲突质量分配给不确定性，不做归一化。
 */
export function yagerFallback(m1: DsMass, m2: DsMass, K: number): DsMass {
  const support = m1.support * m2.support;
  const oppose = m1.oppose * m2.oppose;
  const uncertain =
    m1.uncertain * m2.uncertain +
    m1.support * m2.uncertain +
    m1.uncertain * m2.support +
    m1.oppose * m2.uncertain +
    m1.uncertain * m2.oppose +
    K; // 冲突质量全部归入不确定性

  return { support, oppose, uncertain };
}

// ============================================================
// 4. 多证据组合（链式）
// ============================================================

/**
 * 链式组合多个证据体
 * 优先级：Dempster ⊕ → 交互 ⊕/⊖ → 蕴含 ⊃ → 互斥 ⊗ → 归一化
 */
export function combineMasses(masses: DsMass[]): DsMass {
  if (masses.length === 0) return { support: 0, oppose: 0, uncertain: 1 };
  if (masses.length === 1) return masses[0];

  let result = masses[0];
  for (let i = 1; i < masses.length; i++) {
    result = dempsterCombine(result, masses[i]);
  }
  return result;
}

// ============================================================
// 5. 置信度 → 模态映射
// ============================================================

/**
 * 置信度（support - oppose）→ 模态五档
 * @param confidence 净置信度 [-1, 1]
 */
export function confidenceToModality(confidence: number): EpistemicModality {
  const abs = Math.abs(confidence);
  if (abs >= 0.75) return 'assert';
  if (abs >= 0.60) return 'likely';
  if (abs >= 0.45) return 'tend';
  if (abs >= 0.25) return 'possible';
  return 'unknown';
}

/**
 * 从 DsMass 计算净置信度
 */
export function netConfidence(m: DsMass): number {
  return m.support - m.oppose;
}

// ============================================================
// 6. 预设证据体（因子命中）
// ============================================================

/** 因子命中（强证据） */
export function strongEvidence(): DsMass {
  return { support: 0.8, oppose: 0.05, uncertain: 0.15 };
}

/** 因子命中（中证据） */
export function mediumEvidence(): DsMass {
  return { support: 0.6, oppose: 0.1, uncertain: 0.3 };
}

/** 因子命中（弱证据） */
export function weakEvidence(): DsMass {
  return { support: 0.4, oppose: 0.2, uncertain: 0.4 };
}

/** 无证据 */
export function noEvidence(): DsMass {
  return { support: 0, oppose: 0, uncertain: 1 };
}
