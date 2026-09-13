// src/lib/sky/constellationQuality.ts
// 星座线段数分级（D3 裁定：E1 只提供数据与分级，材质归 E3）
// 契约表 §2.7：high 566 / mid 400 / low 200
//
// 说明：本轮按现有 CONSTELLATION_SEGMENTS 的原始顺序截断。
// 若未来需要「亮星优先」（低档下保留更亮的星座），
// 由 E1 在数据生成阶段预排序，或下一轮追加 sortSegmentsByBrightness。

export type QualityTier = 'high' | 'mid' | 'low';

// 明确数值，不用 Infinity（契约表已固定 566）
const SEGMENT_LIMITS: Record<QualityTier, number> = {
  high: 566,
  mid: 400,
  low: 200,
};

/**
 * 按画质档位截断星座线段。
 * - 若原始段数 <= 上限，返回原数组（不复制）
 * - 否则返回前 limit 段（新数组）
 */
export function selectSegmentsForTier(
  segments: number[][],
  tier: QualityTier
): number[][] {
  if (!Array.isArray(segments)) return [];
  const limit = SEGMENT_LIMITS[tier];
  if (segments.length <= limit) return segments;
  return segments.slice(0, limit);
}

/** 返回档位对应的段数上限，供 E3 预算核算引用 */
export function getSegmentLimit(tier: QualityTier): number {
  return SEGMENT_LIMITS[tier];
}