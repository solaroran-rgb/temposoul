/**
 * T07 · 导出术语表 tier2 待译行（作为五语术语表的译文队列）
 *
 * 输入：docs/audit/.../thread-03.../output/terms/7lang-terms.csv（一期 tier1 成果）
 * 输出：docs/i18n/T07/terms-tier2.json —— [{ key, zh, pinyin, category }]
 * 说明：tier1 已完成（zh/en 基准 + 五语译名），tier2 为二期待译，纳入本表。
 *
 * 用法：node scripts/i18n/export-tier2-terms.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const CSV = path.join(
  ROOT,
  'docs/audit/2026-09-13-上线前加固/thread-03-多语言翻译实现与准确性/output/terms/7lang-terms.csv',
);
const OUT = path.join(ROOT, 'docs/i18n/T07/terms-tier2.json');

/** 极简 RFC4180 解析：支持引号包裹、引号内转义 ""、引号内换行 */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else inQuotes = false;
      } else cell += ch;
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n') {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else if (ch !== '\r') cell += ch;
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const header = rows.shift();
  return rows
    .filter((r) => r.length === header.length)
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

const rows = parseCsv(fs.readFileSync(CSV, 'utf8').replace(/^﻿/, ''));
const tier2 = rows.filter((r) => r.status === 'tier2_pending');
const queue = tier2.map((r) => ({
  key: r.archetype_key,
  zh: r.zh,
  pinyin: r.pinyin,
  category: r.category,
}));
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(queue, null, 2), 'utf8');
console.log(`CSV 总行 ${rows.length} ／ tier2 待译 ${queue.length} → docs/i18n/T07/terms-tier2.json`);
const byCat = {};
for (const q of queue) byCat[q.category] = (byCat[q.category] || 0) + 1;
console.log(Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 12));
