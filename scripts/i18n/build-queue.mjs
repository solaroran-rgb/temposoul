/**
 * T07 · 合并语料清单为去重译文队列（以 zh 原文为唯一键）
 *
 * 输入：docs/i18n/T07/corpus/<corpus>.json（extract-body-corpus.ts 产出）
 * 输出：docs/i18n/T07/queue.json —— [{ n, corpus, id, zh }]，按语料顺序去重（首次出现的 id 为准）
 *
 * 用法：node scripts/i18n/build-queue.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const CORPUS = path.resolve(import.meta.dirname, '../../docs/i18n/T07/corpus');
const OUT = path.resolve(import.meta.dirname, '../../docs/i18n/T07/queue.json');

const ORDER = [
  'knowledge-manifest',
  'faq',
  'faq-categories',
  'news-meta',
  'news',
  'classics-meta',
  'classics',
  'wiki-zodiac',
  'wiki-astro',
  'wiki-parenting',
  'zodiac-profiles',
  'tarot-meanings',
  'dream-dict',
  'dream-meta',
];

const seen = new Map();
for (const name of ORDER) {
  const f = path.join(CORPUS, `${name}.json`);
  if (!fs.existsSync(f)) continue;
  const j = JSON.parse(fs.readFileSync(f, 'utf8'));
  for (const e of j.entries) {
    if (!e.zh || seen.has(e.zh)) continue;
    seen.set(e.zh, { corpus: name, id: e.id, zh: e.zh });
  }
}

const queue = [...seen.entries()].map(([zh, meta], i) => ({ n: i + 1, ...meta }));
for (const name of ORDER.filter((n) => fs.existsSync(path.join(CORPUS, `${n}.json`)))) {
  // no-op, keeps ORDER auditable
}
fs.writeFileSync(OUT, JSON.stringify(queue, null, 2), 'utf8');
const chars = queue.reduce((s, q) => s + q.zh.length, 0);
console.log(`queue.json 写出：${queue.length} 条唯一串 / ${chars} 字`);
const byCorpus = {};
for (const q of queue) byCorpus[q.corpus] = (byCorpus[q.corpus] || 0) + 1;
console.log(byCorpus);
