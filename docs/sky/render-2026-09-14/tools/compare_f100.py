# -*- coding: utf-8 -*-
"""门禁：渲染截图 vs 设计稿 CT-1 逐像素对拍。"""
import numpy as np, sys, os, json
from PIL import Image

CT1 = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
SHOT = sys.argv[1] if len(sys.argv) > 1 else r"C:\temp\tsprev\shot_1920.png"

ref = Image.open(CT1).convert("RGB")
got = Image.open(SHOT).convert("RGB")
print("ref  %s  %s" % (ref.size, os.path.basename(CT1)))
print("got  %s  %s" % (got.size, os.path.basename(SHOT)))
if got.size != ref.size:
    print("  尺寸不同 -> 缩放 get 到 ref 尺寸再比（会引入插值差）")
    got = got.resize(ref.size, Image.LANCZOS)

A = np.asarray(ref).astype(np.float32)
B = np.asarray(got).astype(np.float32)
D = np.abs(A - B)
mse = float((D ** 2).mean())
psnr = float("inf") if mse == 0 else 10 * np.log10(255.0 * 255.0 / mse)
print("\n=== 逐像素对拍（1920x969）===")
print("  PSNR            = %s dB" % ("∞ (完全一致)" if mse == 0 else "%.2f" % psnr))
print("  最大通道差       = %.0f" % D.max())
print("  平均通道差       = %.4f" % D.mean())
print("  99.9 分位差      = %.0f" % np.percentile(D, 99.9))
print("  完全一致像素占比  = %.4f%%" % ((D.max(axis=2) == 0).mean() * 100))
print("  差<=1 像素占比   = %.4f%%" % ((D.max(axis=2) <= 1).mean() * 100))
print("  差<=2 像素占比   = %.4f%%" % ((D.max(axis=2) <= 2).mean() * 100))
print("  差>8  像素占比   = %.4f%%" % ((D.max(axis=2) > 8).mean() * 100))

# 分区差异
H = ref.size[1]
lum = lambda X: X @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
print("\n=== 分区（差异定位）===")
print("  区块                均差    最大差   >8占比    ref均亮   got均亮")
zones = [("天空 0-640", 0, 640), ("辉光带 640-706", 640, 706),
         ("地形 706-969", 706, 969), ("全图", 0, H)]
for nm, y0, y1 in zones:
    dz = D[y0:y1]
    print("  %-18s %6.3f   %5.0f   %6.3f%%   %6.2f    %6.2f" % (
        nm, dz.mean(), dz.max(), (dz.max(axis=2) > 8).mean()*100,
        lum(A[y0:y1]).mean(), lum(B[y0:y1]).mean()))

# 差异热力图
if D.max() > 0:
    hm = np.clip(D.max(axis=2) * 12, 0, 255).astype(np.uint8)
    Image.fromarray(hm).save(os.path.join(os.path.dirname(SHOT), "diff_heat.png"))
    # 差异最大的行
    rowmax = D.max(axis=(1, 2))
    top = np.argsort(-rowmax)[:6]
    print("\n  差异最大行: " + ", ".join("y=%d(%.0f)" % (y, rowmax[y]) for y in sorted(top)))
    print("  差异热力图 -> %s" % os.path.join(os.path.dirname(SHOT), "diff_heat.png"))

verdict = "PASS-F100" if (mse == 0 or psnr >= 48) else ("PASS-F95" if psnr >= 34 else "FAIL")
print("\n  >>> 判定：%s" % verdict)
json.dump(dict(psnr=(None if mse == 0 else round(psnr, 3)), mse=mse,
               maxdiff=float(D.max()), meandiff=float(D.mean()),
               exact_pct=float((D.max(axis=2) == 0).mean()*100), verdict=verdict),
          open(os.path.join(os.path.dirname(SHOT), "diff_report.json"), "w"), indent=1)
