/**
 * astro-view.ts —— 共享投影纯函数（B3「一致性锚定在共用投影纯函数包」的落地）
 *
 * 任何渲染端（L1 node-canvas / L2 three.js / 复现校验）都必须调用 projectSky()，
 * 输入同样 SkyParams → 输出逐星屏幕坐标逐字节一致。
 *
 * 坐标系约定（与 src/lib/sky/astro.ts 一致）：+X 东、+Y 天顶、+Z 北。
 * 投影模型：针孔透视。相机朝向 (alt=aimAlt, az=dirDeg)，fov 垂直。
 *   s(alt,az) 单位向量 → 相机系 (right, up, fwd) → 屏幕 (px,py)。
 * 确定性：零随机数；闪烁相位的随机种子在上游以参数哈希注入，不在本层。
 */
import {
  toJulianDay,
  localSiderealTime,
  precessionMatrix,
  applyPrecession,
  radecToAltAz,
  normalizeRad,
  DEG,
} from '../sky/astro';
import { copyStarData, constellationSegmentsRad } from './catalog';

export interface SkyParams {
  /** Unix 毫秒（UTC） */
  unixMs: number;
  /** 观测点纬度（度，北正南负） */
  latDeg: number;
  /** 观测点经度（度，东经为正） */
  lngDeg: number;
  /** 视向中心方位角（度，0=北 90=东 180=南 270=西），规范化取整 */
  dirDeg: number;
  /** 星等阈值（暗于此丢弃） */
  magLimit: number;
  /** 画布宽（px） */
  width: number;
  /** 画布高（px） */
  height: number;
  /** 垂直视场角（度） */
  fovDeg?: number;
  /** 相机仰角（度，朝地平线略向上看） */
  aimAltDeg?: number;
}

export interface ProjectedStar {
  /** 屏幕 x（px） */
  x: number;
  /** 屏幕 y（px） */
  y: number;
  mag: number;
  ci: number;
  /** 地平高度（弧度） */
  alt: number;
  /** 方位角（弧度，北顺时针） */
  az: number;
  /** 相对视向的通量亮度 10^(-0.4*(mag-m0)) */
  flux: number;
  /** 相机前向深度（z，>0 可见） */
  depth: number;
}

export interface ProjectedSeg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** 两端都在视锥内才画整段；否则需裁剪（P0 简化：任一端在背后则不画） */
  visible: boolean;
}

/** alt/az(rad) -> 单位方向向量（+X东 +Y天顶 +Z北） */
function dirVec(alt: number, az: number): [number, number, number] {
  const ca = Math.cos(alt);
  return [ca * Math.sin(az), Math.sin(alt), ca * Math.cos(az)];
}
function dot(a: number[], b: number[]): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a: number[], b: number[]): [number, number, number] {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}
function norm(a: number[]): [number, number, number] {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
}

export interface SkyProjection {
  stars: ProjectedStar[];
  segments: ProjectedSeg[];
  /** 复现快照：把逐星屏幕坐标量化到 0.5px 后的紧凑串（用于证书比对/逐星一致断言） */
  snapshot: string;
  width: number;
  height: number;
}

/**
 * 主入口：同参数 → 逐星屏幕坐标完全一致。
 * 注意：本函数纯同步、无 IO、无时钟读取（时间从 unixMs 传入）。
 */
export function projectSky(p: SkyParams): SkyProjection {
  const fovDeg = p.fovDeg ?? 60;
  const aimAltDeg = p.aimAltDeg ?? 18;

  const jd = toJulianDay(p.unixMs);
  const lst = localSiderealTime(jd, p.lngDeg);
  const lat = p.latDeg * DEG;

  // 岁差：拷贝一份再就地变（保证可重复、不污染源星表）
  const data = copyStarData();
  const m = precessionMatrix(jd);
  applyPrecession(data, m);

  // 相机基
  const aimAlt = aimAltDeg * DEG;
  const dir = normalizeRad(p.dirDeg * DEG);
  const fwd = norm(dirVec(aimAlt, dir));
  const worldUp: [number, number, number] = [0, 1, 0];
  const right = norm(cross(fwd, worldUp));
  const upScreen = norm(cross(right, fwd));

  const focal = p.height / 2 / Math.tan((fovDeg / 2) * DEG);
  const cx = p.width / 2;
  const cy = p.height / 2;

  const stars: ProjectedStar[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const ra = data[i];
    const dec = data[i + 1];
    const mag = data[i + 2];
    const ci = data[i + 3];
    if (mag > p.magLimit) continue;

    const { alt, az } = radecToAltAz(ra, dec, lst, lat);
    if (alt <= 0) continue; // 地平线以下丢弃

    const s = dirVec(alt, az);
    const z = dot(s, fwd);
    if (z <= 0.02) continue; // 在相机背后
    const x = dot(s, right);
    const y = dot(s, upScreen);
    const px = cx + (x / z) * focal;
    const py = cy - (y / z) * focal;
    if (px < -50 || px > p.width + 50 || py < -50 || py > p.height + 50) continue;

    const flux = Math.pow(10, -0.4 * (mag - p.magLimit));
    stars.push({ x: px, y: py, mag, ci, alt, az, flux, depth: z });
  }
  // 确定性排序：按亮度降序（同亮按 x,y），保证数组顺序可复现
  stars.sort((a, b) => a.mag - b.mag || a.x - b.x || a.y - b.y);

  // 星座线：端点同样投影，两端都在视锥内才可见
  const segs = constellationSegmentsRad();
  const projPts: { x: number; y: number; z: number }[] = [];
  const projectSegPt = (ra: number, dec: number) => {
    const { alt, az } = radecToAltAz(ra, dec, lst, lat);
    const s = dirVec(alt, az);
    const z = dot(s, fwd);
    const x = dot(s, right);
    const y = dot(s, upScreen);
    return {
      x: cx + (x / (z <= 0.02 ? 0.02 : z)) * focal,
      y: cy - (y / (z <= 0.02 ? 0.02 : z)) * focal,
      z,
    };
  };
  const segments: ProjectedSeg[] = [];
  for (const sg of segs) {
    const a = projectSegPt(sg.ra1, sg.dec1);
    const b = projectSegPt(sg.ra2, sg.dec2);
    projPts.length = 0;
    const visible =
      a.z > 0.02 &&
      b.z > 0.02 &&
      a.x > 0 && a.x < p.width && a.y > 0 && a.y < p.height &&
      b.x > 0 && b.x < p.width && b.y > 0 && b.y < p.height;
    segments.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, visible });
  }

  return { stars, segments, snapshot: buildSnapshot(stars), width: p.width, height: p.height };
}

/**
 * 复现快照：逐星 (x,y,mag) 量化到 0.5px / 0.01mag 的紧凑串。
 * 同参数必然逐字节相同；参数被改任一关键星坐标漂移 → 快照变化。
 */
export function buildSnapshot(stars: ProjectedStar[]): string {
  const q = (v: number) => Math.round(v * 2) / 2; // 0.5px
  const parts = stars.map((s) => `${q(s.x).toFixed(1)},${q(s.y).toFixed(1)},${s.mag.toFixed(2)}`);
  return parts.join(';');
}
