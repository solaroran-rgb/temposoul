# -*- coding: utf-8 -*-
"""p5_composition.py —— /sky 视觉标准 v2 第五批：构图与前景标定
依据：SKY-VISUAL-STANDARD-v2.md §3.1/§3.2/§3.5/§6.6/§6.7/§6.9 + §9(V13-V18/V24) + §11

核心结论（解析投影，冻结相机 pos(0,58,200)→lookAt(0,20,-160) fov58°, pitch=-6.03°）：
  地面上一点 (0,0,z) 的屏显画高比例单调映射：
    z=+190→100%   z=+104.5→98.35%   z=+72→82.9%   z=+32→72.4%   z=+8→68.3%
    z=0→67.2%     z=+5→67.9%        z=-70→59.6%   z=-∞→40.5%（消失线）
  ⇒ §3.1「地平线 68%」= 城市天际线**基座**所在行，冻结相机下对应 z≈+5。
  ⇒ 原实现把天际线单层钉在 z=80（基座屏 81.3%），地平线掉到 68% 以下 = V13/V14 不达标的真因。
  ⇒ 相机契约本身没错，§11 无需改动；错的是载荷 z 摆放与人形标定。
"""
import io, os, sys

W = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\.temposoul-wt\thread-sky-v2-exec"
GEO = os.path.join(W, "src", "lib", "geo", "geoEngine.ts")
SCN = os.path.join(W, "src", "lib", "sky", "SkyScene.ts")


def rep(path, old, new, tag):
    t = io.open(path, encoding="utf-8").read()
    assert old in t, "[FAIL] 未找到锚点: " + tag
    assert t.count(old) == 1, "[FAIL] 锚点不唯一(%d): %s" % (t.count(old), tag)
    io.open(path, "w", encoding="utf-8").write(t.replace(old, new))
    print("[ok] " + tag)


# ============================================================
# geoEngine.ts · (a) 抽象天际线 → 三层纵深，基座落 68%
# ============================================================
OLD_A = """export function buildAbstractSkylinePayload(lat: number, lon: number): CityPayload {
  const segs: number[] = [];
  const warmCand: { x: number; y: number; z: number; h: number }[] = []; // §4.2
  const N = 26;
  const HALF_W = 150;
  let prevY = 0;
  for (let i = 0; i <= N; i++) {
    const x = -HALF_W + (i / N) * HALF_W * 2;
    const r1 = hash01(i * 7.31 + lat * 0.01 + lon * 0.017);
    const r2 = hash01(i * 3.17 + lon * 0.013 - lat * 0.007);
    const y = 6 + r1 * 22 + (r2 - 0.5) * 8; // 6..36 units 起伏
    if (i > 0) segs.push(x, prevY, 80, x, y, 80);
    prevY = y;
    // 局部塔尖粒子（暖橙候选；§4.2 最终只落 1 簇）
    if (r1 > 0.72) warmCand.push({ x, y: y + 3, z: 80, h: y });
  }
  const pWarm: number[] = [];
  if (warmCand.length) {
    const best = warmCand.reduce((a, b) => (b.h > a.h ? b : a));
    pWarm.push(best.x, best.y, best.z);
  }
  const points: PointPart[] = [
    { positions: new Float32Array(pWarm), size: 1.6, warm: 1 },
  ];
  return {
    lines: [{ pts: new Float32Array(segs), layer: CITY_LAYER.mid }],
    points,
    water: [], roads: [],
    landmarks: [{ pts: new Float32Array(segs), layer: CITY_LAYER.far }],
  };
}"""

NEW_A = """export function buildAbstractSkylinePayload(lat: number, lon: number): CityPayload {
  /* §3.1 / V13 / V14：地平线 = 城市天际线**基座**所在行，硬约束 68.0%±1%。
     冻结相机（§11：pos(0,58,200)→lookAt(0,20,-160)，fov 58°）下地面点 (0,0,z) 的屏显比例：
       z=+190→100%  z=+72→82.9%  z=+32→72.4%  z=+8→68.3%  z=-70→59.6%  z→-∞→40.5%
     ⇒ 基座落 68% ⇔ z≈+5。原实现单层放 z=80（基座 81.3%）→ 地平线下沉到 68% 以下，不达标。
     按 R1「base 色按距离分级（近/中/远）」铺三层纵深，填满 68%–100% 地貌带（V24 均亮）。 */
  const TIERS: { z: number; hMin: number; hMax: number; layer: number }[] = [
    { z: 8, hMin: 3, hMax: 7, layer: CITY_LAYER.far },    // 远层：基座屏 68.3%，塔顶 ≤65.0%（越线 ≤3%）
    { z: 32, hMin: 4, hMax: 13, layer: CITY_LAYER.mid },  // 中层：基座屏 72.4%
    { z: 72, hMin: 6, hMax: 20, layer: CITY_LAYER.near }, // 近层：基座屏 82.9%
  ];
  const N = 26;
  const HALF_W = 150;
  const lines: GlowSeg[] = [];
  const warmCand: { x: number; y: number; z: number; h: number }[] = []; // §4.2 全画唯一暖点
  for (let ti = 0; ti < TIERS.length; ti++) {
    const { z, hMin, hMax, layer } = TIERS[ti];
    const out: number[] = [];
    let prevY = 0;
    for (let i = 0; i <= N; i++) {
      const x = -HALF_W + (i / N) * HALF_W * 2;
      const r1 = hash01(i * 7.31 + ti * 13.7 + lat * 0.01 + lon * 0.017);
      const r2 = hash01(i * 3.17 + ti * 5.9 + lon * 0.013 - lat * 0.007);
      const y = hMin + r1 * (hMax - hMin) + (r2 - 0.5) * 2; // 该层起伏
      if (i > 0) out.push(x, prevY, z, x, y, z);
      prevY = y;
      // 塔尖粒子（暖橙候选；§4.2 最终只落 1 簇 = 全画最高者）
      if (r1 > 0.72) warmCand.push({ x, y: y + 1.5, z, h: y });
    }
    lines.push({ pts: new Float32Array(out), layer });
  }
  const pWarm: number[] = [];
  if (warmCand.length) {
    const best = warmCand.reduce((a, b) => (b.h > a.h ? b : a));
    pWarm.push(best.x, best.y, best.z);
  }
  const points: PointPart[] = [
    { positions: new Float32Array(pWarm), size: 1.6, warm: 1 },
  ];
  return {
    lines,
    points,
    water: [], roads: [],
    landmarks: [{ pts: lines[0].pts, layer: CITY_LAYER.far }],
  };
}"""

rep(GEO, OLD_A, NEW_A, "geoEngine · 抽象天际线三层纵深（基座落 68%，V13/V14）")

# ============================================================
# geoEngine.ts · (b) 山体高度上限（越线 ≤3%）
# ============================================================
OLD_B = """    const y = c.level * S * 2.0; // 山体层叠抬升（P1b 艺术化：2.0，山脊天际线露出塔顶）
    if (y < 14) continue; // P1b 精化：只留高海拔山脊段（y≥14 ≈ 海拔144m+），形成 2-3 层清晰轮廓"""

NEW_B = """    /* §6.7 / V13：冻结相机高度 58u ⇒ 任何高度 ≥58u 的山体在几何上**必然**越过地平线。
       故抬升系数 2.0 → 0.9（DEM 1000m ≈ 43.7u < 58u），把越线量压进 §6.7 允许的 ≤3% 画高；
       同时入画门槛 14 → 8，保住 2 层轮廓数量（山上等高线密度不变）。 */
    const y = c.level * S * 0.9;
    if (y < 8) continue;"""

rep(GEO, OLD_B, NEW_B, "geoEngine · 山体高度上限（§6.7 越线 ≤3%）")

# ============================================================
# SkyScene.ts · (c) 地面栅格远缘收到地平线（z=+6）
# ============================================================
OLD_C = """  const segs: number[] = []; // R6/§6.7：间距 10 → 20 units（负空间）
  for (let z = -70; z <= 320; z += GRID_STEP) segs.push(-320, 0, z, 320, 0, z);
  for (let x = -320; x <= 320; x += GRID_STEP) segs.push(x, 0, -70, x, 0, 320);"""

NEW_C = """  const segs: number[] = []; // R6/§6.7：间距 10 → 20 units（负空间）
  /* §3.1/V13：地平线 68% 对应 z=+5（冻结相机）。栅格远缘由 z=-70 收到 z=+6，
     使地面不在 68% 以上留下任何像素 —— V13/V14 达标的前提，同时不污染天空区（V23）。 */
  for (let z = 6; z <= 220; z += GRID_STEP) segs.push(-320, 0, z, 320, 0, z);
  for (let x = -320; x <= 320; x += GRID_STEP) segs.push(x, 0, 6, x, 0, 220);"""

rep(SCN, OLD_C, NEW_C, "SkyScene · 栅格远缘收至地平线 z=+6")

# ============================================================
# SkyScene.ts · (d1) 人形剪影：暗剪影色调（§3.5 形态铁律）
# ============================================================
OLD_D1 = """    /* R4：粒子色 cyan-core 混 text-bright（C5：色值只来自 token，无字面 hex） */
    const silColor = rawColor('uColorWhite').clone().lerp(rawColor('uColorCore'), 0.45);
    const ptsMat = new THREE.PointsMaterial({
      color: silColor, size: 0.9, map: dotTex, transparent: true, opacity: SIL_PTS_BASE * 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });"""

NEW_D1 = """    /* §3.5「形态铁律（不可变）：暗剪影 + 亮背景，禁止渲染成一根亮白立柱」优先于 R4 的
       「cyan-core 混 text-bright」——CT-1 基准图上人形是**相对更暗**的形体，被背后辉光托出。
       故改为 NormalBlending 深青剪影（uColorDim ×0.25，仍只取 token 无色字面量）。
       size：PointsMaterial.size 受 group.scale 缩放，0.44 local × 0.826 = 0.363u 世界高，
       在深度 89u 处屏显 ≈4.0px（人形屏高 79px ⇒ 点径 ≈5%，与 §6.9「小剂量窗格」同量级）。 */
    const silColor = rawColor('uColorDim').clone().multiplyScalar(0.25);
    const ptsMat = new THREE.PointsMaterial({
      color: silColor, size: 0.44, map: dotTex, transparent: true, opacity: 0.92,
      blending: THREE.NormalBlending, depthWrite: false,
    });"""

rep(SCN, OLD_D1, NEW_D1, "SkyScene · 人形改暗剪影（§3.5 形态铁律）")

# ============================================================
# SkyScene.ts · (d2) 人形位置/尺度 + 光晕标定（V15–V18）
# ============================================================
OLD_D2 = """    group.position.set(0, 0, 50); // 前景观测位（P1b：前移避塔身，面向南方星空）
    group.scale.setScalar(4.0); // P1b：对齐 jinan-v2 中央发光人形"""

NEW_D2 = """    /* §3.5 / V15–V18 冻结相机下的精确标定（解析解，非试凑）：
       (0,0,z) 屏显：z=104.5 → 98.35%（脚底，贴屏底）；配合世界高 7.656u
       ⇒ 头顶 91.02%、屏高 7.33%、宽 1.75%(≤1.8%)、水平中心 50%。
       轮廓局部高 9.27u ⇒ group.scale = 7.656 / 9.27 = 0.826。 */
    group.position.set(0, 0, 104.5);
    group.scale.setScalar(0.826);"""

rep(SCN, OLD_D2, NEW_D2, "SkyScene · 人形位置/尺度标定（V15–V18）")

OLD_D3 = """    halo.scale.set(46, 46, 1);
    halo.position.set(0, 17, -2);"""

NEW_D3 = """    /* §3.5：光晕半径 / 人形高 = 1.3–1.6×。人形世界高 7.656u ⇒ 目标半径 11.1u
       ⇒ 精灵直径 22.2u 世界 = 26.9u local ⇒ scale 27。位置贴躯干中心（local y=4.5）。 */
    halo.scale.set(27, 27, 1);
    halo.position.set(0, 4.5, -2);"""

rep(SCN, OLD_D3, NEW_D3, "SkyScene · 光晕半径标定（§3.5 1.3–1.6×）")

print("\n[done] p5 构图/前景标定补丁全部落地")
