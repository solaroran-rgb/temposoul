# -*- coding: utf-8 -*-
"""响应式构图探针：量化各视口下地平线位置与人形中心偏移。"""
import numpy as np, glob, os, json
from PIL import Image

D = r"C:\temp\tsprev"
CT1 = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
HZ_DESIGN = 0.680083

# 设计稿中地平线的「亮度特征」参考
a = np.asarray(Image.open(CT1).convert("RGB")).astype(np.float32)
lum = a @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
row = lum.mean(axis=1)
# 地平线 = 辉光峰值附近（CT1: y=676 青度最高，659 为几何地平线）

print("=== 响应式构图探针 ===")
print("  %-14s %10s %12s %12s %10s" % ("视口", "尺寸", "地平线y/H", "偏离设计稿", "人形中心x"))
rows = []
for f in sorted(glob.glob(os.path.join(D, "vp_*.png"))):
    im = Image.open(f).convert("RGB")
    W, H = im.size
    b = np.asarray(im).astype(np.float32)
    l2 = b @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    rm = l2.mean(axis=1)
    # 地平线判据：地形带起点 = 从上往下第一个「行均亮 > 全图均亮*1.25 且后续持续」的行
    thr = l2.mean() * 1.15
    hy = None
    for y in range(int(H*0.25), int(H*0.98)):
        if rm[y] > thr and rm[min(y+8, H-1)] > thr*0.85:
            hy = y; break
    # 人形中心：底部 18% 区间的列均亮峰值
    if hy:
        y0 = int(H*0.82)
        col = l2[y0:].mean(axis=0)
        cx = int(np.argmax(col))
    else:
        cx = -1
    hz_ratio = (hy / H) if hy else float('nan')
    dev = (hz_ratio - HZ_DESIGN) * 100 if hy else float('nan')
    cx_ratio = cx / W if cx >= 0 else float('nan')
    print("  %-14s %10s %12s %11s %10s" % (os.path.basename(f)[3:-4], "%dx%d" % (W, H),
          "%.4f" % hz_ratio if hy else "n/a", "%+.2f%%" % dev if hy else "n/a",
          "%.4f" % cx_ratio if cx >= 0 else "n/a"))
    rows.append(dict(f=os.path.basename(f), w=W, h=H, hz_ratio=round(hz_ratio, 4) if hy else None,
                     dev_pct=round(dev, 2) if hy else None, cx_ratio=round(cx_ratio, 4)))
json.dump(rows, open(os.path.join(D, "vp_report.json"), "w"), indent=1)
