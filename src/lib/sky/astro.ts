// src/lib/sky/astro.ts
// 复用现有 toJulianDay / localSiderealTime，新增岁差与坐标转换。
// 坐标系约定：+X 东、+Y 天顶、+Z 北；天球半径 R=500；地面 y=0。

export const DEG = Math.PI / 180;
export const RAD = 180 / Math.PI;
export const TWO_PI = Math.PI * 2;

/** 角度归一到 [0, 2π) */
export function normalizeRad(a: number): number {
  const t = a % TWO_PI;
  return t < 0 ? t + TWO_PI : t;
}

/** 儒略日：输入 Unix 毫秒，输出 JD */
export function toJulianDay(unixMs: number): number {
  return unixMs / 86400000 + 2440587.5;
}

/** 格林尼治平恒星时（弧度），Meeus 12.4 简化式，误差 < 0.01° */
export function gmstRad(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const gmstDeg =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return normalizeRad(gmstDeg * DEG);
}

/** 本地恒星时（弧度），lonDeg 东经为正 */
export function localSiderealTime(jd: number, lonDeg: number): number {
  return normalizeRad(gmstRad(jd) + lonDeg * DEG);
}

// 行主序 3x3 矩阵乘法：C = A * B
function mul3(A: number[], B: number[]): number[] {
  const C = new Array(9);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      C[i * 3 + j] =
        A[i * 3 + 0] * B[0 * 3 + j] +
        A[i * 3 + 1] * B[1 * 3 + j] +
        A[i * 3 + 2] * B[2 * 3 + j];
    }
  }
  return C;
}

/**
 * IAU 1976 岁差矩阵：J2000 -> 当日平赤道。
 * P = Rz(-z) · Ry(theta) · Rz(-zeta)
 * 返回行主序 9 元素矩阵 m，作用于向量 [x,y,z]：v' = m * v。
 * 精度：1900-2100 内 < 1 arcsec。
 */
export function precessionMatrix(jd: number): Float64Array {
  const T = (jd - 2451545.0) / 36525.0;

  // 三个岁差角（角秒 -> 弧度）
  const zeta =
    (2306.2181 * T + 0.30188 * T * T + 0.017998 * T * T * T) / 3600 * DEG;
  const z =
    (2306.2181 * T + 1.09468 * T * T + 0.018203 * T * T * T) / 3600 * DEG;
  const theta =
    (2004.3109 * T - 0.42665 * T * T - 0.041833 * T * T * T) / 3600 * DEG;

  const cz = Math.cos(z), sz = Math.sin(z);
  const ct = Math.cos(theta), st = Math.sin(theta);
  const cze = Math.cos(zeta), sze = Math.sin(zeta);

  // 行主序 Rz(-z) = [cz, sz, 0; -sz, cz, 0; 0, 0, 1]
  const Rz = [
    cz, sz, 0,
    -sz, cz, 0,
    0, 0, 1,
  ];
  // 行主序 Ry(theta) = [ct, 0, st; 0, 1, 0; -st, 0, ct]
  const Ry = [
    ct, 0, st,
    0, 1, 0,
    -st, 0, ct,
  ];
  // 行主序 Rz(-zeta) = [cze, sze, 0; -sze, cze, 0; 0, 0, 1]
  const Rzeta = [
    cze, sze, 0,
    -sze, cze, 0,
    0, 0, 1,
  ];

  const R = mul3(mul3(Rz, Ry), Rzeta);
  const m = new Float64Array(9);
  for (let i = 0; i < 9; i++) m[i] = R[i];
  return m;
}

/**
 * 批量岁差：就地修改 interleaved Float32Array [ra,dec,mag,ci,...]
 * 只动 ra/dec，跳过 mag/ci。
 * 注意：本函数会修改输入数组，请勿重复调用。
 */
export function applyPrecession(data: Float32Array, m: Float64Array): void {
  for (let i = 0; i < data.length; i += 4) {
    const ra = data[i];
    const dec = data[i + 1];
    const cd = Math.cos(dec);
    const x = cd * Math.cos(ra);
    const y = cd * Math.sin(ra);
    const z = Math.sin(dec);

    const nx = m[0] * x + m[1] * y + m[2] * z;
    const ny = m[3] * x + m[4] * y + m[5] * z;
    const nz = m[6] * x + m[7] * y + m[8] * z;

    data[i] = Math.atan2(ny, nx);
    data[i + 1] = Math.asin(Math.max(-1, Math.min(1, nz)));
  }
}

/**
 * 赤道 -> 地平。
 * lst: 本地恒星时(rad)，lat: 纬度(rad)
 * 返回 { alt, az }，az 从北顺时针：0=北, PI/2=东, PI=南, 3PI/2=西。
 */
export function radecToAltAz(
  ra: number,
  dec: number,
  lst: number,
  lat: number
): { alt: number; az: number } {
  const raN = normalizeRad(ra);
  const lstN = normalizeRad(lst);
  const H = normalizeRad(lstN - raN);

  const sinDec = Math.sin(dec);
  const cosDec = Math.cos(dec);
  const sinLat = Math.sin(lat);
  const cosLat = Math.cos(lat);
  const sinH = Math.sin(H);
  const cosH = Math.cos(H);

  const sinAlt = sinDec * sinLat + cosDec * cosLat * cosH;
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));

  const cosAlt = Math.cos(alt);
  const denom = cosAlt * cosLat;

  let az: number;
  if (Math.abs(denom) < 1e-9) {
    // 天顶/天底或极点退化，方位角无定义，取 0
    az = 0;
  } else {
    const cosAz = (sinDec - sinAlt * sinLat) / denom;
    az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
    if (sinH > 0) az = TWO_PI - az;
  }
  return { alt, az };
}

/**
 * 地平 -> 天球笛卡尔。约定：+X 东、+Y 天顶、+Z 北。
 * R 默认 500（与 URBAN 契约一致）。
 */
export function altAzToVec3(
  alt: number,
  az: number,
  R = 500
): { x: number; y: number; z: number } {
  const ca = Math.cos(alt);
  return {
    x: R * ca * Math.sin(az),
    y: R * Math.sin(alt),
    z: R * ca * Math.cos(az),
  };
}

/** 一步到位：ra/dec -> 地平 -> 天球笛卡尔 */
export function radecToVec3(
  ra: number,
  dec: number,
  lst: number,
  lat: number,
  R = 500
): { x: number; y: number; z: number } {
  const { alt, az } = radecToAltAz(ra, dec, lst, lat);
  return altAzToVec3(alt, az, R);
}