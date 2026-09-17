# -*- coding: utf-8 -*-
"""从 CT-1 剥离 UI 文字，生成「纯场景层」，并精确测量 UI 几何供 HTML 层使用。"""
import numpy as np, os, json
from PIL import Image, ImageFilter
from scipy import ndimage

CT1 = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
OUT = r"D:\workbuddy\2026-09-14-09-43-10\_assets"
a = np.asarray(Image.open(CT1).convert("RGB")).astype(np.float32)
H, W = a.shape[:2]
lum = a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)

# 三个 UI 区域（含 margin）
REGIONS = [
    ("title",    106, 214, 730, 1375),
    ("subtitle", 212, 278, 765, 1155),
    ("cta",      312, 436, 845, 1135),
]

# ---------- 1. 精确几何测量 ----------
print("=== UI 几何测量（1920×969 设计稿坐标系）===")
geo = {}
for name, y0, y1, x0, x1 in REGIONS:
    sub = lum[y0:y1, x0:x1]
    m = sub > 34
    if not m.any():
        print("  %-8s 未检出" % name); continue
    ys, xs = np.where(m)
    gy0, gy1 = y0 + ys.min(), y0 + ys.max() + 1
    gx0, gx1 = x0 + xs.min(), x0 + xs.max() + 1
    print("  %-8s  y[%4d,%4d) 高%3d   x[%4d,%4d) 宽%4d   中心x=%.1f (%.2f%%)" % (
        name, gy0, gy1, gy1-gy0, gx0, gx1, gx1-gx0, (gx0+gx1)/2, (gx0+gx1)/2/W*100))
    geo[name] = dict(y0=int(gy0), y1=int(gy1), x0=int(gx0), x1=int(gx1),
                     h=int(gy1-gy0), w=int(gx1-gx0),
                     cx=round((gx0+gx1)/2, 1), cy=round((gy0+gy1)/2, 1),
                     cx_pct=round((gx0+gx1)/2/W*100, 3), cy_pct=round((gy0+gy1)/2/H*100, 3),
                     w_pct=round((gx1-gx0)/W*100, 3), h_pct=round((gy1-gy0)/H*100, 3))
    # 该区最亮值（用于估算文字色）
    print("        文字色峰值 RGB = %s   区内背景均亮=%.1f" % (
        a[gy0:gy1, gx0:gx1].reshape(-1,3)[np.argmax(lum[gy0:gy1, gx0:gx1].ravel())].astype(int).tolist(),
        lum[y0:y1, x0:x1][lum[y0:y1, x0:x1] <= 20].mean() if (lum[y0:y1, x0:x1] <= 20).any() else -1))

# ---------- 2. 抠除文字：逐列垂直插值 ----------
print("\n=== 生成纯场景层 ===")
mask = np.zeros((H, W), np.float32)
for name, y0, y1, x0, x1 in REGIONS:
    mask[y0:y1, x0:x1] = 1.0                       # 矩形全覆盖（比阈值法更彻底）
mimg = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))
mask = np.asarray(mimg).astype(np.float32) / 255.0  # 边缘羽化，避免硬接缝
print("  待修补像素 = %d (%.3f%%)" % (int((mask > 0.5).sum()), (mask > 0.5).sum()/(H*W)*100))

fill = a.copy()
mbin = mask > 0.02
for x in range(W):
    col = mbin[:, x]
    if not col.any(): continue
    idx = np.flatnonzero(col)
    brk = np.flatnonzero(np.diff(idx) > 1)
    for seg in np.split(idx, brk + 1):
        y0, y1 = int(seg[0]), int(seg[-1])
        top = a[max(y0-10, 0):y0, x].mean(axis=0) if y0 > 0 else a[min(y1+1, H-1), x]
        bot = a[y1+1:min(y1+11, H), x].mean(axis=0) if y1+1 < H else top
        n = y1 - y0 + 1
        t = np.linspace(0, 1, n + 2)[1:-1][:, None]
        fill[y0:y1+1, x] = top[None, :] * (1 - t) + bot[None, :] * t
out = a * (1 - mask[..., None]) + fill * mask[..., None]

scene = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
scene.save(os.path.join(OUT, "scene_1920.png"))
print("  场景层 -> scene_1920.png")

# 修补质量检查
d = np.abs(out - a)
chk = mask > 0.5
print("  区域内平均修改幅度 = %.2f（越小越自然）" % d[chk].mean())
print("  区域外修改量 = %d（必须为 0）" % int((d.sum(axis=2)[~chk] > 0.5).sum()))

# 多分辨率场景层
for w in (1920, 1440, 1080, 768, 390):
    h = int(round(H * w / W))
    r = scene if w == 1920 else scene.resize((w, h), Image.LANCZOS)
    r.save(os.path.join(OUT, "scene_%d.png" % w), optimize=True)
    try: r.save(os.path.join(OUT, "scene_%d.avif" % w), "AVIF", quality=75, speed=4)
    except Exception as e: pass
    try: r.save(os.path.join(OUT, "scene_%d.webp" % w), "WEBP", lossless=True, method=6, quality=100)
    except Exception as e: pass
    print("  scene_%d: png %.1fKB" % (w, os.path.getsize(os.path.join(OUT, "scene_%d.png" % w))/1024))

json.dump(geo, open(os.path.join(OUT, "ui_geometry.json"), "w"), indent=1, ensure_ascii=False)
print("\n  UI 几何 -> ui_geometry.json")
