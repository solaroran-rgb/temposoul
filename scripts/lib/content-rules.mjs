/**
 * L-15 内容导入流水线 · 规则内核
 *
 * 单一真值源：WP-18 §5 十段规范 + 总规范 §2.1 字数下限 + 验收红线（C-TRAD / C-LINK / C-SOURCE / C-WORDING）。
 * import-content.mjs 与 verify-content.mjs 共用本模块，保证「导入判据 == 校验判据」。
 */

export const SEGMENT_KEYS = [
  's0_summary',
  's1_meaning',
  's2_method',
  's3_combination',
  's4_traditional',
  's5_misconception',
  's6_source',
  's7_selfcheck',
  's8_related',
  's9_tool',
  's10_disclaimer',
];

/** 每段字数下限（对照 WP-18 §5 与总规范 §2.1） */
export const SEGMENT_MIN_CHARS = {
  s0_summary: 80,
  s1_meaning: 150,
  s2_method: 100,
  s3_combination: 150,
  s4_traditional: 200,
  s5_misconception: 40,
  s6_source: 10,
  s7_selfcheck: 20,
  s8_related: 10,
  s9_tool: 8,
  s10_disclaimer: 6,
};

/** 每段字数上限（上限为软约束，仅告警不拒收） */
export const SEGMENT_MAX_CHARS = {
  s0_summary: 150,
  s1_meaning: 250,
  s2_method: 200,
  s3_combination: 300,
  s4_traditional: 400,
};

export const CATEGORIES = [
  'bazi',
  'ziwei',
  'divination',
  'sanshi',
  'fengshui',
  'name',
  'astro',
  'tarot',
  'almanac',
  'nayin',
  'shensha',
  'shishen',
];

/** 合规红线：C-TRAD —— s4 必须含该句，否则拒收 */
export const C_TRAD_SENTENCE = '此为传统命理观点';

/** 合规红线：C-SOURCE —— 无出处必须出现的标记 */
export const NO_SOURCE_MARKERS = ['出处待考', '待补'];

/** 合规红线：C-WORDING —— 禁词（与 scripts/lint-content.mjs 口径一致） */
export const FORBIDDEN_WORDS = [
  '治愈', '诊断', '药方', '治病', '康复', '疗效', '病症', '治疗', '治愈率',
  '必赢', '无罪', '胜诉', '保证胜诉', '法律意见',
  '必涨', '稳赚', '翻倍', '保本', '收益保证', '荐股', '稳赚不赔',
  '注定', '必定',
];

/** 否定语境豁免前缀（与 lint-content 保持一致，避免误报） */
export const NEGATION_PREFIXES = [
  '不构成', '不作', '不属于', '不作为', '不是', '并非', '避免', '不应', '不得', '不可', '不会', '没有', '非',
];

/** 单条总字数下限（防空壳） */
export const MIN_TOTAL_CHARS = 800;

// ── 解析 ──────────────────────────────────────────────────────────────────

/**
 * 解析 ###TERM_BEGIN/END 块。
 * 返回 [{ record, startLine, endLine }]；startLine 用于「报错到行」。
 */
export function parseTermBlocks(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let current = null;

  lines.forEach((line, i) => {
    const lineNo = i + 1;
    if (line.trim() === '###TERM_BEGIN') {
      current = { record: {}, startLine: lineNo, endLine: lineNo };
      return;
    }
    if (line.trim() === '###TERM_END') {
      if (current) {
        current.endLine = lineNo;
        blocks.push(current);
      }
      current = null;
      return;
    }
    if (!current) return;

    const m = line.match(/^([A-Za-z0-9_.]+)\s*:\s*(.*)$/);
    if (m) {
      current.record[m[1]] = m[2].trim();
      return;
    }
    // 续行（多行正文）：追加到上一个键
    const keys = Object.keys(current.record);
    if (keys.length && line.trim()) {
      current.record[keys[keys.length - 1]] += '\n' + line.trim();
    }
  });

  if (current) {
    // 未闭合块：按行报错
    blocks.push({ ...current, unclosed: true });
  }
  return blocks;
}

/** 把扁平 key（tdk.title.zh / title.en）还原为嵌套对象 */
export function unflatten(record) {
  const out = {};
  for (const [key, value] of Object.entries(record)) {
    const parts = key.split('.');
    let node = out;
    for (let i = 0; i < parts.length - 1; i += 1) {
      node[parts[i]] = node[parts[i]] ?? {};
      node = node[parts[i]];
    }
    node[parts[parts.length - 1]] = value;
  }
  return out;
}

/** 统计中文字数口径：剔除空白与标点后按字符计 */
export function countChars(s) {
  return String(s ?? '').replace(/\s+/g, '').length;
}

export function splitMulti(s, sep = ';;') {
  return String(s ?? '')
    .split(sep)
    .map(x => x.trim())
    .filter(Boolean);
}

// ── 校验 ──────────────────────────────────────────────────────────────────

/**
 * 单条记录校验。
 * @param {object} rec 扁平记录（含 title.zh / tdk.title.zh 等）
 * @param {object} ctx { knownSlugs:Set, plannedSlugs:Set, existingTdkTitles:Map<slug,string> }
 * @returns {{ errors: string[], warnings: string[], normalized: object }}
 */
export function validateRecord(rec, ctx = {}) {
  const errors = [];
  const warnings = [];
  const knownSlugs = ctx.knownSlugs ?? new Set();
  const plannedSlugs = ctx.plannedSlugs ?? new Set();
  const existingTdkTitles = ctx.existingTdkTitles ?? new Map();

  // 1) 必填键齐全性
  const required = [
    'id', 'category', 'slug', 'title.zh', 'title.en',
    'tdk.title.zh', 'tdk.desc.zh',
    ...SEGMENT_KEYS,
  ];
  for (const key of required) {
    if (!rec[key] || !String(rec[key]).trim()) {
      errors.push(`C-FIELD 缺字段 ${key}`);
    }
  }

  // 2) 分类枚举
  if (rec.category && !CATEGORIES.includes(rec.category)) {
    errors.push(`C-FIELD category「${rec.category}」不在枚举（${CATEGORIES.join('|')}）`);
  }

  // 3) slug 规范
  if (rec.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(rec.slug)) {
    errors.push(`C-FIELD slug「${rec.slug}」非 kebab-case`);
  }

  // 4) 标题与 TDK 长度
  if (rec['title.zh'] && countChars(rec['title.zh']) > 10) {
    errors.push(`C-LEN title.zh 超 10 字（当前 ${countChars(rec['title.zh'])}）`);
  }
  if (rec['tdk.title.zh'] && countChars(rec['tdk.title.zh']) > 30) {
    errors.push(`C-LEN tdk.title.zh 超 30 字（当前 ${countChars(rec['tdk.title.zh'])}）`);
  }
  if (rec['tdk.desc.zh'] && countChars(rec['tdk.desc.zh']) > 80) {
    errors.push(`C-LEN tdk.desc.zh 超 80 字（当前 ${countChars(rec['tdk.desc.zh'])}）`);
  }

  // 5) 十段字数下限
  for (const key of SEGMENT_KEYS) {
    const value = rec[key];
    if (!value) continue;
    const n = countChars(value);
    const min = SEGMENT_MIN_CHARS[key];
    if (n < min) {
      errors.push(`C-LEN ${key} 不足 ${min} 字（当前 ${n}）`);
    }
    const max = SEGMENT_MAX_CHARS[key];
    if (max && n > max) {
      warnings.push(`W-LEN ${key} 超建议上限 ${max} 字（当前 ${n}）`);
    }
  }

  // 6) C-TRAD：s4 强制合规句
  if (rec.s4_traditional && !rec.s4_traditional.includes(C_TRAD_SENTENCE)) {
    errors.push(`C-TRAD s4_traditional 缺强制合规句「${C_TRAD_SENTENCE}」`);
  }

  // 7) C-SOURCE：无出处必须标「出处待考」或「待补」
  if (rec.s6_source) {
    const parts = splitMulti(rec.s6_source);
    const hasBook = /《.+?》/.test(rec.s6_source);
    const hasMarker = NO_SOURCE_MARKERS.some(m => rec.s6_source.includes(m));
    if (!hasBook && !hasMarker) {
      errors.push('C-SOURCE s6_source 无《书名》且未标「出处待考/待补」——古籍零编造红线');
    }
    if (parts.length !== 3) {
      warnings.push(`W-SOURCE s6_source 建议 3 段（书名·篇目 ;; 原文 ;; 白话），当前 ${parts.length} 段`);
    }
  }

  // 8) s5 误解 ≥2 条且含「误解→澄清」
  if (rec.s5_misconception) {
    const items = splitMulti(rec.s5_misconception);
    if (items.length < 2) {
      errors.push(`C-FIELD s5_misconception 需 ≥2 条（当前 ${items.length}）`);
    }
    const bad = items.filter(x => !x.includes('误解') || !x.includes('澄清'));
    if (bad.length) {
      errors.push(`C-FIELD s5_misconception 有 ${bad.length} 条缺「误解→澄清」范式`);
    }
  }

  // 9) s7 自检 3 步
  if (rec.s7_selfcheck) {
    const steps = splitMulti(rec.s7_selfcheck);
    if (steps.length !== 3) {
      warnings.push(`W-SELFCHECK s7_selfcheck 建议 3 步（当前 ${steps.length}）`);
    }
  }

  // 10) s9 反查工具链接
  if (rec.s9_tool && !/^\/[a-z0-9/-]+(\?term=[a-z0-9-]+)?$/.test(rec.s9_tool)) {
    errors.push(`C-LINK s9_tool「${rec.s9_tool}」格式非法（需 /path?term=<slug>）`);
  }

  // 11) C-LINK：内链 slug 必须已入库或在待建清单
  if (rec.s8_related) {
    const related = String(rec.s8_related)
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    if (related.length < 6 || related.length > 10) {
      warnings.push(`W-LINK s8_related 建议 6-10 个（当前 ${related.length}）`);
    }
    for (const slug of related) {
      if (!knownSlugs.has(slug) && !plannedSlugs.has(slug)) {
        errors.push(`C-LINK 内链死链：${slug} 既未入库也不在待建清单`);
      }
    }
  }

  // 12) C-WORDING：禁词（含否定语境豁免）
  const whole = Object.entries(rec)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
  for (const word of FORBIDDEN_WORDS) {
    let idx = whole.indexOf(word);
    while (idx !== -1) {
      const before = whole.slice(Math.max(0, idx - 4), idx);
      const negated = NEGATION_PREFIXES.some(p => before.endsWith(p));
      if (!negated) {
        errors.push(`C-WORDING 命中禁词「${word}」——违反禁医疗/法律/投资/宿命断言`);
      }
      idx = whole.indexOf(word, idx + word.length);
    }
  }

  // 13) 防空壳：总字数 ≥800
  const total = SEGMENT_KEYS.reduce((sum, k) => sum + countChars(rec[k]), 0);
  if (total < MIN_TOTAL_CHARS) {
    errors.push(`C-SHELL 总字数 ${total} < ${MIN_TOTAL_CHARS}（防空壳）`);
  }

  // 14) TDK 唯一性（同批外已存在且不同 slug → 重复）
  const tdkTitle = (rec['tdk.title.zh'] ?? '').trim();
  if (tdkTitle) {
    const owner = existingTdkTitles.get(tdkTitle);
    if (owner && owner !== rec.slug) {
      errors.push(`C-TDK tdk.title.zh 与已入库条目「${owner}」重复`);
    }
  }

  return {
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
    normalized: unflatten(rec),
    totalChars: total,
  };
}

// ── slug 生成 ─────────────────────────────────────────────────────────────

/** 无 slug 时按 id 兜底生成（kebab-case）；中文 id 走 id 的尾部拼音段 */
export function deriveSlug(rec) {
  if (rec.slug && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(rec.slug)) return rec.slug;
  const raw = rec.slug || rec.id || '';
  return (
    String(raw)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || null
  );
}

/** TDK 缺失时按公式补齐 */
export function deriveTdk(rec) {
  const title = (rec['title.zh'] ?? '').trim();
  const summary = (rec.s0_summary ?? '').replace(/\s+/g, ' ').trim();
  const tdkTitle = (rec['tdk.title.zh'] ?? '').trim() || `${title}是什么意思｜命律术语百科`.slice(0, 30);
  const tdkDesc =
    (rec['tdk.desc.zh'] ?? '').trim() ||
    `${title}：${summary}。本条目为命理文化术语解释，仅供娱乐与自我觉察。`.slice(0, 80);
  return { title: tdkTitle, desc: tdkDesc };
}
