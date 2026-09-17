# -*- coding: utf-8 -*-
"""P2 执行：SkyScene.ts（依据 §6.2 / §6.5 c / §6.7 / §6.9 / R4 / R6 / R7 / §11 相机契约）"""
import io, os

W = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\.temposoul-wt\thread-sky-v2-exec"
P = r"src\lib\sky\SkyScene.ts"
p = os.path.join(W, P)
t = io.open(p, encoding="utf-8").read()

def rep(t, a, b, tag):
    assert a in t, "[MISS] " + tag
    return t.replace(a, b, 1)

# ---- 0. import：补 rawColor + R2/R6 常量 ----
t = rep(t,
"""import {
  createSharedUniforms, detectTier, isWebGL2Available, managedColor, aliasAlpha,
  TIER, RENDER_ORDER, DUST_MAX,
  type QualityTier,
} from './renderTokens';""",
"""import {
  createSharedUniforms, detectTier, isWebGL2Available, managedColor, aliasAlpha, rawColor,
  TIER, RENDER_ORDER, DUST_MAX,
  GRID_LAYER, HORIZON_BAND_LAYER, GRID_STEP, LINE_PROFILE,
  type QualityTier,
} from './renderTokens';""",
"import.renderTokens")

# ---- R6-a：栅格间距 10 → GRID_STEP(20) ----
t = rep(t,
"""function buildGridSegs(): Float32Array {
  const segs: number[] = [];
  for (let z = -70; z <= 320; z += 10) segs.push(-320, 0, z, 320, 0, z);
  for (let x = -320; x <= 320; x += 10) segs.push(x, 0, -70, x, 0, 320);
  return new Float32Array(segs);
}""",
"""function buildGridSegs(): Float32Array {
  const segs: number[] = []; // R6/§6.7：间距 10 → 20 units（负空间）
  for (let z = -70; z <= 320; z += GRID_STEP) segs.push(-320, 0, z, 320, 0, z);
  for (let x = -320; x <= 320; x += GRID_STEP) segs.push(x, 0, -70, x, 0, 320);
  return new Float32Array(segs);
}""",
"grid.step")

# ---- R6-b：栅格 layer 0.32→0.07（L6）；地平线辉光带 0.9→0.14（L5）；线 profile 归 L6/L5 ----
t = rep(t,
"""  const ground = new THREE.Mesh(
    buildGlowLineGeometry([{ pts: gridSegs, layer: 0.32 }, { pts: horizonSegs, layer: 0.9 }]),
    makeGlowLineMaterial(shared, { core: 'uColorDim' }),
  );""",
"""  /* R6：栅格 0.32 → L6(0.07)；地平线辉光带 0.9 → L5(0.14)。R9 的"辉光峰值 ×0.45"由此更强地覆盖。 */
  const ground = new THREE.Mesh(
    buildGlowLineGeometry([{ pts: gridSegs, layer: GRID_LAYER }, { pts: horizonSegs, layer: HORIZON_BAND_LAYER }]),
    makeGlowLineMaterial(shared, { core: 'uColorDim', ...LINE_PROFILE.grid }),
  );""",
"ground.layers")

# ---- R7：星座标签改「仅中文 + 独立偏移 + §6.2 字号」 ----
t = rep(t,
"""  const constellLabels: { sprite: THREE.Sprite; dir: THREE.Vector3 }[] = [];""",
"""  /* §6.2 标签规格：仅中文 / alpha 0.5–0.7 / 屏显 11–12px。
     精灵世界高 LBL_H=14.3 → 深度 430 处屏显 ≈29px；字号 28/68 → ≈12px。
     R7：禁止旧的 `84 + 50 * zh.length` 宽度拼接，节点标记与中文名各自独立定位。 */
  const LBL_W = 33.6, LBL_H = 14.3;
  const constellLabels: { sprite: THREE.Sprite; dir: THREE.Vector3 }[] = [];""",
"labels.lblwh")

t = rep(t,
"""      const c = document.createElement('canvas');
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
      sp.scale.set(168, 24, 1);""",
"""      const c = document.createElement('canvas');
      c.width = 160; c.height = 68;
      const ctx = c.getContext('2d')!;
      // 节点标记（≤ L3；§6.2 禁止衍射星芒）
      ctx.fillStyle = 'rgba(120,230,255,0.42)';
      ctx.beginPath();
      ctx.moveTo(10, 34); ctx.lineTo(20, 24); ctx.lineTo(30, 34); ctx.lineTo(20, 44); ctx.closePath();
      ctx.fill();
      // 中文名（R7：独立偏移，固定 x=40，不再随字数拼接）
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = '500 28px "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif';
      ctx.fillStyle = 'rgba(196,240,255,0.62)';
      ctx.fillText(zh, 40, 34);
      const tex = new THREE.CanvasTexture(c);
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 1, depthWrite: false, depthTest: false, fog: false });
      const sp = new THREE.Sprite(mat);
      sp.position.set(v.x, v.y, v.z);
      sp.scale.set(LBL_W, LBL_H, 1);""",
"labels.canvas")

t = rep(t,
"""    const halfW = (0.5 * 96 * f) / (aspect * depth) * 1.05;
    const halfH = (0.5 * 18 * f) / depth * 1.6;""",
"""    const halfW = (0.5 * LBL_W * f) / (aspect * depth) * 1.05; // R7：改用真实精灵宽（原硬编码 96）
    const halfH = (0.5 * LBL_H * f) / depth * 1.6;             // R7：改用真实精灵高（原硬编码 18）""",
"labels.halfwh")

# ---- R4：人形（删 LineLoop → 纯粒子 900 / size 0.9 / 1-d 衰减 / 脚部翻倍 / 圆形光晕 / 脚下磁力环） ----
t = rep(t,
"""  let silLine: THREE.LineLoop | undefined;
  let silPts: THREE.Points | undefined;
  const SIL_BASE_OP = 1.0, SIL_PTS_BASE = 0.5; // P1b：剪影提亮（0.8/0.16→1.0/0.5）对齐基准发光人形""",
"""  let silPts: THREE.Points | undefined;
  const SIL_PTS_BASE = 0.5;              // P1b：剪影粒子不透明度基准
  const SIL_RING_OP = 0.10;              // §6.5 c：脚下磁力环峰值 α ≤ 0.10""",
"sil.decl")

t = rep(t,
"""    // 边缘辉光线（闭合轮廓）
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
    }""",
"""    /* R4：删除 LineLoop 外轮廓（历史"白柱化"事故；V11「无闭合直线轮廓」）；
       点数 210 → 900，密度按到中轴距离 1/d 衰减，脚部 10% 点数翻倍（§6.9 接地感）。 */
    const inside = (x: number, y: number): boolean => {
      let ins = false;
      for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
        const [xi, yi] = P[i], [xj, yj] = P[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins;
      }
      return ins;
    };
    const xs: number[] = [];
    let guard = 0;
    const SIL_TARGET = 900;
    while (xs.length / 3 < SIL_TARGET && guard++ < 80000) {
      const x = (Math.random() - 0.5) * 5.0;
      const y = 0.2 + Math.random() * 9.2;
      if (!inside(x, y)) continue;
      const dens = 1 / (1 + Math.abs(x) * 1.6);   // 到中轴距离 1/d 衰减
      const foot = y < 1.1 ? 2 : 1;               // 脚部接地感
      if (Math.random() > dens * foot) continue;
      xs.push(x, y, 0);
    }""",
"sil.loopremoved")

t = rep(t,
"""    const ptsMat = new THREE.PointsMaterial({
      color: 0xf2fbff, size: 1.0, map: dotTex, transparent: true, opacity: SIL_PTS_BASE * 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });""",
"""    /* R4：粒子色 cyan-core 混 text-bright（C5：色值只来自 token，无字面 hex） */
    const silColor = rawColor('uColorWhite').clone().lerp(rawColor('uColorCore'), 0.45);
    const ptsMat = new THREE.PointsMaterial({
      color: silColor, size: 0.9, map: dotTex, transparent: true, opacity: SIL_PTS_BASE * 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });""",
"sil.ptsmat")

t = rep(t,
"""    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: dotTex, color: 0xbfe9ff, transparent: true, opacity: 0.22,
      blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
    }));
    halo.scale.set(42, 58, 1);""",
"""    /* R4：光晕改圆形 scale(46,46)，opacity 0.22 → 0.16 */
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: dotTex, color: 0xbfe9ff, transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false,
    }));
    halo.scale.set(46, 46, 1);""",
"sil.halo")

t = rep(t,
"""    group.add(halo, silLine, silPts);
    scene.add(group);""",
"""    /* §6.5 c / V20：脚下磁力环 1 组（半径 = 3× 人形高；刻度 12 段；α ≤ 0.10；全画唯一环系） */
    const RING_R = 9.3 * 3, RING_SEG = 12, ringPts: number[] = [];
    for (let i = 0; i < RING_SEG; i++) {
      const a0 = (i / RING_SEG) * Math.PI * 2;
      const a1 = a0 + (Math.PI * 2 / RING_SEG) * 0.5;
      ringPts.push(Math.cos(a0) * RING_R, 0, Math.sin(a0) * RING_R,
                   Math.cos(a1) * RING_R, 0, Math.sin(a1) * RING_R);
    }
    const ringGeo = new THREE.BufferGeometry();
    ringGeo.setAttribute('position', new THREE.Float32BufferAttribute(ringPts, 3));
    const ring = new THREE.LineSegments(ringGeo, new THREE.LineBasicMaterial({
      color: rawColor('uColorCore'), transparent: true, opacity: SIL_RING_OP,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    ring.frustumCulled = false;
    ring.renderOrder = RENDER_ORDER.avatar - 2;

    group.add(halo, ring, silPts);
    scene.add(group);""",
"sil.ring")

io.open(p, "w", encoding="utf-8", newline="").write(t)
print("[OK] SkyScene.ts  %d chars" % len(t))
print("P2 DONE")
