# -*- coding: utf-8 -*-
"""p6_city_nebula.py —— /sky 视觉标准 v2 第六批：地貌带实心度 + 星云条带归位
依据：§6.6（城市天际线：纯线框 + 窗格点阵 / 单栋塔宽 ≥6px）、
      §6.10（星云只蒙天空区上部，y ≤ 0.70，smoothstep(0.70,0.80) 衰减）、
      §3.6 C1（地平线辉光带为设计特征）、§9 V25 / V26

问题（第五批审计实测）：
  · 地貌区均亮 = 0.46（CT-1 = 14.6）→ 城市带近乎不可见；
  · V25 辉光带峰/地貌均亮 = 4.554（阈值 ≤0.85）→ 因分子是星云条带、分母近乎 0；
  · 星云「地平线枝杈」钉在 hy=0.42，把视觉地平线拉到 40%（假地平线）。
"""
import io, os

W = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\.temposoul-wt\thread-sky-v2-exec"
GEO = os.path.join(W, "src", "lib", "geo", "geoEngine.ts")
NEB = os.path.join(W, "src", "pages", "SkyPage", "NebulaOverlay.tsx")


def rep(path, old, new, tag):
    t = io.open(path, encoding="utf-8").read()
    assert old in t, "[FAIL] 未找到锚点: " + tag
    assert t.count(old) == 1, "[FAIL] 锚点不唯一(%d): %s" % (t.count(old), tag)
    io.open(path, "w", encoding="utf-8").write(t.replace(old, new))
    print("[ok] " + tag)


# ============================================================
# 1) geoEngine · 抽象城市升级为「塔身线框 + 窗格点阵」（§6.6 / R12）
# ============================================================
OLD1 = """  const TIERS: { z: number; hMin: number; hMax: number; layer: number }[] = [
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
  };"""

NEW1 = """  const TIERS: { z: number; hMin: number; hMax: number; wMax: number; n: number; layer: number }[] = [
    { z: 8, hMin: 3, hMax: 7, wMax: 2.0, n: 56, layer: CITY_LAYER.far },    // 远层：基座屏 68.3%
    { z: 32, hMin: 4, hMax: 13, wMax: 3.4, n: 64, layer: CITY_LAYER.mid },  // 中层：基座屏 72.4%
    { z: 72, hMin: 6, hMax: 20, wMax: 5.5, n: 64, layer: CITY_LAYER.near }, // 近层：基座屏 82.9%
  ];
  const HALF_W = 240;
  const lines: GlowSeg[] = [];
  const lm: GlowSeg[] = [];
  const win: number[] = [];
  const warmCand: { x: number; y: number; z: number; h: number }[] = []; // §4.2 全画唯一暖点
  for (let ti = 0; ti < TIERS.length; ti++) {
    const { z, hMin, hMax, wMax, n, layer } = TIERS[ti];
    const out: number[] = [];  // 天际线轮廓（连续性）
    const rect: number[] = []; // §6.6 塔身纯线框（禁实体填充）
    let prevY = 0;
    for (let i = 0; i <= n; i++) {
      const x = -HALF_W + (i / n) * HALF_W * 2;
      const r1 = hash01(i * 7.31 + ti * 13.7 + lat * 0.01 + lon * 0.017);
      const r3 = hash01(i * 5.53 + ti * 2.3 + lon * 0.011);
      const h = hMin + r1 * (hMax - hMin);
      /* §6.6「单栋塔最小宽度 ≥6px」：近层深度 121u，1u ≈ 7.9px ⇒ 宽 ≥1.6u 即达标 */
      const w = 1.6 + r3 * wMax;
      if (i > 0) out.push(x, prevY, z, x, h, z);
      prevY = h;
      // 塔身线框：左竖 / 顶 / 右竖
      rect.push(x - w / 2, 0, z, x - w / 2, h, z);
      rect.push(x - w / 2, h, z, x + w / 2, h, z);
      rect.push(x + w / 2, h, z, x + w / 2, 0, z);
      // §6.6 窗格点阵：点径 1px / 间距 4px（0.85u @ 近层 depth121 ≈ 4.3px）/ α ≤ L5
      for (let wy = 0.9; wy < h - 0.5; wy += 0.85)
        for (let wx = x - w / 2 + 0.45; wx < x + w / 2 - 0.25; wx += 1.1)
          win.push(wx, wy, z);
      if (r1 > 0.86) warmCand.push({ x, y: h + 1.5, z, h });
    }
    lines.push({ pts: new Float32Array(out), layer });
    lm.push({ pts: new Float32Array(rect), layer });
  }
  const pWarm: number[] = [];
  if (warmCand.length) {
    const best = warmCand.reduce((a, b) => (b.h > a.h ? b : a));
    pWarm.push(best.x, best.y, best.z);
  }
  const points: PointPart[] = [
    { positions: new Float32Array(pWarm), size: 1.6, warm: 1 },
  ];
  if (win.length) points.push({ positions: new Float32Array(win), size: 0.5, warm: 0 });
  return {
    lines,
    points,
    water: [], roads: [],
    landmarks: lm,
  };"""

rep(GEO, OLD1, NEW1, "geoEngine · 抽象城市升级为塔身线框 + 窗格点阵（§6.6 / R12）")

# ============================================================
# 2) NebulaOverlay · 枝杈星云归位到地平线（§6.10 / §3.6 C1）
# ============================================================
OLD2 = """      // 地平线枝杈星云（细长弥散条带，双层 sin 波扭曲；jinan-v2 下半部与地貌交界处的枝杈）
      const hy = h * 0.42; // P1b：枝杈星云位于星空底部（地貌区上方），不再蒙住山体"""
NEW2 = """      /* §6.10 / §3.6 C1 / V13：原实现把枝杈星云钉在 hy=0.42，在 CT-1 构图（地平线 68%）下
         于 40% 处造出一条**假地平线**（D1 检测器因此误判 41%）。现下移贴住地平线，
         作为 §3.6 C1 承认的「地平线辉光带」存在；α 同步压到 0.035 级（V25 分母约束）。 */
      const hy = h * 0.62;"""
rep(NEB, OLD2, NEW2, "NebulaOverlay · 枝杈星云下移至地平线（h*0.42 → h*0.62）")

OLD3 = """        gg.addColorStop(0, `rgba(0,128,196,${0.13 - k * 0.03})`);"""
NEW3 = """        gg.addColorStop(0, `rgba(0,128,196,${0.035 - k * 0.010})`);"""
rep(NEB, OLD3, NEW3, "NebulaOverlay · 辉光带 α 0.13 → 0.035（V25）")

OLD4 = """        const py = h * (0.32 + ((i * 37.3) % 22) / 100 * 0.24);"""
NEW4 = """        const py = h * (0.50 + ((i * 37.3) % 22) / 100 * 0.16);"""
rep(NEB, OLD4, NEW4, "NebulaOverlay · 浮尘带随星云条带下移")

print("\n[done] p6 地貌带实心度 + 星云归位补丁落地")
