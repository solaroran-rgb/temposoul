# -*- coding: utf-8 -*-
"""根因定位：差异是资产转换引入，还是浏览器渲染引入？"""
import numpy as np, os
from PIL import Image

CT1 = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
AST = r"D:\workbuddy\2026-09-14-09-43-10\_assets"
SHOT = r"C:\temp\tsprev\shot_1920.png"

im0 = Image.open(CT1)
print("=== CT-1 原 PNG 元信息 ===")
print("  mode=%s size=%s" % (im0.mode, im0.size))
print("  info keys = %s" % list(im0.info.keys()))
print("  icc_profile = %s" % ("有 (%d bytes)" % len(im0.info['icc_profile']) if im0.info.get('icc_profile') else "无"))

A = np.asarray(im0.convert("RGB")).astype(np.int16)
B = np.asarray(Image.open(os.path.join(AST, "plate_1920.png")).convert("RGB")).astype(np.int16)
imw = Image.open(os.path.join(AST, "plate_1920.webp"))
print("  WebP info = %s icc=%s" % (list(imw.info.keys()), "有" if imw.info.get('icc_profile') else "无"))
C = np.asarray(imw.convert("RGB")).astype(np.int16)
S = np.asarray(Image.open(SHOT).convert("RGB")).astype(np.int16)

def cmp(x, y, nm):
    d = np.abs(x - y)
    dm = d.max(axis=2)
    print("  %-22s max=%3d  mean=%.4f  exact=%7.3f%%  >8=%6.3f%%" % (
        nm, dm.max(), d.mean(), (dm == 0).mean()*100, (dm > 8).mean()*100))
    return dm

print("\n=== 差异传递链 ===")
cmp(A, B, "CT1 -> plate.png")
cmp(A, C, "CT1 -> plate.webp")
cmp(C, S, "plate.webp -> shot")
d = cmp(A, S, "CT1 -> shot")

print("\n=== CT-1 vs shot 差异分布 ===")
ys, xs = np.where(d > 8)
if len(ys):
    print("  差异像素数 = %d" % len(ys))
    print("  y 范围 [%d, %d]   x 范围 [%d, %d]" % (ys.min(), ys.max(), xs.min(), xs.max()))
    # y 直方（每 40 行）
    hist = {}
    for y in ys: hist[y//40] = hist.get(y//40, 0) + 1
    print("  按 40 行分带的差异像素数：")
    for k in sorted(hist): print("    y[%4d,%4d)  %d" % (k*40, k*40+40, hist[k]))
    # 差异是否散布（噪点）还是聚集（结构）
    from scipy import ndimage
    lab, n = ndimage.label(d > 8)
    sizes = ndimage.sum(np.ones_like(lab), lab, range(1, n+1))
    print("  差异连通块数 = %d，最大块 = %d px，中位块 = %.0f px" % (n, sizes.max(), np.median(sizes)))
    print("  >200px 的大块数 = %d" % (sizes > 200).sum())
    # 抽 3 个最大块的位置
    big = np.argsort(-sizes)[:3]
    for bi in big:
        sl = ndimage.find_objects(lab)[bi]
        print("    块 size=%d  位置 y[%d,%d] x[%d,%d]" % (
            sizes[bi], sl[0].start, sl[0].stop, sl[1].start, sl[1].stop))

# CT-1 顶部 40 行细节（星点）
print("\n=== 顶部 y=18..32 的极值点（CT1 vs shot）===")
for y in range(18, 33):
    ra = A[y]; rb = S[y]
    ia = np.where(ra.max(axis=1) > 40)[0]
    ib = np.where(rb.max(axis=1) > 40)[0]
    if len(ia) or len(ib):
        print("  y=%2d  CT1亮点x=%s   shot亮点x=%s" % (y, ia[:8].tolist(), ib[:8].tolist()))
