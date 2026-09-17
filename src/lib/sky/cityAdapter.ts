/**
 * cityAdapter.ts —— 集成层城市管线适配器（主审按集成启动书"实际输出修正"纪律补写）
 * 背景：E2 交付 meshBuilder 产出 CityBatch（现成 BufferGeometry，position+aLayer/aWarm/aSize，
 *       layer 语义 0/1/2 档，来自 config.LAYER_NEAR/LAYER_MID）；
 *       E3 交付 sceneCore 消费 CityPayload（GlowSeg 紧凑段 + PointPart，layer 为 0.85/0.5/0.28 浮点）。
 *       两套契约在专家侧未闭环，本文件在集成层做纯格式适配，不改变任何视觉参数。
 * 适配规则：
 *   - buildings/roads/water/landmarks/peaks → GlowSeg（L2 紧凑段；per-seg layer 按 aLayer 档映射 CITY_LAYER）
 *   - nodes → PointPart（按 aWarm 分桶：warm0 size=1.0 顶环节点 / warm1 size=1.6 地标窗点）
 *   - 占位城（PLACEHOLDER+/fallback）→ E2 placeholder Group 原样挂 scene（不经 GlowLine，材质已 token 化）
 */
import * as THREE from 'three';
import { fetchCityGeo, isFallback, type CityGeo } from '../city/geoApi';
import { cityGeoToBatches, disposeBatches, type CityBatch } from '../city/meshBuilder';
import { classifyMode, type CityMode } from '../city/config';
import { buildPlaceholderCity } from '../city/placeholder';
import { CITY_LAYER } from './renderTokens';
import type { CityPayload } from './sceneCore';
import type { GlowSeg } from './materials/glowLine';
import type { PointPart } from './materials/glowPoint';

/** aLayer 档（0/1/2）→ GlowLine layer 浮点（CITY_LAYER 0.85/0.5/0.28） */
const LAYER_MAP = [CITY_LAYER.near, CITY_LAYER.mid, CITY_LAYER.far] as const;

/** 从 LineSegments 几何（position + 可选 aLayer 档）提取 GlowSeg 列表（按档分组，每档一段） */
function lineBatchesToSegs(batches: CityBatch[]): GlowSeg[] {
  const groups: number[][] = [[], [], [], []];
  for (const b of batches) {
    const g = b.geometry;
    const pos = g.getAttribute('position') as THREE.BufferAttribute;
    if (!pos) return [];
    const lay = g.getAttribute('aLayer') as THREE.BufferAttribute | undefined;
    const pArr = pos.array as Float32Array;
    const n = pos.count;
    for (let i = 0; i + 1 < n; i += 2) {
      const L = lay ? LAYER_MAP[Math.min(2, Math.max(0, Math.round(lay.array[i] as number)))] : 1.0;
      const gi = L === CITY_LAYER.near ? 0 : L === CITY_LAYER.mid ? 1 : 2;
      const out = groups[gi];
      out.push(
        pArr[i * 3],
        pArr[i * 3 + 1],
        pArr[i * 3 + 2],
        pArr[i * 3 + 3],
        pArr[i * 3 + 4],
        pArr[i * 3 + 5],
      );
    }
  }
  const segs: GlowSeg[] = [];
  const LAYERS = [CITY_LAYER.near, CITY_LAYER.mid, CITY_LAYER.far];
  for (let gi = 0; gi < 3; gi++) {
    if (groups[gi].length) segs.push({ pts: new Float32Array(groups[gi]), layer: LAYERS[gi] });
  }
  if (groups[3].length) segs.push({ pts: new Float32Array(groups[3]), layer: 1.0 }); // 无档（peaks）
  return segs;
}

/** nodes 几何 → PointPart 分桶（warm0 顶环 / warm1 地标窗点） */
function nodesToParts(batch: CityBatch): PointPart[] {
  const g = batch.geometry;
  const pos = g.getAttribute('position') as THREE.BufferAttribute;
  const warm = g.getAttribute('aWarm') as THREE.BufferAttribute | undefined;
  const size = g.getAttribute('aSize') as THREE.BufferAttribute | undefined;
  if (!pos) return [];
  const pArr = pos.array as Float32Array;
  const wArr = warm?.array as Float32Array | undefined;
  const sArr = size?.array as Float32Array | undefined;
  const p0: number[] = [],
    p1: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const w = wArr ? wArr[i] : 0;
    const dest = w > 0.5 ? p1 : p0;
    dest.push(pArr[i * 3], pArr[i * 3 + 1], pArr[i * 3 + 2]);
  }
  const parts: PointPart[] = [];
  if (p0.length)
    parts.push({
      positions: new Float32Array(p0),
      size: sArr ? (sArr[0] as number) : 1.0,
      warm: 0,
    });
  if (p1.length)
    parts.push({
      positions: new Float32Array(p1),
      size: sArr ? (sArr[0] as number) : 1.6,
      warm: 1,
    });
  return parts;
}

/** CityBatch 列表 → CityPayload（纯格式适配） */
export function batchesToPayload(batches: CityBatch[]): CityPayload {
  const lines: GlowSeg[] = [];
  const water: GlowSeg[] = [];
  const roads: GlowSeg[] = [];
  const landmarks: GlowSeg[] = [];
  let points: PointPart[] = [];
  for (const b of batches) {
    switch (b.kind) {
      case 'buildings':
        lines.push(...lineBatchesToSegs([b]));
        break;
      case 'roads':
        roads.push(...lineBatchesToSegs([b]));
        break;
      case 'water':
        water.push(...lineBatchesToSegs([b]));
        break;
      case 'landmarks':
        landmarks.push(...lineBatchesToSegs([b]));
        break;
      case 'peaks':
        lines.push(...lineBatchesToSegs([b]));
        break; // 无独立槽，并入 lines（layer 1.0）
      case 'nodes':
        points = nodesToParts(b);
        break;
    }
  }
  return { lines, points, water, roads, landmarks };
}

export interface CityLoadResult {
  payload: CityPayload | null; // 真实数据（FULL/HYBRID/PLACEHOLDER+ 的真实部分）
  placeholder: THREE.Group | null; // 占位城 Group（PLACEHOLDER+ 或 fallback）
  mode: CityMode | null;
}

/** 一次城市数据获取 + 转换（/api/geo 失败 → 仅占位城） */
export async function loadCityToPayload(
  lat: number,
  lon: number,
  mobile: boolean,
): Promise<CityLoadResult> {
  try {
    const res = await fetchCityGeo(lat, lon);
    if (isFallback(res)) {
      return {
        payload: null,
        placeholder: buildPlaceholderCity(`${lat.toFixed(2)},${lon.toFixed(2)}`, mobile),
        mode: null,
      };
    }
    const geo = res as CityGeo;
    const mode = classifyMode(geo.raw_count);
    const { batches } = cityGeoToBatches(geo, mobile);
    const payload = batchesToPayload(batches);
    disposeBatches(batches);
    const placeholder =
      mode === 'PLACEHOLDER+'
        ? buildPlaceholderCity(`${lat.toFixed(2)},${lon.toFixed(2)}`, mobile)
        : null;
    return { payload, placeholder, mode };
  } catch (e) {
    console.warn('OSM load failed', e);
    return {
      payload: null,
      placeholder: buildPlaceholderCity(`${lat.toFixed(2)},${lon.toFixed(2)}`, mobile),
      mode: null,
    };
  }
}
