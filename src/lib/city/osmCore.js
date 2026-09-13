/**
 * URBAN · 服务端/离线管线共享纯函数（裁定 D7：产出 L2 紧凑段格式）
 * import 方：functions/api/geo.ts（回源）+ warmup/rewarm 脚本 + 客户端 meshBuilder（仅 fnv1a）
 * 单一事实源：SERVER_CFG 为全部服务端数值参数唯一定义点，config.ts 转引，禁止双写。
 * 纯 ESM + JSDoc，Node / Wrangler / Vite 三运行时通用，零外部依赖。
 * 自审修复：F1 闭合环先剥后简再闭合（§5.5 归档解法）；F2 eps 单位修正为 u（0.2u=2m）。
 */

export const SERVER_CFG = {
  METERS_PER_UNIT: 10,     // 1 scene unit = 10 m（坐标契约 v4 §0.4）
  H_SCALE: 2.0,            // 高度视觉夸张系数
  MAX_BUILDINGS: 800,      // 服务端裁剪上限（距中心升序保近）
  MIN_AREA_M2: 40,         // 噪声建筑过滤
  MAX_RING_PTS: 9,         // 含闭合点 → 开放轮廓 ≤8 顶点
  ROAD_MAX: 250,
  WATER_MAX: 120,
  PEAK_MAX: 60,
  LANDMARK_MAX: 8,
  OFFLINE_MAX_WAYS: 2500,  // 预热全量查询
  FALLBACK_MAX_WAYS: 800,  // 运行时回源（Workers 10ms CPU 约束）
  DP_EPS_BUILDING: 0.2,    // 单位 u（=2m，§5.5 实测通过值；F2 修复）
  DP_EPS_ROAD: 1.0,        // 单位 u（=10m）
};

const R_LAT = 110540;
const R_LON = 111320;
const DEG = Math.PI / 180;
const r1 = (v) => Math.round(v * 10) / 10;
const flat = (pts) => pts.flatMap((p) => [p.x, p.z]);

export function latlonToENU(lat, lon, origin) {
  return {
    x: ((lon - origin.lon) * R_LON * Math.cos(origin.lat * DEG)) / SERVER_CFG.METERS_PER_UNIT,
    z: ((lat - origin.lat) * R_LAT) / SERVER_CFG.METERS_PER_UNIT,
  };
}

export function fnv1a(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** 迭代式 Douglas-Peucker（无递归，Workers CPU 友好）。仅接受开放点列（F1 纪律）。 */
export function dp(pts, eps) {
  if (pts.length <= 2) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = 1; keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    if (b - a < 2) continue;
    const ax = pts[a].x, az = pts[a].z;
    const dx = pts[b].x - ax, dz = pts[b].z - az;
    const len = Math.hypot(dx, dz);
    if (len < 1e-6) continue;   // 零基线段直接跳过（防除零爆炸，F1 二级防护）
    let maxD = -1, idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dz * (pts[i].x - ax) - dx * (pts[i].z - az)) / len;
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > eps && idx > 0) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

export function simplifyTo(pts, maxPts, eps0) {
  let eps = eps0;
  let out = dp(pts, eps);
  for (let i = 0; i < 6 && out.length > maxPts; i++) { eps *= 1.7; out = dp(pts, eps); }
  return out;
}

const isClosed = (pts) => {
  const n = pts.length;
  return n > 1 && pts[0].x === pts[n - 1].x && pts[0].z === pts[n - 1].z;
};

function shoelaceClosed(ring) {
  let s = 0;
  for (let i = 0; i < ring.length - 1; i++) s += ring[i].x * ring[i + 1].z - ring[i + 1].x * ring[i].z;
  return Math.abs(s / 2);
}

/** 无层数标签：质心+面积 hash → 3~15 层伪随机（同位置恒定，重试不闪变） */
function estimateHeightUnits(levels, areaM2, c) {
  const lv = levels > 0
    ? Math.min(levels, 40)
    : 3 + (fnv1a(`${c.x.toFixed(0)},${c.z.toFixed(0)},${Math.round(areaM2 / 50)}`) % 13);
  return (lv * 3) / SERVER_CFG.METERS_PER_UNIT;
}

/** B1 地标白名单：[tagKey, tagValue("*"=任意), 权重] */
const LANDMARK_WHITELIST = [
  ["tourism", "attraction", 10], ["tourism", "museum", 8],
  ["historic", "*", 9],
  ["amenity", "place_of_worship", 9],
  ["building", "cathedral", 10], ["building", "mosque", 10],
  ["building", "temple", 10], ["building", "church", 8],
  ["railway", "station", 8], ["aeroway", "terminal", 8],
  ["man_made", "tower", 8], ["man_made", "lighthouse", 7],
  ["leisure", "stadium", 7], ["office", "government", 6],
];

function landmarkHit(tags) {
  for (const [k, v, w] of LANDMARK_WHITELIST) {
    if (tags[k] && (v === "*" || tags[k] === v)) return { w, kind: `${k}:${tags[k]}` };
  }
  return null;
}

const ROAD_CLS = { motorway: 0, trunk: 0, primary: 1, secondary: 2 };

/**
 * Overpass 查询构造。
 * roadsFull=true（预热）：含 secondary；false（运行时回源）：仅 motorway|trunk|primary，压 CPU。
 */
export function buildQuery(lat, lon, opts = {}) {
  const maxWays = opts.maxWays ?? SERVER_CFG.OFFLINE_MAX_WAYS;
  const roadRe = opts.roadsFull === false
    ? "^(motorway|trunk|primary)$"
    : "^(motorway|trunk|primary|secondary)$";
  return `[out:json][timeout:25];
(
  way["building"](around:2000,${lat},${lon});
  way["highway"~"${roadRe}"](around:2500,${lat},${lon});
  way["waterway"~"^(river|stream)$"](around:2500,${lat},${lon});
  way["natural"="water"](around:2500,${lat},${lon});
  node["natural"="peak"](around:3000,${lat},${lon});
);
out geom qt ${maxWays};`;
}

const LATIN_RE = /^[\x20-\x7e]+$/;

/**
 * OSM JSON → /api/geo v2 payload（L2 紧凑段格式，裁定 D7）。
 * 坐标：scene units，+X 东 / +Z 北，预圆整 0.1u。
 */
export function simplifyOsm(osm, origin) {
  const C = SERVER_CFG;
  const buildings = [];
  const roads = [];
  const water = [];
  const peaks = [];
  const lmCand = [];

  for (const el of osm?.elements ?? []) {
    if (el.type === "way" && Array.isArray(el.geometry) && el.geometry.length >= 2) {
      const tags = el.tags || {};
      const raw = el.geometry.map((g) => {
        const p = latlonToENU(g.lat, g.lon, origin);
        return { x: r1(p.x), z: r1(p.z) };
      });

      if (tags.highway && ROAD_CLS[tags.highway] !== undefined) {
        // 路网：开放折线直接简化
        const simp = simplifyTo(raw, 80, C.DP_EPS_ROAD);
        if (simp.length >= 2) roads.push({ pts: flat(simp), cls: ROAD_CLS[tags.highway] });
      } else if (tags.building) {
        // F1 修复：闭合环 → 剥闭合点 → 开放点列简化 → 重闭合
        const open = isClosed(raw) ? raw.slice(0, -1) : raw;
        if (open.length < 3) continue;
        // 面积用原始闭合环计算（简化前，精度最高）
        const ringForArea = isClosed(raw) ? raw : [...raw, raw[0]];
        const areaM2 = shoelaceClosed(ringForArea) * C.METERS_PER_UNIT * C.METERS_PER_UNIT;
        if (areaM2 < C.MIN_AREA_M2) continue;
        const simp = simplifyTo(open, C.MAX_RING_PTS - 1, C.DP_EPS_BUILDING);
        if (simp.length < 3) continue;
        const closed = [...simp, simp[0]];   // 末点=首点（契约 §1.3）
        const n = simp.length;
        let cx = 0, cz = 0;
        for (let i = 0; i < n; i++) { cx += simp[i].x; cz += simp[i].z; }
        cx /= n; cz /= n;
        const lv = parseFloat(tags["building:levels"] ?? "");
        const h = r1(
          estimateHeightUnits(Number.isFinite(lv) ? lv : 0, areaM2, { x: cx, z: cz }) * C.H_SCALE,
        );
        const entry = {
          pts: flat(closed), h,
          lv: Number.isFinite(lv) && lv > 0 ? lv : undefined,
          area: Math.round(areaM2),
          _r: Math.hypot(cx, cz),
        };
        buildings.push(entry);
        const hit = landmarkHit(tags);
        if (hit) lmCand.push({ entry, w: hit.w, kind: hit.kind, tags });
      } else if (tags.waterway || tags.natural === "water") {
        const simp = simplifyTo(raw, 60, C.DP_EPS_ROAD);
        if (simp.length >= 2) water.push(flat(simp));
      }
    } else if (el.type === "node" && el.tags?.natural === "peak") {
      const p = latlonToENU(el.lat, el.lon, origin);
      peaks.push([r1(p.x), r1(p.z)]);
    }
  }

  buildings.sort((a, b) => a._r - b._r);   // 距中心升序（drawRange 契约）

  // 地标：白名单打分 Top8；不足 2 个时面积 Top 兜底（B1 无名地标）
  const scored = lmCand
    .map((c) => ({ ...c, score: c.w * (Math.sqrt(c.entry.area || 50) / 10) * c.entry.h }))
    .sort((a, b) => b.score - a.score)
    .slice(0, C.LANDMARK_MAX);
  if (scored.length < 2) {
    const byArea = [...buildings].sort((a, b) => (b.area || 0) - (a.area || 0));
    for (const entry of byArea) {
      if (scored.length >= 2) break;
      if (!scored.some((s) => s.entry === entry)) {
        scored.push({ entry, w: 3, kind: "unnamed_top_area", tags: {}, score: 1 });
      }
    }
  }
  const landmarks = scored.map(({ entry, kind, tags, score }) => {
    const rawName = tags.name;
    const nameEn = tags["name:en"] || (rawName && LATIN_RE.test(rawName) ? rawName : undefined);
    const name = rawName && rawName !== nameEn ? rawName : undefined;
    const out = { pts: entry.pts, h: entry.h, kind, score: Math.round(score * 100) / 100 };
    if (nameEn) out.nameEn = nameEn;
    if (name) out.name = name;
    return out;
  });

  const clipped = buildings.slice(0, C.MAX_BUILDINGS).map((b) => {
    const { _r, ...rest } = b;
    return rest;
  });

  return {
    v: 2,
    center: [+origin.lat.toFixed(4), +origin.lon.toFixed(4)],
    ts: Math.floor(Date.now() / 1000),
    raw_count: buildings.length,
    buildings: clipped,
    roads: roads.slice(0, C.ROAD_MAX),
    landmarks,
    water: water.slice(0, C.WATER_MAX),
    peaks: peaks.slice(0, C.PEAK_MAX),
  };
}