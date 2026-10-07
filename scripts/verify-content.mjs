#!/usr/bin/env node
/**
 * L-15 内容导入流水线 · 校验脚本
 *
 * 用法：
 *   node scripts/verify-content.mjs [--store data/content/lexicon] [--batch <batchId>] [--check-links]
 *
 * 校验项（对照 L-15 详细步骤 3 + WP-18 §7 验收门禁）：
 *   1. 十段齐全性
 *   2. 每字段字数下限（对照总规范 §2.1）
 *   3. 古籍参考：无《书名》必须含「出处待考 / 待补」
 *   4. TDK 唯一性（全库去重）
 *   5. 内链可达性（--check-links：slug 必须存在于库或待建清单）→ C-LINK
 *   6. C-TRAD：s4_traditional 必须含「此为传统命理观点」
 *
 * 退出码：0 = 全绿；1 = 存在 FAIL（门禁阻断）
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SEGMENT_KEYS,
  CATEGORIES,
  C_TRAD_SENTENCE,
  validateRecord,
  countChars,
  splitMulti,
} from './lib/content-rules.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const storeDir = resolve(ROOT, arg('store', join('data', 'content', 'lexicon')));
const batchFilter = arg('batch', null);
const checkLinks = process.argv.includes('--check-links');

const storeFile = join(storeDir, 'lexicon-terms.json');
const plannedFile = join(storeDir, 'planned-slugs.txt');

if (!existsSync(storeFile)) {
  console.error(`[verify-content] store 不存在：${storeFile}`);
  console.error('  请先运行 scripts/import-content.mjs 导入，或指定 --store');
  process.exit(2);
}

const store = JSON.parse(readFileSync(storeFile, 'utf8'));
const terms = Object.entries(store.terms ?? {}).filter(
  ([, t]) => !batchFilter || t.batchId === batchFilter
);

const plannedSlugs = existsSync(plannedFile)
  ? new Set(
      readFileSync(plannedFile, 'utf8')
        .split(/\r?\n/)
        .map(x => x.trim())
        .filter(Boolean)
        .filter(x => !x.startsWith('#'))
    )
  : new Set();

const knownSlugs = new Set(Object.keys(store.terms ?? {}));

// ── 全库 TDK 去重表 ───────────────────────────────────────────────────────
const tdkTitleMap = new Map();
for (const [slug, t] of Object.entries(store.terms ?? {})) {
  const key = t?.tdk?.title?.zh;
  if (!key) continue;
  if (!tdkTitleMap.has(key)) tdkTitleMap.set(key, []);
  tdkTitleMap.get(key).push(slug);
}
const tdkDescMap = new Map();
for (const [slug, t] of Object.entries(store.terms ?? {})) {
  const key = t?.tdk?.desc?.zh;
  if (!key) continue;
  if (!tdkDescMap.has(key)) tdkDescMap.set(key, []);
  tdkDescMap.get(key).push(slug);
}

const failures = [];
const warnings = [];

function fail(slug, code, detail) {
  failures.push({ slug, code, detail });
}
function warn(slug, code, detail) {
  warnings.push({ slug, code, detail });
}

function flat(t) {
  const out = {};
  for (const [k, v] of Object.entries(t)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v)) {
        if (v2 && typeof v2 === 'object' && !Array.isArray(v2)) {
          for (const [k3, v3] of Object.entries(v2)) out[`${k}.${k2}.${k3}`] = v3;
        } else {
          out[`${k}.${k2}`] = v2;
        }
      }
    } else {
      out[k] = v;
    }
  }
  return out;
}

for (const [slug, term] of terms) {
  // 1) 十段齐全性
  for (const key of SEGMENT_KEYS) {
    if (!term[key] || !String(term[key]).trim()) {
      fail(slug, 'C-TENSEG', `缺段 ${key}`);
    }
  }

  // 2) 字数下限
  const rec = flat(term);
  const { errors, warnings: w } = validateRecord(rec, {
    knownSlugs: checkLinks ? knownSlugs : new Set(Object.keys(store.terms ?? {})),
    plannedSlugs,
    existingTdkTitles: new Map(),
  });
  // 过滤掉 C-TDK（该项在全库层单独判）与 C-LINK（未开 --check-links 时由 knownSlugs 全量放开）
  errors
    .filter(e => !e.startsWith('C-TDK'))
    .filter(e => checkLinks || !e.startsWith('C-LINK'))
    .forEach(e => fail(slug, e.split(' ')[0], e.slice(e.indexOf(' ') + 1)));
  w.forEach(x => warn(slug, x.split(' ')[0], x.slice(x.indexOf(' ') + 1)));

  // 3) 分类枚举
  if (term.category && !CATEGORIES.includes(term.category)) {
    fail(slug, 'C-FIELD', `category「${term.category}」不在枚举`);
  }

  // 4) C-TRAD 独立复核（门禁点名项）
  if (term.s4_traditional && !String(term.s4_traditional).includes(C_TRAD_SENTENCE)) {
    fail(slug, 'C-TRAD', `s4_traditional 缺「${C_TRAD_SENTENCE}」`);
  }

  // 5) 古籍参考独立复核
  if (term.s6_source) {
    const hasBook = /《.+?》/.test(term.s6_source);
    const hasMarker = ['出处待考', '待补'].some(m => String(term.s6_source).includes(m));
    if (!hasBook && !hasMarker) {
      fail(slug, 'C-SOURCE', 's6_source 无《书名》且未标「出处待考/待补」');
    }
    if (splitMulti(term.s6_source).length !== 3) {
      warn(slug, 'W-SOURCE', `s6_source 段数 ${splitMulti(term.s6_source).length}，建议 3`);
    }
  }

  // 6) 防空壳总字数
  const total = SEGMENT_KEYS.reduce((s, k) => s + countChars(term[k]), 0);
  if (total < 800) fail(slug, 'C-SHELL', `总字数 ${total} < 800`);
}

// 7) TDK 全库唯一性
for (const [key, slugs] of tdkTitleMap) {
  if (slugs.length > 1) fail(slugs[0], 'C-TDK', `tdk.title.zh 重复（${slugs.join(', ')}）`);
}
for (const [key, slugs] of tdkDescMap) {
  if (slugs.length > 1) warn(slugs[0], 'W-TDK', `tdk.desc.zh 重复（${slugs.join(', ')}）`);
}

// 8) C-LINK 内链可达性（--check-links）
if (checkLinks) {
  for (const [slug, term] of terms) {
    const related = String(term.s8_related ?? '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    for (const r of related) {
      if (!knownSlugs.has(r) && !plannedSlugs.has(r)) {
        fail(slug, 'C-LINK', `内链死链 ${r}`);
      }
    }
  }
}

// ── 输出 ──────────────────────────────────────────────────────────────────
const byCode = new Map();
for (const f of failures) {
  if (!byCode.has(f.code)) byCode.set(f.code, []);
  byCode.get(f.code).push(f);
}

console.log(`\n[verify-content] store=${storeFile}`);
console.log(`  校验范围：${terms.length} 条${batchFilter ? `（批次 ${batchFilter}）` : '（全库）'}`);
console.log(`  内链校验：${checkLinks ? 'ON（C-LINK 死链判 FAIL）' : 'OFF（加 --check-links 开启）'}`);
console.log(`\n  FAIL ${failures.length} 项 / WARN ${warnings.length} 项`);

if (failures.length) {
  console.log('\n  失败明细：');
  for (const [code, list] of [...byCode].sort()) {
    console.log(`    [${code}] ${list.length}`);
    list.slice(0, 20).forEach(f => console.log(`      - ${f.slug}：${f.detail}`));
    if (list.length > 20) console.log(`      … 其余 ${list.length - 20} 条省略`);
  }
}
if (warnings.length) {
  console.log('\n  告警明细（不阻断）：');
  warnings.slice(0, 20).forEach(w => console.log(`    - ${w.slug} [${w.code}] ${w.detail}`));
  if (warnings.length > 20) console.log(`    … 其余 ${warnings.length - 20} 条省略`);
}

console.log(failures.length ? '\n[verify-content] FAIL —— 门禁阻断' : '\n[verify-content] PASS —— 全绿');
process.exit(failures.length ? 1 : 0);
