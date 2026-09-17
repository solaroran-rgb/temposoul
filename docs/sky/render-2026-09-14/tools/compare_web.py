# -*- coding: utf-8 -*-
"""compare_web.py —— 真网页版 vs 设计稿 CT-1：全图 + 分区（背景区/文字区）诚实对拍。
背景区 = 原场景层（应高度一致）；文字区 = HTML 渲染（必然有字形差，如实报告）。"""
import io, os, json
import numpy as np
from PIL import Image

REF = r"E:\KnowledgeOS\项目库\TempoSoul 命律 网站建设系统\docs\design\baseline\SKY-BASELINE-CT1.png"
SHOT = r"C:\temp\tsprev\web_W1-fixed1920-good.png"

# 设计稿文字区域（1920×969）
TEXT_ZONES = {
    "标题(title)":   (106, 214, 730, 1375),
    "副标题(sub)":   (222, 278, 765, 1155),
    "CTA按钮":       (332, 436, 845, 1135),
}

def load(p):
    return np.asarray(Image.open(p).convert("RGB"), dtype=np.int16)

a, b = load(REF), load(SHOT)
print("参考:", a.shape, "| 渲染:", b.shape)
assert a.shape == b.shape, "尺寸不一致，无法对拍"

d = np.abs(a - b)
def report(name, sub_a=None, sub_b=None):
    if sub_a is None: sub_a, sub_b = a, b
    dd = np.abs(sub_a - sub_b)
    if dd.ndim < 3: dd = dd.reshape(-1, 1)
    mse = float((dd.astype(np.float64) ** 2).mean())
    psnr = float("inf") if mse == 0 else 10 * np.log10(255.0 ** 2 / mse)
    mx = dd.max(axis=-1)
    exact = float((mx == 0).mean() * 100)
    le2 = float((mx <= 2).mean() * 100)
    le8 = float((mx <= 8).mean() * 100)
    print("%-20s PSNR=%-8s max=%3d mean=%6.3f  exact=%7.4f%%  diff<=2:%7.2f%%  diff<=8:%7.2f%%"
          % (name, ("inf" if psnr == float("inf") else "%.2f" % psnr),
             int(dd.max()), float(dd.mean()), exact, le2, le8))
    return {"psnr": (None if psnr == float("inf") else round(psnr, 2)),
            "maxdiff": int(dd.max()), "meandiff": round(float(dd.mean()), 4),
            "exact": round(exact, 4), "le2": round(le2, 4), "le8": round(le8, 4)}

out = {}
print("=" * 108)
out["全图"] = report("全图")

# 构建背景掩码（挖掉文字区 + 少量外扩）
H, W = a.shape[:2]
mask = np.ones((H, W), bool)
PAD = 6
for (y0, y1, x0, x1) in TEXT_ZONES.values():
    mask[max(0, y0 - PAD):min(H, y1 + PAD), max(0, x0 - PAD):min(W, x1 + PAD)] = False
print("-" * 108)
out["背景区(文字已挖除)"] = report("背景区(非文字)", a[mask], b[mask])

print("-" * 108)
for k, (y0, y1, x0, x1) in TEXT_ZONES.items():
    out[k] = report(k, a[y0:y1, x0:x1], b[y0:y1, x0:x1])

# 差异热力定位（横带）
print("-" * 108)
bands = 10
print("差异横带定位（每带 exact%）:")
band_info = []
for i in range(bands):
    y0, y1 = H * i // bands, H * (i + 1) // bands
    ds = d[y0:y1]
    ex = float((ds.max(axis=2) == 0).mean() * 100)
    band_info.append({"band": "%d-%d" % (y0, y1), "exact": round(ex, 2),
                      "mean": round(float(ds.mean()), 3)})
    print("  y[%4d,%4d)  exact=%6.2f%%  mean=%6.3f" % (y0, y1, ex, float(ds.mean())))
out["横带"] = band_info

# 差异热力图
hm = (np.clip(d.max(axis=2), 0, 64) * 4).astype(np.uint8)
Image.fromarray(hm).save(r"C:\temp\tsprev\web_diff_heat.png")
print("\n差异热力图 -> C:\\temp\\tsprev\\web_diff_heat.png")

io.open(r"C:\temp\tsprev\_web_gate.json", "w", encoding="utf-8").write(
    json.dumps(out, ensure_ascii=False, indent=2))
print("门禁报告 -> C:\\temp\\tsprev\\_web_gate.json")
