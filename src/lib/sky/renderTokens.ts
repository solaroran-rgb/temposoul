/**
 * renderTokens.ts —— 渲染参数单源（C5/D6 载体）· 终版（替代上一版）
 * 纪律：src/lib/sky/ 下唯一允许出现非 token 数值的位置（线宽/透明度/衰减等非颜色参数）；
 *       颜色一律来自 E4 holographic-tokens，GLSL 与场景代码零字面色值。
 * 色彩管理（B12 修复）：
 *   rawColor()     —— NoColorSpace 直读，喂自定义 ShaderMaterial（raw 管线直读直出还原 hex）
 *   managedColor() —— 默认 sRGB→linear，仅 renderer.setClearColor（内置管线负责输出转换）
 */
import * as THREE from "three";
import { HOLOGRAPHIC_TOKENS } from "../../theme/holographic-tokens";

/* ---- token 键名单点（R-E3-1：bg-void 与 E4 对齐；集成核对点 #1 复核对象） ---- */
export const TOKEN_KEYS = {
  bg: "bg-void", core: "cyan-core", dim: "cyan-dim",
  bright: "text-bright", warm: "accent-warm", constellation: "cyan-constellation",
} as const;

/* ---- D6 别名映射（主审定案；uColorCore 与 uColorBlue 同指 cyan-core，无双源） ---- */
export const TOKEN_ALIAS = {
  uColorBlue: TOKEN_KEYS.core, uColorWhite: TOKEN_KEYS.bright, uColorWarm: TOKEN_KEYS.warm,
  uColorDim: TOKEN_KEYS.dim, uColorConstellation: TOKEN_KEYS.constellation, uColorCore: TOKEN_KEYS.core,
  uColorGlow: "cyan-glow", // F-2 主审裁定：线光晕专属色（E4 10 键 cyan-glow）
} as const;
export type AliasName = keyof typeof TOKEN_ALIAS;

/* ---- R-E3-2：字符串解析器（E4 单源格式：#RGB / #RRGGBB / #RRGGBBAA / rgb() / rgba()） ---- */
interface ParsedToken { r: number; g: number; b: number; a: number }
const RGBA_RE = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/;
function parseTokenString(raw: string): ParsedToken {
  const v = String(raw ?? "").trim();
  if (v.startsWith("#")) {
    let h = v.slice(1);
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (h.length === 6 || h.length === 8) {
      const n = parseInt(h, 16);
      const p: ParsedToken = h.length === 8
        ? { r: (n >>> 24) & 255, g: (n >>> 16) & 255, b: (n >>> 8) & 255, a: (n & 255) / 255 }
        : { r: (n >>> 16) & 255, g: (n >>> 8) & 255, b: n & 255, a: 1 };
      if ([p.r, p.g, p.b, p.a].every(Number.isFinite)) return p;
    }
  }
  const m = RGBA_RE.exec(v);
  if (m) {
    const p = { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
    if ([p.r, p.g, p.b, p.a].every(Number.isFinite)) return p;
  }
  throw new Error('[renderTokens] 无法解析 token 值 "' + v + '"（E4 单源为字符串：#RGB/#RRGGBB/#RRGGBBAA/rgb()/rgba()）');
}
function tok(key: string): ParsedToken {
  const v = (HOLOGRAPHIC_TOKENS as Record<string, string | undefined>)[key];
  if (typeof v !== "string" || v === "") {
    throw new Error('[renderTokens] token 缺失或非字符串: "' + key + '"（核对 E4 holographic-tokens 键名）');
  }
  return parseTokenString(v);
}
/** B12 语义保持：uniform 走 raw 通道（NoColorSpace 直读直出；自定义 ShaderMaterial 无输出转换） */
export function rawColor(a: AliasName): THREE.Color {
  const { r, g, b } = tok(TOKEN_ALIAS[a]);
  return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.NoColorSpace);
}
/** clearColor 走 managed 通道（sRGB→working；内置 clear 时输出转换回 sRGB） */
export function managedColor(): THREE.Color {
  const { r, g, b } = tok(TOKEN_KEYS.bg);
  return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
}
/** alpha 自 rgba() 形态提取；hex 默认 1。'rgba(77,208,225,0.40)' → 0.40（D2 星座线） */
export const aliasAlpha = (a: AliasName): number => tok(TOKEN_ALIAS[a]).a;

/* ---- 线 profile（D3：核心窄峰 + 光晕宽峰） ---- */
export const LINE = { coreWidthPx: 1.0, glowRadiusPx: 2.6, coreAlpha: 0.9, glowAlpha: 0.32 } as const;
export const LANDMARK_LINE = { coreWidthPx: 1.4, glowRadiusPx: 3.2 } as const; // C2：地标独立宽度

/* ---- 城市参数（B4：单一全局排序列表；景深为 per-seg layer） ---- */
export const CITY_LAYER = { near: 0.85, mid: 0.5, far: 0.28 } as const;
export const CITY_OPACITY = { lines: 1.0, water: 0.85, roads: 0.55, landmarks: 0.95, points: 1.0 } as const;
export const DISTANCE_FADE = { near: 180, far: 600 } as const;

/* ---- 点类 ---- */
export const POINT = { spriteSize: 64, perspScale: 300, nodeSize: 2.2, windowSize: 1.8, dustSize: 1.4 } as const;
export const DUST_MAX = 320;

/* ---- 画质分级（C1 终局：uMagLimit 6.0；starChunks 为重算分片帧数） ---- */
export type QualityTier = "high" | "mid" | "low";
export const TIER: Record<QualityTier, {
  uMagLimit: number; dprCap: number; ambientFps: number; constellationSegs: number;
  diffractionMax: number; starChunks: number; cityRatio: number; roadsRatio: number;
  dustRatio: number; twinkleAmp: number;
}> = {
  high: { uMagLimit: 6.0, dprCap: 2,   ambientFps: 24, constellationSegs: 566, diffractionMax: 20, starChunks: 1, cityRatio: 1.0,  roadsRatio: 1.0,  dustRatio: 1.0,  twinkleAmp: 0.10 },
  mid:  { uMagLimit: 5.0, dprCap: 1.5, ambientFps: 24, constellationSegs: 400, diffractionMax: 12, starChunks: 5, cityRatio: 0.6,  roadsRatio: 0.5,  dustRatio: 0.5,  twinkleAmp: 0.10 },
  low:  { uMagLimit: 4.5, dprCap: 1,   ambientFps: 20, constellationSegs: 200, diffractionMax: 0,  starChunks: 8, cityRatio: 0.35, roadsRatio: 0.25, dustRatio: 0.25, twinkleAmp: 0 },
};

/* ---- D5 分态判据 + G7 降级治理参数 ---- */
export const PERF_BUDGET = {
  fullP95: { high: 16.9, mid: 33, low: 50 },
  ambientSpikeMs: 100, governorWindow: 30, governorFactor: 1.3,
} as const;

/* ---- renderOrder 固定表（B10 补全；additive 可交换，此表为 diff 稳定与可读性） ---- */
export const RENDER_ORDER = {
  ground: 0, water: 1, roads: 2, cityLines: 3, cityPoints: 4, landmarks: 5,
  avatar: 6, dust: 6, moon: 7, constellation: 8, stars: 8,
} as const;

export function detectTier(): QualityTier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 4;
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse && (mem <= 4 || cores <= 4)) return "low";
  if (coarse) return "mid";
  return "high";
}

export function isWebGL2Available(): boolean { // G5：CSS 降级路径前置判断
  try { return !!document.createElement("canvas").getContext("webgl2"); } catch { return false; }
}

export interface SharedUniforms {
  uTime: { value: number };
  uGlobalFade: { value: number };
  uResolution: { value: THREE.Vector2 };
  uDpr: { value: number };
}
export function createSharedUniforms(dpr: number): SharedUniforms {
  return { uTime: { value: 0 }, uGlobalFade: { value: 0 }, uResolution: { value: new THREE.Vector2(1, 1) }, uDpr: { value: dpr } };
}