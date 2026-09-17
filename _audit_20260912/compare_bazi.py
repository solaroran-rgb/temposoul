"""A468 红线重审 · 八字准确度对比。

TempoSoul 线上 API vs lunar-python（业界标准开源库，被卜易居/元亨利贞广泛使用）。
10 组覆盖边界：普通/早子时/晚子时/立春交接/节气交接/夏令时/闰年/西疆/海外/闰月。
"""
import json
import os
import time
import urllib.request
import urllib.error
from lunar_python import Solar

BASE = "https://www.temposoul.com/api/v1"
HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "results")
os.makedirs(OUT, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0",
      "Accept": "application/json", "Origin": "https://www.temposoul.com",
      "Referer": "https://www.temposoul.com/"}

# 10 组测试用例（公历输入，统一口径：北京时间/真太阳时校正）
CASES = [
    {"id": "01_normal",   "desc": "普通白天 1990-06-15 10:30 北京",
     "y":1990,"m":6,"d":15,"h":10,"mi":30,"gender":"male","lon":116.407,"tz":8},
    {"id": "02_early_zi",  "desc": "早子时 1988-03-08 00:30 上海",
     "y":1988,"m":3,"d":8,"h":0,"mi":30,"gender":"female","lon":121.473,"tz":8},
    {"id": "03_late_zi",   "desc": "晚子时 1995-11-22 23:45 广州",
     "y":1995,"m":11,"d":22,"h":23,"mi":45,"gender":"male","lon":113.264,"tz":8},
    {"id": "04_lichun",    "desc": "立春交接 1992-02-04 21:30 成都",
     "y":1992,"m":2,"d":4,"h":21,"mi":30,"gender":"female","lon":104.066,"tz":8},
    {"id": "05_dongzhi",   "desc": "冬至交接 2000-12-21 08:15 哈尔滨",
     "y":2000,"m":12,"d":21,"h":8,"mi":15,"gender":"male","lon":126.534,"tz":8},
    {"id": "06_dst",       "desc": "夏令时 1987-06-15 14:20 西安",
     "y":1987,"m":6,"d":15,"h":14,"mi":20,"gender":"female","lon":108.940,"tz":8,"dst":True},
    {"id": "07_leap",      "desc": "闰年 1984-02-29 16:40 武汉",
     "y":1984,"m":2,"d":29,"h":16,"mi":40,"gender":"male","lon":114.305,"tz":8},
    {"id": "08_urumqi",    "desc": "西疆 1993-08-08 12:00 乌鲁木齐",
     "y":1993,"m":8,"d":8,"h":12,"mi":0,"gender":"female","lon":87.617,"tz":8},
    {"id": "09_newyork",   "desc": "纽约 1991-07-04 09:15",
     "y":1991,"m":7,"d":4,"h":9,"mi":15,"gender":"male","lon":-74.006,"tz":-4,"tzid":"America/New_York"},
    {"id": "10_leap_month","desc": "闰六月 1987-07-30 06:00 北京",
     "y":1987,"m":7,"d":30,"h":6,"mi":0,"gender":"female","lon":116.407,"tz":8},
]


def post(path, payload, retries=3):
    url = f"{BASE}/{path}"
    for i in range(retries):
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(url, data=data, method="POST",
                                     headers={**UA, "Content-Type": "application/json"})
        t0 = time.time()
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="replace")
            try:
                parsed = json.loads(body)
            except Exception:
                parsed = {"raw": body[:300]}
            if e.code >= 500 and i < retries - 1:
                time.sleep(1.5 * (i + 1))
                continue
            return {"ok": False, "http": e.code, "error": parsed}
        except Exception as e:
            if i < retries - 1:
                time.sleep(1.5 * (i + 1))
                continue
            return {"ok": False, "error": str(e)}


def temposoul_bazi(c):
    req = {
        "gender": c["gender"], "year": c["y"], "month": c["m"], "day": c["d"],
        "dateType": "solar", "birthHour": c["h"], "birthMinute": c["mi"],
        "birthLongitude": c["lon"], "useTrueSolarTime": True,
    }
    if "tzid" in c:
        req["timeZoneId"] = c["tzid"]
    else:
        req["timezone"] = c["tz"]
    if c.get("dst"):
        req["applyChinaDst"] = True
    r = post("bazi/calculate", req)
    if not r.get("ok"):
        return None, r
    d = r["data"]
    p = d["pillars"]
    return {
        "year": p["year"]["ganZhi"], "month": p["month"]["ganZhi"],
        "day": p["day"]["ganZhi"], "hour": p["hour"]["ganZhi"],
        "dayMaster": d["dayMaster"]["gan"],
        "lunar": f"{d['lunarDate']['monthName']}{d['lunarDate']['dayName']}",
        "timeName": d["timeInfo"]["name"],
    }, req


def lunar_python_bazi(c):
    """独立基准：lunar-python 默认按节气换月、按 23:00 换日（晚子时归次日）。
    注意：lunar-python 默认不做真太阳时校正，这里直接用公历时间。
    """
    # 夏令时：1987-06-15 14:20 北京时间，实际钟表时间是 14:20（夏令时拨快1小时）
    # 真实标准时 = 13:20。TempoSoul applyChinaDst=true 会自动减1小时。
    h, mi = c["h"], c["mi"]
    if c.get("dst"):
        h -= 1  # 夏令时回退
    s = Solar.fromYmdHms(c["y"], c["m"], c["d"], h, mi, 0)
    l = s.getLunar()
    ec = l.getEightChar()
    return {
        "year": ec.getYear(), "month": ec.getMonth(),
        "day": ec.getDay(), "hour": ec.getTime(),
        "dayMaster": ec.getDayGan(),
        "lunar": f"{l.getMonthInChinese()}{l.getDayInChinese()}",
    }


def main():
    rows = []
    for c in CASES:
        print(f"\n=== {c['id']} · {c['desc']} ===")
        ts, req = temposoul_bazi(c)
        lp = lunar_python_bazi(c)
        if ts is None:
            print("  TempoSoul FAIL:", req)
            rows.append({"id": c["id"], "desc": c["desc"], "error": req})
            continue
        match = (ts["year"] == lp["year"] and ts["month"] == lp["month"]
                 and ts["day"] == lp["day"] and ts["hour"] == lp["hour"])
        print(f"  TempoSoul : {ts['year']} {ts['month']} {ts['day']} {ts['hour']}  日主={ts['dayMaster']} 农历={ts['lunar']}")
        print(f"  lunar-py  : {lp['year']} {lp['month']} {lp['day']} {lp['hour']}  日主={lp['dayMaster']} 农历={lp['lunar']}")
        print(f"  MATCH: {'YES' if match else 'NO'}")
        rows.append({
            "id": c["id"], "desc": c["desc"],
            "temposoul": ts, "lunar_python": lp, "match": match,
        })
    out = os.path.join(OUT, "bazi_compare.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    n_match = sum(1 for r in rows if r.get("match"))
    n_total = sum(1 for r in rows if "match" in r)
    print(f"\n=== 四柱一致率：{n_match}/{n_total} ===")
    print(f"详细结果 -> {out}")


if __name__ == "__main__":
    main()
