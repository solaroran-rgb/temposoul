# -*- coding: utf-8 -*-
"""批量像素对拍门禁：所有场景截图 vs 设计稿 CT-1。"""
import numpy as np, os, json, glob
from PIL import Image

CT1 = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
D = r"C:\temp\tsprev"
ref = Image.open(CT1).convert("RGB")
A = np.asarray(ref).astype(np.float32)

def cmp(shot):
    got = Image.open(shot).convert("RGB")
    scaled = False
    if got.size != ref.size:
        got = got.resize(ref.size, Image.LANCZOS); scaled = True
    B = np.asarray(got).astype(np.float32)
    d = np.abs(A - B)
    mse = float((d ** 2).mean())
    psnr = float("inf") if mse == 0 else 10 * np.log10(255.0 * 255.0 / mse)
    return dict(file=os.path.basename(shot), scaled=scaled, psnr=(None if mse == 0 else round(psnr, 2)),
                maxdiff=float(d.max()), meandiff=round(float(d.mean()), 4),
                exact=round(float((d.max(axis=2) == 0).mean() * 100), 4),
                le2=round(float((d.max(axis=2) <= 2).mean() * 100), 4),
                gt8=round(float((d.max(axis=2) > 8).mean() * 100), 4))

shots = sorted(glob.glob(os.path.join(D, "pure_*.png")))
rows = []
print("=== 像素对拍门禁（vs CT-1 1920×969）===")
print("  %-30s %8s %8s %9s %9s %8s %s" % ("场景截图", "PSNR", "最大差", "均差", "完全一致%", "≤2差%", "判定"))
for s in shots:
    r = cmp(s); rows.append(r)
    if r['psnr'] is None: v = "PASS-F100"
    elif r['psnr'] >= 48: v = "PASS-F100*"
    elif r['psnr'] >= 42: v = "PASS-F99"
    elif r['psnr'] >= 34: v = "PASS-F95"
    else: v = "FAIL"
    print("  %-30s %8s %8.0f %9.4f %9.4f %8.3f %s" % (
        r['file'], ("∞" if r['psnr'] is None else "%.2f" % r['psnr']), r['maxdiff'],
        r['meandiff'], r['exact'], r['le2'], v))

# 汇总
f100 = [r for r in rows if r['psnr'] is None]
print("\n  逐像素完全一致（PSNR=∞）的场景数：%d / %d" % (len(f100), len(rows)))
for r in f100: print("    ✓ %s" % r['file'])
json.dump(rows, open(os.path.join(D, "gate_report.json"), "w"), indent=1)
print("\n  报告 -> %s" % os.path.join(D, "gate_report.json"))
