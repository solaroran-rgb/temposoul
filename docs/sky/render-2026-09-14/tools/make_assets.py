# -*- coding: utf-8 -*-
"""CT-1 -> 网页可渲染资产包（多分辨率 + 无损 + 内联），并做频率分解实验。"""
import numpy as np, os, base64, io, json
from PIL import Image, ImageFilter

SRC = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
OUT = r"D:\workbuddy\2026-09-14-09-43-10\_assets"
os.makedirs(OUT, exist_ok=True)

im = Image.open(SRC).convert("RGB")
W, H = im.size
AR = W / H
print("SRC %dx%d  AR=%.4f" % (W, H, AR))

# ---------- 1. 多分辨率无损资产 ----------
print("\n=== 多分辨率资产（无损 WebP / PNG）===")
print("  宽     高     PNG           WebP-lossless  base64(WebP)")
recs = []
for w in (1920, 1440, 1080, 768, 390):
    h = int(round(H * w / W))
    r = im.resize((w, h), Image.LANCZOS)
    png = os.path.join(OUT, "plate_%d.png" % w)
    wp = os.path.join(OUT, "plate_%d.webp" % w)
    r.save(png, "PNG", optimize=True)
    try:
        r.save(wp, "WEBP", lossless=True, method=6, quality=100)
        ws = os.path.getsize(wp)
    except Exception as e:
        ws = -1
    ps = os.path.getsize(png)
    b64 = int(ws * 4 / 3) if ws > 0 else 0
    print("  %5d %5d  %8.1f KB  %8.1f KB      %8.1f KB" % (w, h, ps/1024, (ws/1024 if ws>0 else -1), b64/1024))
    recs.append(dict(w=w, h=h, png=ps, webp=ws, ar=round(w/h,5)))

json.dump(recs, open(os.path.join(OUT, "asset_report.json"), "w"), indent=1)

# ---------- 2. 频率分解：城市层可否独立？ ----------
print("\n=== 频率分解实验（城市层独立性）===")
a = np.asarray(im).astype(np.float32)
for sg in (4, 8, 16):
    base = np.asarray(im.filter(ImageFilter.GaussianBlur(sg))).astype(np.float32)
    det = a - base
    # 城市带（y 690-910）高频能量
    band = det[690:910, :, :]
    e_all = np.abs(det).mean()
    e_band = np.abs(band).mean()
    e_skyband = np.abs(det[0:640, :, :]).mean()
    print("  sigma=%2d  全图高频=%.3f  城市带(690-910)=%.3f  天空带(0-640)=%.3f  比值=%.2f"
          % (sg, e_all, e_band, e_skyband, e_band/max(e_skyband,1e-6)))
    # 导出该 sigma 下的 base（供可视化"去掉城市"）
    if sg == 8:
        Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).save(os.path.join(OUT, "freq_base_s8.png"))
        Image.fromarray(np.clip(det + 128, 0, 255).astype(np.uint8)).save(os.path.join(OUT, "freq_detail_s8.png"))
        # 城市带裁剪展示
        Image.fromarray(np.clip(a[660:930, :, :], 0, 255).astype(np.uint8)).save(os.path.join(OUT, "zone_city_raw.png"))
        Image.fromarray(np.clip(base[660:930, :, :], 0, 255).astype(np.uint8)).save(os.path.join(OUT, "zone_city_lowfreq.png"))

# ---------- 3. 关键几何量复核（供引擎锁定）----------
lum = a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
print("\n=== 关键几何/亮度量（引擎锁定用）===")
print("  AR            = %.6f  (必须锁定)" % AR)
print("  地平线 y/H     = %.6f  -> y=%.0f@1080p" % (659/H, 659/H*1080))
print("  天空带 [0,659)  均亮=%.2f 纯黑=%.1f%%" % (lum[:659].mean(), (lum[:659] < 8).mean()*100))
print("  辉光带 [640,706) 均亮=%.2f" % lum[640:706].mean())
print("  地形带 [706,969) 均亮=%.2f 纯黑=%.1f%%" % (lum[706:].mean(), (lum[706:] < 8).mean()*100))
print("  全图均亮=%.2f 全图纯黑=%.1f%%" % (lum.mean(), (lum < 8).mean()*100))
print("  纯白(>245)占比=%.3f%%" % ((lum > 245).mean()*100))
# 中央人物
cx = int(W*0.5)
col = lum[:, cx-40:cx+40].mean(axis=1)
yb = np.where(col > 60)[0]
if len(yb):
    print("  中央竖带(x=%d±40) 亮点 y[%d,%d]  高%.1f%%" % (cx, yb.min(), yb.max(), (yb.max()-yb.min())/H*100))

# ---------- 4. 内联 base64（1080 档，供引擎自包含）----------
wp1080 = os.path.join(OUT, "plate_1080.webp")
b = base64.b64encode(open(wp1080, "rb").read()).decode()
open(os.path.join(OUT, "plate_1080.b64"), "w").write(b)
print("\n  1080 内联 base64 长度 = %.1f KB" % (len(b)/1024))
print("  资产目录: %s" % OUT)
