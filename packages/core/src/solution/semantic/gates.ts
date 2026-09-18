/**
 * 命律 · 巴纳姆三道闸
 *
 * G 卡定稿 v1.0：
 * - 极性闸：L1/L2 句不得翻转/模糊 fact_polarity
 * - 置信度闸：assert 档禁绝对化词；possible/unknown 必含限定词
 * - 具体性闸：L1/L2 禁具体时间/事件/数字；L3 必挂 atomic_id
 */
import type { FactPolarity, EpistemicModality } from './types';

// ============================================================
// 1. 白话分层
// ============================================================

export type WhiteTalkLayer = 'L0' | 'L1' | 'L2' | 'L3';

export interface WhiteTalkSentence {
  text: string;
  layer: WhiteTalkLayer;
  polarity: FactPolarity;
  modality: EpistemicModality;
  atomicId?: string;
}

// ============================================================
// 2. 极性闸
// ============================================================

/**
 * 极性闸：L1/L2 句不得翻转/模糊 fact_polarity
 * 违反处置：拒绝渲染，回退 L0
 */
export function polarityGate(sentence: WhiteTalkSentence): { pass: boolean; reason?: string } {
  if (sentence.layer === 'L0' || sentence.layer === 'L3') return { pass: true };

  // L1/L2 必须有明确极性
  if (sentence.polarity === '0') {
    return { pass: false, reason: 'L1/L2 极性模糊，必须明确 +/-' };
  }

  return { pass: true };
}

// ============================================================
// 3. 置信度闸
// ============================================================

/** 绝对化禁词（assert 档禁用） */
const ABSOLUTE_WORDS = ['注定', '必然', '一定', '绝对', '肯定', '就是', '毫无疑问'];

/** 限定词（possible/unknown 档必含） */
const MODALITY_WORDS = ['可能', '或许', '大概', '倾向于', '有可能'];

/**
 * 置信度闸：
 * - assert 档禁绝对化词
 * - possible/unknown 必含限定词
 */
export function confidenceGate(sentence: WhiteTalkSentence): { pass: boolean; reason?: string } {
  const text = sentence.text;

  if (sentence.modality === 'assert') {
    const hit = ABSOLUTE_WORDS.find((w) => text.includes(w));
    if (hit) {
      return { pass: false, reason: `assert 档禁用绝对化词"${hit}"` };
    }
  }

  if (sentence.modality === 'possible' || sentence.modality === 'unknown') {
    const hasModal = MODALITY_WORDS.some((w) => text.includes(w));
    if (!hasModal) {
      return { pass: false, reason: 'possible/unknown 档必含限定词（可能/或许/大概）' };
    }
  }

  return { pass: true };
}

// ============================================================
// 4. 具体性闸
// ============================================================

/**
 * 具体性闸：
 * - L1/L2 禁具体时间/事件/数字
 * - L3 必挂 atomic_id
 */
export function specificityGate(sentence: WhiteTalkSentence): { pass: boolean; reason?: string } {
  // L3 必须挂 atomic_id
  if (sentence.layer === 'L3' && !sentence.atomicId) {
    return { pass: false, reason: 'L3 必须挂 atomic_id' };
  }

  // L1/L2 禁具体年份/日期/数字
  if (sentence.layer === 'L1' || sentence.layer === 'L2') {
    if (/\d{4}年|\d+月|\d+岁/.test(sentence.text)) {
      return { pass: false, reason: 'L1/L2 禁具体时间/数字' };
    }
  }

  return { pass: true };
}

// ============================================================
// 5. 三道闸汇总
// ============================================================

export interface GateResult {
  pass: boolean;
  errors: string[];
  fallback?: string; // 回退模板原文
}

/**
 * 三道闸汇总检查
 * 任何一道失败 → 拒绝渲染，回退 L0
 */
export function runGates(sentence: WhiteTalkSentence): GateResult {
  const errors: string[] = [];

  const p1 = polarityGate(sentence);
  if (!p1.pass) errors.push(`极性闸: ${p1.reason}`);

  const p2 = confidenceGate(sentence);
  if (!p2.pass) errors.push(`置信度闸: ${p2.reason}`);

  const p3 = specificityGate(sentence);
  if (!p3.pass) errors.push(`具体性闸: ${p3.reason}`);

  return {
    pass: errors.length === 0,
    errors,
    fallback: errors.length > 0 ? '（已回退为中性描述）' : undefined,
  };
}

// ============================================================
// 6. barnum_ratio 计算
// ============================================================

/**
 * barnum_ratio = (L1 + L2) / 总句数
 * > 0.5 且 avg_confidence < 0.45 → 触发强边界声明
 */
export function calcBarnumRatio(sentences: WhiteTalkSentence[]): number {
  if (sentences.length === 0) return 0;
  const barnumCount = sentences.filter(
    (s) => s.layer === 'L1' || s.layer === 'L2'
  ).length;
  return barnumCount / sentences.length;
}
