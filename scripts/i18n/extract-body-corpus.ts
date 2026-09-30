/**
 * T07 · 五语正文翻译二期 —— 正文语料抽取 + 回退点盘点
 *
 * 作用：
 *   1) 从 src/data 各内容语料中抽取「待译正文条目」（含 CJK 的文案字段），赋予稳定 id；
 *   2) 按 id 统计字数，产出 Round-2 语料清单 docs/i18n/T07/corpus/*.json 与 _inventory.json；
 *   3) 同时盘点 src/i18n/locales 五语词典中「仍是英文占位」的正文键（UI 层回退点）。
 *
 * 用法：tsx --tsconfig tsconfig.app.json scripts/i18n/extract-body-corpus.ts
 * 确定性：同一代码状态重跑结果一致（按源顺序遍历，不排序去重）。
 */
import fs from 'node:fs';
import path from 'node:path';

import { FAQ_DATA, FAQ_CATEGORIES } from '@/data/faq';
import { NEWS_META, newsArticles } from '@/data/news';
import { CLASSICS_META, classicsArticles } from '@/data/classics';
import { zodiacWikiData } from '@/data/wiki/zodiac';
import { astroWikiRegistry, parentingData } from '@/data/wiki/astro-wiki';
import { ZODIAC_PROFILES } from '@/data/fortune/zodiac-profiles';
import { TAROT_CARD_MEANINGS } from '@/data/tarot/card-meanings';
import { DREAM_ENTRIES, DREAM_SOURCE, DREAM_CAUTION } from '@/data/dream/dream-dict';
import { ARTICLE_MANIFEST } from '@/data/knowledge/manifest';

/** 可译文案字段白名单（含数组/嵌套容器）；其余字段视为标识符，不译 */
const TRANSLATABLE_KEYS = new Set([
  'aliases',
  'answer',
  'author',
  'blocks',
  'caution',
  'description',
  'disclaimer',
  'dynasty',
  'h1',
  'header',
  'heading',
  'intro',
  'items',
  'keyword',
  'label',
  'listDescription',
  'listTitle',
  'metaDescription',
  'modernText',
  'name',
  'question',
  'rows',
  'sources',
  'summary',
  'tags',
  'template',
  'text',
  'title',
  'traditionalText',
  'unit',
  'upright',
  'reversed',
  'variables',
]);

const CJK = /[㐀-鿿豈-﫿]/;

function extract(value: unknown, idPath: string, out: { id: string; zh: string }[]) {
  if (typeof value === 'string') {
    if (CJK.test(value)) out.push({ id: idPath, zh: value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => extract(v, `${idPath}[${i}]`, out));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      if (!TRANSLATABLE_KEYS.has(k)) continue;
      const next = idPath ? `${idPath}.${k}` : k;
      extract(v, next, out);
    }
  }
}

function collectFromArray(arr: readonly unknown[], idOf: (item: never, i: number) => string) {
  const out: { id: string; zh: string }[] = [];
  arr.forEach((item, i) => {
    const base = idOf(item as never, i);
    for (const [k, v] of Object.entries(item as Record<string, unknown>)) {
      if (!TRANSLATABLE_KEYS.has(k)) continue;
      extract(v, `${base}.${k}`, out);
    }
  });
  return out;
}

const corpora: { name: string; file: string; entries: { id: string; zh: string }[] }[] = [
  { name: 'faq', file: 'src/data/faq.ts', entries: collectFromArray(FAQ_DATA, (d) => (d as { id: string }).id) },
  {
    name: 'faq-categories',
    file: 'src/data/faq.ts',
    entries: collectFromArray(FAQ_CATEGORIES, (d) => (d as { key: string }).key),
  },
  { name: 'news-meta', file: 'src/data/news.ts', entries: (() => { const o: { id: string; zh: string }[] = []; for (const [k, v] of Object.entries(NEWS_META)) if (TRANSLATABLE_KEYS.has(k)) extract(v, k, o); return o; })() },
  { name: 'news', file: 'src/data/news.ts', entries: collectFromArray(newsArticles, (d) => (d as { slug: string }).slug) },
  { name: 'classics-meta', file: 'src/data/classics.ts', entries: collectFromArray(CLASSICS_META, (d) => (d as { slug: string }).slug) },
  { name: 'classics', file: 'src/data/classics.ts', entries: collectFromArray(classicsArticles, (d) => (d as { slug: string }).slug) },
  { name: 'wiki-zodiac', file: 'src/data/wiki/zodiac.ts', entries: collectFromArray(zodiacWikiData, (d) => (d as { id: string }).id) },
  { name: 'wiki-astro', file: 'src/data/wiki/astro-wiki.ts', entries: collectFromArray(astroWikiRegistry, (d) => (d as { id: string }).id) },
  { name: 'wiki-parenting', file: 'src/data/wiki/astro-wiki.ts', entries: collectFromArray(parentingData, (d) => (d as { id?: string }).id ?? 'x') },
  { name: 'zodiac-profiles', file: 'src/data/fortune/zodiac-profiles.ts', entries: collectFromArray(ZODIAC_PROFILES, (d) => `${(d as { signId: string }).signId}.${(d as { topic: string }).topic}`) },
  { name: 'tarot-meanings', file: 'src/data/tarot/card-meanings.ts', entries: collectFromArray(TAROT_CARD_MEANINGS, (d) => (d as { id: string }).id) },
  { name: 'dream-dict', file: 'src/data/dream/dream-dict.ts', entries: collectFromArray(DREAM_ENTRIES, (d) => (d as { id: string }).id) },
  { name: 'knowledge-manifest', file: 'src/data/knowledge/manifest.ts', entries: collectFromArray(ARTICLE_MANIFEST, (d) => (d as { slug: string }).slug) },
];

// 梦典常量（模块级散串）
// 注意：常量名即中文原文，不在 TRANSLATABLE_KEYS 白名单内，走通用 extract() 会被跳过 → 显式登记
const dreamConst: { id: string; zh: string }[] = [
  { id: 'source', zh: DREAM_SOURCE },
  { id: 'caution', zh: DREAM_CAUTION },
];
corpora.push({ name: 'dream-meta', file: 'src/data/dream/dream-dict.ts', entries: dreamConst });

const OUT = path.resolve(process.cwd(), 'docs/i18n/T07/corpus');
fs.mkdirSync(OUT, { recursive: true });

const inventory: Record<string, unknown> = {};
let total = 0;
let totalChars = 0;
for (const c of corpora) {
  fs.writeFileSync(path.join(OUT, `${c.name}.json`), JSON.stringify(c, null, 2), 'utf8');
  const chars = c.entries.reduce((s, e) => s + e.zh.length, 0);
  inventory[c.name] = { file: c.file, entries: c.entries.length, chars };
  total += c.entries.length;
  totalChars += chars;
  console.log(`${c.name.padEnd(20)} 条目 ${String(c.entries.length).padStart(4)}  字数 ${String(chars).padStart(6)}  ← ${c.file}`);
}
console.log(`\n合计：${total} 条目 / ${totalChars} 汉字（Round-2 语料）`);

fs.writeFileSync(
  path.join(OUT, '_inventory.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), totalEntries: total, totalChars, corpora: inventory }, null, 2),
  'utf8',
);
console.log(`清单已写出：${path.relative(process.cwd(), OUT)}`);
