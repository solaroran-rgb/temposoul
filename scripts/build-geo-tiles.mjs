/**
 * build-geo-tiles.mjs —— P1 Geo Tile 构建管线
 * 链路：真实 Geo Data(OSM/Overpass) → 解析/简化 → 米制线稿坐标（以台北101为中心）→ LOD 三级 JSON → public/geo/
 * 运行时只 fetch 静态 tile，零边缘计算（Cloudflare Free 10ms CPU 约束）。
 *
 * 输出：
 *   public/geo/taipei101-meta.json   —— 元信息（中心/边界/计数/来源）
 *   public/geo/taipei101-L0.json     —— 近景（<1200m）：精细建筑（含101完整轮廓+棱线+暖橙）、主要道路
 *   public/geo/taipei101-L1.json     —— 中景（1200–2200m）：简化建筑、次要道路
 *   public/geo/taipei101-L2.json     —— 远景（>2200m 或自然类）：水系、象山步道线、远郊建筑带
 *
 * 坐标规格：米制平面（x=东米，z=北米，y=高度米），原点=台北101 (25.0330°N, 121.5654°E)。
 * 渲染层乘以 METER_TO_U 即得场景 units（+X 东 / +Y 天顶 / +Z 北，与 SkyScene 一致）。
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const RAW = path.join(ROOT, 'data', 'raw', 'taipei101-osm.json');
const OUT_DIR = path.join(ROOT, 'public', 'geo');
fs.mkdirSync(OUT_DIR, { recursive: true });

const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));
const elems = raw.elements;

/* ---- 节点坐标表 ---- */
const nodes = new Map();
for (const e of elems) if (e.type === 'node') nodes.set(e.id, [e.lat, e.lon]);

/* ---- 米制投影（原点=台北101） ---- */
const C_LAT = 25.0330, C_LON = 121.5654;
const M_PER_DEG_LAT = 110574;
const M_PER_DEG_LON = 111320 * Math.cos((C_LAT * Math.PI) / 180);
function toM(lat, lon) {
  return { x: (lon - C_LON) * M_PER_DEG_LON, z: (lat - C_LAT) * M_PER_DEG_LAT };
}
function toMArray(pts) {
  return pts.map(([la, lo]) => { const m = toM(la, lo); return [m.x, m.z]; });
}

/* ---- 道格拉斯-普克简化（容差米） ---- */
function perpDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / Math.hypot(dx, dy);
}
function dpSimplify(pts, eps) {
  if (pts.length < 3) return pts;
  let maxD = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > eps) {
    const l = dpSimplify(pts.slice(0, idx + 1), eps);
    const r = dpSimplify(pts.slice(idx), eps);
    return l.slice(0, -1).concat(r);
  }
  return [pts[0], pts[pts.length - 1]];
}

/* ---- 多边形面积（鞋带公式，米²） ---- */
function polyAreaM2(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, z1] = pts[i], [x2, z2] = pts[(i + 1) % pts.length];
    a += x1 * z2 - x2 * z1;
  }
  return Math.abs(a) / 2;
}

/* ---- 要素解算 ---- */
function ringM(w) {
  const pts = [];
  for (const nid of w.nodes) { const n = nodes.get(nid); if (n) pts.push(n); }
  if (pts.length < 3) return null;
  return toMArray(pts);
}
function lineM(w) {
  const pts = [];
  for (const nid of w.nodes) { const n = nodes.get(nid); if (n) pts.push(n); }
  if (pts.length < 2) return null;
  return toMArray(pts);
}
function centerOf(pts) {
  let sx = 0, sz = 0;
  for (const [x, z] of pts) { sx += x; sz += z; }
  return { x: sx / pts.length, z: sz / pts.length };
}
function distOf(pts) {
  const c = centerOf(pts);
  return Math.hypot(c.x, c.z);
}

const TOURISM_101 = 1159328965;

/* ---- 建筑（面积/顶点预算控制，LOD 分层） ---- */
function capRing(ring, maxPts) {
  if (ring.length <= maxPts) return ring;
  const step = Math.ceil(ring.length / maxPts);
  const out = [];
  for (let i = 0; i < ring.length; i += step) out.push(ring[i]);
  if (out.length < 3) return ring.slice(0, 3);
  return out;
}
const buildings = [];
for (const w of elems) {
  if (w.type !== 'way' || !w.tags || !w.tags.building) continue;
  const ring = ringM(w);
  if (!ring) continue;
  if (polyAreaM2(ring) < 40) continue; // 过滤过小（<40㎡）
  const is101 = w.id === TOURISM_101;
  const eps = is101 ? 2 : 5;
  const simple = dpSimplify(ring, eps);
  if (simple.length < 3) continue;
  const hRaw = parseFloat(w.tags.height || '');
  const levels = parseInt(w.tags['building:levels'] || '0', 10);
  const heightM = is101 ? 508 : (hRaw || (levels ? levels * 3.2 : 12));
  buildings.push({
    id: 'w' + w.id, name: w.tags.name || '', kind: is101 ? 'tower' : 'building',
    ring: simple, heightM, warm: is101, dist: distOf(simple), area: polyAreaM2(simple),
  });
}

/* ---- 道路（过滤人行小径/服务道，保主干与次干） ---- */
const ROAD_OK = new Set(['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 'living_street', 'service', 'primary_link', 'secondary_link', 'tertiary_link']);
const roads = [];
for (const w of elems) {
  if (w.type !== 'way' || !w.tags || !w.tags.highway) continue;
  if (!ROAD_OK.has(w.tags.highway)) continue;
  if (w.tags.highway === 'service' && !w.tags.name) continue; // 无名服务道噪音大
  const line = lineM(w);
  if (!line) continue;
  const simple = dpSimplify(line, 6);
  if (simple.length < 2) continue;
  roads.push({ id: 'w' + w.id, name: w.tags.name || '', polyline: simple, dist: distOf(simple), cls: w.tags.highway });
}

/* ---- 水系（waterway + natural=water） ---- */
const water = [];
for (const w of elems) {
  if (w.type !== 'way' || !w.tags) continue;
  const isW = w.tags.waterway || w.tags.natural === 'water';
  if (!isW) continue;
  const line = lineM(w);
  if (!line) continue;
  const simple = dpSimplify(line, 10);
  if (simple.length < 2) continue;
  water.push({ id: 'w' + w.id, name: w.tags.name || '', polyline: simple, dist: distOf(simple) });
}

/* ---- 山径（象山步道，L2 远景线稿） ---- */
const trails = [];
for (const w of elems) {
  if (w.type !== 'way' || !w.tags || !w.tags.name) continue;
  if (!/象山|拇指山|虎山/.test(w.tags.name)) continue;
  if (!(w.tags.highway === 'footway' || w.tags.highway === 'path' || w.tags.highway === 'steps')) continue;
  const line = lineM(w);
  if (!line) continue;
  const simple = dpSimplify(line, 8);
  if (simple.length < 2) continue;
  trails.push({ id: 'w' + w.id, name: w.tags.name, polyline: simple, dist: distOf(simple) });
}

console.log(`parsed: buildings=${buildings.length} roads=${roads.length} water=${water.length} trails=${trails.length}`);

/* ---- LOD 三级分配（数量预算：L0≤700 栋按面积、L1≤450 栋、L2 边缘带） ---- */
const L0 = 1200, L1 = 2200;
function toTileJson(kind, items) {
  return items.map((it) => {
    const o = { id: it.id, name: it.name || undefined, kind };
    if (it.ring) o.ring = it.ring;
    if (it.polyline) o.polyline = it.polyline;
    if (it.heightM) o.heightM = it.heightM;
    if (it.warm) o.warm = true;
    return o;
  });
}

const inL0 = buildings.filter((b) => b.dist <= L0);
const inL1 = buildings.filter((b) => b.dist > L0 && b.dist <= L1);
const inL2 = buildings.filter((b) => b.dist > L1);

// 101 恒在 L0（精细）；其余按面积降序取预算（P1 视觉：密度克制，线稿可读）
const budget = (arr, n, ringPts) => {
  const sorted = [...arr].sort((a, b) => (b.warm ? 1 : 0) - (a.warm ? 1 : 0) || b.area - a.area);
  return sorted.slice(0, n).map((b) => ({ ...b, ring: capRing(b.ring, ringPts) }));
};
const l0Build = budget(inL0, 350, 14);
const l1Build = budget(inL1, 260, 10).map((b) => ({ ...b, ring: dpSimplify(b.ring, 10) }));
const l2Build = budget(inL2, 140, 8).map((b) => ({ ...b, ring: dpSimplify(b.ring, 16) }));

const CLS_RANK = { motorway: 0, trunk: 1, primary: 2, secondary: 3, tertiary: 4, primary_link: 5, secondary_link: 5, tertiary_link: 5, residential: 6, living_street: 7, unclassified: 6, service: 8 };
const roadBudget = (arr, n) => {
  const sorted = [...arr].sort((a, b) => (CLS_RANK[a.cls] ?? 9) - (CLS_RANK[b.cls] ?? 9) || a.dist - b.dist);
  return sorted.slice(0, n);
};

const L0_TILE = {
  id: 'taipei101', level: 'L0', unit: 'meter', center: { lat: C_LAT, lon: C_LON },
  landmarks: toTileJson('building', l0Build),
  roads: toTileJson('road', roadBudget(roads.filter((r) => r.dist <= L0), 380)),
  water: [], trails: [],
};
const L1_TILE = {
  id: 'taipei101', level: 'L1', unit: 'meter', center: { lat: C_LAT, lon: C_LON },
  landmarks: toTileJson('building', l1Build.map((b) => ({ ...b, ring: dpSimplify(b.ring, 10) }))),
  roads: toTileJson('road', roadBudget(roads.filter((r) => r.dist > L0 && r.dist <= L1), 160)),
  water: [], trails: [],
};
const L2_TILE = {
  id: 'taipei101', level: 'L2', unit: 'meter', center: { lat: C_LAT, lon: C_LON },
  landmarks: toTileJson('building', l2Build.map((b) => ({ ...b, ring: dpSimplify(b.ring, 16) }))),
  roads: [], water: toTileJson('water', water), trails: toTileJson('trail', trails),
};

/* ---- 写盘 ---- */
function sizeKB(o) { return (Buffer.byteLength(JSON.stringify(o)) / 1024).toFixed(1) + 'KB'; }
fs.writeFileSync(path.join(OUT_DIR, 'taipei101-L0.json'), JSON.stringify(L0_TILE));
fs.writeFileSync(path.join(OUT_DIR, 'taipei101-L1.json'), JSON.stringify(L1_TILE));
fs.writeFileSync(path.join(OUT_DIR, 'taipei101-L2.json'), JSON.stringify(L2_TILE));

const meta = {
  id: 'taipei101', name: '台北101', version: '0.1-p1',
  center: { lat: C_LAT, lon: C_LON }, unit: 'meter',
  lod: { L0: 'near<1200m', L1: 'mid 1200-2200m', L2: 'far>2200m+natural' },
  source: 'OpenStreetMap (Overpass API, 2026-09-14)', bbox: [25.0220, 121.5540, 25.0440, 121.5770],
  counts: {
    L0: { landmarks: L0_TILE.landmarks.length, roads: L0_TILE.roads.length },
    L1: { landmarks: L1_TILE.landmarks.length, roads: L1_TILE.roads.length },
    L2: { landmarks: L2_TILE.landmarks.length, water: L2_TILE.water.length, trails: L2_TILE.trails.length },
  },
  sizes: { L0: sizeKB(L0_TILE), L1: sizeKB(L1_TILE), L2: sizeKB(L2_TILE) },
};
fs.writeFileSync(path.join(OUT_DIR, 'taipei101-meta.json'), JSON.stringify(meta, null, 2));
console.log('tiles written:');
console.log('  L0', sizeKB(L0_TILE), `${L0_TILE.landmarks.length} buildings, ${L0_TILE.roads.length} roads`);
console.log('  L1', sizeKB(L1_TILE), `${L1_TILE.landmarks.length} buildings, ${L1_TILE.roads.length} roads`);
console.log('  L2', sizeKB(L2_TILE), `${L2_TILE.landmarks.length} buildings, ${L2_TILE.water.length} water, ${L2_TILE.trails.length} trails`);
console.log('meta:', JSON.stringify(meta.sizes));
