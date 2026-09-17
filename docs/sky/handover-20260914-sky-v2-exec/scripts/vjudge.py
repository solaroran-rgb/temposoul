# -*- coding: utf-8 -*-
"""vjudge.py —— /sky 视觉标准 v2 判据（V1-V31 可像素化部分）+ CT-1 并排对拍
依据：SKY-VISUAL-STANDARD-v2.md §3 / §4.2 / §5 / §9 / §12
"""
import io, os, json, math
V13_BIAS = 0.0  # CT-1 反标定偏置（%）：消除检测器系统偏差，见下方标定段
import numpy as np
from PIL import Image, ImageDraw, ImageFont

WT = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\.temposoul-wt\thread-sky-v2-exec"
RAW = os.path.join(WT, "docs", "sky", "visual-v2-20260914", "raw")
OUT = os.path.join(WT, "docs", "sky", "visual-v2-20260914")
CT1 = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
os.makedirs(OUT, exist_ok=True)


def Lstar(img_rgb):
    """sRGB → CIE L*（§9 全部阈值以 L* 表述）"""
    c = img_rgb.astype(np.float64) / 255.0
    lin = np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
    Y = 0.2126 * lin[..., 0] + 0.7152 * lin[..., 1] + 0.0722 * lin[..., 2]
    f = np.where(Y > 0.008856, np.cbrt(Y), 7.787 * Y + 16.0 / 116.0)
    return 116.0 * f - 16.0


def hsv(arr):
    c = arr.astype(np.float64) / 255.0
    mx = c.max(axis=2); mn = c.min(axis=2)
    d = mx - mn
    h = np.zeros_like(mx)
    nz = d > 1e-6
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    m = nz & (mx == r); h[m] = (60 * ((g - b) / np.where(d == 0, 1, d)) % 360)[m]
    m = nz & (mx == g); h[m] = (60 * ((b - r) / np.where(d == 0, 1, d)) + 120)[m]
    m = nz & (mx == b); h[m] = (60 * ((r - g) / np.where(d == 0, 1, d)) + 240)[m]
    s = np.where(mx > 1e-6, d / np.where(mx == 0, 1, mx), 0)
    return h, s


def connected_domain_count(mask, min_size=40):
    """4-邻域连通域计数（纯 numpy BFS，图像较小可接受）"""
    H, W = mask.shape
    seen = np.zeros((H, W), bool)
    n = 0
    ys, xs = np.nonzero(mask)
    for y0, x0 in zip(ys, xs):
        if seen[y0, x0]:
            continue
        stack = [(y0, x0)]; seen[y0, x0] = True; size = 0
        while stack:
            y, x = stack.pop(); size += 1
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                yy, xx = y + dy, x + dx
                if 0 <= yy < H and 0 <= xx < W and mask[yy, xx] and not seen[yy, xx]:
                    seen[yy, xx] = True; stack.append((yy, xx))
        if size >= min_size:
            n += 1
    return n


def block_max(ls, bs=64):
    H, W = ls.shape
    hb, wb = H // bs, W // bs
    if hb == 0 or wb == 0:
        return float(ls.mean())
    core = ls[: hb * bs, : wb * bs].reshape(hb, bs, wb, bs).mean(axis=(1, 3))
    return float(core.max())


def analyze(path, name, horizon_pct_expect=None):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im)
    H, W = a.shape[:2]
    ls = Lstar(a)
    row = ls.mean(axis=1)
    # ---- 地平线检测：多法并用，用 CT-1 真值 68.01% 反标定选定主判据 ----
    lo, hi = int(0.45 * H), int(0.92 * H)
    # D1 行均值最大正梯度（单行）
    g1 = np.diff(row[lo:hi])
    d1 = lo + int(np.argmax(g1)) if len(g1) else int(0.68 * H)
    # D2 行均值首次 > 天空基线×2.5（基线=顶部 15% 中位数）
    base = float(np.median(row[: max(1, int(0.15 * H))]))
    thr = max(2.5 * base, 3.0)
    ov = np.nonzero(row > thr)[0]
    d2 = int(ov[0]) if len(ov) else int(0.68 * H)
    # D3 结构密度：水平 15px 盒滤后 L*>9 的行占比，首次持续 2%H 超过 0.25
    ker = np.ones(15) / 15.0
    sm = np.apply_along_axis(lambda r: np.convolve(r, ker, mode="same"), 1, ls)
    dens = (sm > 9).mean(axis=1)
    win = max(3, int(0.02 * H))
    d3 = int(0.68 * H)
    for y in range(int(0.30 * H), max(1, H - win)):  # 跳过顶部 30%（品牌/HUD 文字会误触发）
        if dens[y:y + win].mean() > 0.25:
            d3 = y
            break
    # D4 行均值（3%H 平滑）梯度峰
    ws = max(3, int(0.03 * H))
    smr = np.convolve(row, np.ones(ws) / ws, mode="same")
    g4 = np.diff(smr[lo:hi])
    d4 = lo + int(np.argmax(g4)) if len(g4) else int(0.68 * H)
    # D5 非纯黑像素占比（与介质无关：线稿/实心城市都成立）；多阈值打印以 CT-1 标定
    dens5 = (ls > 8).mean(axis=1)
    d5 = {}
    for T in (0.04, 0.07, 0.10, 0.14):
        dd = int(0.68 * H)
        for y in range(int(0.30 * H), max(1, H - win)):
            if dens5[y:y + win].mean() > T:
                dd = y
                break
        d5[T] = round(dd / H * 100, 2)
    # 主判据：D5@10%（非纯黑像素占比，与介质无关）+ CT-1 反标定偏置
    hr = int(min(0.99, max(0.0, (d5[0.10] + V13_BIAS) / 100.0)) * H)
    py = int(0.68 * H)  # 规范目标地平线
    sky = ls[:py]; grd = ls[py:]
    h, s = hsv(a)
    warm = (h >= 15) & (h <= 45) & (s > 0.2)
    cyan = (h >= 175) & (h <= 200) & (s > 0.2)
    glow_lo, glow_hi = int(0.60 * H), int(0.80 * H)
    res = {
        "name": name, "size": [W, H],
        "V1_全画纯黑%": round(float((ls < 8).mean() * 100), 2),
        "V13_地平线实测%": round(hr / H * 100, 2),
        "V13_梯度峰行": hr,
        "地平线候选D1_单行梯度%": round(d1 / H * 100, 2),
        "地平线候选D2_亮度起跳%": round(d2 / H * 100, 2),
        "地平线候选D3_结构密度%": round(d3 / H * 100, 2),
        "地平线候选D4_平滑梯度%": round(d4 / H * 100, 2),
        "地平线候选D5_非黑占比@4%": d5[0.04],
        "地平线候选D5_非黑占比@7%": d5[0.07],
        "地平线候选D5_非黑占比@10%": d5[0.10],
        "地平线候选D5_非黑占比@14%": d5[0.14],
        "V13_辉光带峰行%": round((glow_lo + int(np.argmax(row[glow_lo:glow_hi]))) / H * 100, 2),
        "V14_地貌区占比%": round((H - hr) / H * 100, 2),
        "V23_天空区纯黑%(按68%)": round(float((sky < 8).mean() * 100), 2),
        "V23_天空区纯黑%(按实测线)": round(float((ls[:hr] < 8).mean() * 100), 2),
        "V24_地貌区均亮": round(float(grd.mean()), 2),
        "V25_辉光带均亮/地貌均亮": round(float(row[glow_lo:glow_hi].mean() / max(grd.mean(), 1e-6)), 3),
        "V27_近白占比%": round(float((ls > 85).mean() * 100), 2),
        "V28_青蓝族%": round(float(cyan.mean() * 100), 2),
        "V4_暖橙占比%": round(float(warm.mean() * 100), 3),
        "V29_单区块最大均值L*": round(block_max(ls), 2),
        "天空区均亮": round(float(sky.mean()), 2),
        "分区均亮": {
            "天空0-68%": round(float(ls[:py].mean()), 2),
            "地平线带60-80%": round(float(ls[glow_lo:glow_hi].mean()), 2),
            "地貌68-100%": round(float(ls[py:].mean()), 2),
        },
    }
    res["V4_暖橙连通域"] = int(connected_domain_count(warm))
    if horizon_pct_expect:
        res["地平线目标%"] = horizon_pct_expect
    return res, row


rows = {}
res_all = {}
ct1, row_ct1 = analyze(CT1, "CT-1 基线(1920x969)")
res_all["ct1"] = ct1
V13_BIAS = 68.01 - ct1["地平线候选D5_非黑占比@10%"]
print("  [标定] CT-1 D5@10%% = %.2f%% → 偏置 = %+.2f%%" % (ct1["地平线候选D5_非黑占比@10%"], V13_BIAS))
print("=== CT-1 基线 ===")
for k, v in ct1.items():
    print("  %-26s %s" % (k, v))

for tag in ("desktop", "mobile"):
    p = os.path.join(RAW, tag + ".png")
    if os.path.exists(p):
        r, row = analyze(p, "实现 " + tag)
        res_all[tag] = r
        rows[tag] = row
        print("=== 实现 %s ===" % tag)
        for k, v in r.items():
            print("  %-26s %s" % (k, v))

# ---- 行均值剖面曲线（归一化画高）----
CW, CH = 1200, 520
chart = Image.new("RGB", (CW, CH), (10, 10, 14))
d = ImageDraw.Draw(chart)
try:
    fnt = ImageFont.truetype("C:/Windows/Fonts/consola.ttf", 14)
except Exception:
    fnt = ImageFont.load_default()
AXL, AXR, TOP, BOT = 60, CW - 20, 20, CH - 40
d.rectangle([AXL, TOP, AXR, BOT], outline=(60, 60, 70))
for frac in (0.5, 0.6801):
    x = AXL + frac * (AXR - AXL)
    d.line([x, TOP, x, BOT], fill=(90, 90, 100))
    d.text((x + 3, TOP + 2), "%.4f" % frac, fill=(150, 150, 160), font=fnt)
ymax = 70.0
def plot(row, color, label):
    n = len(row)
    pts = []
    for i in range(0, n, max(1, n // 600)):
        x = AXL + (i / (n - 1)) * (AXR - AXL)
        y = BOT - min(row[i], ymax) / ymax * (BOT - TOP)
        pts.append((x, y))
    d.line(pts, fill=color, width=2)
    d.text((AXL + 8, TOP + 6 + (0 if color == (255, 90, 90) else 20)), label, fill=color, font=fnt)
d.text((AXL, CH - 30), "x=画高比例(0-1)  y=行均值 L* (0-70)", fill=(170, 170, 180), font=fnt)
plot(row_ct1, (255, 90, 90), "CT-1")
if "desktop" in rows:
    plot(rows["desktop"], (90, 220, 255), "实现 desktop")
chart.save(os.path.join(OUT, "rowprofile.png"))

# ---- 上下并排对拍图（各自原生分辨率，不拉伸）----
ct = Image.open(CT1).convert("RGB")
if "desktop" in rows:
    rn = Image.open(os.path.join(RAW, "desktop.png")).convert("RGB")
    W = max(ct.width, rn.width)
    canvas = Image.new("RGB", (W, ct.height + rn.height + 56), (12, 12, 16))
    dc = ImageDraw.Draw(canvas)
    dc.text((12, 8), "CT-1 冻结基线 1920x969  (地平线 68.01%)", fill=(255, 90, 90), font=fnt)
    canvas.paste(ct, ((W - ct.width) // 2, 30))
    y2 = ct.height + 44
    dc.text((12, y2 - 22), "实现 /sky 1920x1080  (vite build 生产产物)", fill=(90, 220, 255), font=fnt)
    canvas.paste(rn, ((W - rn.width) // 2, y2))
    canvas.save(os.path.join(OUT, "compare-desktop.png"))

json.dump(res_all, io.open(os.path.join(OUT, "audit.json"), "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
print("\n[out] " + OUT)
