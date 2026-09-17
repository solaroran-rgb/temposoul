/**
 * skyDome.ts —— 夜空天穹层（SkyDome 渐变穹 + Milky Way FBM 银河带）
 *
 * 来源：ck42bb/procedural-stars-threejs 技能 sky_dome.frag / milky_way.frag，
 *       按本项目 C5 纪律改造 —— GLSL 零字面色值：
 *         - 所有 vec3 色 uniform 一律由 renderTokens.rawColor() 从 E4 token 取色；
 *         - 天穹多 stop 渐变 = 单 token 基色(cyan-dim) + GLSL 内标量亮度调制（标量系数允许）；
 *         - skill 原字面 tints（光污染暖橙 / 月亮冷白 / 黄道光）改走 token uniform。
 * 渲染约定（B10 纪律）：depthWrite:false / depthTest:false / renderOrder 控制前后，
 *   dome 为不透明背景最先画，银河带 additive 叠加于其上、星点（RENDER_ORDER.stars=8）在最前。
 */
import * as THREE from 'three';
import { rawColor } from './renderTokens';

/* ---------- 天穹 Shader（多 stop 渐变 + 地平线辉光 + 光污染 + 月亮环境辉光） ---------- */
const SKY_DOME_VERT = `
varying vec3 vWorldDir;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldDir = wp.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const SKY_DOME_FRAG = `
precision highp float;
varying vec3 vWorldDir;
uniform vec3 uBase;        // 天穹基色（cyan-dim）
uniform vec3 uGlow;        // 地平线辉光（cyan-glow）
uniform vec3 uPollution;   // 光污染暖橙（accent-warm）
uniform vec3 uMoon;        // 月亮环境辉光冷白（text-bright）
uniform float uGlowStrength;
uniform float uLightPollution;
uniform vec3 uMoonPos;
uniform float uMoonGlowStr;
uniform float uGlobalFade; // D4：intro 期 0→1，天穹随全局淡入
void main() {
  vec3 dir = normalize(vWorldDir);
  float elevation = dir.y; // -1 地平线(下) ~ +1 天顶

  // 多 stop 渐变：单 token 基色 × 标量亮度（顶暗→中亮→地平微亮）
  vec3 base = uBase;
  float zenithLum = 0.20;                       // 天顶最深
  float midLum = 0.45;
  float horizonLum = 0.30;
  vec3 sky;
  if (elevation > 0.3) {
    sky = base * mix(midLum, zenithLum, (elevation - 0.3) / 0.7);
  } else if (elevation > 0.0) {
    sky = base * mix(horizonLum, midLum, elevation / 0.3);
  } else {
    sky = base * horizonLum; // 地平线以下保持暗基
  }

  // 地平线辉光带
  float horizonBand = exp(-abs(elevation) * 8.0) * uGlowStrength;
  sky += uGlow * horizonBand;

  // 光污染（暖橙，仅低空）
  float pollution = exp(-abs(elevation) * 4.0) * uLightPollution;
  sky += uPollution * pollution * 0.45;

  // 月亮环境辉光（主晕 + 宽晕）
  float moonAngle = max(dot(dir, normalize(uMoonPos)), 0.0);
  float moonHalo = pow(moonAngle, 16.0) * uMoonGlowStr;
  float moonWideGlow = pow(moonAngle, 3.0) * uMoonGlowStr * 0.15;
  sky += uMoon * (moonHalo + moonWideGlow);

  sky *= uGlobalFade;
  gl_FragColor = vec4(sky, 1.0);
}
`;

/* ---------- 银河带 Shader（FBM 结构 + 尘埃带 + 核增亮） ---------- */
const MILKY_WAY_VERT = `
varying vec3 vWorldDir;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldDir = wp.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const MILKY_WAY_FRAG = `
precision highp float;
varying vec3 vWorldDir;
uniform float uBrightness;
uniform float uBandWidth;
uniform float uBandTilt;
uniform float uCoreGlow;
uniform float uDustLanes;
uniform vec3 uWarm;   // 核侧暖（accent-warm）
uniform vec3 uCool;   // 边缘冷（cyan-core）
uniform float uTime;
uniform float uGlobalFade; // D4：intro 淡入

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
             mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
}
float fbm(vec2 p, int oct) {
  float sum = 0.0, amp = 1.0, maxA = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    sum += noise(p) * amp; maxA += amp;
    amp *= 0.5; p *= 2.1;
  }
  return sum / maxA;
}
void main() {
  vec3 dir = normalize(vWorldDir);
  float galLat = dir.y * cos(uBandTilt) - dir.z * sin(uBandTilt);
  float galLon = atan(dir.x, dir.z * cos(uBandTilt) + dir.y * sin(uBandTilt));

  float band = exp(-galLat * galLat / (uBandWidth * uBandWidth));
  vec2 uv = vec2(galLon * 2.0, galLat * 8.0);
  float structure = fbm(uv * 3.0, 5);
  structure = structure * 0.7 + 0.3;
  float dust = fbm(uv * 4.0 + 1.7, 4);
  dust = smoothstep(0.35, 0.55, dust) * uDustLanes;
  float core = exp(-galLon * galLon * 2.0) * uCoreGlow;

  float mw = band * structure * (1.0 - dust) + core * band;
  mw *= uBrightness;

  vec3 col = mix(uCool, uWarm, core * 2.0 + 0.3);
  col *= mw;

  float starNoise = noise(uv * 80.0);
  starNoise = pow(starNoise, 8.0) * band * 0.3;
  col += uCool * starNoise; // 微亮散点（cool token，避免字面白）

  col *= uGlobalFade;
  gl_FragColor = vec4(col, 1.0);
}
`;

export interface SkyDome {
  /** 加入 scene 的对象（dome + milky way） */
  dome: THREE.Mesh;
  milkyWay: THREE.Mesh;
  /** 刷新月亮方向（归一化世界方向）+ 光晕强度（0 = 关，月升出地平线用） */
  setMoon(dir: THREE.Vector3, glowStr: number): void;
  dispose(): void;
}

/**
 * @param scene     目标场景
 * @param domeR     天穹半径（> 星点 R，建议 R*1.05）
 * @param shared    共享 uniform（复用 uTime / uGlobalFade，与星点/城市同钟）
 */
export function createSkyDome(scene: THREE.Scene, domeR: number, shared: { uTime: { value: number }; uGlobalFade: { value: number } }): SkyDome {
  /* ---- 天穹（不透明背景；最先画） ---- */
  const domeGeo = new THREE.SphereGeometry(domeR, 48, 24);
  const domeMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    transparent: false,
    uniforms: {
      uBase: { value: rawColor('uColorDim') },
      uGlow: { value: rawColor('uColorGlow') },
      uPollution: { value: rawColor('uColorWarm') },
      uMoon: { value: rawColor('uColorWhite') },
      uGlowStrength: { value: 0.6 },
      uLightPollution: { value: 0.25 },
      uMoonPos: { value: new THREE.Vector3(0, 1, 0) }, // 默认天顶（无月时朝上，无影响）
      uMoonGlowStr: { value: 0.0 },
      uGlobalFade: shared.uGlobalFade,
    },
    vertexShader: SKY_DOME_VERT,
    fragmentShader: SKY_DOME_FRAG,
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.renderOrder = -3;
  dome.frustumCulled = false;
  scene.add(dome);

  /* ---- 银河带（additive，叠加于天穹、位于星点之下） ---- */
  const mwGeo = new THREE.SphereGeometry(domeR - 30, 64, 32);
  const mwMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    depthTest: false,
    transparent: true,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uBrightness: { value: 0.5 },
      uBandWidth: { value: 0.42 },
      uBandTilt: { value: 0.55 },
      uCoreGlow: { value: 0.35 },
      uDustLanes: { value: 0.5 },
      uWarm: { value: rawColor('uColorWarm') },
      uCool: { value: rawColor('uColorCore') },
      uTime: shared.uTime,
      uGlobalFade: shared.uGlobalFade,
    },
    vertexShader: MILKY_WAY_VERT,
    fragmentShader: MILKY_WAY_FRAG,
  });
  const milkyWay = new THREE.Mesh(mwGeo, mwMat);
  milkyWay.renderOrder = -2;
  milkyWay.frustumCulled = false;
  scene.add(milkyWay);

  return {
    dome,
    milkyWay,
    setMoon(dir, glowStr) {
      (domeMat.uniforms.uMoonPos.value as THREE.Vector3).copy(dir);
      (domeMat.uniforms.uMoonGlowStr as { value: number }).value = glowStr;
    },
    dispose() {
      domeGeo.dispose();
      domeMat.dispose();
      mwGeo.dispose();
      mwMat.dispose();
    },
  };
}
