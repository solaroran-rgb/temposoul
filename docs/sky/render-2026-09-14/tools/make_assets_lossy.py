# -*- coding: utf-8 -*-
"""找「视觉无损」压缩档：体积 vs PSNR 性价比，含 AVIF。"""
import numpy as np, os, json
from PIL import Image
try:
    import pillow_avif  # noqa
except Exception:
    pass

SRC = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
OUT = r"D:\workbuddy\2026-09-14-09-43-10\_assets"
A = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)

def psnr_of(path):
    B = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    if B.shape != A.shape:
        return None, None, None
    D = np.abs(A - B)
    mse = float((D ** 2).mean())
    p = float("inf") if mse == 0 else 10 * np.log10(255.0 * 255.0 / mse)
    return p, float(D.mean()), float((D.max(axis=2) == 0).mean() * 100)

res = []
print("=== WebP lossy ===")
print("  档位        宽  体积KB   PSNR    均差   完全一致%")
for w in (1920, 1080):
    h = int(round(969 * w / 1920))
    im = Image.open(SRC).convert("RGB").resize((w, h), Image.LANCZOS)
    for q in (98, 95, 92, 88, 82):
        p = os.path.join(OUT, "lossy_w%d_q%d.webp" % (w, q))
        im.save(p, "WEBP", quality=q, method=6)
        kb = os.path.getsize(p) / 1024
        if w == 1920:
            ps, md, ex = psnr_of(p)
            print("  WebP q%-3d  %5d  %7.1f  %6.2f  %6.3f  %7.3f%%" % (q, w, kb, ps, md, ex))
            res.append(dict(fmt="webp", q=q, w=w, kb=kb, psnr=ps, meandiff=md, exact=ex))
        else:
            print("  WebP q%-3d  %5d  %7.1f" % (q, w, kb))

print("\n=== AVIF（若编码器可用）===")
ok = False
for w in (1920,):
    h = int(round(969 * w / 1920))
    im = Image.open(SRC).convert("RGB").resize((w, h), Image.LANCZOS)
    for q in (75, 65, 55, 45):
        p = os.path.join(OUT, "lossy_w%d_q%d.avif" % (w, q))
        try:
            im.save(p, "AVIF", quality=q, speed=4)
            ok = True
        except Exception as e:
            print("  AVIF 不可用: %s" % str(e)[:90]); break
        kb = os.path.getsize(p) / 1024
        ps, md, ex = psnr_of(p)
        print("  AVIF q%-3d  %5d  %7.1f  %6.2f  %6.3f  %7.3f%%" % (q, w, kb, ps, md, ex))
        res.append(dict(fmt="avif", q=q, w=w, kb=kb, psnr=ps, meandiff=md, exact=ex))
    if not ok: break

# 结论推荐
print("\n=== 结论 ===")
cands = [r for r in res if r['psnr'] and r['psnr'] >= 42]
if cands:
    best = min(cands, key=lambda r: r['kb'])
    print("  体积最小且 PSNR>=42dB（视觉无损门槛）：%s q%d  %.1fKB  PSNR %.2f  完全一致 %.2f%%"
          % (best['fmt'].upper(), best['q'], best['kb'], best['psnr'], best['exact']))
    for label, thr in (("无限接近（PSNR>=48）", 48), ("严格（PSNR>=50）", 50)):
        c = [r for r in res if r['psnr'] and r['psnr'] >= thr]
        if c:
            b = min(c, key=lambda r: r['kb'])
            print("  %s：%s q%d  %.1fKB  PSNR %.2f" % (label, b['fmt'].upper(), b['q'], b['kb'], b['psnr']))
json.dump(res, open(os.path.join(OUT, "lossy_report.json"), "w"), indent=1)
