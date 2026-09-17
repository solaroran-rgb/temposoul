# -*- coding: utf-8 -*-
"""BP1 命名基准核对：拟新增 core 键 vs T3 terms CSV 现行键 逐一比对。"""
import csv
import io
import sys

sys.stdout.reconfigure(encoding="utf-8")
CSV = r"docs\audit\2026-09-13-上线前加固\thread-03-多语言翻译实现与准确性\output\terms\7lang-terms.csv"
rows = list(csv.DictReader(io.open(CSV, encoding="utf-8-sig")))
by_key = {r["archetype_key"]: r["zh"] for r in rows}
by_zh = {}
for r in rows:
    by_zh.setdefault(r["zh"], []).append(r["archetype_key"])

STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
STEM_PY = ["jia", "yi", "bing", "ding", "wu", "ji", "geng", "xin", "ren", "gui"]
BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
BRANCH_PY = ["zi", "chou", "yin", "mao", "chen", "si", "wu", "wei", "shen", "you", "xu", "hai"]
ZODIACS = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"]
ZODIAC_PY = ["shu", "niu", "hu", "tu", "long", "she", "ma", "yang", "hou", "ji", "gou", "zhu"]
WUXING = ["木", "火", "土", "金", "水"]
WUXING_PY = ["mu", "huo", "tu", "jin", "shui"]
SHISHEN = ["比肩", "劫财", "食神", "伤官", "偏财", "正财", "七杀", "正官", "偏印", "正印"]
SHISHEN_PY = ["bijian", "jiecai", "shishen", "shangguan", "piancai", "zhengcai", "qisha", "zhengguan", "pianyin", "zhengyin"]

def check(prefix, zhs, pys, label):
    miss = []
    for zh, py in zip(zhs, pys):
        key = "%s:%s" % (prefix, py)
        if key not in by_key:
            miss.append((zh, key, by_zh.get(zh, ["<无该zh行>"])))
    print(label, "OK" if not miss else "MISS", miss if miss else "")

check("bazi:stem", STEMS, STEM_PY, "天干10:")
check("bazi:branch", BRANCHES, BRANCH_PY, "地支12:")
check("bazi:zodiac", ZODIACS, ZODIAC_PY, "生肖12:")
check("bazi:wuxing", WUXING, WUXING_PY, "五行5:")
check("bazi:shishen", SHISHEN, SHISHEN_PY, "十神10:")

# 60 甲子：stem_py+branch_py 连写
jiazi_miss = []
for i in range(60):
    zh = STEMS[i % 10] + BRANCHES[i % 12]
    key = "bazi:jiazi:%s%s" % (STEM_PY[i % 10], BRANCH_PY[i % 12])
    if key not in by_key:
        jiazi_miss.append((zh, key, by_zh.get(zh, ["<无>"])))
print("六十甲子60:", "OK" if not jiazi_miss else "MISS", jiazi_miss[:6], "…共%d" % len(jiazi_miss))

# 64 卦：列出 CSV 里 yijing:gua 全部键供生成器使用
gua = sorted((k, v) for k, v in by_key.items() if k.startswith("yijing:gua:"))
print("yijing:gua 键数:", len(gua))
print("样例:", gua[:4])
