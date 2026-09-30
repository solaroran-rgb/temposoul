/**
 * T07 · 译文机器核验（流水线大门）
 *
 * 校验项：
 *   ① 键覆盖：queue.json 每条 zh 是否都有译文（缺失 = 该页面回落中文）
 *   ② 空值：译文不允许空串
 *   ③ 多余键：不在队列里的键（旧稿残留 / 误译造成）   ④ 占位符完整性：{var} 模板变量、Markdown 链接目标 必须与原文一致
 *   ⑤ 中文残留：除允许保留的文化词白名单外，译文中不得出现汉字
 *   ⑥ 长度比：译文/原文字符比，异常（<0.3 或 >4）判为可疑（漏译或过度发挥）
 *   ⑦ UI 覆盖层：83 个英文占位键是否都有译文
 *
 * 产物：
 *   docs/i18n/T07/_verify.json  机器核验明细
 *   docs/i18n/T07/_sample.json  抽检样本（分层 10%，含五语对照）
 *
 * 用法：node scripts/i18n/verify-translations.mjs [抽样比例]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const T07 = path.join(ROOT, 'docs/i18n/T07');
const TRANSLATED = path.join(T07, 'translated');

const LANGS = ['ja', 'ko-KN', 'vi-VN', 'th-TH', 'es-ES'];

/** 允许在五语译文中保留的汉字文化词（不得译为本地语，避免口径漂移） */
const KEEP_HAN = [
  '八字', '紫微斗数', '紫微', '天干', '地支', '十神', '纳音', '神煞', '风水', '五行',
  '太极', '阴阳', '乾坤', '周易', '易经', '梅花易数', '六爻', '太乙', '奇门遁甲',
  '二十八宿', '九宫', '河图', '洛书', '二十四节气', '干支', '生肖', '黄历', '择日',
  // 古籍书名 / 文化专有名词：外文译文保留汉字原词属合理口径
  '周公解梦', '《周公解梦》', '周易参同契', '渊海子平', '三命通会', '紫微斗数全书',
];

/** ja / ko 属汉字文化圈，译文中保留汉字词属正常；vi / th / es 不得残留汉字（白名单除外） */
const HAN_ALLOWED_LOCALES = new Set(['ja', 'ko-KN']);

const HAN_RE = /[一-鿿]/;

function readJson(p, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

const queue = readJson(path.join(T07, 'queue.json'), []);
const uiKeys = readJson(path.join(T07, 'ui-fallback-keys.json'), []);
const ratio = Number(process.argv[2] || 0.1);

function mergeLang(locale) {
  const map = {};
  for (const part of ['-p1', '-p2', '-p3', '-p4', '-extra']) {
    const p = path.join(TRANSLATED, `${locale}${part}.json`);
    if (fs.existsSync(p)) Object.assign(map, readJson(p));
  }
  return map;
}

function tokens(s, re) {
  return (s.match(re) || []).sort().join('|');
}

const report = {};
const uiMaps = {};
for (const locale of LANGS) {
  const map = mergeLang(locale);
  const ui = {};
  for (const part of ['-ui', '-ui-extra']) {
    const p = path.join(TRANSLATED, `${locale}${part}.json`);
    if (fs.existsSync(p)) Object.assign(ui, readJson(p));
  }
  uiMaps[locale] = ui;
  const issues = { missing: [], empty: [], extra: [], placeholder: [], link: [], hanResidue: [], lengthOutlier: [] };
  const keysPerCorpus = {};
  const ratios = [];

  const qByZh = new Map(queue.map((q) => [q.zh, q]));
  for (const q of queue) {
    const v = map[q.zh];
    keysPerCorpus[q.corpus] = keysPerCorpus[q.corpus] || { total: 0, hit: 0 };
    keysPerCorpus[q.corpus].total++;
    if (v === undefined) {
      issues.missing.push(q.id);
      continue;
    }
    if (typeof v !== 'string' || !v.trim()) {
      issues.empty.push(q.id);
      continue;
    }
    keysPerCorpus[q.corpus].hit++;
    // 占位符
    const phSrc = tokens(q.zh, /\{[a-zA-Z_]+\}/g);
    const phDst = tokens(v, /\{[a-zA-Z_]+\}/g);
    if (phSrc !== phDst) issues.placeholder.push({ id: q.id, src: phSrc, dst: phDst });
    // Markdown 链接目标
    const lkSrc = tokens(q.zh, /\]\(([^)]*)\)/g);
    const lkDst = tokens(v, /\]\(([^)]*)\)/g);
    if (lkSrc !== lkDst) issues.link.push({ id: q.id, src: lkSrc, dst: lkDst });
    // 中文残留（ja / ko 汉字文化圈豁免）
    if (!HAN_ALLOWED_LOCALES.has(locale) && HAN_RE.test(v)) {
      const residue = v.replace(new RegExp(KEEP_HAN.join('|'), 'g'), '');
      if (HAN_RE.test(residue)) issues.hanResidue.push({ id: q.id, value: v.slice(0, 60) });
    }
    // 长度比（记录，稍后按该语种中位数做相对判据）
    ratios.push({ id: q.id, ratio: v.length / q.zh.length });
  }
  // 长度异常：以该语种长度比中位数为基准，偏离 [0.4×, 2.5×] 判为可疑（绝对下限 0.25）
  const rs = ratios.map((r) => r.ratio).sort((a, b) => a - b);
  const median = rs.length ? rs[Math.floor(rs.length / 2)] : 1;
  issues.lengthOutlier = ratios
    .filter((r) => r.ratio < Math.max(0.25, median * 0.4) || r.ratio > median * 2.5)
    .map((r) => ({ id: r.id, ratio: Number(r.ratio.toFixed(2)), median: Number(median.toFixed(2)) }));

  for (const k of Object.keys(map)) if (!qByZh.has(k)) issues.extra.push(k.slice(0, 40));

  const uiMissing = uiKeys.map((k) => k.key).filter((k) => !ui[k] || !String(ui[k]).trim());
  const corpusCov = Object.fromEntries(
    Object.entries(keysPerCorpus).map(([k, v]) => [k, Number((v.hit / v.total).toFixed(3))]),
  );
  const chars = Object.values(map).reduce((s, v) => s + (typeof v === 'string' ? v.length : 0), 0);
  report[locale] = {
    translated: Object.keys(map).length,
    targetChars: chars,
    issues: {
      missing: issues.missing.length,
      empty: issues.empty.length,
      extra: issues.extra.length,
      placeholder: issues.placeholder.length,
      link: issues.link.length,
      hanResidue: issues.hanResidue.length,
      lengthOutlier: issues.lengthOutlier.length,
    },
    issueDetail: {
      missing: issues.missing.slice(0, 40),
      empty: issues.empty.slice(0, 20),
      placeholder: issues.placeholder.slice(0, 20),
      link: issues.link.slice(0, 20),
      hanResidue: issues.hanResidue.slice(0, 20),
      lengthOutlier: issues.lengthOutlier.slice(0, 20),
    },
    corpusCoverage: corpusCov,
    uiMissing,
  };
  const t = report[locale].issues;
  console.log(
    `${locale.padEnd(6)} 译文 ${String(report[locale].translated).padStart(4)}/${queue.length}` +
      ` ${String(chars).padStart(6)}字 | 缺 ${t.missing} 空 ${t.empty} 占位符 ${t.placeholder} 链接 ${t.link}` +
      ` 汉字残留 ${t.hanResidue} 长度异常 ${t.lengthOutlier} | UI 缺 ${uiMissing.length}`,
  );
}

// 分层抽检样本
const byCorpus = new Map();
for (const q of queue) {
  if (!byCorpus.has(q.corpus)) byCorpus.set(q.corpus, []);
  byCorpus.get(q.corpus).push(q);
}
const sample = [];
let seed = 20260930;
const rnd = () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};
for (const [corpus, items] of byCorpus) {
  const n = Math.max(3, Math.ceil(items.length * ratio));
  const picked = new Set();
  while (picked.size < Math.min(n, items.length)) picked.add(Math.floor(rnd() * items.length));
  for (const i of picked) {
    const q = items[i];
    sample.push({
      corpus,
      id: q.id,
      zh: q.zh,
      ...Object.fromEntries(LANGS.map((l) => [l, mergeLang(l)[q.zh] ?? ''])),
    });
  }
}
fs.writeFileSync(path.join(T07, '_sample.json'), JSON.stringify(sample, null, 2), 'utf8');
fs.writeFileSync(path.join(T07, '_verify.json'), JSON.stringify({ generatedAt: new Date().toISOString(), langs: report }, null, 2), 'utf8');
console.log(`\n抽检样本 ${sample.length} 条 → docs/i18n/T07/_sample.json`);
console.log('核验明细 → docs/i18n/T07/_verify.json');
