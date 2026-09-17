/** osmCore.js 类型声明（构建跳过 tsc 为已知项，此文件保编辑器/类型安全） */
import type { CityGeo } from './geoApi';

export declare const SERVER_CFG: {
  METERS_PER_UNIT: number;
  H_SCALE: number;
  MAX_BUILDINGS: number;
  MIN_AREA_M2: number;
  MAX_RING_PTS: number;
  ROAD_MAX: number;
  WATER_MAX: number;
  PEAK_MAX: number;
  LANDMARK_MAX: number;
  OFFLINE_MAX_WAYS: number;
  FALLBACK_MAX_WAYS: number;
  DP_EPS_BUILDING: number;
  DP_EPS_ROAD: number;
};
export declare function latlonToENU(
  lat: number,
  lon: number,
  origin: { lat: number; lon: number },
): { x: number; z: number };
export declare function fnv1a(str: string): number;
export declare function dp(
  pts: { x: number; z: number }[],
  eps: number,
): { x: number; z: number }[];
export declare function simplifyTo(
  pts: { x: number; z: number }[],
  maxPts: number,
  eps0: number,
): { x: number; z: number }[];
export declare function buildQuery(
  lat: number,
  lon: number,
  opts?: { maxWays?: number; roadsFull?: boolean },
): string;
export declare function simplifyOsm(osm: unknown, origin: { lat: number; lon: number }): CityGeo;
