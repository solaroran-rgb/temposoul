/**
 * T07 · 缺口译文补齐（走本地网关 LLM：openai/Qwen3.8-27B-Ridge）
 *
 * 场景：子代理因配额中断时，本脚本接手剩余条目，规则与子代理一致（术语沿用既有词典口径、
 * 占位符原样保留、免责口径不得弱化、缺译回落中文）。产出落在 <locale>-extra.json，
 * 由 build-body-modules.mjs / verify-translations.mjs 一并合并。
 *
 * 用法：
 *   node scripts/i18n/llm-translate.mjs <locale> [body|ui] [--only corpusA,corpusB]
 * 例：
 *   node scripts/i18n/llm-translate.mjs th-TH ui
 *   node scripts/i18n/llm-translate.mjs vi-VN body --only faq,news,classics,classics-meta,wiki-zodiac,wiki-astro,wiki-parenting,zodiac-profiles,faq-categories,news-meta
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const T07 = path.join(ROOT, 'docs/i18n/T07');
const TRANSLATED = path.join(T07, 'translated');
const GATEWAY = 'http://127.0.0.1:8011/v1/chat/completions';
const MODEL = process.env.TS_LLM_MODEL || 'openai/Qwen3.8-27B-Ridge';
const BATCH = Number(process.env.TS_LLM_BATCH || 16);
const REQ_TIMEOUT_MS = 180; // 单次网关调用上限（秒），超时即减半重试

const locale = process.argv[2];
const kind = process.argv[3] === 'ui' ? 'ui' : 'body';
const force = process.argv.includes('--force'); // 强制重译（译文已存在但机器校验不通过时用）
const onlyIdx = process.argv.indexOf('--only');
const only = onlyIdx > 0 ? new Set(process.argv[onlyIdx + 1].split(',')) : null;

if (!locale) {
  console.error('用法：node scripts/i18n/llm-translate.mjs <locale> [body|ui] [--only a,b]');
  process.exit(1);
}

const LOCALE_LABEL = {
  ja: '日语（日本語）',
  'ko-KN': '韩语（한국어）',
  'vi-VN': '越南语（Tiếng Việt）',
  'th-TH': '泰语（ไทย）',
  'es-ES': '西班牙语（español de España）',
};

/** 术语策略（与既有词典口径一致，避免新口径漂移） */
const TERM_POLICY = {
  ja: '八字/紫微斗数/天干/地支/十神/大运/流年/神煞/风水/五行 保留汉字原词；其余按日语既有译法。',
  'ko-KN': '八字=팔자，紫微斗数=자미두수，天干/地支/十神=천간/지지/십신，大运/流年=대운/세운；塔罗沿用既有译名。',
  'vi-VN': '采用汉越词：八字=Bát Tự，紫微斗数=Tử Vi Đẩu Số，天干/地支=Thiên Can/Địa Chi，十神=Thập Thần；塔罗小阿尔卡那用既有译法。',
  'th-TH': '中文专有概念用泰语音译并保持一致；塔罗牌名、星座名沿用既有译法。',
  'es-ES': '东方概念用西语译名＋拼音（八字 Ba Zi、紫微斗数 Zi Wei Dou Shu、天干 Tian Gan）；塔罗牌名用西语既有译名（El Loco、La Emperatriz…）。',
};

const SYSTEM = [
  '你是东方命理/占星/塔罗/解梦网站的本地化引擎，负责把中文正文译为指定语言。',
  '硬规则：',
  '1) 只译不改：不得增删原句信息、不得弱化免责声明（如「不构成任何专业建议」「仅供娱乐与自我觉察」必须完整表达）。',
  '2) 占位符与格式原样保留：{name} 等模板变量、半角/全角标点、【】「」「」、数字、URL、Markdown 链接的括号目标 (…) 一律不动；[文字](目标) 只翻方括号内文字。',
  '2b) 极重要：同一句里重复出现的占位符（例如 {name} 出现两次、{requirement} 与 {skill} 各一次）必须原样保留同名同次数，一个都不能改名、不能增删、不能合并，模板变量顺序也必须一致。',
  '3) 术语一致性：' + TERM_POLICY[locale],
  '4) 输出纯 JSON 对象，键为原文、值为译文，覆盖输入全部条目，不输出任何解释、代码块或额外文字。',
  '5) 译文不得为空、不得原样复制中文。',
  '',
  '输入语言：中文；输出语言：' + LOCALE_LABEL[locale],
].join('\n');

function readJson(p, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

// 已译内容（含子代理分片 + 本脚本历史产出）
function existingMap(loc) {
  const map = {};
  for (const part of ['-p1', '-p2', '-p3', '-p4', '-extra']) {
    const p = path.join(TRANSLATED, `${loc}${part}.json`);
    if (fs.existsSync(p)) Object.assign(map, readJson(p));
  }
  return map;
}

const queue = readJson(path.join(T07, 'queue.json'), []);
const uiKeys = readJson(path.join(T07, 'ui-fallback-keys.json'), []);

const done = existingMap(locale);
let targets;
if (kind === 'ui') {
  targets = uiKeys
    .filter((k) => only ? only.has(k.key) : true)
    .filter((k) => !done[k.key])
    .map((k) => ({ id: k.key, zh: k.zh }));
} else {
  targets = queue
    .filter((q) => (only ? only.has(q.corpus) || only.has(q.id) : true))
    .filter((q) => force || !done[q.zh])
    .map((q) => ({ id: q.id, corpus: q.corpus, zh: q.zh }));
}

if (!targets.length) {
  console.log(`无缺口：${locale} ${kind}`);
  process.exit(0);
}
console.log(`待译 ${targets.length} 条（${locale} ${kind}${only ? ' · 仅 ' + [...only].join(',') : ''}）`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function callLlm(text, maxTokens = 2500) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(GATEWAY, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: AbortSignal.timeout(REQ_TIMEOUT_MS * 1000),
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.2,
          max_tokens: maxTokens,
          messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: text },
          ],
        }),
      });
      if (res.status === 429 || res.status >= 500) {
        lastErr = new Error(`HTTP ${res.status} 限流/服务忙，退避重试 ${attempt + 1}/3`);
        await sleep(8000 * (attempt + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content ?? '';
      if (!content.trim()) throw new Error('空响应');
      return content;
    } catch (err) {
      lastErr = err;
      if (err.name === 'TimeoutError') await sleep(3000);
    }
  }
  throw lastErr ?? new Error('未知错误');
}

/** 清洗：去 ```json 围栏、去 "[中文回复]" 之类的说明前缀，取第一个 JSON 值到最后一个 */
function sliceJson(text) {
  let s = text.indexOf('[');
  let e = text.lastIndexOf(']');
  if (s < 0 || e < 0) {
    s = text.indexOf('{');
    e = text.lastIndexOf('}');
  }
  if (s < 0 || e < 0) return text;
  // 前置文字里可能也有 [ ]（模型爱写 "[中文回复]"），需回退到真正的 JSON 起始：
  // 只认「后面紧跟引号」的 [ / {（即 JSON 对象/数组起点）
  const firstKey = text.search(/[{[]\s*"/);
  if (firstKey > 0 && firstKey < s) {
    s = firstKey;
    e = Math.max(text.lastIndexOf('}'), text.lastIndexOf(']'));
  }
  if (e < s) return text;
  return text.slice(s, e + 1);
}

/** 回退：正则抽取所有 "key": "value" 对（模型输出被截断时也能捞回大半） */
function regexPairs(text) {
  const re = /"((?:[^"\\]|\\.)*)"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  const out = {};
  let m;
  while ((m = re.exec(text))) out[m[1]] = m[2];
  return out;
}

/**
 * 解析 LLM 输出为 {原文|键: 译文} 对象。
 * 兼容三种常见形态：
 *   1) { "甲": "乙" }
 *   2) [ {"甲":"乙"}, {"丙":"丁"} ]
 *   3) 带 ```json 围栏的上面两种
 */
function parseMap(text) {
  if (typeof text !== 'string' || !text.trim()) return null;
  const cleaned = text.replace(/```(?:json)?/gi, '').trim();
  let value = null;
  try {
    value = JSON.parse(sliceJson(cleaned));
  } catch {
    // 退路：直接整段 JSON.parse（模型偶尔裸输出对象）
    try {
      value = JSON.parse(cleaned.trim());
    } catch {
      const pairs = regexPairs(cleaned);
      if (!Object.keys(pairs).length) return null;
      value = pairs;
    }
  }
  let out = null;
  if (Array.isArray(value)) {
    out = {};
    for (const item of value) {
      if (item && typeof item === 'object') {
        for (const [k, v] of Object.entries(item)) {
          if (typeof k === 'string' && typeof v === 'string' && v.trim()) out[k] = v;
        }
      }
    }
  } else if (value && typeof value === 'object') {
    out = {};
    for (const [k, v] of Object.entries(value)) {
      if (typeof v === 'string' && v.trim()) out[k] = v;
    }
  }
  return out;
}

// UI 补译与正文补译分开落盘，避免点路径键混入正文映射、中文键混入 UI 覆盖层
const outPath = path.join(TRANSLATED, `${locale}${kind === 'ui' ? '-ui-extra' : '-extra'}.json`);
const store = readJson(outPath, {});

let success = 0;
let failed = 0;
for (let i = 0; i < targets.length; i += BATCH) {
  const batch = targets.slice(i, i + BATCH);
  const payload = kind === 'ui' ? batch.map((t) => t.id) : batch.map((t) => t.zh);
  // ui 批次：size 元素为 {id, src}；body 批次：size 元素为字符串（中文原文）
  const makePrompt = (size) =>
    kind === 'ui'
      ? `把下面 ${size.length} 个 UI 词条的源文本译成${LOCALE_LABEL[locale]}。\n` +
        `格式要求：输出 JSON 对象，键必须是每个词条前给出的「条目 id」（点路径字符串），值是译文；不要输出源文本作键。\n` +
        `输入（每项为 [条目id, 源文本]）：\n${JSON.stringify(size.map((t) => [t.id, t.zh]))}`
      : `把下面 ${size.length} 条中文文案译成${LOCALE_LABEL[locale]}。按 {原文: 译文} 或 [{"原文":"译文"}] 输出。\n输入：\n${JSON.stringify(size)}`;
  let map = null;
  for (let attempt = 0; attempt < 3 && !map; attempt++) {
    const size = attempt === 0 ? batch : batch.slice(0, Math.max(1, Math.ceil(batch.length / Math.pow(2, attempt))));
    try {
      // max_tokens 按批大小给（避免单条小批时模型自由发挥拖长尾）；每条留 ~110 token 余量
      const raw = await callLlm(makePrompt(size), Math.min(12000, Math.max(600, size.length * 110)));
      map = parseMap(raw);
      if (!map && process.env.TS_LLM_DEBUG) console.log('  [raw]', String(raw).slice(0, 500));
      if (map) {
        // 只接受输入键；空值丢弃
        const keys = size.map((t) => (kind === 'ui' ? t.id : t.zh));
        let kept = Object.fromEntries(keys.filter((k) => typeof map[k] === 'string' && map[k].trim()).map((k) => [k, map[k]]));
        // ui 兜底：模型偶尔以源文本作键，按源文本反查条目 id 再取回
        if (!Object.keys(kept).length && kind === 'ui') {
          kept = {};
          for (const t of size) {
            const v = map[t.zh] ?? map[t.id];
            if (typeof v === 'string' && v.trim()) kept[t.id] = v;
          }
        }
        // 回退二：模型给的键与原文本身有出入（改标点、多出解释键、按行序错位）时按「占位符序列 + 长度」就近配对
        if (!Object.keys(kept).length) {
          const norm = (s) => String(s).replace(/\s+/g, '');
          const sig = (s) => (String(s).match(/\{[a-zA-Z_]+\}/g) || []).join('|');
          for (const t of size) {
            const want = kind === 'ui' ? t.id : t.zh;
            const target = kind === 'ui' ? t.id : t.zh;
            let chosen = null;
            for (const [k, v] of Object.entries(map)) {
              if (k === want && typeof v === 'string' && v.trim()) { chosen = v; break; }
            }
            if (chosen === null) {
              for (const [k, v] of Object.entries(map)) {
                if (sig(k) === sig(want) && Math.abs(norm(k).length - norm(want).length) <= 2 && typeof v === 'string' && v.trim()) { chosen = v; break; }
              }
            }
            if (chosen === null) {
              // 兜底：取第一个「确属译文」的值（不得原样复读原文、不得含汉字残留）
              const isTr = (x) => typeof x === 'string' && x.trim() && x.trim() !== norm(want) && !/[一-鿿]/.test(x);
              const first = Object.entries(map).find(([, v]) => isTr(v));
              if (first) chosen = first[1];
            }
            if (typeof chosen === 'string' && chosen.trim()) kept[target] = chosen;
          }
        }
        if (process.env.TS_LLM_DEBUG) console.log('  [dbg] rawKeys=', Object.keys(map || {}).length, 'want=', size.length, 'kept=', Object.keys(kept).length);
        map = Object.keys(kept).length ? kept : null;
      }
    } catch (err) {
      console.warn(`  ! 批次 ${i / BATCH + 1} 第 ${attempt + 1} 次失败：${err.message}`);
    }
  }
  if (!map) {
    failed += batch.length;
    continue;
  }
  Object.assign(store, map);
  success += Object.keys(map).length;
  fs.writeFileSync(outPath, JSON.stringify(store, null, 2), 'utf8');
  process.stdout.write(`  批次 ${i / BATCH + 1}/${Math.ceil(targets.length / BATCH)} ✓${Object.keys(map).length}\n`);
}

const after = existingMap(locale);
const missing = (kind === 'ui'
  ? uiKeys.map((k) => k.key)
  : queue.map((q) => q.zh)
).filter((k) => !after[k]);

console.log(`\n完成：成功 ${success}，失败 ${failed}，本轮后仍缺 ${missing.length}`);
if (missing.length) console.log('仍缺示例：', missing.slice(0, 10));
