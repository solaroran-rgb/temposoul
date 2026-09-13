/**
 * glowPoint.ts —— GlowPoint 材质族 · 终版
 *  - SimplePoints：aSize + aWarm 选择器（C4：warm=1 → accent-warm）
 *  - makeStarPoints：E1 星点 GLSL 注入式工厂（GLSL 单源归 E1，本工厂只做 D6 uniform + tier 接线）
 *  - bakeRadialSprite：灰度遮罩贴图（非调色板色值，C5 合规），启动时 Canvas2D 离线烘焙
 */
import * as THREE from "three";
import { rawColor, POINT, TIER, type AliasName, type QualityTier, type SharedUniforms } from "../renderTokens";

export function bakeRadialSprite(size = POINT.spriteSize): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

export interface PointPart { positions: Float32Array; size: number; warm: 0 | 1 }
export interface MergedPoints { positions: Float32Array; sizes: Float32Array; warm: Float32Array; count: number }

export function mergePointSpecs(parts: PointPart[]): MergedPoints {
  let n = 0;
  for (const p of parts) n += p.positions.length / 3;
  const positions = new Float32Array(n * 3), sizes = new Float32Array(n), warm = new Float32Array(n);
  let v = 0;
  for (const p of parts) {
    const m = p.positions.length / 3;
    positions.set(p.positions, v * 3);
    sizes.fill(p.size, v, v + m);
    warm.fill(p.warm, v, v + m);
    v += m;
  }
  return { positions, sizes, warm, count: n };
}

export function buildPointsGeometry(spec: MergedPoints): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(spec.positions, 3));
  g.setAttribute("aSize", new THREE.BufferAttribute(spec.sizes, 1));
  g.setAttribute("aWarm", new THREE.BufferAttribute(spec.warm, 1));
  return g;
}

export const POINT_VERT = /* glsl */ `
attribute float aSize;
attribute float aWarm;
uniform float uDpr;
uniform float uSizeScale;
uniform float uPerspScale;
uniform float uFadeNear;
uniform float uFadeFar;
uniform float uTime;
uniform float uTwinkleAmp;
varying float vWarm;
varying float vFade;
varying float vTw;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float dist = max(-mv.z, 1.0);
  vFade = clamp((uFadeFar - dist) / (uFadeFar - uFadeNear), 0.0, 1.0);
  float ph = fract(sin(dot(position.xy, vec2(12.9898, 78.233))) * 43758.5453);
  vTw = 1.0 - uTwinkleAmp * (0.5 + 0.5 * sin(uTime * 1.7 + ph * 6.2831));
  vWarm = aWarm;
  gl_PointSize = clamp(aSize * uSizeScale * uDpr * (uPerspScale / dist), 1.0, 64.0);
  gl_Position = projectionMatrix * mv;
}`;

export const POINT_FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uColorBase;
uniform vec3 uColorWarm;
uniform float uOpacity;
uniform float uGlobalFade;
varying float vWarm;
varying float vFade;
varying float vTw;
void main() {
  float m = texture2D(uMap, gl_PointCoord).r;
  float a = m * vFade * vTw * uOpacity * uGlobalFade;
  if (a < 0.004) discard;
  gl_FragColor = vec4(mix(uColorBase, uColorWarm, vWarm), a);
}`;

export interface SimplePointsOptions {
  base: AliasName; opacity?: number; sizeScale?: number;
  fadeNear?: number; fadeFar?: number; twinkleAmp?: number; depthTest?: boolean;
}
export function makeSimplePointsMaterial(shared: SharedUniforms, sprite: THREE.CanvasTexture, o: SimplePointsOptions): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: POINT_VERT,
    fragmentShader: POINT_FRAG,
    uniforms: {
      ...shared,
      uMap: { value: sprite },
      uColorBase: { value: rawColor(o.base) },
      uColorWarm: { value: rawColor("uColorWarm") },
      uOpacity: { value: o.opacity ?? 1 },
      uSizeScale: { value: o.sizeScale ?? 1 },
      uPerspScale: { value: POINT.perspScale },
      uFadeNear: { value: o.fadeNear ?? 1e9 },
      uFadeFar: { value: o.fadeFar ?? 1e10 },
      uTwinkleAmp: { value: o.twinkleAmp ?? 0 },
    },
    transparent: true, depthWrite: false, depthTest: o.depthTest ?? true,
    blending: THREE.AdditiveBlending,
  });
}

/* ---- StarPoints：E1 GLSL 注入式工厂 ----
 * E1 的 GLSL 必须声明并使用以下 uniform（D6 + tier + 入场淡入）：
 *   uMagLimit / uDpr / uTime / uDiffractionMax / uGlobalFade / uFlickerAmp
 *   uColorBlue / uColorWhite / uColorWarm / uColorDim
 * 且顶点着色器须含两行（R2 契约 + 消除遮挡盘）：
 *   最终 alpha *= uGlobalFade;                     // D4 入场
 *   最终 alpha *= smoothstep(-0.015, 0.02, position.y / 500.0); // 地平线以下淡出
 * attribute 契约：position（动态）/ aMag / aCi（stars.data 布局 {ra, dec, mag, ci}）
 */
export function makeStarPoints(
  shared: SharedUniforms, tier: QualityTier,
  glsl: { vertexShader: string; fragmentShader: string }, starData: Float32Array,
): THREE.Points {
  const n = starData.length / 4;
  const pos = new Float32Array(n * 3);
  const mag = new Float32Array(n);
  const ci = new Float32Array(n);
  for (let i = 0; i < n; i++) { mag[i] = starData[i * 4 + 2]; ci[i] = starData[i * 4 + 3]; }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
  g.setAttribute("aMag", new THREE.BufferAttribute(mag, 1));
  g.setAttribute("aCi", new THREE.BufferAttribute(ci, 1));
  const mat = new THREE.ShaderMaterial({
    vertexShader: glsl.vertexShader,
    fragmentShader: glsl.fragmentShader,
    uniforms: {
      ...shared,
      uColorBlue: { value: rawColor("uColorBlue") },
      uColorWhite: { value: rawColor("uColorWhite") },
      uColorWarm: { value: rawColor("uColorWarm") },
      uColorDim: { value: rawColor("uColorDim") },
      uMagLimit: { value: TIER[tier].uMagLimit },
      uDiffractionMax: { value: TIER[tier].diffractionMax },
      uFlickerAmp: { value: TIER[tier].twinkleAmp }, // I5 单源：E1 声明名 uFlickerAmp，值出自 TIER.twinkleAmp（此前缺注 → GLSL 默认 0，星点永无闪烁）
    },
    transparent: true, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending,
  });
  const pts = new THREE.Points(g, mat);
  pts.frustumCulled = false;
  return pts;
}

/** G8：尘埃层（seeded LCG；域匹配 v2 相机 (0,34,-95) 朝 +z） */
export function buildDustSpec(count: number, seed = 7): PointPart {
  let s = (seed >>> 0) || 1;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (rnd() * 2 - 1) * 190;
    positions[i * 3 + 1] = 4 + rnd() * 88;
    positions[i * 3 + 2] = -30 + rnd() * 300;
  }
  return { positions, size: POINT.dustSize, warm: 0 };
}
