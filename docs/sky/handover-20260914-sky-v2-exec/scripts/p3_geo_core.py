# -*- coding: utf-8 -*-
"""P3 执行：geoEngine.ts + sceneCore.ts（依据 §4.2 / §6.6 / §6.7 / §6.8 / §6.9 / R1 / R2 / R5 / R6）"""
import io, os

W = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\.temposoul-wt\thread-sky-v2-exec"
def rd(p): return io.open(os.path.join(W, p), encoding="utf-8").read()
def wr(p, t): io.open(os.path.join(W, p), "w", encoding="utf-8", newline="").write(t)
def rep(t, a, b, tag):
    assert a in t, "[MISS] " + tag
    return t.replace(a, b, 1)

# ================= A. src/lib/geo/geoEngine.ts =================
P = r"src\lib\geo\geoEngine.ts"
t = rd(P)

t = rep(t, "import { CITY_LAYER } from '../sky/renderTokens';",
           "import { CITY_LAYER, TERRAIN_BAND_LAYER } from '../sky/renderTokens';", "geo.import")

# --- §4.2 暖橙唯一性：buildLandmarkPayload（候选制，只落 1 簇） ---
t = rep(t, "  const pWarm: number[] = [];   // 地标焦点（暖橙）",
           "  const warmCand: { x: number; y: number; z: number; h: number }[] = []; // §4.2：暖橙候选（最终只落 1 簇）",
        "geo.lm.cand")
t = rep(t, "          pWarm.push(center.x, lm.kind === 'tower' ? hU : hU * 0.5, center.z);",
           "          warmCand.push({ x: center.x, y: lm.kind === 'tower' ? hU : hU * 0.5, z: center.z, h: hU });",
        "geo.lm.push")
t = rep(t, "  if (!anyInRange) return buildAbstractSkylinePayload(lat, lon);",
"""  if (!anyInRange) return buildAbstractSkylinePayload(lat, lon);

  /* §4.2 暖橙配额：全画唯一暖点 → 候选按高度取最大者，只落 1 簇 */
  const pWarm: number[] = [];
  if (warmCand.length) {
    const best = warmCand.reduce((a, b) => (b.h > a.h ? b : a));
    pWarm.push(best.x, best.y, best.z);
  }""", "geo.lm.derive")

# --- §4.2：buildAbstractSkylinePayload 单一暖点 ---
t = rep(t, "  const segs: number[] = [];\n  const pWarm: number[] = [];\n  const N = 26;",
           "  const segs: number[] = [];\n  const warmCand: { x: number; y: number; z: number; h: number }[] = []; // §4.2\n  const N = 26;",
        "geo.sky.cand")
t = rep(t, """    // 局部塔尖粒子（暖橙焦点）
    if (r1 > 0.72) pWarm.push(x, y + 3, 80);""",
"""    // 局部塔尖粒子（暖橙候选；§4.2 最终只落 1 簇）
    if (r1 > 0.72) warmCand.push({ x, y: y + 3, z: 80, h: y });""", "geo.sky.push")
t = rep(t, "  const points: PointPart[] = [\n    { positions: new Float32Array(pWarm), size: 1.6, warm: 1 },\n  ];",
"""  const pWarm: number[] = [];
  if (warmCand.length) {
    const best = warmCand.reduce((a, b) => (b.h > a.h ? b : a));
    pWarm.push(best.x, best.y, best.z);
  }
  const points: PointPart[] = [
    { positions: new Float32Array(pWarm), size: 1.6, warm: 1 },
  ];""", "geo.sky.derive")

# --- §4.2：buildTilePayload 删塔身暖橙第二点 ---
t = rep(t,
"""      if (lm.warm) {
        const S = METER_TO_U;
        pWarm.push(lm.ring[0][0] * S, h, lm.ring[0][1] * S); // 塔尖暖橙焦点
        pWarm.push(lm.ring[0][0] * S, h * 0.55, lm.ring[0][1] * S); // P1b：塔身暖橙焦点（增强单点聚焦）
      } else if (isL0) {""",
"""      if (lm.warm) {
        const S = METER_TO_U;
        // §4.2：全画暖橙焦点数量 = 1（删塔身第二点；多点时必须聚为单簇）
        if (!pWarm.length) pWarm.push(lm.ring[0][0] * S, h, lm.ring[0][1] * S);
      } else if (isL0) {""", "geo.tile.warm")

# --- R2：山体三 band layer 1.0/0.92/0.78 → 0.42/0.28/0.15 ---
t = rep(t,
"""  const bands: { segs: number[]; layer: number }[] = [
    { segs: [], layer: 1.0 },
    { segs: [], layer: 0.92 },
    { segs: [], layer: 0.78 },
  ];""",
"""  /* R2：三 band layer 1.0/0.92/0.78 → 0.42/0.28/0.15（远暗近亮，全部落 L4–L5） */
  const bands: { segs: number[]; layer: number }[] = [
    { segs: [], layer: TERRAIN_BAND_LAYER[0] },
    { segs: [], layer: TERRAIN_BAND_LAYER[1] },
    { segs: [], layer: TERRAIN_BAND_LAYER[2] },
  ];""", "geo.terrain.bands")

# --- R6：植被 2.2 → 1.4 ---
t = rep(t, "    vegetation: veg.length ? [{ positions: new Float32Array(veg), size: 2.2, warm: 0 }] : [],",
           "    vegetation: veg.length ? [{ positions: new Float32Array(veg), size: 1.4, warm: 0 }] : [], // R6：2.2 → 1.4",
        "geo.veg.size")

wr(P, t)
print("[OK] geoEngine.ts  %d chars" % len(t))

# ================= B. src/lib/sky/sceneCore.ts =================
P = r"src\lib\sky\sceneCore.ts"
t = rd(P)

t = rep(t,
"""import { PERF_BUDGET, TIER, RENDER_ORDER, CITY_OPACITY, LANDMARK_LINE, DISTANCE_FADE,
         type QualityTier, type SharedUniforms } from "./renderTokens";""",
"""import { PERF_BUDGET, TIER, RENDER_ORDER, CITY_OPACITY, LINE_PROFILE, DISTANCE_FADE,
         type QualityTier, type SharedUniforms } from "./renderTokens";""", "core.import")

t = rep(t,
"""  const vegetation = new THREE.Points(new THREE.BufferGeometry(),
    makeSimplePointsMaterial(shared, sprite, { base: "uColorCore", ...fade }));""",
"""  const vegetation = new THREE.Points(new THREE.BufferGeometry(),
    // R6/§6.9：点阵仅窗格，禁止大面积地形点阵 → base 归 dim、opacity ≤ 0.2
    makeSimplePointsMaterial(shared, sprite, { base: "uColorDim", opacity: 0.2, ...fade }));""", "core.vegetation")

t = rep(t,
"""  return {
    lines: mkLine({ core: "uColorCore", opacity: CITY_OPACITY.lines, ...fade }, RENDER_ORDER.cityLines),
    water: mkLine({ core: "uColorDim", opacity: CITY_OPACITY.water, ...fade }, RENDER_ORDER.water),
    roads: mkLine({ core: "uColorDim", opacity: CITY_OPACITY.roads, ...fade }, RENDER_ORDER.roads),
    landmarks: mkLine({ core: "uColorCore", opacity: CITY_OPACITY.landmarks,
      coreWidthPx: LANDMARK_LINE.coreWidthPx, glowRadiusPx: LANDMARK_LINE.glowRadiusPx, ...fade }, RENDER_ORDER.landmarks),
    terrain: mkLine({ core: "uColorCore", opacity: 1.0, coreWidthPx: 3.6, glowRadiusPx: 8.0, ...fade }, RENDER_ORDER.water),
    points,
    vegetation,
  };""",
"""  /* R1/R2/R5：层级一律归 §5.1（城市 L3 / 地标 L2 / 山脊·水系 L4 / 道路 L5），
     线宽与光晕半径取 §6 模块 profile；山头色 uColorCore → uColorDim（§6.7，原 3.6/8.0 是"地平线过亮"主因）。 */
  return {
    lines: mkLine({ core: "uColorCore", opacity: CITY_OPACITY.lines, ...LINE_PROFILE.city, ...fade }, RENDER_ORDER.cityLines),
    water: mkLine({ core: "uColorDim", opacity: CITY_OPACITY.water, ...LINE_PROFILE.water, ...fade }, RENDER_ORDER.water),
    roads: mkLine({ core: "uColorDim", opacity: CITY_OPACITY.roads, ...LINE_PROFILE.roads, ...fade }, RENDER_ORDER.roads),
    landmarks: mkLine({ core: "uColorCore", opacity: CITY_OPACITY.landmarks, ...LINE_PROFILE.landmark, ...fade }, RENDER_ORDER.landmarks),
    terrain: mkLine({ core: "uColorDim", opacity: 1.0, ...LINE_PROFILE.terrain, ...fade }, RENDER_ORDER.water),
    points,
    vegetation,
  };""", "core.kit")

wr(P, t)
print("[OK] sceneCore.ts  %d chars" % len(t))
print("P3 DONE")
