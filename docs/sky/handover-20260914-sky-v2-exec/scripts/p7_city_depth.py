# -*- coding: utf-8 -*-
"""p7_city_depth.py —— /sky 视觉标准 v2 第七批：城市 6 层纵深铺满 68%–100% 地貌带
依据：§3.1（地貌区 659–969 = 68%–100%）、§6.6（城市天际线 / 近中远分级）、§6.7（塔尖越线 ≤3%）、
      §9 V14（地貌区占比 32%±1）/ V24 / V25

第六批实测：城市带落在 65%–83%，83%–100% 为空 → 地貌带只铺了一半。
本批按「屏显塔顶 = 68% → 前景塔顶 99%」反解 6 层深度与高度区间（解析解，非试凑）：
  各层基座屏显：70.2% / 76.0% / 82.0% / 88.0% / 94.0% / 99.0%
  各层塔顶屏显：67.3% / 74–75% / 78–80.5% / 78–86% / 83–92% / 87–98%
远层最高塔顶 67.3%（越过地平线 0.7% ≤ §6.7 允许的 3%）。
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


OLD1 = """  const TIERS: { z: number; hMin: number; hMax: number; wMax: number; n: number; layer: number }[] = [
    { z: 8, hMin: 3, hMax: 7, wMax: 2.0, n: 56, layer: CITY_LAYER.far },    // 远层：基座屏 68.3%
    { z: 32, hMin: 4, hMax: 13, wMax: 3.4, n: 64, layer: CITY_LAYER.mid },  // 中层：基座屏 72.4%
    { z: 72, hMin: 6, hMax: 20, wMax: 5.5, n: 64, layer: CITY_LAYER.near }, // 近层：基座屏 82.9%
  ];"""

NEW1 = """  const TIERS: { z: number; hMin: number; hMax: number; wMax: number; n: number; layer: number }[] = [
    { z: 19, hMin: 0.9, hMax: 5.4, wMax: 2.6, n: 90, layer: CITY_LAYER.far },  // 基座 70.2%｜塔顶 67.3%
    { z: 48, hMin: 1.7, hMax: 9.9, wMax: 3.0, n: 80, layer: CITY_LAYER.far },  // 基座 76.0%
    { z: 69, hMin: 2.2, hMax: 11.4, wMax: 3.4, n: 72, layer: CITY_LAYER.mid }, // 基座 82.0%
    { z: 85, hMin: 2.5, hMax: 12.5, wMax: 3.8, n: 64, layer: CITY_LAYER.mid }, // 基座 88.0%
    { z: 97, hMin: 2.2, hMax: 12.3, wMax: 4.2, n: 56, layer: CITY_LAYER.near },// 基座 94.0%
    { z: 105, hMin: 1.1, hMax: 12.3, wMax: 4.6, n: 48, layer: CITY_LAYER.near },// 基座 99.0%
  ];"""

rep(GEO, OLD1, NEW1, "geoEngine · 城市 6 层纵深（铺满 68%–100%，V14/V24/V25）")

OLD2 = """        gg.addColorStop(0, `rgba(0,128,196,${0.035 - k * 0.010})`);"""
NEW2 = """        gg.addColorStop(0, `rgba(0,128,196,${0.018 - k * 0.005})`);"""
rep(NEB, OLD2, NEW2, "NebulaOverlay · 辉光带 α 0.035 → 0.018（V25 分母抬升后仍留余量）")

print("\n[done] p7 城市纵深补丁落地")
