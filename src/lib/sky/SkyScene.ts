/**
 * @file SkyScene — Three.js 星空+城市整合场景（集成层函数式终版）
 *
 * 集成说明：主仓原为 class 版（714 行，new SkyScene(container, opts)）。
 * E3 第三轮交付 P1-P8 为「接线补丁」，其假定的函数式骨架（renderer/scene/camera、
 * gridSegs/horizonSegs、视差阻尼、星座标签、月相、人物、模块时空状态）未在任何轮次完整交付。
 * 本文件按集成启动书「实际输出修正」纪律组装：
 *   - E3 模块：renderTokens / materials/glowLine / materials/glowPoint / starField /
 *     sceneCore / perf/sampler / starShader（E1 GLSL）/ selftest（R-E3-2）
 *   - 既有领域迁移（class 版原文）：相机构图、星座标签（Canvas 色值保留以稳定基线）、
 *     月相（computeMoon + moonTextures）、线框人物（呼吸/脚光）、fog
 *   - 集成层新增（明确标注）：gridSegs/horizonSegs 数据生成（E3 P5 假定「既有数据源」）、
 *     视差阻尼（E3 P8 假定「既有」，class 版无）、setTimeLocation 时空重建、
 *     dispose 增强、城市加载走 cityAdapter（E2 CityBatch → E3 CityPayload 格式适配）
 * 坐标系：+X 东、+Y 天顶、+Z 北；天球 R=500；地面 y=0；1 unit = 10m
 */
import * as THREE from 'three';
import { toJulianDay, localSiderealTime, precessionMatrix, applyPrecession, radecToAltAz, altAzToVec3, DEG } from './astro';
import { STAR_COUNT, STAR_DATA } from './stars.data';
import { CONSTELLATION_SEGMENTS } from './constellations.data';
import { computeMoon, makeMoonTextures } from './moon';
import {
  createSharedUniforms, detectTier, isWebGL2Available, managedColor, aliasAlpha,
  TIER, RENDER_ORDER, DUST_MAX,
  type QualityTier,
} from './renderTokens';
import {
  makeGlowLineMaterial, buildGlowLineGeometry, applySegDrawRange, updateGlowLineSegment,
  countSegments, type GlowSeg,
} from './materials/glowLine';
import {
  makeSimplePointsMaterial, makeStarPoints, buildPointsGeometry, buildDustSpec, bakeRadialSprite, mergePointSpecs,
} from './materials/glowPoint';
import { createSceneCore, buildCityKit, type SceneCoreApi } from './sceneCore';
import { createRecomputeTask, type RecomputeTask } from './starField';
import { STAR_GLSL } from './starShader';
import { buildLandmarkPayload, loadTilePayload } from '../geo/geoEngine';
import { constInfoOf } from './constellationInfo';
import type { CityPayload } from './sceneCore';

const R = 500;
const D2R = Math.PI / 180;

/* ---- 模块级时空状态（E3 P7/P8 假定；初始默认济南 + 当前时刻，SkyPage 加载后经 setTimeLocation 覆盖） ---- */
let curDate = new Date();
let curLat = 36.65;
let curLon = 117.12;

/* ---- 集成层新增：地面网格数据（E3 P5 假定「既有 gridSegs/horizonSegs」，主仓无模块级数据；
 *       按 E3 注释「网格 z 域 [-70, +HALF] 避开相机平面」将 class 版 GridHelper(640,64)
 *       与地平线辉光带（PlaneGeometry(900,160)@y=30,z=230）线框化） ---- */
function buildGridSegs(): Float32Array {
  const segs: number[] = [];
  for (let z = -70; z <= 320; z += 10) segs.push(-320, 0, z, 320, 0, z);
  for (let x = -320; x <= 320; x += 10) segs.push(x, 0, -70, x, 0, 320);
  return new Float32Array(segs);
}
function buildHorizonSegs(): Float32Array {
  const segs: number[] = [];
  for (const y of [24, 28, 30, 32, 36]) segs.push(-450, y, 230, 450, y, 230);
  return new Float32Array(segs);
}
const gridSegs = buildGridSegs();
const horizonSegs = buildHorizonSegs();

/* ---- 星座悬停回调通道（集成层补：class 版 onConstellationHover 既有功能，
 *      E3 函数式未交付；SkyPage 经此注册，信息卡依赖） ---- */
let hoverCb: ((name: string | null) => void) | null = null;
export function setConstellationHoverHandler(cb: ((name: string | null) => void) | null): void {
  hoverCb = cb;
}

/** 集成层扩展 API（E3 SceneCoreApi + 页面对接面） */
export interface SkySceneApi extends SceneCoreApi {
  getScreenPosition(v: THREE.Vector3): { x: number; y: number; front: boolean };
  cameraApi: { parallax(dx: number, dy: number): void };
  setTimeLocation(date: Date, geo: { lat: number; lon: number }): void;
}

export function createSkyScene(canvas: HTMLCanvasElement): SkySceneApi | null {
  /* PATCH-4：R-E3-2 验收自测（?selftest 动态加载，独立 chunk 不进主包） */
  if (new URLSearchParams(location.search).has('selftest')) { // 注意：?selftest 无值形态 get() 返回 ''（falsy），必须用 has()
    import('./selftest').then((m) => m.runTokenSelftest()).catch((e) => console.error('[selftest] 加载失败', e));
  }
  if (!isWebGL2Available()) { // G5：CSS 静态降级由 SkyPage 处理
    document.getElementById('sky-boot')?.remove();
    return null;
  }

  let tier: QualityTier = detectTier();
  const shared = createSharedUniforms(Math.min(window.devicePixelRatio || 1, TIER[tier].dprCap));

  /* 渲染器 / 场景 / 相机（既有 class constructor 迁移；canvas 由 SkyPage 创建传入） */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setClearColor(managedColor(), 1);   // B12：clearColor 走 managed 通道
  renderer.setPixelRatio(shared.uDpr.value);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x020204, 0.0016); // 既有（class 版；自定义 shader 均 fog:false 不受影响）
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 2000);
  // P1b：俯瞰构图看向南方（象山/四兽山方向）——城市在前、山脊在后（jinan-v2 基准）
  camera.position.set(0, 58, 200);
  camera.lookAt(0, 20, -160);

  const sprite = bakeRadialSprite();
  const moonTextures = makeMoonTextures();
  const dotTex = sprite; // 人物/标签共用点纹理（既有）

  /* ===== 星座标签（既有 class buildConstellationLabels 迁移；Canvas 色值保留以稳定基线） ===== */
  const constellLabels: { sprite: THREE.Sprite; dir: THREE.Vector3 }[] = [];
  const CONS: [string, number, number][] = [
    ['Ursa Major', 11.0, 50], ['Ursa Minor', 15.0, 75], ['Cassiopeia', 1.0, 60],
    ['Orion', 5.5, 0], ['Taurus', 4.5, 18], ['Gemini', 7.0, 25],
    ['Leo', 10.5, 15], ['Virgo', 13.3, 0], ['Scorpius', 16.8, -30],
    ['Sagittarius', 19.0, -25], ['Lyra', 18.7, 38.8], ['Aquila', 19.7, 8.7],
    ['Pegasus', 23.0, 20], ['Andromeda', 0.8, 35],
  ];
  function buildConstellationLabels() {
    const jd = toJulianDay(curDate.getTime());
    const lst = localSiderealTime(jd, curLon);
    const latRad = curLat * DEG;
    for (const [name, raH, decD] of CONS) {
      const aa = radecToAltAz(raH * 15 * DEG, decD * DEG, lst, latRad);
      if (aa.alt < -2 * DEG) continue;
      const v = altAzToVec3(aa.alt, aa.az, R); // 与星点/星座线同坐标系（+X 东/+Y 天顶/+Z 北）
      const zh = constInfoOf(name)?.zh ?? name;
      const c = document.createElement('canvas');
      c.width = 820; c.height = 116;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = 'rgba(120,230,255,0.95)';
      ctx.shadowColor = 'rgba(0,200,255,0.9)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(34, 58); ctx.lineTo(46, 46); ctx.lineTo(58, 58); ctx.lineTo(46, 70); ctx.closePath();
      ctx.fill();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '600 50px "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif';
      ctx.shadowBlur = 16;
      ctx.fillStyle = 'rgba(196,240,255,0.94)';
      ctx.fillText(zh, 84, 56);
      ctx.font = '400 22px "Courier New", monospace';
      ctx.shadowBlur = 8;
      ctx.fillStyle = 'rgba(143,232,255,0.8)';
      ctx.fillText(name.toUpperCase().replace(/ /g, ''), 84 + 50 * Math.max(2, zh.length), 62);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.92, depthWrite: false, depthTest: false, fog: false });
      const sp = new THREE.Sprite(mat);
      sp.position.set(v.x, v.y, v.z);
      sp.scale.set(168, 24, 1);
      sp.renderOrder = 999;
      sp.userData.name = name;
      scene.add(sp);
      constellLabels.push({ sprite: sp, dir: new THREE.Vector3(v.x, v.y, v.z).normalize() });
    }
  }
  /** 集成层补：时空切换后标签随天球旋转重建（class 版 updateSpatioTemporal 语义） */
  function rebuildConstellationLabels() {
    for (const l of constellLabels) { scene.remove(l.sprite); l.sprite.material.dispose(); (l.sprite.material as THREE.SpriteMaterial).map?.dispose(); }
    constellLabels.length = 0;
    buildConstellationLabels();
  }
  /** 标签屏幕空间钳制投影 + 防重叠松弛（既有 class updateConstellationLabels 迁移） */
  function updateConstellationLabels() {
    if (!constellLabels.length) return;
    const f = 1 / Math.tan((camera.fov * DEG) / 2);
    const aspect = camera.aspect || 1;
    const depth = 430;
    const X_LEFT = -0.66, X_RIGHT = 0.8, Y_TOP = 0.7, Y_BOT = -0.9;
    const clampX = (x: number) => Math.max(X_LEFT, Math.min(X_RIGHT, x));
    const v = new THREE.Vector3();
    const tg = constellLabels.map(({ sprite, dir }) => {
      v.copy(dir).multiplyScalar(R).applyMatrix4(camera.matrixWorldInverse);
      const zc = Math.max(-v.z, 0.5);
      let nx = (v.x / zc) * f / aspect;
      let ny = (v.y / zc) * f;
      nx = clampX(nx);
      ny = Math.max(Y_BOT, Math.min(Y_TOP, ny));
      return { sprite, nx, ny };
    });
    const halfW = (0.5 * 96 * f) / (aspect * depth) * 1.05;
    const halfH = (0.5 * 18 * f) / depth * 1.6;
    for (let pass = 0; pass < 8; pass++) {
      for (let i = 0; i < tg.length; i++) {
        for (let j = i + 1; j < tg.length; j++) {
          const a = tg[i], b = tg[j];
          const dx = b.nx - a.nx, dy = b.ny - a.ny;
          const ox = halfW * 2 - Math.abs(dx);
          const oy = halfH * 2 - Math.abs(dy);
          if (ox > 0 && oy > 0) {
            if (oy <= ox) { const s = (oy / 2 + 0.004) * (dy >= 0 ? 1 : -1); a.ny -= s; b.ny += s; }
            else { const s = (ox / 2 + 0.004) * (dx >= 0 ? 1 : -1); a.nx -= s; b.nx += s; }
          }
        }
      }
      tg.forEach((t) => { t.nx = clampX(t.nx); t.ny = Math.max(Y_BOT, Math.min(Y_TOP, t.ny)); });
    }
    for (const t of tg) {
      v.set(t.nx * aspect * depth / f, t.ny * depth / f, -depth).applyMatrix4(camera.matrixWorld);
      t.sprite.position.copy(v);
    }
  }

  /* ===== 月相（既有 class buildMoon 迁移；setTimeLocation 时重建） ===== */
  let moonSprite: THREE.Sprite | undefined;
  function buildMoon() {
    const jd = toJulianDay(curDate.getTime());
    const lst = localSiderealTime(jd, curLon);
    const moon = computeMoon(jd, lst, curLat * DEG, R);
    if (moon.alt < 0) return;
    const mat = new THREE.SpriteMaterial({
      map: moonTextures[moon.slot],
      transparent: true, depthWrite: false, depthTest: false,
      blending: THREE.AdditiveBlending, fog: false,
    });
    moonSprite = new THREE.Sprite(mat);
    moonSprite.position.set(moon.vec.x, moon.vec.y, moon.vec.z);
    moonSprite.scale.set(26, 26, 1); // P1b：12→26 对齐基准弯月视觉权重
    scene.add(moonSprite);
  }
  function rebuildMoon() {
    if (moonSprite) { scene.remove(moonSprite); moonSprite.material.dispose(); moonSprite = undefined; }
    buildMoon();
  }

  /* ===== D1-A · 观测者粒子剪影（P1；替代旧火柴人；半透明青色粒子填充 + 边缘辉光线） ===== */
  let silLine: THREE.LineLoop | undefined;
  let silPts: THREE.Points | undefined;
  const SIL_BASE_OP = 1.0, SIL_PTS_BASE = 0.5; // P1b：剪影提亮（0.8/0.16→1.0/0.5）对齐基准发光人形
  function buildSilhouette() {
    // 正面站姿剪影轮廓（units，人高 ≈9.3；原点在脚底；面朝 +Z 星空）
    const P: [number, number][] = [];
    const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n: number) => {
      for (let i = 0; i <= n; i++) {
        const a = a0 + ((a1 - a0) * i) / n;
        P.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
      }
    };
    // 头（左侧 180°→右侧 180°）
    arc(0, 8.85, 0.52, Math.PI, 0, 8);
    // 右半身（肩→肘→手→髋→腿→踝→脚）
    P.push([1.5, 7.55], [1.85, 6.15], [1.68, 4.75], [1.12, 5.12], [0.86, 2.75], [0.92, 0.32], [1.32, 0.16]);
    // 脚底
    P.push([1.32, 0.1], [-1.32, 0.1]);
    // 左半身（踝→腿→髋→手→肘→肩）
    P.push([-0.92, 0.32], [-0.86, 2.75], [-1.12, 5.12], [-1.68, 4.75], [-1.85, 6.15], [-1.5, 7.55]);

    // 边缘辉光线（闭合轮廓）
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(P.flatMap(([x, y]) => [x, y, 0]), 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf2fbff, transparent: true, opacity: SIL_BASE_OP,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    silLine = new THREE.LineLoop(lineGeo, lineMat);
    silLine.frustumCulled = false;
    silLine.renderOrder = RENDER_ORDER.avatar;

    // 内部粒子填充（ray-cast 点在多边形内采样，青色半透明呼吸）
    const xs: number[] = [];
    let guard = 0;
    while (xs.length < 210 && guard++ < 6000) {
      const x = (Math.random() - 0.5) * 5.0;
      const y = 0.2 + Math.random() * 9.2;
      // 点在多边形内（射线法，忽略 y）
      let inside = false;
      for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
        const [xi, yi] = P[i], [xj, yj] = P[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) xs.push(x, y, 0);
    }
    const ptsGeo = new THREE.BufferGeometry();
    ptsGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(xs), 3));
    const ptsMat = new THREE.PointsMaterial({
      color: 0xf2fbff, size: 1.0, map: dotTex, transparent: true, opacity: SIL_PTS_BASE * 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    silPts = new THREE.Points(ptsGeo, ptsMat);
    silPts.frustumCulled = false;
    silPts.renderOrder = RENDER_ORDER.avatar + 1;

    const group = new THREE.Group();
    group.position.set(0, 0, 50); // 前景观测位（P1b：前移避塔身，面向南方星空）
    group.scale.setScalar(4.0); // P1b：对齐 jinan-v2 中央发光人形
    // P1b：径向光晕（基准"发光人形"质感；暖白低透明度大光斑）
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: dotTex, color: 0xbfe9ff, transparent: true, opacity: 0.22,
      blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
    }));
    halo.scale.set(42, 58, 1);
    halo.position.set(0, 17, -2);
    halo.renderOrder = RENDER_ORDER.avatar - 1;
    group.add(halo, silLine, silPts);
    scene.add(group);
  }

  /* ===== 渐进式首屏时间线（P1 契约：0/300 背景粒子 → 800 星空轮廓 → 1500 山河 → 3000 地标稳定） =====
   * 背景/粒子/星空由 sceneCore intro（uGlobalFade 500ms）与星点入场覆盖 0-800ms 段；
   * 本表管理其余分层：人物 800ms、山河(lines/water/roads) 1500ms、地标(landmarks/points) 3000ms。 */
  const progStages: { mat: THREE.ShaderMaterial | THREE.Material; base: number; t0: number; dur: number; mode: 'uniform' | 'prop' }[] = [];
  let sceneT0 = -1; // 渐进时间线起点（首个渲染帧）
  function registerProgressive(obj: { material: THREE.Material | THREE.Material[] }, t0: number, dur = 800) {
    const ms = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const m of ms) {
      const sh = m as THREE.ShaderMaterial;
      if (sh.uniforms?.uOpacity) {
        progStages.push({ mat: m, base: sh.uniforms.uOpacity.value as number, t0, dur, mode: 'uniform' });
      } else {
        progStages.push({ mat: m, base: (m as THREE.LineBasicMaterial).opacity, t0, dur, mode: 'prop' });
      }
    }
  }
  const progMul = (t0: number, dur: number, el: number) => Math.min(1, Math.max(0, (el - t0) / dur));

  /* ===== P2 · 星点（E1 GLSL 注入） ===== */
  const stars = makeStarPoints(shared, tier, STAR_GLSL, STAR_DATA);
  stars.renderOrder = RENDER_ORDER.stars;
  scene.add(stars);

  /* ===== P3 · 星座线（D2/D3；段优先级降序契约由 E1 constellationQuality 保证） ===== */
  const constGeo = buildGlowLineGeometry(
    CONSTELLATION_SEGMENTS.map(() => ({ pts: new Float32Array(6), layer: 1 })));
  const constellation = new THREE.Mesh(constGeo, makeGlowLineMaterial(shared, {
    core: 'uColorConstellation', opacity: aliasAlpha('uColorConstellation'), // 0.40（D2，token alpha 携带）
  }));
  constellation.renderOrder = RENDER_ORDER.constellation;
  constellation.frustumCulled = false;
  scene.add(constellation);

  /* ===== P4 · 城市五对象（材质持久）+ 尘埃（替换既有 320 尘埃实现，G8） ===== */
  const cityKit = buildCityKit(shared, sprite);
  scene.add(cityKit.lines, cityKit.points, cityKit.water, cityKit.roads, cityKit.landmarks, cityKit.terrain, cityKit.vegetation);
  const dust = new THREE.Points(buildPointsGeometry(mergePointSpecs([buildDustSpec(DUST_MAX)])),
    makeSimplePointsMaterial(shared, sprite, { base: 'uColorDim', twinkleAmp: TIER[tier].twinkleAmp }));
  dust.renderOrder = RENDER_ORDER.dust;
  dust.frustumCulled = false;
  scene.add(dust);

  /* ===== P5 · 地面合并（2→1 batch；B13：z 向线段不跨相机平面，相机 z=-95） ===== */
  const ground = new THREE.Mesh(
    buildGlowLineGeometry([{ pts: gridSegs, layer: 0.32 }, { pts: horizonSegs, layer: 0.9 }]),
    makeGlowLineMaterial(shared, { core: 'uColorDim' }),
  );
  ground.renderOrder = RENDER_ORDER.ground;
  ground.frustumCulled = false;
  scene.add(ground);

  /* ===== 既有领域装配（标签/月相/剪影；构造期即当前时空） ===== */
  buildConstellationLabels();
  buildMoon();
  buildSilhouette();
  // 渐进时序注册（地标最后稳定；剪影单独驱动呼吸不在此列）
  registerProgressive(cityKit.terrain, 1500);
  registerProgressive(cityKit.water, 1500);
  registerProgressive(cityKit.roads, 1500);
  registerProgressive(cityKit.lines, 1500);
  registerProgressive(cityKit.landmarks, 3000);
  registerProgressive(cityKit.points, 3000);

  /* 构造期一次性全量填充星点/星座线（E3 P3 注释要求；避免首帧空几何） */
  function fillInitialPositions() {
    const jd = toJulianDay(curDate.getTime());
    const lst = localSiderealTime(jd, curLon);
    const pm = precessionMatrix(jd), lat = curLat;
    const prec = new Float32Array(STAR_DATA); // 岁差副本（主仓 applyPrecession 就地 4-stride，不修改共享常量）
    applyPrecession(prec, pm);
    const starPos = stars.geometry.getAttribute('position') as THREE.BufferAttribute;
    const starArr = starPos.array as Float32Array;
    for (let i = 0; i < STAR_COUNT; i++) {
      const { alt, az } = radecToAltAz(prec[i * 4], prec[i * 4 + 1], lst, lat);
      const v = altAzToVec3(alt, az, R);
      starArr[i * 3] = v.x; starArr[i * 3 + 1] = v.y; starArr[i * 3 + 2] = v.z;
    }
    starPos.needsUpdate = true;
    const constPos = constGeo.getAttribute('position') as THREE.BufferAttribute;
    const constOth = constGeo.getAttribute('aOther') as THREE.BufferAttribute;
    for (let i = 0; i < CONSTELLATION_SEGMENTS.length; i++) {
      const s = CONSTELLATION_SEGMENTS[i];
      const a = radecToAltAz(s[0] * D2R, s[1] * D2R, lst, lat);
      const b = radecToAltAz(s[2] * D2R, s[3] * D2R, lst, lat);
      updateGlowLineSegment(constGeo, i, altAzToVec3(a.alt, a.az, R), altAzToVec3(b.alt, b.az, R));
    }
    constPos.needsUpdate = true; constOth.needsUpdate = true;
  }
  fillInitialPositions();

  /* ===== 星座悬停拾取（既有 class onMove 迁移；标签 raycaster 拾取 → hoverCb） ===== */
  const raycaster = new THREE.Raycaster();
  const mouseNDC = new THREE.Vector2();
  let hoveredName: string | undefined;
  let lastMX = -9999, lastMY = -9999;
  const onMove = (e: MouseEvent) => {
    if (Math.abs(e.clientX - lastMX) < 1 && Math.abs(e.clientY - lastMY) < 1) return;
    lastMX = e.clientX; lastMY = e.clientY;
    const rect = canvas.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouseNDC, camera);
    const hits = raycaster.intersectObjects(constellLabels.map((l) => l.sprite), false);
    const name = hits.length ? (hits[0].object.userData.name as string) : null;
    if (name !== hoveredName) { hoveredName = name ?? undefined; hoverCb?.(name); }
  };
  canvas.addEventListener('mousemove', onMove);

  /* ===== onResize（既有 class resize 迁移 + uResolution 同步） ===== */
  function onResize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    updateConstellationLabels();
  }
  window.addEventListener('resize', onResize);
  onResize(); // 初始调用（class 版 constructor 语义；漏掉则 setSize 永不执行，缓冲 300×150）

  /* ===== P6 · 降级重挂（G7 目标函数；含 PATCH-2 uFlickerAmp 同步） ===== */
  function applyTier() {
    const p = TIER[tier];
    shared.uDpr.value = Math.min(window.devicePixelRatio || 1, p.dprCap);
    renderer.setPixelRatio(shared.uDpr.value);
    (stars.material as THREE.ShaderMaterial).uniforms.uMagLimit.value = p.uMagLimit;
    (stars.material as THREE.ShaderMaterial).uniforms.uDiffractionMax.value = p.diffractionMax;
    (stars.material as THREE.ShaderMaterial).uniforms.uFlickerAmp.value = p.twinkleAmp; // I5：Governor 降档同步（low → 0 关闪烁）
    applySegDrawRange(constGeo, CONSTELLATION_SEGMENTS.length, p.constellationSegs / CONSTELLATION_SEGMENTS.length);
    applySegDrawRange(cityKit.lines.geometry, countSegments(lastCityLines), p.cityRatio);
    applySegDrawRange(cityKit.roads.geometry, countSegments(lastCityRoads), p.roadsRatio);
    dust.geometry.setDrawRange(0, Math.floor(DUST_MAX * p.dustRatio));
    (dust.material as THREE.ShaderMaterial).uniforms.uTwinkleAmp.value = p.twinkleAmp;
    onResize(); // DPR 变更触发尺寸重算
  }

  /* ===== P7 · 分片重算（G1；闭包捕获当次时空；岁差采用主仓就地批量语义，副本隔离） ===== */
  function startRecompute(): RecomputeTask {
    const jd = toJulianDay(curDate.getTime()), lst = localSiderealTime(jd, curLon);
    const pm = precessionMatrix(jd), lat = curLat;
    const prec = new Float32Array(STAR_DATA); // 岁差副本（STAR_DATA 为共享常量，就地改会污染）
    applyPrecession(prec, pm);
    const starPos = stars.geometry.getAttribute('position') as THREE.BufferAttribute;
    const starArr = starPos.array as Float32Array;
    const constPos = constGeo.getAttribute('position') as THREE.BufferAttribute;
    const constOth = constGeo.getAttribute('aOther') as THREE.BufferAttribute;
    return createRecomputeTask([
      {
        count: STAR_COUNT,
        run: (i0, i1) => {
          for (let i = i0; i < i1; i++) {
            const { alt, az } = radecToAltAz(prec[i * 4], prec[i * 4 + 1], lst, lat);
            const v = altAzToVec3(alt, az, R); // S-3：取返回值；契约签名 (altRad, azRad, r) → Vector3
            starArr[i * 3] = v.x; starArr[i * 3 + 1] = v.y; starArr[i * 3 + 2] = v.z;
          }
        },
        done: () => { starPos.needsUpdate = true; },
      },
      {
        count: CONSTELLATION_SEGMENTS.length,
        run: (i0, i1) => {
          for (let i = i0; i < i1; i++) { // 星座线不做岁差（v4 契约）
            const s = CONSTELLATION_SEGMENTS[i];
            const a = radecToAltAz(s[0] * D2R, s[1] * D2R, lst, lat);
            const b = radecToAltAz(s[2] * D2R, s[3] * D2R, lst, lat);
            updateGlowLineSegment(constGeo, i, altAzToVec3(a.alt, a.az, R), altAzToVec3(b.alt, b.az, R));
          }
        },
        done: () => { constPos.needsUpdate = true; constOth.needsUpdate = true; },
      },
    ], TIER[tier].starChunks);
  }

  /* ===== 地面管线（P1：真实 Geo Tile → 程序化线稿，CDN 静态零边缘计算） =====
   * 链路：真实 Geo Data(OSM) → 构建期 Geo Tile(米制) → 本地坐标 → Three.js Geometry
   *   - 台北101 周边（≤3.2km）：LOD 三级真实 tile（建筑/道路/水系/象山步道）
   *   - 台北其他位置：内置 14 地标（经纬度版，回退）
   *   - 其他城市：确定性抽象天际线
   * 异步竞态防护：连续 setTimeLocation 时丢弃过期加载结果。 */
  let lastCityLines: GlowSeg[] = [], lastCityRoads: GlowSeg[] = [];
  let geoReq = 0;
  async function loadGeoCity() {
    const req = ++geoReq;
    let payload: CityPayload;
    try {
      const tp = await loadTilePayload(curLat, curLon);
      payload = tp ?? buildLandmarkPayload(curLat, curLon, tier === 'low');
    } catch (e) {
      console.warn('geo tile load fallback', e);
      payload = buildLandmarkPayload(curLat, curLon, tier === 'low');
    }
    if (req !== geoReq) return; // 过期结果丢弃
    lastCityLines = payload.lines;
    lastCityRoads = payload.roads ?? [];
    coreApi.swapCity(payload);
  }

  /* ===== core 装配（P1b：视差阻尼 + 剪影呼吸 + 星座标签更新） ===== */
  let coreApi: SceneCoreApi;
  const parallaxTarget = new THREE.Vector2();
  const parallaxPos = new THREE.Vector2();
  coreApi = createSceneCore({
    canvas, renderer, scene, camera, shared,
    city: cityKit,
    currentTier: () => tier,
    onTierDowngrade: (t) => { tier = t; applyTier(); }, // G7：单向
    startRecompute,
    frameExtras: (now) => {
      const t = now / 1000;
      parallaxPos.lerp(parallaxTarget, 0.08);
      if (parallaxPos.lengthSq() > 1e-6) {
        camera.position.x = parallaxPos.x * 6;
        camera.position.y = 58 + parallaxPos.y * 4;
        camera.lookAt(0, 20, -160);
      }
      if (silPts) (silPts.material as THREE.PointsMaterial).opacity = 0.5 + 0.12 * Math.sin(t * 1.4); // P1b：呼吸基准 0.14→0.5（对齐剪影粒子亮度）
      updateConstellationLabels();
    },
    onContextRestored: () => { coreApi.requestRecompute(); }, // B9：恢复后重算
  });

  /* ===== P8 · 对外 API 与 dispose 组装 ===== */
  applyTier();
  // G1 稳定性：构造期预热 render 一次——shader 编译帧移出 intro 采样窗口
  // （编译帧 ~200ms 会污染 full P95；预热后 intro 采样只含运行时帧，不违背 D5 判据）
  renderer.render(scene, camera);
  return {
    ...coreApi, // start/swapCity/onReady/onStateChange/worldToScreen/captureFrame/perfApi/dispose
    getScreenPosition: coreApi.worldToScreen, // E4 SVG 引出线对接名（R3 任务书措辞）
    cameraApi: {
      parallax: (dx: number, dy: number) => {
        parallaxTarget.set(dx, dy);
        coreApi.noteInteraction();
      },
    },
    setTimeLocation: (date: Date, geo: { lat: number; lon: number }) => {
      curDate = date; curLat = geo.lat; curLon = geo.lon;
      rebuildConstellationLabels(); // 集成层补：标签随天球旋转重建
      rebuildMoon();
      coreApi.requestRecompute();
      loadGeoCity(); // 地标随位置同步重建（无网络，立即生效）
    },
    dispose() {
      coreApi.dispose();
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMove);
      hoverCb = null;
      /* dispose 增强：scene.traverse 全量 geometry/material dispose、
         sprite.dispose()、renderer.dispose()、renderer.forceContextLoss()（iOS 活跃 context 上限） */
      scene.traverse((o) => {
        const anyO = o as unknown as { geometry?: THREE.BufferGeometry; material?: THREE.Material | THREE.Material[] };
        if (anyO.geometry) anyO.geometry.dispose();
        if (anyO.material) (Array.isArray(anyO.material) ? anyO.material : [anyO.material]).forEach((m) => m.dispose());
      });
      sprite.dispose();
      renderer.dispose();
      try { renderer.forceContextLoss(); } catch { /* 部分环境不支持 */ }
    },
  };
}
