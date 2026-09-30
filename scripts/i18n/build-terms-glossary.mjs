/**
 * T07 · 五语术语表生成（zh/en 为基准，五语译名）
 *
 * 输入：
 *   docs/audit/.../7lang-terms.csv        —— 一期 tier1 术语（已含五语译名）
 *   docs/i18n/T07/terms-tier2.json        —— 二期抽取的 tier2 术语（仅 zh/pinyin/category）
 *   docs/i18n/T07/translated/<locale>.json —— 五语正文译文（用中文原文反查既有译名，命中即复用）
 * 输出：
 *   docs/i18n/T07/T07_五语术语表.csv       —— key,zh,pinyin,category,en,ja,ko,vi,th,es,basis,status
 *   docs/i18n/T07/_terms-coverage.json     —— 术语表统计（各语言已填 / 待补）
 *
 * tier2 缺失译名走本地网关 LLM（每语种一次大批量调用），提示词口径与正文翻译一致。
 *
 * 用法：node scripts/i18n/build-terms-glossary.mjs [--llm]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const T07 = path.join(ROOT, 'docs/i18n/T07');
const TRANSLATED = path.join(T07, 'translated');
const SRC_CSV = path.join(
  ROOT,
  'docs/audit/2026-09-13-上线前加固/thread-03-多语言翻译实现与准确性/output/terms/7lang-terms.csv',
);
const GATEWAY = 'http://127.0.0.1:8011/v1/chat/completions';
const MODEL = process.env.TS_LLM_MODEL || 'openai/Qwen3.8-27B-Ridge';
const USE_LLM = process.argv.includes('--llm');
/** 占位符（无论文）不计为已填 */
const has = (v) => String(v ?? '').trim().length > 0 && String(v).trim() !== '—';
// en 仅在 --llm 模式下参与补缺（tier2 概念的英文口径由 LLM 回填，tier1 英文来自一期 CSV）
const LANGS = ['ja', 'ko', 'vi', 'th', 'es'];
const LANGS_LLM = ['en', ...LANGS];

/* ---------- CSV 解析（BOM 兼容 + 引号转义） ---------- */
function parseCsv(text) {
  const s = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  const rows = [];
  let row = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"') {
        if (s[i + 1] === '"') { cur += '"'; i++; } else q = false;
      } else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (c !== '\r') cur += c;
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  const head = rows.shift().map((h) => h.trim());
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])));
}

function readJson(p, fallback = null) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

/* ---------- 1) 一期 tier1 ---------- */
const tier1 = parseCsv(fs.readFileSync(SRC_CSV, 'utf8'));
const tier2 = readJson(path.join(T07, 'terms-tier2.json'), []);
console.log(`tier1 ${tier1.length} 条，tier2 ${tier2.length} 条`);

/* ---------- 2) 既有五语译名反查（正文译文 + UI 覆盖层） ---------- */
const existing = Object.fromEntries(LANGS.map((l) => [l, {}]));
for (const l of LANGS) {
  const files = [
    path.join(TRANSLATED, `${l}.json`),
    path.join(TRANSLATED, `${l}-ui.json`),
  ];
  for (const f of files) {
    const obj = readJson(f, {});
    if (!obj) continue;
    for (const [zh, tr] of Object.entries(obj)) {
      if (typeof tr === 'string' && tr.trim() && zh.length >= 2) existing[l][zh] = tr;
    }
  }
}

/* ---------- 3) 合并术语行 ---------- */
const rows = [];
const byZh = new Map();
for (const r of tier1) {
  const row = {
    key: r.archetype_key,
    zh: r.zh,
    pinyin: r.pinyin,
    category: r.category,
    en: r.en,
    ja: r.ja,
    ko: r.ko,
    vi: r.vi,
    th: r.th,
    es: r.es,
    basis: r.basis,
    status: r.status,
  };
  rows.push(row);
  byZh.set(r.zh, row);
}
for (const t of tier2) {
  if (byZh.has(t.zh)) {
    // tier2 与 tier1 同形：仅补齐 key
    const r = byZh.get(t.zh);
    if (!r.key.startsWith('tier2:')) r.key = `tier2:${t.key}`;
    continue;
  }
  const row = {
    key: `tier2:${t.key}`,
    zh: t.zh,
    pinyin: t.pinyin,
    category: t.category,
    en: '',
    ja: existing.ja[t.zh] ?? '',
    ko: existing.ko[t.zh] ?? '',
    vi: existing.vi[t.zh] ?? '',
    th: existing.th[t.zh] ?? '',
    es: existing.es[t.zh] ?? '',
    basis: '',
    status: 'tier2_pending',
  };
  rows.push(row);
  byZh.set(t.zh, row);
}

/* ---------- 4) LLM 补齐 tier2 缺失五语译名（按语种一次大批量） ---------- */
const pendingZh = rows.filter((r) => r.status === 'tier2_pending').map((r) => r.zh);
console.log(`待补译名：tier2 ${pendingZh.length} 个概念`);

if (USE_LLM && pendingZh.length) {
  const SYSTEM = [
    '你是东方命理/紫微斗数/风水/占星术语的术语表编纂引擎。',
    '任务：为每个中文术语给出该目标语言的规范译名（名词短语即可，不要整句解释）。',
    '硬规则：',
    '1) 只给译名，不解释、不音译注释、不写括号说明；',
    '2) 汉字文化概念（八字、紫微斗数、天干、地支、十神、大运、流年、神煞、纳音、二十八宿、二十四山、五行）在该语言有通行写法时优先用通行写法，无通行写法时用该语言音译并全小写；',
    '3) 不得输出空串、不得原样复制中文。',
    '4) 输出纯 JSON 对象 {"原文术语": "译名"}，覆盖输入全部条目，不要代码块、不要解释。',
  ].join('\n');
  /** 解析模型输出（兼容 ```json 围栏 + 前缀文字） */
  function parseNames(text) {
    const cleaned = String(text).replace(/```(?:json)?/gi, '').trim();
    let s = cleaned.indexOf('{');
    let e = cleaned.lastIndexOf('}');
    if (s < 0 || e < 0) {
      s = cleaned.indexOf('[');
      e = cleaned.lastIndexOf(']');
    }
    if (s < 0 || e < 0) return {};
    try {
      const v = JSON.parse(cleaned.slice(s, e + 1));
      if (v && typeof v === 'object') return v;
    } catch { /* 落到正则回退 */ }
    const out = {};
    const re = /"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
    let m;
    while ((m = re.exec(cleaned))) out[m[1]] = m[2];
    return out;
  }

  const CHUNK = 150; // 单批上限：846 条一次性调用会超出输出上限并解析失败
  for (const l of LANGS_LLM) {
    let targets = pendingZh.filter((zh) => { const r = byZh.get(zh); return !(r && has(r[l])); });
    if (!targets.length) { console.log(`  ${l} 无缺口`); continue; }
    let n = 0;
    const filled = {}; // 本语种全部补到的译名，落盘用（避免块级 map 作用域失效）
    for (let i = 0; i < targets.length; i += CHUNK) {
      const chunk = targets.slice(i, i + CHUNK);
      let map = {};
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const res = await fetch(GATEWAY, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            signal: AbortSignal.timeout(600 * 1000),
            body: JSON.stringify({
              model: MODEL,
              temperature: 0.2,
              max_tokens: 4000,
              messages: [
                { role: 'system', content: SYSTEM },
                { role: 'user', content: `目标语言：${l}\n输入 ${chunk.length} 个中文术语：\n${JSON.stringify(chunk)}` },
              ],
            }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const j = await res.json();
          map = parseNames(j?.choices?.[0]?.message?.content ?? '');
          if (Object.keys(map).length) break;
        } catch (err) {
          console.warn(`  ! ${l} 批次 ${i / CHUNK + 1} 第 ${attempt + 1} 次失败：${err.message}`);
        }
      }
      for (const zh of chunk) {
        const v = map[zh];
        const row = byZh.get(zh);
        if (row && typeof v === 'string' && v.trim() && v.trim() !== zh) { row[l] = v.trim(); filled[zh] = v.trim(); n++; }
      }
      process.stdout.write(`  ${l} 批次 ${i / CHUNK + 1}/${Math.ceil(targets.length / CHUNK)} ✓\n`);
    }
    console.log(`  ${l} 补 ${n}/${targets.length}`);
    // 状态改写为已定稿（译名经机器校验，仍待母语抽检）
    for (const zh of targets) {
      const row = byZh.get(zh);
      if (row && row[l]) row.status = 'tier2_glossed';
    }
    fs.writeFileSync(path.join(T07, `_terms-${l}.json`), JSON.stringify(filled, null, 2), 'utf8');
  }
}

/* ---------- 5) basis / status 归一 ---------- */
const CAT_BASIS = {
  五行: '五行：汉字文化圈（ja/ko/vi）沿用汉字「木火土金水」原词；th/es 用本民族文化对应概念译出，首见处加括号标注汉字原词。',
};
for (const r of rows) {
  if (!r.basis) r.basis = CAT_BASIS[r.category] || '汉字文化圈术语：ja/ko 保留汉字原词、vi 用汉越词、th 音译、es 西语意译（首见处附拼音），待母语复核。';
  if (LANGS.every(has)) r.status = 'filled';
  else if (LANGS.some(has)) r.status = 'partial';
}

/* ---------- 6) 落盘 ---------- */
const HEAD = ['key', 'zh', 'pinyin', 'category', 'en', 'ja', 'ko', 'vi', 'th', 'es', 'basis', 'status'];
const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
const csv = [HEAD.join(',')]
  .concat(rows.map((r) => HEAD.map((h) => esc(r[h])).join(',')))
  .join('\n');
fs.writeFileSync(path.join(T07, 'T07_五语术语表.csv'), '\ufeff' + csv + '\n', 'utf8');

const stat = {};
for (const l of ['en', ...LANGS]) {
  stat[l] = {
    filled: rows.filter((r) => has(r[l])).length,
    total: rows.length,
    coverage: `${rows.filter((r) => has(r[l])).length}/${rows.length}`,
  };
}
fs.writeFileSync(path.join(T07, '_terms-coverage.json'), JSON.stringify({ total: rows.length, langs: stat }, null, 2), 'utf8');
console.log('术语表已写出：docs/i18n/T07/T07_五语术语表.csv');
console.log(JSON.stringify(stat, null, 2));
