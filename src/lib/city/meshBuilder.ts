import * as THREE from "three";
import type { CityGeo, CityBuilding, CityLandmark } from "./geoApi";
import { classifyMode, CITY_CONFIG, type CityMode } from "./config";
import { mergeLineGeometries } from "./placeholder";
import { COVERAGE } from "./projection";
import { fnv1a } from "./osmCore.js";   // F3 修复：fnv1a 唯一来源为 osmCore（seed.ts 无此导出）

/**
 * v2 批次契约（裁定 D4/D7/C2/C4/C7）：
 * - 每类恰 1 batch：buildings / roads / nodes / landmarks / water / peaks（+3 已计入 E3 预算）
 * - 无 aDelay/aTargetH/aMatch（D4 生长动画 off；入场 = E3 的 0.5s fade in）
 * - buildings 顶点距中心升序（drawRange 60%/35% 截断契约）
 * - aLayer：0 近 / 1 中 / 2 远（E3 映射 opacity 0.85/0.5/0.28）
 * - nodes：顶环顶点(aWarm=0) + 地标窗点(aWarm=1，C4 次级暖橙 ≤WARM_POINTS_MAX)
 * - material 全部归 E3；本文件只产几何与 attribute，零色值（C5）
 */
export interface CityBatch {
  kind: "buildings" | "roads" | "nodes" | "landmarks" | "water" | "peaks";
  geometry: THREE.BufferGeometry;
  mode: CityMode;
}

const Y_ROAD = 0.08;
const Y_WATER = 0.15;

const layerOf = (r: number): number =>
  r < CITY_CONFIG.LAYER_NEAR ? 0 : r < CITY_CONFIG.LAYER_MID ? 1 : 2;

/** 防御性剥离闭合重复点（服务端契约：末点=首点） */
function ringInfo(b: { pts: number[] }): { n: number; cx: number; cz: number } {
  const nPts = b.pts.length / 2;
  const closed =
    nPts > 1 &&
    b.pts[0] === b.pts[(nPts - 1) * 2] &&
    b.pts[1] === b.pts[(nPts - 1) * 2 + 1];
  const n = closed ? nPts - 1 : nPts;
  let cx = 0, cz = 0;
  for (let i = 0; i < n; i++) { cx += b.pts[i * 2]; cz += b.pts[i * 2 + 1]; }
  return { n, cx: cx / n, cz: cz / n };
}

export function cityGeoToBatches(
  geo: CityGeo,
  mobile: boolean,
): { batches: CityBatch[]; mode: CityMode } {
  const mode = classifyMode(geo.raw_count);
  const batches: CityBatch[] = [];

  const hasBlds = mode !== "PLACEHOLDER+" && geo.buildings.length > 0;
  let blds = geo.buildings;   // 服务端已距中心升序
  if (hasBlds && mobile && blds.length > CITY_CONFIG.MAX_BUILDINGS_MID) {
    blds = blds.slice(0, CITY_CONFIG.MAX_BUILDINGS_MID);   // drawRange 语义：保近裁远
  }

  if (hasBlds) {
    batches.push({ kind: "buildings", geometry: buildBuildingGeometry(blds), mode });
    batches.push({ kind: "nodes", geometry: buildNodesGeometry(blds, geo.landmarks ?? [], mobile), mode });
    if (geo.landmarks?.length) {
      batches.push({ kind: "landmarks", geometry: buildLandmarkGeometry(geo.landmarks), mode });
    }
  }
  // PLACEHOLDER+ 不画真实 roads（避免与占位城伪路网叠加噪点）——数据三态表 §2.1
  if (mode !== "PLACEHOLDER+" && geo.roads?.length) {
    batches.push({ kind: "roads", geometry: buildRoadsGeometry(geo.roads), mode });
  }
  // water/peaks 三态常画（画面不空 + "周边环境"语义）
  const wg = buildWaterGeometry(geo.water);
  if (wg) batches.push({ kind: "water", geometry: wg, mode });
  const pg = buildPeakGeometry(geo.peaks);
  if (pg) batches.push({ kind: "peaks", geometry: pg, mode });

  return { batches, mode };
}

function buildBuildingGeometry(blds: CityBuilding[]): THREE.BufferGeometry {
  const pos: number[] = [], lay: number[] = [];
  const push = (x: number, y: number, z: number, L: number) => { pos.push(x, y, z); lay.push(L); };
  for (const b of blds) {
    const { n, cx, cz } = ringInfo(b);
    if (n < 3) continue;
    const L = layerOf(Math.hypot(cx, cz));
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const x0 = b.pts[i * 2], z0 = b.pts[i * 2 + 1];
      const x1 = b.pts[j * 2], z1 = b.pts[j * 2 + 1];
      push(x0, b.h, z0, L); push(x1, b.h, z1, L);   // 顶环
      push(x0, 0, z0, L);   push(x0, b.h, z0, L);   // 角柱竖线（B2 稀疏化：仅环顶点，底环省略）
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aLayer", new THREE.Float32BufferAttribute(lay, 1));
  return g;
}

function buildNodesGeometry(
  blds: CityBuilding[],
  landmarks: CityLandmark[],
  mobile: boolean,
): THREE.BufferGeometry {
  const pos: number[] = [], warm: number[] = [], size: number[] = [], lay: number[] = [];
  const push = (x: number, y: number, z: number, w: number, s: number, L: number) => {
    pos.push(x, y, z); warm.push(w); size.push(s); lay.push(L);
  };
  // 顶环顶点（青蓝节点 = 图谱感来源）；移动端按步长采样
  const step = mobile ? CITY_CONFIG.NODE_SAMPLE_MOBILE : 1;
  for (let bi = 0; bi < blds.length; bi += step) {
    const b = blds[bi];
    const { n, cx, cz } = ringInfo(b);
    if (n < 3) continue;
    const L = layerOf(Math.hypot(cx, cz));
    for (let i = 0; i < n; i++) push(b.pts[i * 2], b.h, b.pts[i * 2 + 1], 0, 1.0, L);
  }
  // 地标窗点（C4 暖橙次级点缀：仅地标层、全局 ≤ WARM_POINTS_MAX、不新增 draw call）
  let warmCount = 0;
  for (const lm of landmarks) {
    if (warmCount >= CITY_CONFIG.WARM_POINTS_MAX) break;
    const { n } = ringInfo(lm);
    if (n < 3) continue;
    const stride = n <= 6 ? 1 : 2;
    for (let i = 0; i < n && warmCount < CITY_CONFIG.WARM_POINTS_MAX; i += stride) {
      const j = (i + 1) % n;
      const mx = (lm.pts[i * 2] + lm.pts[j * 2]) / 2;
      const mz = (lm.pts[i * 2 + 1] + lm.pts[j * 2 + 1]) / 2;
      const hFrac = 0.25 + (fnv1a(`${mx}|${mz}`) % 3) * 0.25;   // 0.25/0.5/0.75 层高
      push(mx, lm.h * hFrac, mz, 1, 1.6, 0);
      warmCount++;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aWarm", new THREE.Float32BufferAttribute(warm, 1));
  g.setAttribute("aSize", new THREE.Float32BufferAttribute(size, 1));
  g.setAttribute("aLayer", new THREE.Float32BufferAttribute(lay, 1));
  return g;
}

function buildLandmarkGeometry(lms: CityLandmark[]): THREE.BufferGeometry {
  const pos: number[] = [], lay: number[] = [];
  for (const lm of lms) {
    const { n } = ringInfo(lm);
    if (n < 3) continue;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const x0 = lm.pts[i * 2], z0 = lm.pts[i * 2 + 1];
      const x1 = lm.pts[j * 2], z1 = lm.pts[j * 2 + 1];
      pos.push(x0, lm.h, z0, x1, lm.h, z1);   // 顶环
      pos.push(x0, 0, z0, x0, lm.h, z0);       // 角柱
      lay.push(0, 0, 0, 0);                    // 地标恒近景档（B2 亮度分级顶档）
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aLayer", new THREE.Float32BufferAttribute(lay, 1));
  return g;
}

function buildRoadsGeometry(roads: { pts: number[]; cls: number }[]): THREE.BufferGeometry {
  const pos: number[] = [], cls: number[] = [], lay: number[] = [];
  for (const rd of roads) {
    const n = rd.pts.length / 2;
    for (let i = 0; i < n - 1; i++) {
      const x0 = rd.pts[i * 2], z0 = rd.pts[i * 2 + 1];
      const x1 = rd.pts[i * 2 + 2], z1 = rd.pts[i * 2 + 3];
      pos.push(x0, Y_ROAD, z0, x1, Y_ROAD, z1);
      cls.push(rd.cls, rd.cls);
      const L = layerOf(Math.hypot((x0 + x1) / 2, (z0 + z1) / 2));
      lay.push(L, L);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aClass", new THREE.Float32BufferAttribute(cls, 1));
  g.setAttribute("aLayer", new THREE.Float32BufferAttribute(lay, 1));
  return g;
}

function buildWaterGeometry(water: number[][]): THREE.BufferGeometry | null {
  const pos: number[] = [];
  for (const line of water ?? []) {
    const n = line.length / 2;
    for (let i = 0; i < n - 1; i++) {
      pos.push(line[i * 2], Y_WATER, line[i * 2 + 1], line[i * 2 + 2], Y_WATER, line[i * 2 + 3]);
    }
  }
  if (!pos.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  return g;
}

function buildPeakGeometry(peaks: [number, number][]): THREE.BufferGeometry | null {
  if (!peaks?.length) return null;
  const geos: THREE.BufferGeometry[] = [];
  for (const [x, z] of peaks) {
    const cone = new THREE.ConeGeometry(1.5, 2.4, 4, 1, true);
    cone.translate(x, 1.2, z);
    geos.push(new THREE.EdgesGeometry(cone));
    cone.dispose();
  }
  const merged = mergeLineGeometries(geos);
  geos.forEach((g) => g.dispose());
  return merged;
}

/** 仅释放 geometry；material 归 E3 所有并由其释放 */
export function disposeBatches(batches: CityBatch[]): void {
  for (const b of batches) b.geometry.dispose();
}

export { COVERAGE };