/**
 * geoEngine.ts —— 地理引擎（数据 → CityPayload 程序化线稿粒子化）
 *
 * 对应用户架构「地理引擎」：真实经纬度地标 → 本地 3D 坐标（等距局部平面投影）→
 * GlowSeg 荧光线稿 + PointPart 发光粒子，产出 sceneCore 原生 CityPayload，
 * 直接复用渲染管线（无网络、无占位城、同步可预测）。
 *
 * 坐标系对齐 SkyScene：+X 东、+Y 天顶、+Z 北；观测点位于地面原点附近。
 * 缩放：自适应——观测点周边 MAX_RADIUS_M(3.5km) → MAX_RADIUS_U(170 units)，
 * 使地标始终落在相机视野（fov 58°，z∈[40,300]）与地面网格（±320）内。
 */
import { DEG_LAT_M, degLonM, TAIPEI_LANDMARKS, TAIPEI_REF } from './landmarks';
import { CITY_LAYER } from '../sky/renderTokens';
import type { CityPayload } from '../sky/sceneCore';
import type { GlowSeg } from '../sky/materials/glowLine';
import type { PointPart } from '../sky/materials/glowPoint';

export const MAX_RADIUS_M = 3500; // 地标检索半径（米）
export const MAX_RADIUS_U = 170; // 场景半径（units）
export const METER_TO_U = MAX_RADIUS_U / MAX_RADIUS_M; // ≈0.0486 units/m
/** 建筑高度艺术夸张（线稿素描语言：小建筑垂直拉伸以获得天际线轮廓，非精确比例尺） */
export const HEIGHT_SCALE = 1.8; // P1b：4→1.8（塔过高遮挡山脊天际线，缩小塔体让山露出）
export const HEIGHT_CAP_U = 60; // 塔尖视觉高度上限（101 高耸入画面上缘）

/** 等距局部平面投影：经纬度 → 场景坐标（东=x，北=z，高=y） */
export function project(
  lat0: number,
  lon0: number,
  lat: number,
  lon: number,
  hM = 0,
): { x: number; y: number; z: number } {
  const x = (lon - lon0) * degLonM(lat0) * METER_TO_U;
  const z = (lat - lat0) * DEG_LAT_M * METER_TO_U;
  return { x, y: hM * METER_TO_U, z };
}

/* ---- 段/点构建辅助 ---- */

function pushSeg(
  out: number[],
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
) {
  out.push(a.x, a.y, a.z, b.x, b.y, b.z);
}

/** 经纬度环（闭合）→ 线段对数组 */
function ringToSegs(out: number[], ring: [number, number][], lat0: number, lon0: number, hM = 0) {
  for (let i = 0; i < ring.length; i++) {
    const a = project(lat0, lon0, ring[i][0], ring[i][1], hM);
    const b = project(
      lat0,
      lon0,
      ring[(i + 1) % ring.length][0],
      ring[(i + 1) % ring.length][1],
      hM,
    );
    pushSeg(out, a, b);
  }
}

/** 多段线 → 线段对数组 */
function lineToSegs(out: number[], pts: [number, number][], lat0: number, lon0: number, hM = 0) {
  for (let i = 0; i + 1 < pts.length; i++) {
    const a = project(lat0, lon0, pts[i][0], pts[i][1], hM);
    const b = project(lat0, lon0, pts[i + 1][0], pts[i + 1][1], hM);
    pushSeg(out, a, b);
  }
}

/** 距离分层（米 → layer 浮点） */
function layerByDistM(d: number): number {
  if (d < 1200) return CITY_LAYER.near;
  if (d < 2200) return CITY_LAYER.mid;
  return CITY_LAYER.far;
}

function distM(lat0: number, lon0: number, lat: number, lon: number): number {
  const dLat = (lat - lat0) * DEG_LAT_M;
  const dLon = (lon - lon0) * degLonM(lat0);
  return Math.hypot(dLat, dLon);
}

/* ---- 台北地标 → CityPayload ---- */

export function buildLandmarkPayload(lat: number, lon: number, _mobile = false): CityPayload {
  const buildings: number[] = [];
  const landmarks: number[] = [];
  const water: number[] = [];
  const roads: number[] = [];
  const peaks: number[] = [];
  const pWarm: number[] = []; // 地标焦点（暖橙）
  const pCool: number[] = []; // 沿线粒子（冷色）

  let anyInRange = false;
  for (const lm of TAIPEI_LANDMARKS) {
    const d = distM(lat, lon, lm.lat, lm.lon);
    if (d > MAX_RADIUS_M) continue;
    anyInRange = true;
    layerByDistM(d);
    const center = project(lat, lon, lm.lat, lm.lon);
    const hM = lm.heightM ?? 0;
    const hU = hM * METER_TO_U;

    switch (lm.kind) {
      case 'building':
      case 'tower':
        if (lm.ring) {
          // 轮廓环（地面）
          ringToSegs(landmarks, lm.ring, lat, lon, 0);
          if (hU > 0.8) {
            // 垂直棱线（底→顶）与顶环：线稿体量感
            const topRing: [number, number][] = lm.ring;
            const n = topRing.length;
            for (let i = 0; i < n; i++) {
              const b = project(lat, lon, topRing[i][0], topRing[i][1], 0);
              const t = project(lat, lon, topRing[i][0], topRing[i][1], hM);
              pushSeg(buildings, b, t);
              const bn = project(lat, lon, topRing[(i + 1) % n][0], topRing[(i + 1) % n][1], hM);
              pushSeg(buildings, t, bn);
            }
          }
          // 焦点粒子（暖橙，仅地标中心/塔尖）
          pWarm.push(center.x, lm.kind === 'tower' ? hU : hU * 0.5, center.z);
        }
        break;
      case 'park':
        if (lm.ring) ringToSegs(landmarks, lm.ring, lat, lon, 0);
        pCool.push(center.x, 0.2, center.z);
        break;
      case 'mountain':
        if (lm.polyline) {
          // 等高线三环：主脊 + 两圈示意环（纵向位移模拟山体）
          lineToSegs(peaks, lm.polyline, lat, lon, 0);
          lineToSegs(peaks, lm.polyline, lat, lon, (lm.heightM ?? 120) * 0.35);
          lineToSegs(peaks, lm.polyline, lat, lon, (lm.heightM ?? 120) * 0.7);
          pCool.push(center.x, (lm.heightM ?? 120) * METER_TO_U, center.z);
        }
        break;
      case 'river':
        if (lm.polyline) lineToSegs(water, lm.polyline, lat, lon, 0);
        if (lm.polyline) {
          const step = Math.max(1, Math.floor(lm.polyline.length / 4));
          for (let i = 0; i < lm.polyline.length; i += step) {
            const p = project(lat, lon, lm.polyline[i][0], lm.polyline[i][1], 0);
            pCool.push(p.x, 0.2, p.z);
          }
        }
        break;
      case 'road':
        if (lm.polyline) lineToSegs(roads, lm.polyline, lat, lon, 0);
        if (lm.polyline) {
          const step = Math.max(1, Math.floor(lm.polyline.length / 5));
          for (let i = 0; i < lm.polyline.length; i += step) {
            const p = project(lat, lon, lm.polyline[i][0], lm.polyline[i][1], 0);
            pCool.push(p.x, 0.2, p.z);
          }
        }
        break;
    }
  }

  // 没有任何地标在检索半径内（如定位在台北边缘外）→ 回退抽象天际线
  if (!anyInRange) return buildAbstractSkylinePayload(lat, lon);

  const lines: GlowSeg[] = [];
  if (buildings.length) lines.push({ pts: new Float32Array(buildings), layer: CITY_LAYER.near });
  if (landmarks.length) lines.push({ pts: new Float32Array(landmarks), layer: CITY_LAYER.mid });
  if (peaks.length) lines.push({ pts: new Float32Array(peaks), layer: CITY_LAYER.far });

  const points: PointPart[] = [];
  if (pWarm.length) points.push({ positions: new Float32Array(pWarm), size: 3.2, warm: 1 });
  if (pCool.length) points.push({ positions: new Float32Array(pCool), size: 0.9, warm: 0 });

  return {
    lines,
    points,
    water: water.length ? [{ pts: new Float32Array(water), layer: CITY_LAYER.mid }] : [],
    roads: roads.length ? [{ pts: new Float32Array(roads), layer: CITY_LAYER.mid }] : [],
    landmarks: landmarks.length
      ? [{ pts: new Float32Array(landmarks), layer: CITY_LAYER.near }]
      : [],
  };
}

/* ---- 非台北城市回退：抽象天际线（真实经纬度 → 确定性轮廓，非随机） ---- */

function hash01(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** 按城市经纬度确定性地生成一条起伏天际线轮廓 + 塔尖粒子（HUD 素描风） */
export function buildAbstractSkylinePayload(lat: number, lon: number): CityPayload {
  const segs: number[] = [];
  const pWarm: number[] = [];
  const N = 26;
  const HALF_W = 150;
  let prevY = 0;
  for (let i = 0; i <= N; i++) {
    const x = -HALF_W + (i / N) * HALF_W * 2;
    const r1 = hash01(i * 7.31 + lat * 0.01 + lon * 0.017);
    const r2 = hash01(i * 3.17 + lon * 0.013 - lat * 0.007);
    const y = 6 + r1 * 22 + (r2 - 0.5) * 8; // 6..36 units 起伏
    if (i > 0) segs.push(x, prevY, 80, x, y, 80);
    prevY = y;
    // 局部塔尖粒子（暖橙焦点）
    if (r1 > 0.72) pWarm.push(x, y + 3, 80);
  }
  const points: PointPart[] = [{ positions: new Float32Array(pWarm), size: 1.6, warm: 1 }];
  return {
    lines: [{ pts: new Float32Array(segs), layer: CITY_LAYER.mid }],
    points,
    water: [],
    roads: [],
    landmarks: [{ pts: new Float32Array(segs), layer: CITY_LAYER.far }],
  };
}

/** POC 覆盖判断（供 UI 显示地标来源徽标） */
export function isTaipeiCovered(lat: number, lon: number): boolean {
  return distM(TAIPEI_REF.lat, TAIPEI_REF.lon, lat, lon) <= MAX_RADIUS_M;
}

/** 数据源元信息（交付说明/UI 徽标用） */
export const GEO_ENGINE_META = {
  version: '0.1-p1-taipei101',
  source: 'P1: OpenStreetMap 真实数据 → 构建期 Geo Tile（米制坐标）→ CDN 静态',
  radiusM: MAX_RADIUS_M,
};

/* ============================================================
 * P1 · Geo Tile 消费（真实地理数据）
 * 链路：真实 Geo Data → Geo Tile（构建期米制线稿坐标）→ 本地坐标 → Three.js Geometry
 * tile JSON 坐标为「以 tile 中心（台北101）为原点的米制平面」（x=东米, z=北米, y=高度米），
 * 运行时仅乘 METER_TO_U 得场景 units——零实时抓取、零复杂计算。
 * ============================================================ */

export interface GeoTileJson {
  id: string;
  level: 'L0' | 'L1' | 'L2';
  unit: 'meter';
  center: { lat: number; lon: number };
  landmarks?: {
    id: string;
    name?: string;
    kind: string;
    ring?: [number, number][];
    heightM?: number;
    warm?: boolean;
  }[];
  roads?: { id: string; name?: string; polyline?: [number, number][] }[];
  water?: { id: string; name?: string; polyline?: [number, number][] }[];
  trails?: { id: string; name?: string; polyline?: [number, number][] }[];
}

const TILE101 = { lat: 25.033, lon: 121.5654, radiusM: 3200 };

function pushSeg2(
  out: number[],
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
) {
  out.push(ax, ay, az, bx, by, bz);
}

/** 米制多段线 → 场景线段对（y 恒定） */
function mLineToSegs(out: number[], pts: [number, number][], y: number) {
  const S = METER_TO_U;
  for (let i = 0; i + 1 < pts.length; i++) {
    pushSeg2(out, pts[i][0] * S, y, pts[i][1] * S, pts[i + 1][0] * S, y, pts[i + 1][1] * S);
  }
}

/** 米制闭合环 → 地面线段对 */
function mRingToSegs(out: number[], ring: [number, number][], y: number) {
  const S = METER_TO_U;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i],
      b = ring[(i + 1) % ring.length];
    pushSeg2(out, a[0] * S, y, a[1] * S, b[0] * S, y, b[1] * S);
  }
}

/**
 * Geo Tile（L0/L1/L2）→ CityPayload
 * 层级：L0 建筑/地标 → landmarks 槽（近亮）；L1 建筑 → lines（中）；
 *      L2 水系 → water 槽、山径 → lines（远）；101（warm）→ 完整轮廓+垂直棱线+顶环+暖橙焦点
 */
export function buildTilePayload(tiles: GeoTileJson[]): CityPayload {
  const nearLines: number[] = []; // L0 建筑体量（棱线/顶环）
  const midLines: number[] = []; // L1 建筑地面环
  const farLines: number[] = []; // L2 建筑 + 山径
  const landSegs: number[] = []; // L0 建筑地面环（近亮）
  const roadSegs: number[] = [];
  const waterSegs: number[] = [];
  const pWarm: number[] = [];
  const pCool: number[] = [];

  for (const t of tiles) {
    const isL0 = t.level === 'L0',
      isL1 = t.level === 'L1',
      isL2 = t.level === 'L2';
    for (const lm of t.landmarks ?? []) {
      if (!lm.ring || lm.ring.length < 3) continue;
      // 视觉高度（HEIGHT_SCALE 夸张 + 塔尖 cap；101 高耸入画面顶部）
      const hRaw = (lm.heightM ?? 12) * METER_TO_U * HEIGHT_SCALE;
      const h = Math.min(hRaw, HEIGHT_CAP_U);
      mRingToSegs(landSegs, lm.ring, 0);
      if (lm.warm || isL0) {
        // 精细：垂直棱线 + 顶环（体量感；101 完整保留）
        mRingToSegs(nearLines, lm.ring, h);
        const S = METER_TO_U;
        for (let i = 0; i < lm.ring.length; i++) {
          const a = lm.ring[i];
          pushSeg2(nearLines, a[0] * S, 0, a[1] * S, a[0] * S, h, a[1] * S);
        }
      }
      if (lm.warm) {
        const S = METER_TO_U;
        pWarm.push(lm.ring[0][0] * S, h, lm.ring[0][1] * S); // 塔尖暖橙焦点
        pWarm.push(lm.ring[0][0] * S, h * 0.55, lm.ring[0][1] * S); // P1b：塔身暖橙焦点（增强单点聚焦）
      } else if (isL0) {
        const S = METER_TO_U;
        pCool.push(lm.ring[0][0] * S, h * 0.5, lm.ring[0][1] * S); // 建筑顶部节点
      } else if (isL1) {
        mRingToSegs(midLines, lm.ring, 0);
      } else if (isL2) {
        mRingToSegs(farLines, lm.ring, 0);
      }
    }
    for (const r of t.roads ?? []) if (r.polyline) mLineToSegs(roadSegs, r.polyline, 0.1);
    for (const w of t.water ?? []) if (w.polyline) mLineToSegs(waterSegs, w.polyline, 0.1);
    for (const tr of t.trails ?? []) if (tr.polyline) mLineToSegs(farLines, tr.polyline, 0.3);
  }

  const lines: GlowSeg[] = [];
  if (nearLines.length) lines.push({ pts: new Float32Array(nearLines), layer: CITY_LAYER.near });
  if (midLines.length) lines.push({ pts: new Float32Array(midLines), layer: CITY_LAYER.mid });
  if (farLines.length) lines.push({ pts: new Float32Array(farLines), layer: CITY_LAYER.far });
  const points: PointPart[] = [];
  if (pWarm.length) points.push({ positions: new Float32Array(pWarm), size: 6.0, warm: 1 });
  if (pCool.length) points.push({ positions: new Float32Array(pCool), size: 1.0, warm: 0 });
  return {
    lines,
    points,
    water: waterSegs.length ? [{ pts: new Float32Array(waterSegs), layer: CITY_LAYER.mid }] : [],
    roads: roadSegs.length ? [{ pts: new Float32Array(roadSegs), layer: CITY_LAYER.mid }] : [],
    landmarks: landSegs.length ? [{ pts: new Float32Array(landSegs), layer: CITY_LAYER.near }] : [],
  };
}

/** 距台北101 tile 覆盖判断（米） */
export function inTaipei101Tile(lat: number, lon: number): boolean {
  const dLat = (lat - TILE101.lat) * DEG_LAT_M;
  const dLon = (lon - TILE101.lon) * degLonM(TILE101.lat);
  return Math.hypot(dLat, dLon) <= TILE101.radiusM;
}

/** DEM 地形 tile 结构（build-terrain-tiles.mjs 产物） */
export interface GeoTerrainJson {
  id: string;
  level: 'DEM';
  unit: 'meter';
  contours: { level: number; segments: number[] }[]; // 段流 x1,z1,x2,z2,...
  vegetation: [number, number, number][]; // [x,z,h] 米制
}

/**
 * P1b · DEM 地形 → 山体等高线线稿 + 植被粒子
 * 等高线按海拔分三段亮度（近山亮、远山暗；jinan-v2 近亮远暗）；y 按海拔抬升形成层叠山形。
 */
export function buildTerrainPayload(t: GeoTerrainJson): {
  terrain: GlowSeg[];
  vegetation: PointPart[];
} {
  const S = METER_TO_U;
  const bands: { segs: number[]; layer: number }[] = [
    { segs: [], layer: 1.0 },
    { segs: [], layer: 0.92 },
    { segs: [], layer: 0.78 },
  ];
  for (const c of t.contours) {
    const band = c.level <= 85 ? 0 : c.level <= 175 ? 1 : 2;
    const segs = bands[band].segs;
    const y = c.level * S * 2.0; // 山体层叠抬升（P1b 艺术化：2.0，山脊天际线露出塔顶）
    if (y < 14) continue; // P1b 精化：只留高海拔山脊段（y≥14 ≈ 海拔144m+），形成 2-3 层清晰轮廓
    for (let k = 0; k + 3 < c.segments.length; k += 4) {
      // P1b：只保留南方远景段（z < -20m），近处贴地段剔除（避免与城市线稿重叠淹没）
      if (c.segments[k + 1] > -20 || c.segments[k + 3] > -20) continue;
      segs.push(
        c.segments[k] * S,
        y,
        c.segments[k + 1] * S,
        c.segments[k + 2] * S,
        y,
        c.segments[k + 3] * S,
      );
    }
  }
  const terrain: GlowSeg[] = [];
  for (const b of bands)
    if (b.segs.length >= 6) terrain.push({ pts: new Float32Array(b.segs), layer: b.layer });
  const veg: number[] = [];
  for (const [x, z] of t.vegetation) veg.push(x * S, 0.6, z * S);
  return {
    terrain,
    vegetation: veg.length ? [{ positions: new Float32Array(veg), size: 2.2, warm: 0 }] : [],
  };
}

/** 运行时：拉取台北101 LOD 三级 tile + DEM 地形 → payload（CDN 静态，零边缘计算）；范围外返回 null */
export async function loadTilePayload(lat: number, lon: number): Promise<CityPayload | null> {
  if (!inTaipei101Tile(lat, lon)) return null;
  const [l0, l1, l2, dem] = await Promise.all([
    fetch('/geo/taipei101-L0.json').then((r) => r.json() as Promise<GeoTileJson>),
    fetch('/geo/taipei101-L1.json').then((r) => r.json() as Promise<GeoTileJson>),
    fetch('/geo/taipei101-L2.json').then((r) => r.json() as Promise<GeoTileJson>),
    fetch('/geo/taipei101-dem.json')
      .then((r) => r.json() as Promise<GeoTerrainJson>)
      .catch(() => null),
  ]);
  const base = buildTilePayload([l0, l1, l2]);
  if (!dem) return base;
  const ter = buildTerrainPayload(dem);
  return { ...base, terrain: ter.terrain, vegetation: ter.vegetation };
}
