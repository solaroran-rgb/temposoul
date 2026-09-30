#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""i18n 正文回退点盘点：对比各语言 locale 与 zh-CN/en 的 key 集合差异。"""
import json, os, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LOCALES = ROOT / 'src' / 'i18n' / 'locales'
files = {
    'zh-CN': 'zh-CN.ts',
    'en': 'en.ts',
    'ja': 'ja.ts',
    'ko-KN': 'ko-KN.ts',
    'vi-VN': 'vi-VN.ts',
    'th-TH': 'th-TH.ts',
    'es-ES': 'es-ES.ts',
}


def strip_ts(src: str) -> str:
    # 去掉 export const X = / export type ... 等 TS 语法，保留纯对象字面量 JSON 化
    src = re.sub(r'export\s+type\s+[^=]+=\s*typeof\s+\w+\s*;?', '', src)
    src = re.sub(r'export\s+const\s+\w+\s*=\s*', '', src, count=1)
    src = src.strip().rstrip(';').strip()
    # 尾逗号
    src = re.sub(r',(\s*[}\]])', r'\1', src)
    return src


def to_json(src: str):
    txt = strip_ts(src)
    # 单引号 -> 双引号需谨慎处理；改用 json5 风格的简易解析：直接 eval 更稳
    try:
        obj = eval(txt, {"__builtins__": {}}, {})
    except Exception as e:
        return None, str(e)
    return obj, None


def flatten(obj, prefix=''):
    out = {}
    if isinstance(obj, dict):
        for k, v in obj.items():
            key = f'{prefix}.{k}' if prefix else k
            if isinstance(v, dict):
                out.update(flatten(v, key))
            else:
                out[key] = v
    elif isinstance(obj, list):
        out[prefix] = obj
    return out


data = {}
errors = {}
for loc, fn in files.items():
    text = (LOCALES / fn).read_text(encoding='utf-8')
    obj, err = to_json(text)
    if obj is None:
        errors[loc] = err
        continue
    data[loc] = flatten(obj)

if errors:
    print('PARSE ERRORS:', json.dumps(errors, ensure_ascii=False, indent=2))

base = data.get('zh-CN', {})
en = data.get('en', {})

report = {}
for loc in ['ja', 'ko-KN', 'vi-VN', 'th-TH', 'es-ES']:
    d = data.get(loc, {})
    missing_vs_zh = [k for k in base if k not in d]
    missing_vs_en = [k for k in en if k not in d]
    extra = [k for k in d if k not in base]
    # 中文回退：值与 zh-CN 完全相同且非 zh 语言
    same_as_zh = [k for k in d if k in base and isinstance(d[k], str) and d[k] == base[k]]
    report[loc] = {
        'total_keys': len(d),
        'missing_vs_zh': missing_vs_zh,
        'missing_vs_en': missing_vs_en,
        'extra_vs_zh': extra,
        'identical_to_zh': same_as_zh,
    }

print('=== 基准 key 总数 ===')
print('zh-CN:', len(base), '| en:', len(en))
print()
for loc, r in report.items():
    print(f'--- {loc} ---')
    print('总 key:', r['total_keys'])
    print('缺 vs zh-CN:', len(r['missing_vs_zh']))
    if r['missing_vs_zh']:
        print('  ', r['missing_vs_zh'][:80])
    print('缺 vs en:', len(r['missing_vs_en']))
    if r['missing_vs_en']:
        print('  ', r['missing_vs_en'][:80])
    print('多出 vs zh:', len(r['extra_vs_zh']))
    if r['extra_vs_zh']:
        print('  ', r['extra_vs_zh'][:20])
    print('与 zh 完全相同值(疑似未译/回退):', len(r['identical_to_zh']))
    if r['identical_to_zh']:
        print('  ', r['identical_to_zh'][:60])
    print()
