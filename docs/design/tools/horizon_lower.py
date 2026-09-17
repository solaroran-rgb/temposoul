# -*- coding: utf-8 -*-
"""
horizon_lower.py —— 把「天空 / 地面」构图按参考图重排：地平线下拉 + 地面整体压缩

用途：给定一张已经画好的 hero 图，只改「构图比例」，其他元素（天空里的星座 / 文字 / 月亮 / 光柱）保持不变。
原理：以一条水平切割线分开天空与地面 —— 天空区像素零改动，地面区整体垂直压缩；
     中间新出现的天空用「按原图统计特征程序化生成」的星空填补（零复制痕迹、零接缝）；
     若关键天空元素（如月亮）跨越切割线，则先抠出、压缩后再原位贴回。

实测教训（重要）：
  1. 图像模型（AI 生图）对「比例 / 地平线位置」类指令几乎不服从，比例一律交代码；
  2. 补天空不要用「复制原图某段天空」—— 分块偏移会留暗块/条纹，逐行偏移会把星点拉成横纹；
  3. 新天空带的亮度必须按「x 方向低频剖面」逐像素对齐上方天空，
     只用「整行均亮」校正会抹平水平差异，出现方形暗块或横向暗带；
  4. 切割线必须高于所有地面元素的最高点（否则建筑被腰斩），
     且最好高于任何跨越它的天空元素（否则月亮等被切断，需抠出后原位贴回）。

用法：
  python horizon_lower.py --src in.png --out out.png \
      --cut 494 --horizon 548 --horizon-target 659 --moon 466,542,946,1000
"""
import argparse
import numpy as np
from PIL import Image
from scipy import ndimage


def lum(x):
    return 0.2126 * x[:, :, 0] + 0.7152 * x[:, :, 1] + 0.0722 * x[:, :, 2]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--cut', type=int, required=True, help='切割线 y（须高于所有地面元素最高点）')
    ap.add_argument('--horizon', type=int, required=True, help='原视觉地平线 y（亮度骤升处）')
    ap.add_argument('--horizon-target', type=int, required=True, help='目标地平线 y')
    ap.add_argument('--moon', default='', help='跨切割线的天空元素 bbox: y0,y1,x0,x1')
    ap.add_argument('--clean', default='', help='用于统计星点的净空天空行段: y0-y1,y2-y3')
    ap.add_argument('--pillar', default='860,1060', help='中轴光柱 x 范围')
    ap.add_argument('--seed', type=int, default=20260914)
    A = ap.parse_args()

    src = Image.open(A.src).convert('RGB')
    W, H = src.size
    a = np.asarray(src).astype(np.float32)
    YH, YZ, YZ_T = A.cut, A.horizon, A.horizon_target
    k = (H - YZ_T) / (H - YZ)
    S = int(round(H - (H - YH) * k))
    gh, bh = H - S, S - YH
    print('压缩比 k=%.4f  地面 %dpx -> %dpx  新天空带 [%d,%d] %dpx' % (k, H - YH, gh, YH, S, bh))

    C0, C1 = [int(v) for v in A.pillar.split(',')]
    clean_segs = []
    if A.clean:
        for part in A.clean.split(','):
            y0, y1 = part.split('-')
            clean_segs.append((int(y0), int(y1)))
    else:
        clean_segs = [(0, YH)]

    # 1) 抠除跨线天空元素
    a_nm, patch, mbox = a, None, None
    if A.moon:
        y0, y1, x0, x1 = [int(v) for v in A.moon.split(',')]
        a_nm = a.copy()
        up = a_nm[y0 - 14:y0, x0:x1].mean(axis=0)
        dn = a_nm[y1:y1 + 14, x0:x1].mean(axis=0)
        for i, y in enumerate(range(y0, y1)):
            t = (i + 0.5) / (y1 - y0)
            a_nm[y, x0:x1] = up * (1 - t) + dn * t
        patch, mbox = a[y0:y1, x0:x1].copy(), (y0, y1, x0, x1)
        print('跨线元素已抠出', mbox)

    # 2) 星点统计
    clean = np.concatenate([a[s:e] for s, e in clean_segs], axis=0)
    Lc = lum(clean)
    bgm = ndimage.median_filter(Lc, size=25)
    mxm = ndimage.maximum_filter(Lc, size=5)
    pk = (Lc > bgm + 16) & (Lc >= mxm) & (Lc > 26)
    py, px = np.nonzero(pk)
    dens = len(py) / clean.shape[0]
    inc = (Lc[py, px] - bgm[py, px]).astype(np.float32)
    pc = clean[py, px]
    pcl = 0.2126 * pc[:, 0] + 0.7152 * pc[:, 1] + 0.0722 * pc[:, 2]
    unit = pc / np.maximum(pcl, 1.0)[:, None]
    print('净空样本 %d 行 / 星点 %d 个 / 密度 %.3f 个·行⁻¹' % (clean.shape[0], len(py), dens))

    # 3) 程序化生成新天空带
    rng = np.random.default_rng(A.seed)
    tint = a[max(0, YH - 80):YH].reshape(-1, 3).mean(axis=0)
    tint = tint / (0.2126 * tint[0] + 0.7152 * tint[1] + 0.0722 * tint[2])
    cloud = np.abs(ndimage.gaussian_filter(rng.normal(0, 1, (bh, W)).astype(np.float32), 34))
    cloud = cloud / cloud.mean() * 2.4
    gen = np.repeat(cloud[:, :, None], 3, axis=2) * tint[None, None, :]
    n = int(dens * 1.2 * bh)
    for _ in range(n):
        i = rng.integers(0, len(py))
        y = int(rng.integers(0, bh)); x = int(rng.integers(0, W))
        v = float(inc[i]) * float(rng.uniform(0.7, 1.3))
        r = 0.7 + v / 200.0
        rad = int(np.ceil(r * 2.5))
        y0, y1 = max(0, y - rad), min(bh, y + rad + 1)
        x0, x1 = max(0, x - rad), min(W, x + rad + 1)
        if y0 >= y1 or x0 >= x1:
            continue
        yy, xx = np.mgrid[y0:y1, x0:x1]
        gg = np.exp(-(((yy - y) ** 2 + (xx - x) ** 2) / (2 * r * r)))
        gen[y0:y1, x0:x1] += (gg * v)[:, :, None] * unit[i]
    prof = a[max(0, YH - 39):max(1, YH - 17), C0:C1]
    if prof.shape[0] > 3:
        pl = lum(prof.mean(axis=0)[None, :, :])[0]
        gen[:, C0:C1] += np.maximum(pl - np.percentile(pl, 25), 0)[None, :, None]
    print('生成星点 %d 个' % n)

    # 4) 低频亮度场逐像素对齐（关键：不要用整行均亮）
    gen_low = ndimage.gaussian_filter1d(lum(gen).mean(axis=0), 60)
    src_low = ndimage.gaussian_filter1d(lum(a[YH - 4:YH]).mean(axis=0), 60)
    bot_low = ndimage.gaussian_filter1d(lum(a[YH:YH + 8]).mean(axis=0), 60)
    tt = np.linspace(0, 1, bh)[:, None]
    tgt = src_low[None, :] + tt * (bot_low - src_low)[None, :]
    gen += (tgt - gen_low[None, :])[:, :, None]
    print('低频对齐：顶 %.2f -> 底 %.2f' % (tgt[0].mean(), tgt[-1].mean()))

    # 5) 组装 + 接缝羽化
    out = np.zeros_like(a)
    out[:YH] = a_nm[:YH]
    out[YH:S] = gen
    for i in range(12):
        t = i / 12.0
        out[YH + i] = out[YH + i] * t + a_nm[YH - 12 + i] * (1 - t)
    gz = Image.fromarray(a_nm[YH:].clip(0, 255).astype(np.uint8)).resize((W, gh), Image.LANCZOS)
    out[S:] = np.asarray(gz).astype(np.float32)

    # 6) 跨线元素原位贴回（只贴其自身像素，避免方形边界）
    if patch is not None:
        y0, y1, x0, x1 = mbox
        r, g, b = patch[:, :, 0], patch[:, :, 1], patch[:, :, 2]
        m = ndimage.binary_dilation((r > 40) & (r > b + 12), iterations=4)
        al = np.clip(ndimage.gaussian_filter(m.astype(np.float32), 3.0) * 1.8, 0, 1)[:, :, None]
        out[y0:y1, x0:x1] = out[y0:y1, x0:x1] * (1 - al) + patch * al
        print('元素已原位贴回', mbox)

    img = Image.fromarray(out.clip(0, 255).astype(np.uint8))
    img.save(A.out)
    L = lum(out)
    b25 = (L > 25).mean(axis=1) * 100
    yhz = next((y for y in range(int(H * .5), H) if b25[y] > 40 and b25[y:y + 10].mean() > 40), None)
    print('saved %s %s' % (A.out, img.size))
    if yhz:
        print('校验：地平线 y%d (%.1f%%)  天空 %.1f%% / 地面 %.1f%%'
              % (yhz, yhz / H * 100, yhz / H * 100, 100 - yhz / H * 100))


if __name__ == '__main__':
    main()
