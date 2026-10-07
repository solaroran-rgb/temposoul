/**
 * privacy.ts —— P13 隐私：坐标默认模糊到城市级（约 0.1°）
 *
 * B3 P13 冻结：对外链接 /sky/:cert_id（不入经纬度/称谓）；坐标默认模糊到城市级
 * （约 0.1° ≈ 11km），精确级需显式授权分享。
 *
 * 纯函数；不读 navigator，便于 node:test 确定性断言。
 */

/** 城市级模糊精度（度）：0.1° ≈ 11km，落到城市粒度，不露精确门牌 */
export const CITY_LEVEL_EPS_DEG = 0.1;

/** 模糊到城市级（round 到 0.1° 网格） */
export function blurToCityLevel(latDeg: number, lngDeg: number): { lat: number; lng: number } {
  return {
    lat: Math.round(latDeg / CITY_LEVEL_EPS_DEG) * CITY_LEVEL_EPS_DEG,
    lng: Math.round(lngDeg / CITY_LEVEL_EPS_DEG) * CITY_LEVEL_EPS_DEG,
  };
}

export interface PrivacySharingOptions {
  /** 是否显式授权分享精确坐标（默认 false → 城市级模糊） */
  precisionAuthorized?: boolean;
}

export type CoordPrecision = 'city' | 'exact';

/**
 * 解析可对外分享的坐标：未授权 → 城市级模糊；授权 → 原样精确。
 * 返回精度档位，供 UI/证书标注「城市级 / 精确级」。
 */
export function resolveShareableCoords(
  latDeg: number,
  lngDeg: number,
  opts: PrivacySharingOptions = {},
): { lat: number; lng: number; precision: CoordPrecision } {
  if (opts.precisionAuthorized) {
    return { lat: latDeg, lng: lngDeg, precision: 'exact' };
  }
  const blurred = blurToCityLevel(latDeg, lngDeg);
  return { ...blurred, precision: 'city' };
}
