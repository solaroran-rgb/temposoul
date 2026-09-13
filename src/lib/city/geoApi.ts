import { CITY_CONFIG } from "./config";

/** /api/geo v2 响应契约（第二轮 T2 §1，L2 紧凑段格式，裁定 D7） */
export interface CityBuilding {
  pts: number[];   // 扁平闭合环 [x0,z0,...,xn,zn]，末点=首点，≤9 点
  h: number;       // 目标高度 u，已含 H_SCALE
  lv?: number;
  area?: number;   // m²
}
export interface CityRoad {
  pts: number[];   // 扁平开放折线
  cls: 0 | 1 | 2;  // 0=motorway/trunk 1=primary 2=secondary
}
export interface CityLandmark {
  pts: number[];
  h: number;
  name?: string;      // 本地名（语言优先链已在服务端解析）
  nameEn?: string;    // 英文名
  kind: string;       // 白名单命中 kind 或 "unnamed_top_area"
  score: number;
}
export interface CityGeo {
  v: 2;
  center: [number, number];
  ts: number;
  raw_count: number;              // 数据三态唯一判据
  buildings: CityBuilding[];      // 距中心升序（drawRange 契约）
  roads: CityRoad[];
  landmarks: CityLandmark[];      // score 降序 ≤8
  water: number[][];
  peaks: [number, number][];
}

export type GeoFallback = { fallback: true };
export type GeoResponse = CityGeo | GeoFallback;

export const isFallback = (r: GeoResponse): r is GeoFallback => "fallback" in r;

/** 任何失败返回 fallback，永不 throw（含外层 signal 预中止短路） */
export async function fetchCityGeo(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<GeoResponse> {
  if (signal?.aborted) return { fallback: true };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), CITY_CONFIG.GEO_API_TIMEOUT_MS);
  const onOuterAbort = () => ctrl.abort();
  signal?.addEventListener("abort", onOuterAbort, { once: true });
  try {
    const res = await fetch(
      `/api/geo?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`,
      { signal: ctrl.signal },
    );
    if (!res.ok) return { fallback: true };
    return (await res.json()) as GeoResponse;
  } catch {
    return { fallback: true };
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onOuterAbort);
  }
}