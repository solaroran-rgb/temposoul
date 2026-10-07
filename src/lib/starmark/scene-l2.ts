/**
 * scene-l2.ts —— L2 Three.js 交互星空场景（命令式初始化，B3 L2 冻结路线）
 *
 * 【浏览器端模块】本文件 import three，不在 node:test 中导入（测试只测纯函数层）。
 * 场景图：
 *   SkyDome          BackSide 大球（银河渐变）
 *   StarsFar         Points 远景天球（1 draw call）
 *   StarsNear        Points 近场真 3D（穿行视差）
 *   ConstellationLines LineSegments（1 draw call）
 *   BrightStarFlares 最亮 ~20 星辉光
 *
 * 星点 ShaderMaterial：attribute position / aSize / aColor / aTwinkleSeed；
 *   星等→亮度 10^(-0.4*(mag-m0))；闪烁相位以参数哈希为种子（确定性）。
 * React 壳只做 UI；three 命令式初始化，事件上抛 StarSelected/FlyCompleted/QualityChanged。
 * 不引入 react-three-fiber。
 */
import * as THREE from 'three';
import { projectSky, type SkyParams, type ProjectedStar } from './astro-view';
import { brightestStars } from './catalog';
import { getSceneFingerprint } from './fingerprint';
import { canonicalString, type NormalizedSky } from './skyId';
import { detectTier, isWebGL2Available, TIER, type QualityTier } from '../sky/renderTokens';
import { StarPickGrid } from './picking';
import { SCREEN_COORD_TOLERANCE_PX } from './version';

export type L2Event =
  | { type: 'StarSelected'; star: { mag: number; ci: number } }
  | { type: 'FlyCompleted' }
  | { type: 'QualityChanged'; tier: QualityTier };

export interface L2Handle {
  dispose: () => void;
  getFingerprint: () => string;
  setTier: (t: QualityTier) => void;
  pickAt: (cssX: number, cssY: number) => { mag: number } | null;
  /** 当前投影星（供 React 信息卡） */
  projectedStars: ProjectedStar[];
}

export interface L2Options {
  canvas: HTMLCanvasElement;
  params: SkyParams;
  normalized: NormalizedSky;
  onEvent?: (e: L2Event) => void;
  /** 无 WebGL 时回调（外层用同参数 L1 图降级展示） */
  onNoWebGL?: () => void;
}

const VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aTwinkleSeed;
  uniform float uTime;
  uniform float uDpr;
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vColor = aColor;
    float phase = aTwinkleSeed * 6.2831 + uTime;
    vTwinkle = 0.75 + 0.25 * sin(phase);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uDpr * vTwinkle * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG = /* glsl */ `
  varying vec3 vColor;
  varying float vTwinkle;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d) * vTwinkle;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function hashSeed(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return (h >>> 0) / 4294967295; // 0..1
}

export function createL2Scene(opts: L2Options): L2Handle {
  const { canvas, params, normalized, onEvent, onNoWebGL } = opts;

  if (!isWebGL2Available()) {
    onNoWebGL?.();
    return stubHandle(normalized, params);
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(params.fovDeg ?? 60, 1, 0.1, 2000);
  camera.position.set(0, 0, 0);
  camera.lookAt(0, 0, -1);

  // 首帧画质初档探测
  let tier: QualityTier = detectTier();

  // 投影（与 L1 同源）
  const proj = projectSky(params);

  // SkyDome：BackSide 大球渐变
  const domeGeo = new THREE.SphereGeometry(800, 24, 16);
  const domeMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {},
    vertexShader: 'varying vec3 vp; void main(){ vp = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader:
      'varying vec3 vp; void main(){ float t = normalize(vp).y*0.5+0.5; gl_FragColor = vec4(mix(vec3(0.02,0.03,0.08), vec3(0.05,0.10,0.22), t), 1.0); }',
  });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  scene.add(dome);

  // 星点 buffer：position 用单位方向（由 alt/az 反推天球坐标）
  const positions = new Float32Array(proj.stars.length * 3);
  const sizes = new Float32Array(proj.stars.length);
  const colors = new Float32Array(proj.stars.length * 3);
  const seeds = new Float32Array(proj.stars.length);
  proj.stars.forEach((s, i) => {
    // alt/az -> 天球笛卡尔（与 astro-view 同系：+X东 +Y天顶 +Z北）
    const ca = Math.cos(s.alt);
    positions[i * 3] = ca * Math.sin(s.az) * 500; // x 东
    positions[i * 3 + 1] = Math.sin(s.alt) * 500; // y 天顶
    positions[i * 3 + 2] = ca * Math.cos(s.az) * 500; // z 北
    const flux = Math.pow(10, -0.4 * (s.mag - params.magLimit));
    sizes[i] = 1.5 + 4.0 * flux;
    const warm = THREE.MathUtils.clamp((s.ci + 0.3) / 2.1, 0, 1);
    colors[i * 3] = 0.6 + 0.4 * warm;
    colors[i * 3 + 1] = 0.7 + 0.2 * (1 - Math.abs(warm - 0.5));
    colors[i * 3 + 2] = 1.0 - 0.4 * warm;
    seeds[i] = hashSeed(canonicalString(normalized) + ':' + i);
  });

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  starGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  starGeo.setAttribute('aTwinkleSeed', new THREE.BufferAttribute(seeds, 1));
  const starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uDpr: { value: dpr } },
    vertexShader: VERT,
    fragmentShader: FRAG,
  });
  const starsFar = new THREE.Points(starGeo, starMat);
  scene.add(starsFar);

  // StarsNear：近场真 3D（P0 复用同几何、相机近裁剪穿行视差；P1 再做分层 LOD）
  const starsNear = new THREE.Points(starGeo, starMat);
  scene.add(starsNear);

  // ConstellationLines：1 draw call
  const linePts: number[] = [];
  for (const s of proj.segments) {
    if (!s.visible) continue;
    // 屏幕线 -> 这里直接用天球线段端点近似（P0 简化：取投影对应 alt/az）
    linePts.push(s.x1, s.y1, 0, s.x2, s.y2, 0);
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePts), 3));
  const lines = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({ color: 0x78b4ff, transparent: true, opacity: 0.3 }),
  );
  scene.add(lines);

  // BrightStarFlares：最亮 ~20
  const bright = brightestStars(20);
  void bright; // P1 接 sprite；P0 由 aSize 自然放大最亮星

  // 拾取网格（屏幕空间）
  const grid = new StarPickGrid(proj.stars, params.width, params.height);

  // fps 监测：连续 2s <25 单向降档
  let raf = 0;
  let last = performance.now();
  let frames = 0;
  let windowStart = last;
  function loop(now: number) {
    raf = requestAnimationFrame(loop);
    const dt = now - last;
    last = now;
    frames++;
    if (now - windowStart >= 2000) {
      const fps = frames * 1000 / (now - windowStart);
      frames = 0;
      windowStart = now;
      if (fps < 25 && tier !== 'low') {
        tier = tier === 'high' ? 'mid' : 'low';
        renderer.setPixelRatio(Math.min(dpr, TIER[tier].dprCap));
        onEvent?.({ type: 'QualityChanged', tier });
      }
    }
    starMat.uniforms.uTime.value = now / 1000;
    renderer.render(scene, camera);
    void dt;
  }
  raf = requestAnimationFrame(loop);

  return {
    projectedStars: proj.stars,
    getFingerprint: () => getSceneFingerprint({ urlParams: canonicalString(normalized) }),
    setTier(t) {
      tier = t;
      renderer.setPixelRatio(Math.min(dpr, TIER[t].dprCap));
    },
    pickAt(cssX, cssY) {
      const hit = grid.pick(cssX, cssY, SCREEN_COORD_TOLERANCE_PX * 4);
      if (hit) onEvent?.({ type: 'StarSelected', star: { mag: hit.mag, ci: hit.ci } });
      return hit ? { mag: hit.mag } : null;
    },
    dispose() {
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose());
      });
      renderer.dispose();
    },
  };
}

/** 无 WebGL 降级桩（外层展示同参数 L1 图） */
function stubHandle(normalized: NormalizedSky, params: SkyParams): L2Handle {
  return {
    projectedStars: [],
    getFingerprint: () => getSceneFingerprint({ urlParams: canonicalString(normalized) }),
    setTier: () => undefined,
    pickAt: () => null,
    dispose: () => undefined,
  };
  void params;
}
