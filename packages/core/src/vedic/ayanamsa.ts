/**
 * @file Lahiri（Chitra Paksha）岁差 / Ayanamsa
 * @传统依据 印度历改委员会（Calendar Committee 1955）方案，Swiss Ephemeris SE_SIDM_LAHIRI 口径：
 *   - 恒星黄道 0° 锚定 Chitra（Spica, α Virginis）于恒星黄经 180°。
 *   - 历元 J2000.0（JD 2451545.0）Ayanamsa = 23°51′11.539″ = 23.8532053°。
 *   - 其后叠加 IAU 岁差在黄经方向的长期项（约 50.29″/年），含二次/三次项，
 *     不使用纯线性近似。
 * 恒星黄经 = 回归黄经 − Ayanamsa。本函数独立于七政四余 IAU2006 岁差，不复用其表。
 */
import { normalizeLongitude } from './tables';

/** J2000.0 历元 Lahiri Ayanamsa（度）= 23°51′11.539″ */
export const LAHIRI_J2000_DEG = 23 + 51 / 60 + 11.539 / 3600;

export type VedicAyanamsaSystem = 'lahiri';

/**
 * 自 J2000.0 起的黄经岁差（IAU 长期多项式，单位：度）。
 * t 为自 J2000.0 起的儒略世纪数。
 */
function precessionInLongitudeDegrees(t: number): number {
  const arcSeconds =
    5028.796195 * t + 1.1054348 * t * t + 0.00007964 * t * t * t - 0.000023857 * t * t * t * t;
  return arcSeconds / 3600;
}

/**
 * Lahiri Ayanamsa（度）。
 * @param decimalYear 目标时刻的小数公历年份（如 2026.35）。
 */
export function lahiriAyanamsa(decimalYear: number): number {
  if (!Number.isFinite(decimalYear)) {
    throw new Error('Ayanamsa 年份必须是有限数字。');
  }
  const t = (decimalYear - 2000) / 100;
  return LAHIRI_J2000_DEG + precessionInLongitudeDegrees(t);
}

/**
 * 回归黄经 → 恒星黄经（Vedic 口径）。
 * sidereal = tropical − ayanamsa，归一化到 [0, 360)。
 */
export function tropicalToSidereal(tropicalLongitude: number, ayanamsaDegrees: number): number {
  if (!Number.isFinite(tropicalLongitude) || !Number.isFinite(ayanamsaDegrees)) {
    throw new Error('黄经与 Ayanamsa 必须是有限数字。');
  }
  return normalizeLongitude(tropicalLongitude - ayanamsaDegrees);
}

/** Ayanamsa 元信息（入证据链） */
export interface VedicAyanamsaInfo {
  system: VedicAyanamsaSystem;
  degrees: number;
  source: string;
}

export function buildVedicAyanamsaInfo(decimalYear: number): VedicAyanamsaInfo {
  return {
    system: 'lahiri',
    degrees: Number(lahiriAyanamsa(decimalYear).toFixed(6)),
    source: 'Lahiri/Chitra Paksha（IAE）：J2000.0=23°51′11.539″ + IAU 黄经岁差长期项',
  };
}
