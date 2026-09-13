/**
 * build-terrain-tiles.mjs —— P1b 地形构建管线（山体等高线 + 植被）
 * 链路：Open-Elevation DEM 网格 → 双线性插值 120×120 → Marching Squares 等高线 → DP 简化 → public/geo/taipei101-dem.json
 * 植被：程序化派生（DEM 海拔>60m 区域撒粒子簇），零外部依赖
 *
 * 输出：
 *   public/geo/taipei101-dem.json
 *     contours:   [{ level, segments: [x1,z1,x2,z2, ...] }]  （米制，原点=台北101）
 *     vegetation: [[x, z, h], ...]                            （米制，h=DEM 高程）
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DEM = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'raw', 'taipei101-dem.json'), 'utf8'));
const OUT = path.join(ROOT, 'public', 'geo', 'taipei101-dem.json');

const { lats, lons, grid, n } = DEM;
const C_LAT = 25.0330, C_LON = 121.5654;
const M_PER_DEG_LAT = 110574;
const M_PER_DEG_LON = 111320 * Math.cos((C_LAT * Math.PI) / 180);

/* ---- 双线性插值到 S×S 细网格 ---- */
const S = 120;
function sample(lat, lon) {
  // 网格行列（DEM lats 北→南，lons 西→东）
  const fi = ((lats[0] - lat) / (lats[0] - lats[n - 1])) * (n - 1);
  const fj = ((lon - lons[0]) / (lons[n - 1] - lons[0])) * (n - 1);
  const i0 = Math.max(0, Math.min(n - 2, Math.floor(fi)));
  const j0 = Math.max(0, Math.min(n - 2, Math.floor(fj)));
  const di = fi - i0, dj = fj - j0;
  const i1 = Math.min(n - 1, i0 + 1);
  const v00 = grid[i0][j0], v01 = grid[i0][j0 + 1], v10 = grid[i1][j0], v11 = grid[i1][j0 + 1];
  return v00 * (1 - di) * (1 - dj) + v01 * (1 - di) * dj + v10 * di * (1 - dj) + v11 * di * dj;
}
// 直接构造细网格（避免重复插值）
const fine = [];
for (let i = 0; i <= S; i++) {
  const lat = lats[0] - (lats[0] - lats[n - 1]) * (i / S);
  const row = [];
  for (let j = 0; j <= S; j++) {
    const lon = lons[0] + (lons[n - 1] - lons[0]) * (j / S);
    row.push(sample(lat, lon));
  }
  fine.push(row);
}
// 细网格角点米制坐标
const fx = (j) => (lons[0] + (lons[n - 1] - lons[0]) * (j / S) - C_LON) * M_PER_DEG_LON;
const fz = (i) => (lats[0] - (lats[0] - lats[n - 1]) * (i / S) - C_LAT) * M_PER_DEG_LAT;

/* ---- Marching Squares：逐边交点法 ---- */
// 格单元 (i,j)：角 NW=fine[i][j], NE=fine[i][j+1], SE=fine[i+1][j+1], SW=fine[i+1][j]
// 边：顶 NW-NE, 右 NE-SE, 底 SE-SW, 左 SW-NW；交点按边序（顶,右,底,左）两两成段
function marchingSquare(th) {
  const segs = [];
  for (let i = 0; i < S; i++) {
    for (let j = 0; j < S; j++) {
      const nw = fine[i][j], ne = fine[i][j + 1], se = fine[i + 1][j + 1], sw = fine[i + 1][j];
      const pts = [];
      const edge = (a, b, ax, az, bx, bz) => {
        if ((a >= th) === (b >= th)) return;
        const t = (th - a) / (b - a);
        pts.push([ax + (bx - ax) * t, az + (bz - az) * t]);
      };
      // 顶边 (NW→NE)：x 递增
      edge(nw, ne, fx(j), fz(i), fx(j + 1), fz(i));
      // 右边 (NE→SE)：z 递增（南）
      edge(ne, se, fx(j + 1), fz(i), fx(j + 1), fz(i + 1));
      // 底边 (SE→SW)：x 递减
      edge(se, sw, fx(j + 1), fz(i + 1), fx(j), fz(i + 1));
      // 左边 (SW→NW)：z 递减
      edge(sw, nw, fx(j), fz(i + 1), fx(j), fz(i));
      if (pts.length === 2) segs.push(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
      else if (pts.length === 4) {
        segs.push(pts[0][0], pts[0][1], pts[1][0], pts[1][1]);
        segs.push(pts[2][0], pts[2][1], pts[3][0], pts[3][1]);
      }
    }
  }
  return segs;
}

/* ---- DP 简化（线段流，容差米） ---- */
function simplifyStream(stream, eps) {
  // stream: [x1,z1,x2,z2, x1,z1,x2,z2, ...]，按折线连接：段 i 尾 = 段 i+1 头（MS 输出相邻段共享端点）
  // 做法：拼接连续折线后按 DP 简化
  const pts = [];
  for (let k = 0; k < stream.length; k += 4) {
    const x1 = stream[k], z1 = stream[k + 1], x2 = stream[k + 2], z2 = stream[k + 3];
    if (pts.length === 0) pts.push([x1, z1]);
    else {
      const last = pts[pts.length - 1];
      if (Math.hypot(last[0] - x1, last[1] - z1) > 1) pts.push([x1, z1]); // 断开处补起点
    }
    pts.push([x2, z2]);
  }
  // 按长度过滤：过短线丢弃（噪声）
  const kept = [];
  for (let k = 0; k + 1 < pts.length; k++) {
    if (Math.hypot(pts[k + 1][0] - pts[k][0], pts[k + 1][1] - pts[k][1]) > 8) kept.push(pts[k]);
  }
  if (pts.length > 1) kept.push(pts[pts.length - 1]);
  return dp(kept, eps);
}
function perpDist(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / Math.hypot(dx, dy);
}
function dp(pts, eps) {
  if (pts.length < 3) return pts;
  let maxD = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > eps) {
    const l = dp(pts.slice(0, idx + 1), eps);
    const r = dp(pts.slice(idx), eps);
    return l.slice(0, -1).concat(r);
  }
  return [pts[0], pts[pts.length - 1]];
}

/* ---- 等高线（25m 起，30m 间隔，至 325m） ---- */
const contours = [];
let totalSegs = 0;
for (let lev = 25; lev <= 330; lev += 30) {
  const raw = marchingSquare(lev);
  const simplified = simplifyStream(raw, 18);
  // 转成段流 [x1,z1,x2,z2,...]
  const segs = [];
  for (let k = 0; k + 1 < simplified.length; k++) {
    segs.push(simplified[k][0], simplified[k][1], simplified[k + 1][0], simplified[k + 1][1]);
  }
  if (segs.length >= 8) {
    contours.push({ level: lev, segments: segs });
    totalSegs += segs.length / 4;
  }
}

/* ---- 植被（DEM 海拔 > 60m，每格 1 点 + 随机抖动；最后一行 i+1 越界保护） ---- */
const vegetation = [];
const VEG_MIN = 60;
for (let i = 0; i < n - 1; i++) {
  for (let j = 0; j < n; j++) {
    const h = grid[i][j];
    if (h < VEG_MIN) continue;
    // 每格 1-2 点（伪随机基于行列）
    const cnt = ((i * 7 + j * 13) % 2) + 1;
    for (let k = 0; k < cnt; k++) {
      const r1 = ((i * 31 + j * 17 + k * 5) % 100) / 100;
      const r2 = ((i * 43 + j * 29 + k * 11 + 7) % 100) / 100;
      const lat = lats[i] + (lats[i + 1] - lats[i]) * r1;
      const lon = lons[j] + (lons[j + 1] - lons[j]) * r2;
      const x = (lon - C_LON) * M_PER_DEG_LON;
      const z = (lat - C_LAT) * M_PER_DEG_LAT;
      vegetation.push([Math.round(x), Math.round(z), Math.round(h)]);
    }
  }
}

const out = { id: 'taipei101', level: 'DEM', unit: 'meter', contours, vegetation };
fs.writeFileSync(OUT, JSON.stringify(out));
console.log('terrain written:', OUT);
console.log('  contours:', contours.length, 'levels,', totalSegs, 'segments');
console.log('  vegetation:', vegetation.length, 'points');
console.log('  size:', (Buffer.byteLength(JSON.stringify(out)) / 1024).toFixed(1) + 'KB');
