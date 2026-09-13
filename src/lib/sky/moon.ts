// src/lib/sky/moon.ts
// Meeus 简化月球轨道（低精度，黄经误差约 0.5°，视觉无感）+ 12 档月相 CanvasTexture。

import * as THREE from 'three';
import { DEG, TWO_PI, normalizeRad, radecToAltAz, altAzToVec3 } from './astro';

const MOON_PHASE_SLOTS = 12;

function normalizeDeg(d: number): number {
  const t = d % 360;
  return t < 0 ? t + 360 : t;
}

/** 太阳黄经（度），Meeus 25.2 简化 */
function sunEclipticLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mr = M * DEG;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);
  return normalizeDeg(L0 + C);
}

/** 月球黄经、黄纬（度），Meeus 47 低精度主项 */
function moonEcliptic(jd: number): { lon: number; lat: number } {
  const T = (jd - 2451545.0) / 36525.0;
  const Lp = 218.316 + 481267.881 * T;          // 平黄经
  const D = 297.8501921 + 445267.1114034 * T;   // 平距角
  const M = 357.52911 + 35999.05029 * T;        // 太阳平近点角
  const Mp = 134.963 + 477198.867 * T;          // 月球平近点角
  const F = 93.272 + 483202.017 * T;            // 升交点角距

  const Dr = D * DEG, Mr = M * DEG, Mpr = Mp * DEG, Fr = F * DEG;

  // 黄经主项
  const lon =
    Lp +
    6.289 * Math.sin(Mpr) +
    1.274 * Math.sin(2 * Dr - Mpr) +
    0.658 * Math.sin(2 * Dr) +
    0.214 * Math.sin(2 * Mpr) -
    0.186 * Math.sin(Mr) -
    0.114 * Math.sin(2 * Fr);

  // 黄纬主项
  const lat =
    5.128 * Math.sin(Fr) +
    0.281 * Math.sin(Mpr + Fr) +
    0.278 * Math.sin(Mpr - Fr) +
    0.173 * Math.sin(2 * Dr - Fr);

  return { lon: normalizeDeg(lon), lat };
}

/** 黄道 -> 赤道（度），IAU 简化，倾角 23.4392911° */
function eclipticToEquatorial(
  lonDeg: number,
  latDeg: number
): { ra: number; dec: number } {
  const eps = 23.4392911 * DEG;
  const l = lonDeg * DEG;
  const b = latDeg * DEG;
  const sinL = Math.sin(l), cosL = Math.cos(l);
  const sinB = Math.sin(b), cosB = Math.cos(b);
  const sinE = Math.sin(eps), cosE = Math.cos(eps);

  const x = cosB * cosL;
  const y = cosB * sinL * cosE - sinB * sinE;
  const z = cosB * sinL * sinE + sinB * cosE;

  const ra = Math.atan2(y, x);
  const dec = Math.asin(Math.max(-1, Math.min(1, z)));
  return { ra: ra < 0 ? ra + Math.PI * 2 : ra, dec };
}

export interface MoonState {
  ra: number;       // rad
  dec: number;      // rad
  alt: number;      // rad
  az: number;       // rad
  vec: { x: number; y: number; z: number };
  phase: number;    // 0..2PI, 0=新月, PI=满月
  illum: number;    // 0..1 照亮比例
  slot: number;     // 0..11 贴图档位
}

/**
 * 计算月亮状态。
 * jd: 儒略日；lst: 本地恒星时(rad)；lat: 纬度(rad)；R: 天球半径。
 */
export function computeMoon(
  jd: number,
  lst: number,
  lat: number,
  R = 500
): MoonState {
  const { lon, lat: mlat } = moonEcliptic(jd);
  const sunLon = sunEclipticLongitude(jd);
  const { ra, dec } = eclipticToEquatorial(lon, mlat);

  const { alt, az } = radecToAltAz(ra, dec, lst, lat);
  const vec = altAzToVec3(alt, az, R);

  // 相位角：月球黄经 - 太阳黄经，归一 0..2PI
  const phase = normalizeRad((lon - sunLon) * DEG);
  const illum = (1 - Math.cos(phase)) / 2;

  const slot = Math.floor((phase / TWO_PI) * MOON_PHASE_SLOTS) % MOON_PHASE_SLOTS;

  return { ra, dec, alt, az, vec, phase, illum, slot };
}

/**
 * 逐像素渲染单个月相到 ImageData。
 * 数学模型：明暗分界线水平坐标 terminatorX = -cos(phase) * sqrt(1 - dy^2)，
 * 其中 phase 从新月起算（0=新月, π=满月）。亮区在 dx < terminatorX 一侧。
 */
function renderPhaseToImageData(
  size: number,
  phase: number
): ImageData {
  const ctx = document.createElement('canvas').getContext('2d')!;
  const img = ctx.createImageData(size, size);
  const data = img.data;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  const cosPhase = Math.cos(phase);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x - cx) / r;
      const dy = (y - cy) / r;
      const d2 = dx * dx + dy * dy;
      if (d2 > 1) continue; // 圆外透明

      const idx = (y * size + x) * 4;

      // 暗面：极低 alpha 的冷色，保留月球轮廓
      const rim = 0.15 + 0.15 * (1 - d2); // 中心略亮
      data[idx + 0] = 30;
      data[idx + 1] = 45;
      data[idx + 2] = 60;
      data[idx + 3] = Math.round(255 * 0.18 * rim + 20);

      // 亮面判定
      const terminatorX = -cosPhase * Math.sqrt(Math.max(0, 1 - dy * dy));
      if (dx < terminatorX) {
        // 边缘柔化
        const edgeDist = Math.min(
          Math.sqrt(1 - d2), // 到圆边缘
          Math.abs(terminatorX - dx) // 到明暗分界线
        );
        const soft = Math.min(1, edgeDist / 0.08);

        const glow = 0.85 + 0.15 * (1 - d2);
        data[idx + 0] = Math.round(220 * glow * soft + 30 * (1 - soft));
        data[idx + 1] = Math.round(235 * glow * soft + 45 * (1 - soft));
        data[idx + 2] = Math.round(250 * glow * soft + 60 * (1 - soft));
        data[idx + 3] = 255;
      }
    }
  }
  return img;
}

/**
 * 预生成 12 档月相 CanvasTexture。
 * slot 0 = 新月（几乎全暗），slot 6 = 满月（全亮）。
 * 颜色偏冷白，与 HUD 荧光蓝协调。
 */
export function makeMoonTextures(): THREE.CanvasTexture[] {
  const SIZE = 64;
  const textures: THREE.CanvasTexture[] = [];

  for (let slot = 0; slot < MOON_PHASE_SLOTS; slot++) {
    const phase = (slot / MOON_PHASE_SLOTS) * TWO_PI;

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = SIZE;
    const ctx = canvas.getContext('2d')!;

    const img = renderPhaseToImageData(SIZE, phase);
    ctx.putImageData(img, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    tex.generateMipmaps = false;
    tex.needsUpdate = true;
    textures.push(tex);
  }

  return textures;
}

export { MOON_PHASE_SLOTS };