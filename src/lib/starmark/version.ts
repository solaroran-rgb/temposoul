/**
 * version.ts —— 星刻 StarMark 全局版本单源（证书内容的一部分）
 * 纪律：任何渲染/坐标/色标/星表变更都必须在这里 bump 对应版本号，
 *       否则 sky_id 证书将无法判定「同参数是否真的可复现」。
 * 这些值会进入 getSceneFingerprint() 与 sky_id 证书。
 */

/** 星表版本：与 src/lib/sky/stars.data.ts（A5 同源，HYG/BSC via d3-celestial stars.6）绑定 */
export const STAR_CATALOG_VERSION = 'hyg-bsc/d3celestial-stars.6@20261007';
/** 坐标/历元算法版本：复用 src/lib/sky/astro.ts（IAU1976 岁差 + Meeus12.4 GMST） */
export const ALGORITHM_VERSION = 'astro/iau1976+meeus12.4@v1';
/** 时间尺度 */
export const TIME_SCALE = 'UTC' as const;
/** 历元 */
export const EPOCH = 'J2000' as const;
/** 投影模型：针孔透视（地平坐标 -> 相机系），L1/L2 共用 */
export const PROJECTION_VERSION = 'pinhole-horizon-v1';
/** 色标：B-V -> RGB 分段插值 */
export const COLOR_SYSTEM = 'bv-rgb-lerp-v1';
/** 默认星等阈值（暗于此不画） */
export const DEFAULT_MAG_LIMIT = 6.0;
/** L1 PNG 渲染器版本 */
export const L1_RENDER_VERSION = 'starmark-l1@v1';
/** L2 shader 版本（改动 GLSL 必须 bump） */
export const STAR_SHADER_VERSION = 'star-shader@v1';
/** three 锁定版本（与 package.json dependencies three ^0.186.0 对齐） */
export const THREE_VERSION_LOCK = '0.186.0';
/** 渲染容差：L1/L2 关键星体屏幕坐标偏差容差（CSS px），超差判不可复现 */
export const SCREEN_COORD_TOLERANCE_PX = 0.75;

/** 证书内容（对外只暴露版本指纹，不暴露经纬度/称谓 —— P13 隐私） */
export interface CertificateContent {
  catalogVersion: string;
  algorithmVersion: string;
  timeScale: string;
  epoch: string;
  projection: string;
  colorSystem: string;
  magLimit: number;
  l1RenderVersion: string;
  starShaderVersion: string;
  threeVersion: string;
  randomSeed: number;
}

export function buildCertificateContent(magLimit: number, randomSeed: number): CertificateContent {
  return {
    catalogVersion: STAR_CATALOG_VERSION,
    algorithmVersion: ALGORITHM_VERSION,
    timeScale: TIME_SCALE,
    epoch: EPOCH,
    projection: PROJECTION_VERSION,
    colorSystem: COLOR_SYSTEM,
    magLimit,
    l1RenderVersion: L1_RENDER_VERSION,
    starShaderVersion: STAR_SHADER_VERSION,
    threeVersion: THREE_VERSION_LOCK,
    randomSeed,
  };
}
