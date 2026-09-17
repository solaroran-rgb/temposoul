/**
 * @file 吠陀占星星历基础封装
 * @description 复用 astronomy-engine 2.1.19 取九曜（Surya/Chandra/Mangala/Budha/Guru/Shukra/Shani/Rahu/Ketu）
 * 的回归黄经、上升点（Lagna）黄经与逆行标记。
 *   - 行星：Ecliptic(GeoVector(body,time,true)).elon；月亮：EclipticGeoMoon(time).lon。
 *   - Rahu（升交点）：默认平均交点（Meeus 多项式），可切换真交点（几何公式）。
 *   - Lagna：本地恒星时（RAMC）+ 黄赤交角反解上升点黄经；Whole Sign 制不依赖宫位分点。
 * 真太阳时修正不进入本层：吠陀排盘用 UT+经度直接求 ASC，仅在外层挂证据字段。
 */
import * as AstronomyEngine from 'astronomy-engine';
import type { Body } from 'astronomy-engine';
import { normalizeLongitude } from './tables';

// 与 qi_zheng 相同的 default 读取样板：兼容 Node22/tsx 与 Rollup 的模块形态差异。
const astronomyNamespace = AstronomyEngine as unknown as Record<string, unknown>;
const Astronomy = (Reflect.get(astronomyNamespace, 'default') ??
  AstronomyEngine) as typeof AstronomyEngine;
const {
  Body: AstronomyBody,
  Ecliptic,
  EclipticGeoMoon,
  GeoVector,
  GeoMoonState,
  MakeTime,
  RotateState,
  Rotation_EQJ_ECT,
  SiderealTime,
} = Astronomy;

export { AstronomyBody };

export const UNIX_EPOCH_JD = 2440587.5;
export const J2000_JD = 2451545.0;
export const JULIAN_CENTURY_DAYS = 36525;

/** 自 utcMs 求小数公历年份（与七政四余同口径） */
export function getDecimalYear(utcMs: number): number {
  const date = new Date(utcMs);
  const year = date.getUTCFullYear();
  const start = Date.UTC(year, 0, 1);
  const end = Date.UTC(year + 1, 0, 1);
  return year + (utcMs - start) / (end - start);
}

function julianDate(utcMs: number): number {
  return utcMs / 86_400_000 + UNIX_EPOCH_JD;
}

/** 行星/月亮回归黄经（度） */
export function tropicalEclipticLongitude(body: Body, utcMs: number): number {
  const time = MakeTime(new Date(utcMs));
  if (body === AstronomyBody.Moon) {
    return EclipticGeoMoon(time).lon;
  }
  return Ecliptic(GeoVector(body, time, true)).elon;
}

/**
 * 月球平均升交点黄经（Meeus Astronomical Algorithms 多项式）。
 * 吠陀传统 Rahu 取平均交点；Ketu = Rahu + 180°。
 */
export function meanNodeLongitude(utcMs: number): number {
  const t = (julianDate(utcMs) - J2000_JD) / JULIAN_CENTURY_DAYS;
  const omega = 125.04452 - 1934.136261 * t + 0.0020708 * t * t + (t * t * t) / 450000;
  return normalizeLongitude(omega);
}

/** 月球真升交点黄经（几何瞬时交点，与七政四余同公式） */
export function trueNodeLongitude(utcMs: number): number {
  const time = MakeTime(new Date(utcMs));
  const state = RotateState(Rotation_EQJ_ECT(time), GeoMoonState(time));
  const hx = state.y * state.vz - state.z * state.vy;
  const hy = state.z * state.vx - state.x * state.vz;
  return normalizeLongitude(Math.atan2(hx, -hy) * (180 / Math.PI));
}

/** 黄赤交角（度，Meeus 平均章动修正前的平交角多项式） */
export function obliquityOfEcliptic(utcMs: number): number {
  const t = (julianDate(utcMs) - J2000_JD) / JULIAN_CENTURY_DAYS;
  return (
    23 +
    26 / 60 +
    21.448 / 3600 -
    (46.815 * t) / 3600 -
    (0.00059 * t * t) / 3600 +
    (0.001813 * t * t * t) / 3600
  );
}

/**
 * 上升点（Lagna）回归黄经。
 * RAMC（本地恒星时）→ 黄经上升点反解：
 *   y = cos(RAMC)
 *   x = -(sin(RAMC)·cosε + tanφ·sinε)
 *   asc = atan2(y, x)
 * @param longitudeDeg 东经为正（与 AstrolabeBirthInput 同约定）。
 */
export function lagnaLongitude(utcMs: number, latitudeDeg: number, longitudeDeg: number): number {
  const time = MakeTime(new Date(utcMs));
  const gmstHours = SiderealTime(time);
  const ramcDeg = normalizeLongitude((gmstHours + longitudeDeg / 15) * 15);
  const eps = (obliquityOfEcliptic(utcMs) * Math.PI) / 180;
  const ramc = (ramcDeg * Math.PI) / 180;
  const phi = (latitudeDeg * Math.PI) / 180;
  const y = Math.cos(ramc);
  const x = -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps));
  return normalizeLongitude(Math.atan2(y, x) * (180 / Math.PI));
}

function angleDifferenceDegrees(from: number, to: number): number {
  return ((to - from + 540) % 360) - 180;
}

/**
 * 逆行判定：以 ±0.5 日为窗口比较黄经变化。
 * 太阳/月亮/罗睺计都不逆行（交点逆行是轨道视运动，Vedic 中标记为顺行）。
 */
export function isRetrograde(body: Body, utcMs: number): boolean {
  if (body === AstronomyBody.Sun || body === AstronomyBody.Moon) return false;
  const before = tropicalEclipticLongitude(body, utcMs - 432_000);
  const after = tropicalEclipticLongitude(body, utcMs + 432_000);
  return angleDifferenceDegrees(before, after) < 0;
}

/** 九曜 Body 映射（吠陀顺序） */
export const GRAHA_BODIES: Array<{
  key: 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn';
}> = [
  { key: 'Sun' },
  { key: 'Moon' },
  { key: 'Mars' },
  { key: 'Mercury' },
  { key: 'Jupiter' },
  { key: 'Venus' },
  { key: 'Saturn' },
];

/** 取某颗行星的 Body 枚举 */
export function grahaBody(
  key: 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn',
): Body {
  return AstronomyBody[key];
}
