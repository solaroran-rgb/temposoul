#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
词库校验脚本：线程B MVP（R3-8 修订：解析器兼容单行/多行条目 + 新增 layer_tag 校验）
校验项：
  1. (term, category) 无重复
  2. 必填字段非空（term/pinyin/category/definition/source）
  3. category 合法（在 LexiconCategory 类型联合中）
  4. 总数 ≥ 800，八字 ≥ 480，紫微 ≥ 330
  5. layer_tag 全覆盖且取值合法（L0/L1/L2/L3）
输出分类计数与通过/失败。
"""
import re, io, collections, os, sys

WT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEX_PATH = os.path.join(WT, "src", "data", "lexicon.ts")
EXTRA_PATH = os.path.join(WT, "src", "data", "lexicon-extra.ts")

# ── 合法分类列表（从 lexicon.ts type 提取）─────────────────
lex_text = io.open(LEX_PATH, encoding="utf-8", newline="").read()
valid_cats = set(re.findall(r"^\s*\| '([^']+)'", lex_text, re.M))
print("合法分类数:", len(valid_cats))

# ── 解析所有条目 ─────────────────────────────────────────────
# 条目既可能是单行（{ term: ..., source: SRC },），也可能是多行对象；
# 旧版单行正则只能匹配单行形态，会漏掉 98% 条目 → 改为逐行状态机解析。
FIELD_RE = re.compile(r"(term|pinyin|category|definition|source|layer_tag):\s*'([^']*)'")
# source 实际引用常量（source: SRC,），非引号字面量 → 单独抓
SRC_RE = re.compile(r"source:\s*([A-Za-z_$][\w$.]*)")
FIELDS = ("term", "pinyin", "category", "definition", "source", "layer_tag")

def parse_entries(path):
    txt = io.open(path, encoding="utf-8", newline="").read().replace("\r\n", "\n")
    entries, cur, inside = [], {}, False
    for line in txt.split("\n"):
        s = line.strip()
        if not inside:
            if not s.startswith("{"):
                continue
            s = s[1:]
            cur, inside = {}, True
        for k, v in FIELD_RE.findall(s):
            cur[k] = v
        for m in SRC_RE.finditer(s):
            cur["source"] = m.group(1)
        if "}" in s:
            if cur.get("term"):
                entries.append(tuple(cur.get(k, "") for k in FIELDS))
            inside = False
    return entries

base = parse_entries(LEX_PATH)
extra = parse_entries(EXTRA_PATH)
all_entries = base + extra

print("baseLexicon:", len(base))
print("lexiconExtra:", len(extra))
print("合并总数:", len(all_entries))

# ── 校验1: (term, category) 无重复 ──────────────────────────
pairs = [(t, c) for t, _, c, _, _, _ in all_entries]
pair_counts = collections.Counter(pairs)
dup_pairs = [(p, n) for p, n in pair_counts.items() if n > 1]
print("\n=== 校验1: (term, category) 重复 ===")
if dup_pairs:
    print("FAIL: 发现重复:")
    for (t, c), n in dup_pairs:
        print("  %s / %s x%d" % (t, c, n))
else:
    print("PASS: 0 重复")

# ── 校验2: 必填字段非空 ─────────────────────────────────────
missing = []
for t, p, c, d, s, _lt in all_entries:
    if not t.strip():
        missing.append(("term", "(empty)", c))
    if not p.strip():
        missing.append(("pinyin", t, c))
    if not c.strip():
        missing.append(("category", t, "(empty)"))
    if not d.strip():
        missing.append(("definition", t, c))
    if not s.strip():
        missing.append(("source", t, c))
print("\n=== 校验2: 必填字段非空 ===")
if missing:
    print("FAIL: 缺字段 %d 处:" % len(missing))
    for field, term, cat in missing[:20]:
        print("  %s 缺失: term=%s category=%s" % (field, term, cat))
else:
    print("PASS: 0 缺字段")

# ── 校验3: category 合法 ─────────────────────────────────────
invalid_cats = set()
for t, p, c, d, s, _lt in all_entries:
    if c not in valid_cats:
        invalid_cats.add(c)
print("\n=== 校验3: category 合法 ===")
if invalid_cats:
    print("FAIL: 非法分类:", invalid_cats)
else:
    print("PASS: 全部分类合法")

# ── 校验4: 数量门槛 ────────────────────────────────────────
ziwei_cats = {"紫微星曜", "十二宫", "紫微四化", "紫微格局"}
bazi_cats = {"天干","地支","五行","十神","神煞","推命体系","地支关系","干支组合",
             "十二长生","纳音","十干禄","天干五合","三合三会","基础","八字格局"}

cat_counts = collections.Counter(c for _, _, c, _, _, _ in all_entries)
ziwei_total = sum(n for c, n in cat_counts.items() if c in ziwei_cats)
bazi_total = sum(n for c, n in cat_counts.items() if c in bazi_cats)

print("\n=== 校验4: 数量门槛 ===")
print("总数: %d (要求≥800) %s" % (len(all_entries), "PASS" if len(all_entries) >= 800 else "FAIL"))
print("紫微: %d (要求≥330) %s" % (ziwei_total, "PASS" if ziwei_total >= 330 else "FAIL"))
print("八字: %d (要求≥480) %s" % (bazi_total, "PASS" if bazi_total >= 480 else "FAIL"))

# ── 校验5: layer_tag 全覆盖且合法（R3-8）────────────────────
VALID_LAYERS = {"L0", "L1", "L2", "L3"}
layer_missing = [t for t, _, _, _, _, lt in all_entries if not lt.strip()]
layer_invalid = [(t, lt) for t, _, _, _, _, lt in all_entries
                 if lt.strip() and lt not in VALID_LAYERS]
layer_counts = collections.Counter(lt for _, _, _, _, _, lt in all_entries)

print("\n=== 校验5: layer_tag 覆盖与合法性 (R3-8) ===")
if layer_missing:
    print("FAIL: %d 条缺 layer_tag，示例: %s" % (len(layer_missing), layer_missing[:10]))
else:
    print("PASS: layer_tag 全覆盖 (%d/%d)" % (len(all_entries), len(all_entries)))
if layer_invalid:
    print("FAIL: 非法 layer_tag: %s" % (layer_invalid[:10],))
else:
    print("PASS: layer_tag 取值全部合法")
for _k in sorted(layer_counts):
    print("  %s: %d" % (_k, layer_counts[_k]))

print("\n=== 全分类计数 ===")
for c, n in sorted(cat_counts.items(), key=lambda x: -x[1]):
    print("  %s: %d" % (c, n))

# ── 汇总 ─────────────────────────────────────────────────────
all_pass = (not dup_pairs and not missing and not invalid_cats
            and not layer_missing and not layer_invalid)
print("\n=== 最终结果 ===")
print("ALL PASS" if all_pass and len(all_entries) >= 800 and ziwei_total >= 330 and bazi_total >= 480 else "SOME CHECKS FAILED")
sys.exit(0 if all_pass and len(all_entries) >= 800 and ziwei_total >= 330 and bazi_total >= 480 else 1)
