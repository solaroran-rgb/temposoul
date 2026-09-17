"""10 组八字四柱交叉校对：TempoSoul core vs lunar-python（钟表时，不校正）。
年月日柱应完全一致；时柱差异 = 真太阳时校正。
"""
import json
from lunar_python import Solar

# TempoSoul 本地结果（从 run_local.mjs 输出）
TS = {
    "01_normal":    {"y":"庚午","m":"壬午","d":"辛亥","h":"癸巳","h_name":"巳时",
                     "input":{"y":1990,"m":6,"d":15,"h":10,"mi":30}},
    "02_early_zi":  {"y":"戊辰","m":"乙卯","d":"壬戌","h":"庚子","h_name":"早子时",
                     "input":{"y":1988,"m":3,"d":8,"h":0,"mi":30}},
    "03_late_zi":   {"y":"乙亥","m":"丁亥","d":"戊午","h":"壬子","h_name":"晚子时",
                     "input":{"y":1995,"m":11,"d":22,"h":23,"mi":45}},
    "04_lichun":    {"y":"辛未","m":"辛丑","d":"庚戌","h":"丙戌","h_name":"戌时",
                     "input":{"y":1992,"m":2,"d":4,"h":21,"mi":30}},
    "05_dongzhi":   {"y":"庚辰","m":"戊子","d":"癸丑","h":"丙辰","h_name":"辰时",
                     "input":{"y":2000,"m":12,"d":21,"h":8,"mi":15}},
    "06_dst":       {"y":"丁卯","m":"丙午","d":"乙未","h":"壬午","h_name":"午时",
                     "input":{"y":1987,"m":6,"d":15,"h":14,"mi":20,"dst":True}},
    "07_leap":      {"y":"甲子","m":"丙寅","d":"癸巳","h":"庚申","h_name":"申时",
                     "input":{"y":1984,"m":2,"d":29,"h":16,"mi":40}},
    "08_urumqi":    {"y":"癸酉","m":"庚申","d":"辛酉","h":"癸巳","h_name":"巳时",
                     "input":{"y":1993,"m":8,"d":8,"h":12,"mi":0}},
    "09_newyork":   {"y":"辛未","m":"甲午","d":"乙亥","h":"庚辰","h_name":"辰时",
                     "input":{"y":1991,"m":7,"d":4,"h":9,"mi":15}},
    "10_leap_month":{"y":"丁卯","m":"丁未","d":"庚辰","h":"戊寅","h_name":"寅时",
                     "input":{"y":1987,"m":7,"d":30,"h":6,"mi":0}},
}

print(f"{'#':<18} {'TempoSoul':<28} {'lunar-py(钟表时)':<28} {'年/月/日':<10}")
print("-"*90)
results = []
for cid, ts in TS.items():
    i = ts["input"]
    h, mi = i["h"], i["mi"]
    if i.get("dst"):
        h -= 1  # 夏令时回退
    s = Solar.fromYmdHms(i["y"], i["m"], i["d"], h, mi, 0)
    l = s.getLunar()
    ec = l.getEightChar()
    lp = {"y": ec.getYear(), "m": ec.getMonth(), "d": ec.getDay(), "h": ec.getTime()}
    # 年月日柱对比
    ymd_match = (ts["y"] == lp["y"] and ts["m"] == lp["m"] and ts["d"] == lp["d"])
    # 时柱对比（可能因真太阳时校正不同）
    h_match = ts["h"] == lp["h"]
    status = "✅年日月同" if ymd_match else "❌年日月异"
    if ymd_match and h_match:
        h_note = "时柱同"
    elif ymd_match:
        h_note = f"时柱异(真太阳时校正 TS={ts['h']} 钟表={lp['h']})"
    else:
        h_note = "需排查"
    print(f"{cid:<18} {ts['y']} {ts['m']} {ts['d']} {ts['h']:<6} {lp['y']} {lp['m']} {lp['d']} {lp['h']:<6} {status} {h_note}")
    results.append({"id": cid, "ts": ts, "lp": lp, "ymd_match": ymd_match, "h_match": h_match})

ymd_total = len(results)
ymd_pass = sum(1 for r in results if r["ymd_match"])
print(f"\n年/月/日柱一致率：{ymd_pass}/{ymd_total}")
h_total = sum(1 for r in results if r["ymd_match"])
h_pass = sum(1 for r in results if r["ymd_match"] and r["h_match"])
print(f"时柱一致率（含真太阳时差异）：{h_pass}/{h_total}")
