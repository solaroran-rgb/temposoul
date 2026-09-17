# 校验词库转译种子（M2 门禁，468 红线 2.1-01/09/15 关联）：
# - archetypeKey 唯一性与格式（system-enum 规范）
# - 必填字段 / licenseTier 合法值 / version semver
# - L1 填充率统计（evidenceQuote/classicalTerm）与 l1_status 一致性
# 用法: python scripts/validate-lexicon-translator.py
import json, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
SEED = "src/data/lexicon-translator-seed.ts"
KEY_RE = re.compile(r"^[a-z0-9_]+(\.[a-z0-9_]+){2,}$")
SEMVER_RE = re.compile(r"^\d+\.\d+\.\d+$")
LICENSES = {"public_domain", "internal_only", "unknown"}
VALID_L1_STATUS = {"verified", "draft", "pending_manual"}

text = open(SEED, encoding="utf-8").read()
body = text[text.index("= {") + 2 :].rstrip().rstrip(";")
data = json.loads(body)
entries = data["entries"]
errors = []
seen_keys = set()
l1 = {"verified": 0, "draft": 0, "pending_manual": 0, "missing_quote": 0}

for i, e in enumerate(entries):
    where = e.get("archetypeKey", f"#{i}")
    if not e.get("archetypeKey") or not KEY_RE.match(e["archetypeKey"]):
        errors.append(f"{where}: archetypeKey 缺失或格式非法")
    if e["archetypeKey"] in seen_keys:
        errors.append(f"{where}: archetypeKey 重复")
    seen_keys.add(e.get("archetypeKey"))
    for f in ("system", "category", "displayZh", "professionalDef", "licenseTier", "version"):
        if not e.get(f):
            errors.append(f"{where}: 必填字段 {f} 缺失")
    if e.get("licenseTier") not in LICENSES:
        errors.append(f"{where}: licenseTier 非法值 {e.get('licenseTier')}")
    if not SEMVER_RE.match(e.get("version", "")):
        errors.append(f"{where}: version 非 semver {e.get('version')}")
    if e.get("category") not in ("term", "semantic", "translation"):
        errors.append(f"{where}: category 非法 {e.get('category')}")

    has_quote = bool(e.get("evidenceQuote"))
    status = e.get("l1_status")
    if has_quote:
        l1[status if status in ("verified", "draft") else "missing_quote"] += 1
    else:
        l1["pending_manual"] += 1
        if status and status != "pending_manual":
            errors.append(f"{where}: 无 evidenceQuote 但 l1_status={status}，应为 pending_manual")
    if not has_quote and (e.get("evidenceQuote") is None) and status in ("verified", "draft"):
        errors.append(f"{where}: 状态与引文不一致")

print(f"entries={len(entries)} dict_version={data['meta']['dict_version']}")
print(f"L1: verified={l1['verified']} draft={l1['draft']} pending_manual={l1['pending_manual']}")
if errors:
    print(f"FAIL ({len(errors)}):")
    for msg in errors[:30]:
        print(" -", msg)
    sys.exit(1)
print("OK: 全部校验通过")
