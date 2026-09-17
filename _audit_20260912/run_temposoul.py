"""A468 红线重审：10 组生辰 × TempoSoul 排盘 API 实测脚本。

覆盖边界：普通/早子时/晚子时/立春交接/节气交接/夏令时/闰年/闰月/西疆经度/海外。
所有输出落盘到 ./results/ 目录。
"""
import json
import os
import sys
import time
import urllib.request
import urllib.error

BASE = "https://www.temposoul.com/api/v1"
OUT_DIR = os.path.join(os.path.dirname(__file__), "results")
os.makedirs(OUT_DIR, exist_ok=True)

# 10 组生辰（公历），覆盖边界场景
CASES = [
    {
        "id": "01_normal_day",
        "desc": "普通白天·北京",
        "req": {"gender": "male", "year": 1990, "month": 6, "day": 15,
                "dateType": "solar", "birthHour": 10, "birthMinute": 30,
                "birthPlace": "北京", "birthLongitude": 116.407,
                "timezone": 8, "useTrueSolarTime": True},
    },
    {
        "id": "02_early_zi",
        "desc": "早子时 00:30·上海",
        "req": {"gender": "female", "year": 1988, "month": 3, "day": 8,
                "dateType": "solar", "birthHour": 0, "birthMinute": 30,
                "birthPlace": "上海", "birthLongitude": 121.473,
                "timezone": 8, "useTrueSolarTime": True},
    },
    {
        "id": "03_late_zi",
        "desc": "晚子时 23:45·广州",
        "req": {"gender": "male", "year": 1995, "month": 11, "day": 22,
                "dateType": "solar", "birthHour": 23, "birthMinute": 45,
                "birthPlace": "广州", "birthLongitude": 113.264,
                "timezone": 8, "useTrueSolarTime": True},
    },
    {
        "id": "04_lichun_boundary",
        "desc": "立春交接日 1992-02-04·成都",
        "req": {"gender": "female", "year": 1992, "month": 2, "day": 4,
                "dateType": "solar", "birthHour": 21, "birthMinute": 30,
                "birthPlace": "成都", "birthLongitude": 104.066,
                "timezone": 8, "useTrueSolarTime": True},
    },
    {
        "id": "05_solar_term",
        "desc": "冬至交接 2000-12-21·哈尔滨",
        "req": {"gender": "male", "year": 2000, "month": 12, "day": 21,
                "dateType": "solar", "birthHour": 8, "birthMinute": 15,
                "birthPlace": "哈尔滨", "birthLongitude": 126.534,
                "timezone": 8, "useTrueSolarTime": True},
    },
    {
        "id": "06_dst_1987",
        "desc": "夏令时期间 1987-06-15 14:20·西安",
        "req": {"gender": "female", "year": 1987, "month": 6, "day": 15,
                "dateType": "solar", "birthHour": 14, "birthMinute": 20,
                "birthPlace": "西安", "birthLongitude": 108.940,
                "timezone": 8, "applyChinaDst": True,
                "useTrueSolarTime": True},
    },
    {
        "id": "07_leap_day",
        "desc": "闰年 2/29 1984-02-29 16:40·武汉",
        "req": {"gender": "male", "year": 1984, "month": 2, "day": 29,
                "dateType": "solar", "birthHour": 16, "birthMinute": 40,
                "birthPlace": "武汉", "birthLongitude": 114.305,
                "timezone": 8, "useTrueSolarTime": True},
    },
    {
        "id": "08_urumqi",
        "desc": "西疆经度·乌鲁木齐 1993-08-08 12:00",
        "req": {"gender": "female", "year": 1993, "month": 8, "day": 8,
                "dateType": "solar", "birthHour": 12, "birthMinute": 0,
                "birthPlace": "乌鲁木齐", "birthLongitude": 87.617,
                "timezone": 8, "useTrueSolarTime": True},
    },
    {
        "id": "09_newyork",
        "desc": "海外出生·纽约 1991-07-04 09:15",
        "req": {"gender": "male", "year": 1991, "month": 7, "day": 4,
                "dateType": "solar", "birthHour": 9, "birthMinute": 15,
                "birthPlace": "New York", "birthLongitude": -74.006,
                "timeZoneId": "America/New_York",
                "useTrueSolarTime": True},
    },
    {
        "id": "10_lunar_leap",
        "desc": "农历闰月·1987 闰六月初五 卯时",
        "req": {"gender": "female", "year": 1987, "month": 7, "day": 30,
                "dateType": "lunar", "isLeapMonth": True,
                "birthHour": 6, "birthMinute": 0,
                "birthPlace": "北京", "birthLongitude": 116.407,
                "timezone": 8, "useTrueSolarTime": True},
    },
]

# 需要遍历的板块（生辰型排盘端点）
ENDPOINTS = [
    "bazi/calculate",
    "ziwei/calculate",
    "divination/astrolabe",
    "metaphysics/qizheng/calculate",
    "divination/liuyao",       # 需时间起卦
    "divination/meihua",       # 时间起卦
    "divination/qimen",        # 时间起局
    "divination/liuren",       # 时间起课
    "metaphysics/bazhai/calculate",
    "metaphysics/xuankong/calculate",
    "metaphysics/taiyi/calculate",
    "metaphysics/wuyun-liuqi/calculate",
    "metaphysics/huangji-jingshi/calculate",
    "divination/ssgw",         # 称骨
    "divination/almanac",      # 择日
]


def post(path, payload, timeout=30):
    url = f"{BASE}/{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST",
                                 headers={
                                     "Content-Type": "application/json",
                                     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
                                     "Accept": "application/json",
                                     "Origin": "https://www.temposoul.com",
                                     "Referer": "https://www.temposoul.com/",
                                 })
    t0 = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8")
            return {"http": resp.status, "ms": int((time.time() - t0) * 1000),
                    "body": json.loads(body)}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(body)
        except Exception:
            parsed = {"raw": body[:500]}
        return {"http": e.code, "ms": int((time.time() - t0) * 1000),
                "body": parsed}
    except Exception as e:
        return {"http": -1, "ms": int((time.time() - t0) * 1000),
                "body": {"error": str(e)}}


def main():
    summary = []
    for case in CASES:
        cid = case["id"]
        print(f"\n=== {cid} · {case['desc']} ===")
        case_dir = os.path.join(OUT_DIR, cid)
        os.makedirs(case_dir, exist_ok=True)
        with open(os.path.join(case_dir, "_input.json"), "w", encoding="utf-8") as f:
            json.dump(case, f, ensure_ascii=False, indent=2)
        for ep in ENDPOINTS:
            # 部分端点需要独立入参，先复用 bazi req 试试
            payload = case["req"]
            r = post(ep, payload)
            safe_ep = ep.replace("/", "__")
            fp = os.path.join(case_dir, f"{safe_ep}.json")
            with open(fp, "w", encoding="utf-8") as f:
                json.dump(r, f, ensure_ascii=False, indent=2)
            ok = r["body"].get("ok") if isinstance(r["body"], dict) else None
            summary.append({"case": cid, "endpoint": ep, "http": r["http"],
                            "ms": r["ms"], "ok": ok,
                            "err": r["body"].get("error", {}).get("message") if isinstance(r["body"], dict) and not ok else None})
            print(f"  {ep:40s} http={r['http']} {r['ms']}ms ok={ok}")
    with open(os.path.join(OUT_DIR, "_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(f"\nSummary -> {os.path.join(OUT_DIR, '_summary.json')}")


if __name__ == "__main__":
    main()
