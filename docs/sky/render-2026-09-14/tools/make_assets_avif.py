# -*- coding: utf-8 -*-
"""生成最终资产矩阵：无损 WebP（F100 严格档）+ AVIF q75（F99 视觉档）。"""
import os, json
from PIL import Image

SRC = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
OUT = r"D:\workbuddy\2026-09-14-09-43-10\_assets"
AR = 1920 / 969
im0 = Image.open(SRC).convert("RGB")

rows = []
print("=== 资产矩阵 ===")
print("  宽     高     A:无损WebP   B:AVIF-q75    B/A")
for w in (1920, 1440, 1080, 768, 390):
    h = int(round(969 * w / 1920))
    im = im0 if w == 1920 else im0.resize((w, h), Image.LANCZOS)
    pa = os.path.join(OUT, "plate_%d.webp" % w)
    if not os.path.exists(pa):
        im.save(pa, "WEBP", lossless=True, method=6, quality=100)
    pb = os.path.join(OUT, "plate_%d.avif" % w)
    try:
        im.save(pb, "AVIF", quality=75, speed=4)
    except Exception as e:
        print("  AVIF 编码失败 %d: %s" % (w, str(e)[:80])); pb = None
    ka = os.path.getsize(pa) / 1024
    kb = (os.path.getsize(pb) / 1024) if pb else float('nan')
    print("  %5d %5d  %9.1f KB  %9.1f KB  %5.2fx" % (w, h, ka, kb, kb/ka if pb else 0))
    rows.append(dict(w=w, h=h, ar=round(w/h, 6), lossless_webp_kb=round(ka, 1),
                     avif75_kb=round(kb, 1) if pb else None))

json.dump(rows, open(os.path.join(OUT, "matrix.json"), "w"), indent=1)
print("\n  合计（无损全档）= %.1f KB" % sum(r['lossless_webp_kb'] for r in rows))
print("  合计（AVIF全档） = %.1f KB" % sum(r['avif75_kb'] for r in rows if r['avif75_kb']))
print("\n  1080 档对比（弱网首屏关键）：无损 %.1f KB vs AVIF %.1f KB" % (rows[2]['lossless_webp_kb'], rows[2]['avif75_kb']))
