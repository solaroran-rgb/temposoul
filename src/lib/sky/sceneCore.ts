/**
 * sceneCore.ts —— 渲染循环 / 状态机 / 城市过渡 / 降级治理 / 上下文生命周期 / 对外 API
 * （B5/B6/B9/B11 与 G2-G7 的落地；终版）
 * SkyScene.ts 保留既有领域：相机/视差/标签/月相/人物（经 frameExtras 每帧注入）。
 * 状态机：intro（首帧即终态，uGlobalFade 0→1，D4）→ ambient（节流 24/24/20）→ idle（停渲染，事件唤醒）。
 * D5 采样：intro 与交互热度窗口（hotUntil）内为 full 态（P95 判据）；其余 ambient 态（尖峰判据）。
 */
import * as THREE from "three";
import { PERF_BUDGET, TIER, RENDER_ORDER, CITY_OPACITY, LANDMARK_LINE, DISTANCE_FADE,
         type QualityTier, type SharedUniforms } from "./renderTokens";
import { buildGlowLineGeometry, applySegDrawRange, countSegments, makeGlowLineMaterial, type GlowSeg } from "./materials/glowLine";
import { buildPointsGeometry, mergePointSpecs, makeSimplePointsMaterial, type PointPart } from "./materials/glowPoint";
import type { RecomputeTask } from "./starField";
import { mountPerfSampler } from "./perf/sampler";

export interface CityPayload {
  lines: GlowSeg[];          // 全局距心升序（B4 契约）
  points: PointPart[];       // 顶点节点（warm 0）+ 暖橙窗点（warm 1，面积 <0.5%，C4）
  water?: GlowSeg[];
  roads?: GlowSeg[];
  landmarks?: GlowSeg[];
}
export type SceneState = "intro" | "ambient" | "idle";

export interface CityKit {
  lines: THREE.LineSegments; points: THREE.Points;
  water: THREE.LineSegments; roads: THREE.LineSegments; landmarks: THREE.LineSegments;
}

export function buildCityKit(shared: SharedUniforms, sprite: THREE.CanvasTexture): CityKit {
  const mkLine = (o: Parameters<typeof makeGlowLineMaterial>[1], order: number) => {
    const obj = new THREE.Mesh(new THREE.BufferGeometry(), makeGlowLineMaterial(shared, o));
    obj.renderOrder = order;
    obj.frustumCulled = false;
    return obj;
  };
  const fade = { fadeNear: DISTANCE_FADE.near, fadeFar: DISTANCE_FADE.far };
  const points = new THREE.Points(new THREE.BufferGeometry(),
    makeSimplePointsMaterial(shared, sprite, { base: "uColorCore", ...fade }));
  points.renderOrder = RENDER_ORDER.cityPoints;
  points.frustumCulled = false;
  return {
    lines: mkLine({ core: "uColorCore", opacity: CITY_OPACITY.lines, ...fade }, RENDER_ORDER.cityLines),
    water: mkLine({ core: "uColorDim", opacity: CITY_OPACITY.water, ...fade }, RENDER_ORDER.water),
    roads: mkLine({ core: "uColorDim", opacity: CITY_OPACITY.roads, ...fade }, RENDER_ORDER.roads),
    landmarks: mkLine({ core: "uColorCore", opacity: CITY_OPACITY.landmarks,
      coreWidthPx: LANDMARK_LINE.coreWidthPx, glowRadiusPx: LANDMARK_LINE.glowRadiusPx, ...fade }, RENDER_ORDER.landmarks),
    points,
  };
}

export interface SceneCoreDeps {
  canvas: HTMLCanvasElement;
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  shared: SharedUniforms;
  city: CityKit;
  currentTier: () => QualityTier;
  onTierDowngrade: (t: QualityTier) => void;      // SkyScene：重挂 uMagLimit/drawRange/DPR
  startRecompute: () => RecomputeTask;            // 天文脏重算（分片任务，闭包捕获当前时空）
  frameExtras?: (nowMs: number, dtMs: number) => void; // 既有：视差阻尼/标签/月相/呼吸
  onContextRestored?: () => void;
  introMs?: number;
  bootElementId?: string;
}

export interface SceneCoreApi {
  start(initial: CityPayload | null): void;
  swapCity(payload: CityPayload): void;            // dip 过渡（偏差 D-1）
  requestRecompute(): void;
  noteInteraction(): void;
  onReady(cb: () => void): () => void;
  onStateChange(cb: (s: SceneState) => void): () => void;
  worldToScreen(v: THREE.Vector3): { x: number; y: number; front: boolean }; // E4 SVG 引出线（G2）
  captureFrame(cb: (b: Blob | null) => void): void; // G3：与 render 同帧（preserveDrawingBuffer:false）
  getState(): SceneState;
  perfApi: {                                   // ?perf=1 时挂 window.__skySceneApi（G4 门禁消费）
    getState(): SceneState;
    getRenderInfo(): { frame: number; tier: QualityTier };
    reapplyCity(n: number): Promise<void>;      // B8：几何重建/处置压测
    loseAndRestoreContext(): Promise<string>;
    switchCityByName?: (name: string) => Promise<void>; // 集成层注册（真实城市切换）
  };
  dispose(): void;
}

const INTRO_MS = 500, OUT_MS = 220, IN_MS = 260, IDLE_MS = 8000, HOT_MS = 1000;

export function createSceneCore(d: SceneCoreDeps): SceneCoreApi {
  const { canvas, renderer, scene, camera, shared, city: kit } = d;
  const introMs = d.introMs ?? INTRO_MS;
  let state: SceneState = "ambient";
  let started = false, disposed = false;
  let rafId = 0, frameCount = 0, lastFrameMs = 0, lastAmbientMs = 0, lastWakeMs = performance.now();
  let introT0 = -1, hotUntil = 0, markedFull = false;
  let captureCb: ((b: Blob | null) => void) | null = null;
  let recomputeTask: RecomputeTask | null = null;
  let lastPayload: CityPayload | null = null;
  let tr: { phase: "out" | "in"; t0: number } | null = null;   // B11：dip 过渡
  let queued: CityPayload | null = null;
  let bootHandled = false, bootTimer = 0;
  const readyCbs = new Set<() => void>();
  const stateCbs = new Set<(s: SceneState) => void>();
  const sampler = mountPerfSampler();                          // ?perf=1 时非 null

  /* ---- 城市材质基准透明度注册（dip 动画倍率基准） ---- */
  const baseOpacity = new Map<THREE.ShaderMaterial, number>();
  for (const o of [kit.lines, kit.water, kit.roads, kit.landmarks, kit.points]) {
    const m = o.material as THREE.ShaderMaterial;
    baseOpacity.set(m, m.uniforms.uOpacity.value as number);
  }
  const setCityOpacity = (f: number) => {
    for (const [m, base] of baseOpacity) m.uniforms.uOpacity.value = base * f;
  };

  /* ---- 城市挂载（材质持久不 dispose —— G4 黑屏防线；仅换几何） ---- */
  function rebuild(obj: THREE.LineSegments | THREE.Points, geo: THREE.BufferGeometry) {
    obj.geometry.dispose();
    obj.geometry = geo;
  }
  function attachPayload(p: CityPayload) {
    lastPayload = p;
    const t = TIER[d.currentTier()];
    rebuild(kit.lines, buildGlowLineGeometry(p.lines));
    applySegDrawRange(kit.lines.geometry, countSegments(p.lines), t.cityRatio);
    const spec = mergePointSpecs(p.points);
    rebuild(kit.points, buildPointsGeometry(spec));
    kit.points.geometry.setDrawRange(0, Math.floor(spec.count * t.cityRatio));
    rebuild(kit.water, buildGlowLineGeometry(p.water ?? []));
    rebuild(kit.roads, buildGlowLineGeometry(p.roads ?? []));
    applySegDrawRange(kit.roads.geometry, countSegments(p.roads ?? []), t.roadsRatio);
    rebuild(kit.landmarks, buildGlowLineGeometry(p.landmarks ?? []));
  }

  /* ---- G7：降级治理（仅全速帧采样；30 帧均值超阈 → 静默降一档，会话内单向） ---- */
  const govBuf: number[] = [];
  function sampleGovernor(dt: number) {
    if (dt <= 0 || dt > 500) return; // 标签页切换回来的巨帧不计
    govBuf.push(dt);
    if (govBuf.length >= PERF_BUDGET.governorWindow) {
      const mean = govBuf.reduce((a, b) => a + b, 0) / govBuf.length;
      govBuf.length = 0;
      const t = d.currentTier();
      if (t !== "low" && mean > PERF_BUDGET.fullP95[t] * PERF_BUDGET.governorFactor) {
        const next: QualityTier = t === "high" ? "mid" : "low";
        sampler?.note("tier-downgrade: " + t + "→" + next + " (mean " + mean.toFixed(1) + "ms)");
        d.onTierDowngrade(next);
      }
    }
  }

  /* ---- B11/D-1：dip 过渡（intro 期直接换，不可见） ---- */
  function tickTransition(now: number) {
    if (!tr) return;
    const ms = tr.phase === "out" ? OUT_MS : IN_MS;
    const k = Math.min(1, (now - tr.t0) / ms);
    const e = 1 - Math.pow(1 - k, 3);
    setCityOpacity(tr.phase === "out" ? 1 - e : e);
    if (k < 1) return;
    if (tr.phase === "out") {
      if (queued) { attachPayload(queued); queued = null; }
      tr = { phase: "in", t0: now };
    } else {
      setCityOpacity(1);
      tr = queued ? { phase: "out", t0: now } : null;
    }
  }

  /* ---- B6/D5：采样态标记（full = intro + 交互热度窗口） ---- */
  function markSampler(fullSpeed: boolean) {
    if (!sampler) return;
    if (fullSpeed && !markedFull) { sampler.mark("full"); markedFull = true; }
    else if (!fullSpeed && markedFull) { sampler.mark("ambient"); markedFull = false; }
  }

  function ensureLoop() { if (!rafId && !disposed) rafId = requestAnimationFrame(tick); }
  function noteInteraction() {
    const now = performance.now();
    lastWakeMs = now;
    hotUntil = Math.max(hotUntil, now + HOT_MS);
    if (state === "idle") { setState("ambient"); ensureLoop(); }
  }
  function setState(s: SceneState) {
    if (state === s) return;
    state = s;
    stateCbs.forEach((cb) => cb(s));
  }
  function enterIdle() {
    setState("idle");
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }

  /* ---- 渲染循环 ---- */
  function tick(nowMs: number) {
    if (disposed) return;
    rafId = requestAnimationFrame(tick);
    const dt = nowMs - lastFrameMs;
    lastFrameMs = nowMs;
    const fullSpeed = state === "intro" || nowMs < hotUntil;
    if (state === "ambient" && !fullSpeed) {
      if (nowMs - lastAmbientMs < 1000 / TIER[d.currentTier()].ambientFps) return; // D5：节流为设计值
      lastAmbientMs = nowMs;
    }
    markSampler(fullSpeed);

    if (state === "intro") { // D4：首帧即终态，uGlobalFade 0→1
      if (introT0 < 0) introT0 = nowMs;
      shared.uGlobalFade.value = Math.min(1, (nowMs - introT0) / introMs);
      if (shared.uGlobalFade.value >= 1) {
        setState("ambient");
        readyCbs.forEach((cb) => cb());
      }
    }
    tickTransition(nowMs);
    if (recomputeTask && !recomputeTask.finished) recomputeTask.tick(); // G1：分片重算
    else recomputeTask = null;

    shared.uTime.value = nowMs / 1000;
    shared.uResolution.value.set(canvas.width, canvas.height);
    if (fullSpeed) sampleGovernor(dt); // G7
    d.frameExtras?.(nowMs, dt);        // SkyScene 既有：视差阻尼/标签/月相/呼吸

    renderer.render(scene, camera);
    frameCount++;

    if (!bootHandled && frameCount >= 1) { // B5：首帧后 boot 遮罩淡出（遮罩自带 4s 兜底）
      bootHandled = true;
      const boot = document.getElementById(d.bootElementId ?? "sky-boot");
      boot?.classList.add("sky-boot-out");
      bootTimer = window.setTimeout(() => boot?.remove(), 700);
    }
    if (captureCb) { // G3：必须与 render 同帧
      const cb = captureCb; captureCb = null;
      canvas.toBlob((b) => cb(b), "image/png");
    }
    if (state === "ambient" && nowMs - lastWakeMs > IDLE_MS) { enterIdle(); return; }
  }

  /* ---- 唤醒与可见性 ---- */
  const onVis = () => { if (document.hidden) enterIdle(); else noteInteraction(); };
  const onWake = () => noteInteraction();
  window.addEventListener("pointermove", onWake, { passive: true });
  window.addEventListener("pointerdown", onWake, { passive: true });
  window.addEventListener("keydown", onWake);
  window.addEventListener("resize", onWake);
  document.addEventListener("visibilitychange", onVis);

  /* ---- B9：上下文生命周期 ---- */
  const onLost = (e: Event) => { e.preventDefault(); if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } };
  const onRestored = () => {
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (m) (Array.isArray(m) ? m : [m]).forEach((mm) => (mm.needsUpdate = true));
    });
    d.onContextRestored?.();
    noteInteraction();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  const perfApi: SceneCoreApi["perfApi"] = {
    getState: () => state,
    getRenderInfo: () => ({ frame: frameCount, tier: d.currentTier() }),
    async reapplyCity(n) {
      if (!lastPayload) return;
      for (let i = 0; i < n; i++) {
        attachPayload(lastPayload);
        await new Promise<void>((r) => requestAnimationFrame(() => setTimeout(r, 20)));
      }
    },
    async loseAndRestoreContext() {
      const ext = renderer.getContext().getExtension("WEBGL_lose_context");
      if (!ext) return "no-ext";
      ext.loseContext();
      await new Promise((r) => setTimeout(r, 400));
      ext.restoreContext();
      await new Promise((r) => setTimeout(r, 600));
      return renderer.getContext().isContextLost() ? "FAIL" : "pass";
    },
  };
  if (sampler) (window as unknown as Record<string, unknown>).__skySceneApi = perfApi;

  return {
    start(initial) {
      if (initial) attachPayload(initial);
      started = true;
      setState("intro");
      ensureLoop();
    },
    swapCity(p) {
      noteInteraction();
      if (!started || state === "intro") { attachPayload(p); return; } // intro 期直接换（淡入中，不可见）
      queued = p;
      if (!tr) tr = { phase: "out", t0: performance.now() };
    },
    requestRecompute() { // 新请求重启任务（旧任务作废）
      noteInteraction();
      recomputeTask = d.startRecompute();
    },
    noteInteraction,
    onReady(cb) { readyCbs.add(cb); return () => readyCbs.delete(cb); },
    onStateChange(cb) { stateCbs.add(cb); return () => stateCbs.delete(cb); },
    worldToScreen(v) { // G2：E4 SVG 引出线；返回 CSS 像素，front = 相机前方
      const view = v.clone().applyMatrix4(camera.matrixWorldInverse);
      const q = v.clone().project(camera);
      return {
        x: (q.x * 0.5 + 0.5) * canvas.clientWidth,
        y: (1 - (q.y * 0.5 + 0.5)) * canvas.clientHeight,
        front: view.z < 0,
      };
    },
    captureFrame(cb) { captureCb = cb; noteInteraction(); },
    getState: () => state,
    perfApi,
    dispose() { // G6（几何归 core；材质/renderer 归 SkyScene 统一处置）
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(bootTimer);
      window.removeEventListener("pointermove", onWake);
      window.removeEventListener("pointerdown", onWake);
      window.removeEventListener("keydown", onWake);
      window.removeEventListener("resize", onWake);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      for (const o of [kit.lines, kit.points, kit.water, kit.roads, kit.landmarks]) o.geometry.dispose();
      readyCbs.clear();
      stateCbs.clear();
    },
  };
}