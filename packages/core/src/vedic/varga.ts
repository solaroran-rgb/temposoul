/**
 * @file 吠陀分盘（Varga / Divisional Chart）— Phase2 最小子集：D9 Navamsa
 * @传统依据 Parashara Hora Shastra（BPHS）通行 Chara（Parashari）Navamsa 规则：
 *   - 每个 Rashi（30°）均分 9 份，每份 3°20′，即一个 Navamsa；全黄道 108 个 Navamsa。
 *   - Navamsa 在 Rashi 内的起始星座（startSign）由 Rashi 的性质决定：
 *       · 移动（Chara，rashiIndex % 3 === 0）：从本 Rashi 起算；
 *       · 固定（Sthira，rashiIndex % 3 === 1）：从本 Rashi 起第 9 宫（+8）；
 *       · 双元（Dwiswabhava，rashiIndex % 3 === 2）：从本 Rashi 起第 5 宫（+4）。
 *   - 同一 Rashi 内 9 个 Navamsa 沿黄道顺次排入上述起始星座之后。
 *   - D9 不重新求上升点：D1 Lagna 度数直接映射到分盘星座（传统口径）。
 * 本文件只做确定性经度→分盘星座映射，不调用星历。
 */
import { RASHIS, normalizeLongitude, type RashiInfo } from './tables';

export const NAVAMSAS_PER_RASHI = 9;
/** 每个 Navamsa 对应的原始弧长（度）= 3°20′ */
export const NAVAMSA_SPAN_DEG = 30 / NAVAMSAS_PER_RASHI; // 3.3333…
export const NAVAMSA_COUNT = 108;

/**
 * 某 Rashi 的 Navamsa 起始星座索引（Parashari Chara 规则）。
 * @param rashiIndex 0..11（Mesha=0）
 */
export function navamsaStartSign(rashiIndex: number): number {
  const mod = ((rashiIndex % 3) + 3) % 3;
  if (mod === 0) return ((rashiIndex % 12) + 12) % 12; // 移动：自本宫
  if (mod === 1) return ((rashiIndex % 12) + 8) % 12; // 固定：起第 9 宫
  return ((rashiIndex % 12) + 4) % 12; // 双元：起第 5 宫
}

export interface NavamsaPosition {
  /** 全黄道 Navamsa 序号 0..107 */
  navamsaIndex: number;
  /** 落入的 D9 Rashi 索引 0..11 */
  rashiIndex: number;
  rashi: RashiInfo;
  /** 在 D9 Rashi 内的第几个 Navamsa（0..8） */
  navamsaInSign: number;
  /** 进入本 D9 Rashi 后的弧长（度，0..30） */
  degreeInVarga: number;
}

/**
 * 恒星黄经 → D9 Navamsa 落位。
 * @param siderealLongitude 恒星黄经（度，[0,360)）
 */
export function longitudeToNavamsa(siderealLongitude: number): NavamsaPosition {
  const lon = normalizeLongitude(siderealLongitude);
  const navamsaIndex = Math.min(NAVAMSA_COUNT - 1, Math.floor(lon / NAVAMSA_SPAN_DEG));
  // 本 Rashi 内的 Navamsa 序号（0..8）
  const rashiIndexD1 = Math.floor(lon / 30);
  const k = navamsaIndex - rashiIndexD1 * NAVAMSAS_PER_RASHI;
  const startSign = navamsaStartSign(rashiIndexD1);
  const rashiIndex = (startSign + k) % 12;
  // 进入本 Navamsa 的弧长（0..3°20′），线性铺到 D9 宫 0..30°
  const withinNavamsa = lon - navamsaIndex * NAVAMSA_SPAN_DEG;
  const degreeInVarga = withinNavamsa * (30 / NAVAMSA_SPAN_DEG);
  return {
    navamsaIndex,
    rashiIndex,
    rashi: RASHIS[rashiIndex],
    navamsaInSign: k,
    degreeInVarga: Number(degreeInVarga.toFixed(8)),
  };
}
