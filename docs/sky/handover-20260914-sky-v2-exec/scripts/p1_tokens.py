# -*- coding: utf-8 -*-
"""P1 执行：token 层（依据 SKY-VISUAL-STANDARD-v2 §4.1 / §4.2 / §5.1 / §5.2 / §5.4 / R1 / R2 / R5 / R6 / R11）"""
import io, sys, os

W = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\.temposoul-wt\thread-sky-v2-exec"
def rd(p):
    return io.open(os.path.join(W, p), encoding="utf-8").read()
def wr(p, t):
    io.open(os.path.join(W, p), "w", encoding="utf-8", newline="").write(t)
def rep(t, a, b, tag):
    assert a in t, "[MISS] " + tag
    return t.replace(a, b, 1)

# ============ A. src/theme/holographic-tokens.ts ============
P = r"src\theme\holographic-tokens.ts"
t = rd(P)

t = rep(t,
    "'cyan-constellation': 'rgba(77, 208, 225, 0.40)', // D2 裁定 alpha 0.40",
    "'cyan-constellation': 'rgba(77, 208, 225, 0.07)', // R11 / §4.1：0.40 → 0.07（\"很微弱的连线\"）",
    "tokens.constellation")

t = rep(t, "'accent-warm': '#FF8C00',", "'accent-warm': '#F0C878',", "tokens.warm")

t = rep(t,
    "  // 5. 排版 (补齐第 10 键，供 CSS 注入)",
    "  // 4b. 氛围 / 注释族（§4.1 新增；非 uniform 别名，仅供 CSS 注入与 Canvas 层消费）\n"
    "  'accent-warm-deep': '#E08B3F',   // §4.1 暖橙深部\n"
    "  'nebula-violet': '#3A2E5C',      // §6.10 星云弥散（α ≤ 0.12）\n"
    "  'sky-haze': '#0A3B44',           // §4.1 地平线弥散带（α ≤ 0.15）\n"
    "  'sky-annot': '#22E8FF8C',        // §4.1 注释青 #22E8FF @0.55（8 位 hex 携带 alpha）\n"
    "\n"
    "  // 5. 排版 (补齐第 10 键，供 CSS 注入)",
    "tokens.atmos")

t = rep(t,
    " * 严格遵循附录 A 约束、第二轮 C4/C5/D6 裁定及第三轮 R-E4-2 修复指令",
    " * 严格遵循附录 A 约束、第二轮 C4/C5/D6 裁定及第三轮 R-E4-2 修复指令\n"
    " *\n"
    " * ⚠️ 本表为「颜色 + 字体族」混合表：`font-mono` 是字体族字符串、`sky-annot` 是 8 位 hex，\n"
    " *    renderTokens.parseTokenString 只解析被 TOKEN_ALIAS 引用的键（均为真色值），\n"
    " *    本表新增的非颜色键不会被解析（§4.1 脚注要求在此标明）。",
    "tokens.header")
wr(P, t)
print("[OK] holographic-tokens.ts  %d chars" % len(t))

# ============ B. src/lib/sky/renderTokens.ts ============
P = r"src\lib\sky\renderTokens.ts"
t = rd(P)

t = rep(t,
    "export const LINE = { coreWidthPx: 1.6, glowRadiusPx: 4.0, coreAlpha: 0.9, glowAlpha: 0.32 } as const;",
    "export const LINE = { coreWidthPx: 1.6, glowRadiusPx: 4.0, coreAlpha: 0.9, glowAlpha: 0.35 } as const;\n"
    "/* §5.2 裁定：uCoreAlpha : uGlowAlpha = 2.6 : 1（0.9 : 0.35）；光晕是\"呼吸\"来源不是\"亮度\"来源 */",
    "renderTokens.LINE")

t = rep(t,
    "export const LANDMARK_LINE = { coreWidthPx: 2.6, glowRadiusPx: 6.0 } as const; // C2：地标独立宽度",
    "export const LANDMARK_LINE = { coreWidthPx: 2.4, glowRadiusPx: 6.0 } as const; // §5.1 L2：0.72 / 2.4 / 6.0（原 2.6）\n"
    "\n"
    "/* ---- §5.1 六级亮度层级（L1 最亮 → L6 最暗，相邻层 ≈1.7×；连续三层不得同 alpha） ---- */\n"
    "export const LEVEL = {\n"
    "  L1: 1.00, L2: 0.72, L3: 0.42, L4: 0.26, L5: 0.14, L6: 0.07,\n"
    "} as const;\n"
    "\n"
    "/* ---- §5.1 / §6 各模块线 profile（coreWidthPx / glowRadiusPx；R2 山头不再用 L2 宽线） ---- */\n"
    "export const LINE_PROFILE = {\n"
    "  city:     { coreWidthPx: 1.5, glowRadiusPx: 3.6 }, // §6.6 L3 城市建筑轮廓\n"
    "  landmark: { coreWidthPx: 2.4, glowRadiusPx: 6.0 }, // §5.1 L2 地标棱线\n"
    "  terrain:  { coreWidthPx: 1.2, glowRadiusPx: 3.0 }, // §6.7 L4 山脊等高线\n"
    "  water:    { coreWidthPx: 1.2, glowRadiusPx: 3.0 }, // §6.8 L4 水系\n"
    "  roads:    { coreWidthPx: 0.9, glowRadiusPx: 2.2 }, // §6.8 L5 道路\n"
    "  grid:     { coreWidthPx: 0.6, glowRadiusPx: 1.4 }, // §5.1 L6 地面栅格\n"
    "} as const;\n"
    "\n"
    "/* ---- R2：山体三 band layer（远暗近亮，全部落 L4–L5；原 1.0/0.92/0.78） ---- */\n"
    "export const TERRAIN_BAND_LAYER = [0.42, 0.28, 0.15] as const;\n"
    "/* ---- R6：负空间（栅格 → L6；地平线辉光带 → L5；栅格间距 10 → 20 units） ---- */\n"
    "export const GRID_LAYER = LEVEL.L6;\n"
    "export const HORIZON_BAND_LAYER = LEVEL.L5;\n"
    "export const GRID_STEP = 20;",
    "renderTokens.LEVEL")

t = rep(t,
    "export const CITY_LAYER = { near: 0.85, mid: 0.5, far: 0.28 } as const;",
    "export const CITY_LAYER = { near: 0.42, mid: 0.28, far: 0.15 } as const; // R1/§6.6：归 L3（原 0.85/0.5/0.28 高饱和实心化）",
    "renderTokens.CITY_LAYER")

t = rep(t,
    "export const CITY_OPACITY = { lines: 1.0, water: 0.85, roads: 0.55, landmarks: 0.95, points: 1.0 } as const;",
    "export const CITY_OPACITY = { lines: 1.0, water: 1.0, roads: 1.0, landmarks: 1.0, points: 1.0 } as const;\n"
    "/* R5/§6.8：层级一律由 per-seg layer 承载（水系 L4=0.26 / 道路 L5=0.14），uOpacity 归 1 免二次衰减 */",
    "renderTokens.CITY_OPACITY")

t = rep(t, "export const DUST_MAX = 320;", "export const DUST_MAX = 160; // R6：320 → 160（负空间）", "renderTokens.DUST_MAX")

t = rep(t, "diffractionMax: 20,", "diffractionMax: 12,", "renderTokens.diffractionMax")
t = rep(t,
    "export const TIER",
    "/* §5.4：衍射星芒仅最亮 ≤ 12 颗（high 档 20 → 12） */\nexport const TIER",
    "renderTokens.tierComment")

wr(P, t)
print("[OK] renderTokens.ts  %d chars" % len(t))
print("P1 DONE")
