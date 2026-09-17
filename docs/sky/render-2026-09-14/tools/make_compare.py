# -*- coding: utf-8 -*-
"""make_compare.py —— 出「设计稿 | 真网页渲染 | 差异热力」三联对照图 + 文字区放大对照。"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont

REF = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
SHOT = r"C:\temp\tsprev\web_W1-fixed1920-good.png"
OUT = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\sky\render-2026-09-14\evidence"

ref = Image.open(REF).convert("RGB")
shot = Image.open(SHOT).convert("RGB")
assert ref.size == shot.size, (ref.size, shot.size)
W, H = ref.size

a = np.asarray(ref, np.int16); b = np.asarray(shot, np.int16)
d = np.abs(a - b).max(axis=2)

# 差异热力图：0-32 映射到 0-255（黑=一致，亮=有差异）
heat = Image.fromarray(np.clip(d * 8, 0, 255).astype(np.uint8)).convert("RGB")
# 叠色：一致处压暗原图，差异处标红
vis = (np.asarray(ref, np.float32) * 0.30).astype(np.uint8)
vis = np.stack([vis[...,0], vis[...,1], np.clip(vis[...,2] + (d>2)*220, 0, 255)], axis=-1)
vis = np.clip(np.stack([np.clip(vis[...,0].astype(np.int16) + (d>2)*200, 0, 255),
                        vis[...,1], vis[...,2]], -1), 0, 255).astype(np.uint8)
heat_map = Image.fromarray(vis)

try:
    font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 30)
    font2 = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 24)
except Exception:
    font = font2 = ImageFont.load_default()

def label(img, txt):
    im = img.copy(); dr = ImageDraw.Draw(im)
    dr.rectangle([0, 0, im.width, 46], fill=(0, 0, 0))
    dr.text((12, 6), txt, fill=(57, 255, 20), font=font)
    return im

def stack(rows, gap=10, bg=(10, 12, 16)):
    w = max(r.width for r in rows); h = sum(r.height for r in rows) + gap * (len(rows) - 1)
    c = Image.new("RGB", (w, h), bg); y = 0
    for r in rows:
        c.paste(r, (0, y)); y += r.height + gap
    return c

# ① 全图三联（纵向，便于逐眼对照）
out1 = stack([label(ref, "① 设计稿 CT-1（AI 效果图）"),
              label(shot, "② 真网页渲染 home-web.html（背景=场景层 / 文字=真 DOM）"),
              label(heat_map, "③ 差异定位（亮红 = 与设计稿不同之处）")])
out1.save(OUT + r"\07-真网页版_三联对照.png", optimize=True)

# ② 文字区放大对照（设计稿 vs 渲染），横向并排
zones = [(90, 230, 620, 1470), (208, 292, 700, 1220), (320, 448, 820, 1160)]
tiles = []
for (y0, y1, x0, x1) in zones:
    r1 = ref.crop((x0, y0, x1, y1)).resize((int((x1-x0)*1.5), int((y1-y0)*1.5)), Image.LANCZOS)
    r2 = shot.crop((x0, y0, x1, y1)).resize(r1.size, Image.LANCZOS)
    t = Image.new("RGB", (r1.width, r1.height*2 + 8), (0, 0, 0))
    t.paste(r1, (0, 0)); t.paste(r2, (0, r1.height + 8))
    tiles.append(t)
mw = max(t.width for t in tiles)
mb = Image.new("RGB", (mw, sum(t.height for t in tiles) + 16*len(tiles)), (8, 10, 14))
y = 0
for t in tiles:
    mb.paste(t, (0, y)); y += t.height + 16
dr = ImageDraw.Draw(mb)
dr.rectangle([0, 0, mb.width, 46], fill=(0, 0, 0))
dr.text((12, 6), "文字区放大对照 — 上：设计稿 / 下：真网页渲染（同字高，合成窄化对齐跨度）", fill=(57,255,20), font=font)
mb.save(OUT + r"\08-真网页版_文字区放大对照.png", optimize=True)

print("① 三联对照 ->", OUT + r"\07-真网页版_三联对照.png")
print("② 文字放大 ->", OUT + r"\08-真网页版_文字区放大对照.png")
print("差异统计: exact=%.4f%%  max=%d  mean=%.4f" % ((d==0).mean()*100, d.max(), d.mean()))
