/**
 * glowLine.ts —— GlowLine 材质族 · 终版（B1/B2/B3/B13 修复）
 * D3：星座线/城市/地面/水系/路网/地标/骨架线共用本族。
 * D1：depthWrite=false 全层；depthTest 默认 true（月亮/标签例外在场景侧）。
 * D4：无生长动画 attribute。
 * C5：颜色仅经 uniform 注入；GLSL 零字面色值。
 */
import * as THREE from "three";
import { rawColor, LINE, type AliasName, type SharedUniforms } from "../renderTokens";

/** B4 契约：pts 为 L2 紧凑段 [x,y,z,x,y,z,...]；列表须按「距城市中心升序」排列，
 *  使 drawRange 截断语义 = 保留中心城区；景深以 per-seg layer 表达（非数组分区）。 */
export interface GlowSeg { pts: Float32Array; layer: number }
export const countSegments = (segs: GlowSeg[]) => segs.reduce((n, s) => n + s.pts.length / 6, 0) | 0;

export const GLOWLINE_VERT = /* glsl */ `
attribute vec3 aOther;
attribute float aSide;
attribute float aLayer;
uniform vec2 uResolution;
uniform float uHalfWidth;
uniform float uFadeNear;
uniform float uFadeFar;
varying float vSideW;
varying float vW;
varying float vLayer;
varying float vFade;
void main() {
  vec4 mv0 = modelViewMatrix * vec4(position, 1.0);
  vec4 mv1 = modelViewMatrix * vec4(aOther, 1.0);
  vec4 c0 = projectionMatrix * mv0;
  vec4 c1 = projectionMatrix * mv1;
  // B2 修复：法向在像素空间计算（NDC 归一会受视口宽高比扭曲）
  vec2 dPx = ((c1.xy / c1.w) - (c0.xy / c0.w)) * uResolution * 0.5;
  float dl = length(dPx);
  vec2 nPx = (dl > 1e-4) ? vec2(-dPx.y, dPx.x) / dl : vec2(0.0);
  c0.xy += nPx * (aSide * uHalfWidth * 2.0) / uResolution * c0.w;
  // B3 修复：vSideW/vW 手工线性化（片元内比值 = 精确屏幕重心组合，免疫透视校正）
  vSideW = aSide * c0.w;
  vW = c0.w;
  vLayer = aLayer;
  // B13 修复：任一端在相机平面之后（w<=0）即淡出，杜绝 NDC 镜像拉丝
  vFade = clamp((uFadeFar - max(-mv0.z, 1.0)) / (uFadeFar - uFadeNear), 0.0, 1.0)
        * step(1e-3, min(c0.w, c1.w));
  gl_Position = c0;
}`;

export const GLOWLINE_FRAG = /* glsl */ `
uniform vec3 uColorCore;
uniform vec3 uColorGlow;
uniform float uCoreRatio;
uniform float uCoreAlpha;
uniform float uGlowAlpha;
uniform float uOpacity;
uniform float uGlobalFade;
varying float vSideW;
varying float vW;
varying float vLayer;
varying float vFade;
void main() {
  float x = abs(vSideW / vW);            // 屏幕空间横向坐标 ∈ [0,1]
  float aa = fwidth(x) * 1.5 + 1e-4;     // WebGL2 核心功能，无需 extension
  float core = 1.0 - smoothstep(uCoreRatio - aa, uCoreRatio + aa, x); // 锐利核心
  float glow = exp(-x * x * 5.0) * (1.0 - x);                          // 柔和光晕宽峰
  float a = min(uCoreAlpha * core + uGlowAlpha * glow, 1.0);          // 过曝钳制
  a *= vLayer * uOpacity * vFade * uGlobalFade;
  if (a < 0.004) discard;
  gl_FragColor = vec4(mix(uColorGlow, uColorCore, core), a);
}`;

export function buildGlowLineGeometry(segs: GlowSeg[]): THREE.BufferGeometry {
  let total = 0;
  for (const s of segs) total += s.pts.length / 6;
  const pos = new Float32Array(total * 12);
  const oth = new Float32Array(total * 12);
  const side = new Float32Array(total * 4);
  const layer = new Float32Array(total * 4);
  const idx = total * 4 > 65535 ? new Uint32Array(total * 6) : new Uint16Array(total * 6);
  let v = 0, k = 0;
  for (const s of segs) {
    const n = s.pts.length / 6;
    for (let i = 0; i < n; i++) {
      const o = i * 6;
      const px = s.pts[o], py = s.pts[o + 1], pz = s.pts[o + 2];
      const qx = s.pts[o + 3], qy = s.pts[o + 4], qz = s.pts[o + 5];
      pos.set([px, py, pz, px, py, pz, qx, qy, qz, qx, qy, qz], v * 3);
      oth.set([qx, qy, qz, qx, qy, qz, px, py, pz, px, py, pz], v * 3);
      side.set([-1, 1, -1, 1], v); // B1 修复：Q 端侧别翻转（原 [..,1,-1] 产生蝶形四边形）
      layer.fill(s.layer, v, v + 4);
      idx[k++] = v; idx[k++] = v + 1; idx[k++] = v + 2;
      idx[k++] = v; idx[k++] = v + 2; idx[k++] = v + 3;
      v += 4;
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("aOther", new THREE.BufferAttribute(oth, 3));
  g.setAttribute("aSide", new THREE.BufferAttribute(side, 1));
  g.setAttribute("aLayer", new THREE.BufferAttribute(layer, 1));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  return g;
}

export interface GlowLineOptions {
  core: AliasName;
  glow?: AliasName;
  opacity?: number;                              // 星座线传 aliasAlpha("uColorConstellation") = 0.40（D2）
  fadeNear?: number; fadeFar?: number;           // 默认不衰减（天球层）
  coreWidthPx?: number; glowRadiusPx?: number;    // 地标层覆写（C2）
  depthTest?: boolean;                           // 默认 true（D1）
}
export function makeGlowLineMaterial(shared: SharedUniforms, o: GlowLineOptions): THREE.ShaderMaterial {
  const cw = o.coreWidthPx ?? LINE.coreWidthPx;
  const gr = o.glowRadiusPx ?? LINE.glowRadiusPx;
  const halfW = cw * 0.5 + gr;
  return new THREE.ShaderMaterial({
    vertexShader: GLOWLINE_VERT,
    fragmentShader: GLOWLINE_FRAG,
    uniforms: {
      ...shared, // 引用共享：uTime/uGlobalFade/uResolution/uDpr 每帧只写一次
      uColorCore: { value: rawColor(o.core) },
      uColorGlow: { value: rawColor(o.glow ?? "uColorGlow") }, // F-2：默认光晕色 = cyan-glow
      uCoreRatio: { value: (cw * 0.5) / halfW },
      uCoreAlpha: { value: LINE.coreAlpha },
      uGlowAlpha: { value: LINE.glowAlpha },
      uOpacity: { value: o.opacity ?? 1 },
      uHalfWidth: { value: halfW },
      uFadeNear: { value: o.fadeNear ?? 1e9 },
      uFadeFar: { value: o.fadeFar ?? 1e10 },
    },
    transparent: true, depthWrite: false, depthTest: o.depthTest ?? true, side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
}

/** C7：顶点量降级手段（段升序 = 截断语义为保留中心城区） */
export function applySegDrawRange(g: THREE.BufferGeometry, totalSegs: number, ratio: number): void {
  g.setDrawRange(0, Math.floor(totalSegs * ratio) * 6);
}

/** 天文重算后更新段端点（position/aOther 交错写入；循环外统一 needsUpdate） */
export function updateGlowLineSegment(g: THREE.BufferGeometry, i: number, p: { x: number; y: number; z: number }, q: { x: number; y: number; z: number }): void {
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  const oth = g.getAttribute("aOther") as THREE.BufferAttribute;
  const v = i * 4;
  pos.setXYZ(v, p.x, p.y, p.z); pos.setXYZ(v + 1, p.x, p.y, p.z);
  pos.setXYZ(v + 2, q.x, q.y, q.z); pos.setXYZ(v + 3, q.x, q.y, q.z);
  oth.setXYZ(v, q.x, q.y, q.z); oth.setXYZ(v + 1, q.x, q.y, q.z);
  oth.setXYZ(v + 2, p.x, p.y, p.z); oth.setXYZ(v + 3, p.x, p.y, p.z);
}