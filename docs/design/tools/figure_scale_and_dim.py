# -*- coding: utf-8 -*-
"""
TempoSoul /sky 概念图后处理工具 —— 人物缩放 + 中央光效压暗
=============================================================
用途：在一张已成图（人物为"暗剪影 + 亮辉光"）上，以人物自身中心点为锚点
      精确缩放人物（如 50%），并把人物周围扩散的辉光 / 光线 / 中央高光压暗。

为什么必须用代码而不是交给图像模型：
    实测图像模型对「风格 / 元素」类指令服从度高，对「几何比例 / 尺度」类
    指令服从度极低（连续多轮拒绝执行地平线位移与人物缩放，输出逐像素几乎
    不变）。因此分工固定为：风格与元素交 AI 生成，几何与尺度交代码后处理。

核心难点与解法（按踩坑顺序记录，勿重复走弯路）：
    1. 人物与背景同亮度 → 简单阈值抠不出来。
       解法：用「局部对比度」= uniform_filter(L, 53) - L，人物是"暗剪影叠在
       亮辉光上"，对比度显著为正，取最大连通域即得干净人形轮廓（实测填充率
       46%，与人体形状吻合）。
    2. 抹掉人物后必须补背景。已证伪的方案（勿再用）：
       - 矩形线性插值  → 出现明显矩形补丁
       - biharmonic inpaint → 出现乳白糊斑
       - 整列插值      → 出现阶梯条纹
       - 纯径向亮度剖面重建 → 出现同心圆盘
       可用方案：自适应各向异性镜像填充（按到 mask 边界的最近方向选镜像源，
       边界处天然连续）+ 调和插值亮度校正（解决镜像源离辉光中心更远导致的
       整体偏暗"幽灵人形"）。
    3. 羽化边界必须落在 mask 外缘，不能落在人物光晕内部 —— 否则人物边缘的
       暗剪影会被半透明保留，形成人形残影。

输入：一张概念图（默认取 docs/design/redraw-20260914/P0-aerial-base.png）
输出：P1-final-aerial-tiny50.png
依赖：numpy / scipy / Pillow（托管 Python 3.13.12 已具备）
"""
import os
import numpy as np
from scipy import ndimage
from PIL import Image, ImageFilter

D = r'E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\redraw-20260914'
SRC = os.path.join(D, 'P0-aerial-base.png')
OUT = os.path.join(D, 'P1-final-aerial-tiny50.png')

SCALE = 0.50            # 人物缩放比（1.0 = 不变）
DILATE_FILL = 15        # 填充区膨胀半径（覆盖人物外圈光晕）
GRAIN_SIGMA = 2.2       # 填充区叠加颗粒，与原图 film grain 一致

im = Image.open(SRC).convert('RGB')
a = np.asarray(im).astype(np.float32)
H, W, _ = a.shape

# 0. 右下角生成水印清除（该角落为暗背景，用左侧列水平延展填充）
a = a.copy()
a[915:1015, 1390:] = a[915:1015, 1320:1390].mean(axis=1, keepdims=True)

# 1. 局部对比度提取人物轮廓
L = 0.2126 * a[:, :, 0] + 0.7152 * a[:, :, 1] + 0.0722 * a[:, :, 2]
contrast = ndimage.uniform_filter(L, size=53) - L
roi = (slice(560, 820), slice(680, 880))          # 人物所在区域（按新图调整）
m = np.zeros_like(L, bool)
m[roi] = contrast[roi] > 35
m = ndimage.binary_fill_holes(ndimage.binary_closing(m, np.ones((5, 5))))
lab, n = ndimage.label(m)
sizes = ndimage.sum(m, lab, range(1, n + 1))
full = lab == (int(np.argmax(sizes)) + 1)          # 最大连通域 = 人物

ys, xs = np.where(full)
y0, y1, x0, x1 = int(ys.min()), int(ys.max()), int(xs.min()), int(xs.max())
fcx, fcy = (x0 + x1) / 2.0, (y0 + y1) / 2.0        # 缩放锚点 = 人物中心

# 2. 自适应各向异性镜像填充
mask_fill = ndimage.binary_dilation(full, iterations=DILATE_FILL)
mys, mxs = np.where(mask_fill)
mx0, mx1, my0, my1 = int(mxs.min()), int(mxs.max()), int(mys.min()), int(mys.max())
YY, XX = np.mgrid[0:H, 0:W]
xl = np.clip(2 * mx0 - XX, 0, W - 1)
xr = np.clip(2 * mx1 - XX, 0, W - 1)
yt = np.clip(2 * my0 - YY, 0, H - 1)
yb = np.clip(2 * my1 - YY, 0, H - 1)
hfill = np.where((XX <= (mx0 + mx1) // 2)[:, :, None], a[YY, xl], a[YY, xr])
vfill = np.where((YY <= (my0 + my1) // 2)[:, :, None], a[yt, XX], a[yb, XX])
dh = np.clip(np.minimum(XX - mx0, mx1 - XX), 0, None).astype(np.float32)
dv = np.clip(np.minimum(YY - my0, my1 - YY), 0, None).astype(np.float32)
wh, wv = (1.0 / (dh + 1.0))[:, :, None], (1.0 / (dv + 1.0))[:, :, None]
fillv = np.nan_to_num((hfill * wh + vfill * wv) / np.maximum(wh + wv, 1e-6))

# 2b. 调和插值亮度校正：内部保留镜像纹理，亮度按边界差异平滑对齐
py0, py1 = max(0, my0 - 20), min(H, my1 + 21)
px0, px1 = max(0, mx0 - 20), min(W, mx1 + 21)
sub_mask = mask_fill[py0:py1, px0:px1][:, :, None]
d_out = (a - fillv)[py0:py1, px0:px1]
d = np.where(sub_mask, 0.0, d_out)
for _ in range(700):                                # Jacobi 迭代求调和插值
    nb = (np.roll(d, 1, 0) + np.roll(d, -1, 0) + np.roll(d, 1, 1) + np.roll(d, -1, 1)) * 0.25
    d = np.where(sub_mask, nb, d_out)
fillv[py0:py1, px0:px1] += d * sub_mask

# 2c. 合成：羽化边界落在 mask 外缘（此处镜像值与原图天然连续）
alpha = np.clip(ndimage.gaussian_filter(mask_fill.astype(np.float32), 3.0) * 1.35, 0, 1)
clean = a * (1 - alpha[:, :, None]) + fillv * alpha[:, :, None]
soft = ndimage.gaussian_filter(clean, sigma=(1.4, 1.4, 0))   # 辉光核心本就是柔焦
grain = np.random.default_rng(20260914).normal(0, GRAIN_SIGMA, (H, W, 1)).astype(np.float32)
clean = clean * (1 - alpha[:, :, None]) + (soft + grain) * alpha[:, :, None]

# 3. 以人物中心为锚点缩放人物
b = 3
cy0, cy1 = max(0, y0 - b), min(H, y1 + b + 1)
cx0, cx1 = max(0, x0 - b), min(W, x1 + b + 1)
fig = Image.fromarray(a[cy0:cy1, cx0:cx1].astype(np.uint8)).convert('RGBA')
fig.putalpha(Image.fromarray((full[cy0:cy1, cx0:cx1] * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0)))
sw, sh = max(1, int(round(fig.width * SCALE))), max(1, int(round(fig.height * SCALE)))
small = fig.resize((sw, sh), Image.LANCZOS)
base = Image.fromarray(np.clip(clean, 0, 255).astype(np.uint8))
base.paste(small, (int(round(fcx - sw / 2.0)), int(round(fcy - sh / 2.0))), small)

# 4. 中央光效压暗（径向衰减；人物本体 28px 内保护，避免剪影被吃掉）
out = np.asarray(base).astype(np.float32)
r = np.sqrt((XX - fcx) ** 2 + (YY - fcy) ** 2)
dip = 1.0 - 0.42 * np.exp(-(r / 240.0) ** 2) - 0.17 * np.exp(-(r / 640.0) ** 2)
prot = np.clip((r - 28.0) / 70.0, 0, 1)
out = out * (1.0 - (1.0 - dip) * prot)[:, :, None]

Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(OUT)
print('figure %dx%d -> %dx%d (%.0f%%)  pivot=centre (%.1f,%.1f)' % (fig.width, fig.height, sw, sh, SCALE * 100, fcx, fcy))
print('saved', OUT)
