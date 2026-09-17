/**

* C9-终版：跨域配对结果契约（A8 合婚 / B'9-4 星座配对 / C9-1 姓名配对 共用）
* 修正：score: number | null（裁决1）；新增 DossierProvider 统一别名（消灭 as never）
  */
import type { CharDossierLike } from '@temposoul/core/onomastics';

/** ★ 统一 provider 类型，全链路复用，杜绝 any/never 逃逸 */
export type DossierProvider = (char: string) => CharDossierLike | null | undefined;

export type PairConfidence = 'verified' | 'probable' | 'legendary';
export type WuxingRelation = '生' | '克' | '比和' | 'unknown';

export interface PairDimension {
  key: string;
  label: string;
  relation: WuxingRelation;
  detail: string;
  formula?: string;
  confidence: PairConfidence;
  source: string;
  unavailableReason?: string;
}

export interface MethodOrigin {
  name: string;
  era: string;
  hasClassicalBasis: boolean;
  note: string;
}

export interface PairResult {
  system: 'name' | 'bazi' | 'zodiac' | 'ziwei';
  dimensions: PairDimension[];
  /** 裁决1：C9-1 恒 null；B'9-4 为数字 */
  score: number | null;
  summary: string;
  methodOrigin: MethodOrigin;
  caveats: string[];
  disclaimer: string;
  confidence: PairConfidence;
}

export interface DimensionView {
  key: string;
  label: string;
  detail: string;
  formula?: string;
  confidence: PairConfidence;
  source: string;
  available: boolean;
  reason?: string;
}

export function toDimensionView(d: PairDimension): DimensionView {
  return {
    key: d.key,
    label: d.label,
    detail: d.detail,
    formula: d.formula,
    confidence: d.confidence,
    source: d.source,
    available: !d.unavailableReason,
    reason: d.unavailableReason,
  };
}
