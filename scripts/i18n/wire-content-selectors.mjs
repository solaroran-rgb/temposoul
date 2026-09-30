/**
 * T07 · 正文 i18n 接线脚本（一次性、幂等）
 *
 * 作用：把页面/ hook 里对中文数据常量的直接引用，替换为「按语言选择器」引用。
 * 每条替换都断言命中次数，未命中即报错退出，避免静默漏改。
 *
 * 用法：node scripts/i18n/wire-content-selectors.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
let okCount = 0;
let failCount = 0;

/** @type {{file:string, from:string, to:string, times?:number}[]} */
const EDITS = [
  // ---------- 资讯 ----------
  {
    file: 'src/pages/news/NewsListPage.tsx',
    from: "import { newsArticles, NEWS_META } from '@/data/news';",
    to: "import { getNewsArticles, getNewsMeta } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/news/NewsListPage.tsx',
    from: 'useAsyncPage(newsArticles, true)',
    to: 'useAsyncPage(getNewsArticles(), true)',
  },
  {
    file: 'src/pages/news/NewsListPage.tsx',
    from: 'const sorted = [...newsArticles]',
    to: 'const sorted = [...getNewsArticles()]',
  },
  {
    file: 'src/pages/news/NewsListPage.tsx',
    from: 'title={NEWS_META.listTitle}',
    to: 'title={getNewsMeta().listTitle}',
  },
  {
    file: 'src/pages/news/NewsListPage.tsx',
    from: '{NEWS_META.listDescription}',
    to: '{getNewsMeta().listDescription}',
  },
  {
    file: 'src/pages/news/NewsDetailPage.tsx',
    from: "import { newsArticles } from '@/data/news';",
    to: "import { getNewsArticles } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/news/NewsDetailPage.tsx',
    from: 'const article = newsArticles.find',
    to: 'const article = getNewsArticles().find',
  },

  // ---------- 典籍 ----------
  {
    file: 'src/pages/knowledge/ClassicsListPage.tsx',
    from: "import { CLASSICS_META } from '@/data/classics';",
    to: "import { getClassicsMeta } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/knowledge/ClassicsListPage.tsx',
    from: 'useAsyncPage(CLASSICS_META as unknown as readonly object[], true)',
    to: 'useAsyncPage(getClassicsMeta() as unknown as readonly object[], true)',
  },
  {
    file: 'src/pages/knowledge/ClassicsListPage.tsx',
    from: '{CLASSICS_META.map((c) => (',
    to: '{getClassicsMeta().map((c) => (',
  },
  {
    file: 'src/pages/knowledge/ClassicDetailPage.tsx',
    from: "import { classicsArticles } from '@/data/classics';",
    to: "import { getClassicsArticles } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/knowledge/ClassicDetailPage.tsx',
    from: 'const article = classicsArticles.find',
    to: 'const article = getClassicsArticles().find',
  },

  // ---------- 占星 wiki ----------
  {
    file: 'src/pages/wiki/AstroWikiIndexPage.tsx',
    from: "import { astroWikiRegistry } from '@/data/wiki/astro-wiki';",
    to: "import { getAstroWiki } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/wiki/AstroWikiIndexPage.tsx',
    from: ' let result = astroWikiRegistry;',
    to: ' let result = getAstroWiki();',
  },
  {
    file: 'src/pages/wiki/AstroWikiEntryPage.tsx',
    from: "import { astroWikiRegistry } from '@/data/wiki/astro-wiki';",
    to: "import { getAstroWiki } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/wiki/AstroWikiEntryPage.tsx',
    from: ' const found = astroWikiRegistry.find(e => e.id === id);',
    to: ' const found = getAstroWiki().find(e => e.id === id);',
  },
  {
    file: 'src/pages/astrology/ParentingPage.tsx',
    from: "import { parentingData } from '@/data/wiki/astro-wiki';",
    to: "import { getParenting } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/astrology/ParentingPage.tsx',
    from: ' const selectedArticle = selectedSlug ? parentingData.find(a => a.slug === selectedSlug) : null;',
    to: ' const selectedArticle = selectedSlug ? getParenting().find(a => a.slug === selectedSlug) : null;',
  },
  {
    file: 'src/pages/astrology/ParentingPage.tsx',
    from: '{parentingData.map(article => (',
    to: '{getParenting().map(article => (',
  },

  // ---------- 解梦 ----------
  {
    file: 'src/pages/divination/DreamPage.tsx',
    from: "import { DREAM_ENTRIES, DREAM_SOURCE, searchDream } from '@/data/dream/dream-dict';",
    to: "import { searchDream } from '@/data/dream/dream-dict';\nimport { getDreamEntries, getDreamSource } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/divination/DreamPage.tsx',
    from: 'const results = useMemo(() => searchDream(keyword), [keyword]);',
    to: "const results = useMemo(() => searchDream(keyword).map((r) => getDreamEntries().find((e) => e.id === r.id) ?? r), [keyword]);",
  },
  {
    file: 'src/pages/divination/DreamPage.tsx',
    from: 'return stableRank(DREAM_ENTRIES,',
    to: 'return stableRank(getDreamEntries(),',
  },
  {
    file: 'src/pages/divination/DreamPage.tsx',
    from: 'const active = DREAM_ENTRIES.find',
    to: 'const active = getDreamEntries().find',
  },
  {
    file: 'src/pages/divination/DreamPage.tsx',
    from: '<p className="dream__source">来源：{DREAM_SOURCE}</p>',
    to: '<p className="dream__source">{getDreamSource()}</p>',
  },

  // ---------- 塔罗 ----------
  {
    file: 'src/pages/tarot/DailyTarotPage.tsx',
    from: "import { TAROT_CARD_MEANINGS, TarotCardMeaning } from '@/data/tarot/card-meanings';",
    to: "import { TarotCardMeaning } from '@/data/tarot/card-meanings';\nimport { getTarotMeanings } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/tarot/DailyTarotPage.tsx',
    from: 'const picked = pickBySeed(TAROT_CARD_MEANINGS, seed);',
    to: 'const picked = pickBySeed(getTarotMeanings(), seed);',
  },

  // ---------- 星座档案 ----------
  {
    file: 'src/pages/fortune/ZodiacProfilePage.tsx',
    from: "import { ZODIAC_PROFILES, type ProfileTopic } from '@/data/fortune/zodiac-profiles';",
    to: "import { type ProfileTopic } from '@/data/fortune/zodiac-profiles';\nimport { getZodiacProfiles } from '@/i18n/body/content';",
  },
  {
    file: 'src/pages/fortune/ZodiacProfilePage.tsx',
    from: 'const profile = ZODIAC_PROFILES.find',
    to: 'const profile = getZodiacProfiles().find',
  },

  // ---------- FAQ ----------
  {
    file: 'src/hooks/useFaqSearch.ts',
    from: "import { FAQ_DATA, FaqItem } from '../data/faq';",
    to: "import { FaqItem } from '../data/faq';\nimport { getFaq } from '../i18n/body/content';",
  },
  {
    file: 'src/hooks/useFaqSearch.ts',
    from: 'new Fuse(FAQ_DATA, {',
    to: 'new Fuse(getFaq(), {',
  },
  {
    file: 'src/hooks/useFaqSearch.ts',
    from: 'if (!query.trim()) return FAQ_DATA;',
    to: 'if (!query.trim()) return getFaq();',
  },
  {
    file: 'src/pages/platform/FaqPage.tsx',
    from: "import { FAQ_CATEGORIES, FaqCategory } from '../../data/faq';",
    to: "import { FaqCategory } from '../../data/faq';\nimport { getFaqCategories } from '../../i18n/body/content';",
  },
  {
    file: 'src/pages/platform/FaqPage.tsx',
    from: '{FAQ_CATEGORIES.map((c) => (',
    to: '{getFaqCategories().map((c) => (',
  },

  // ---------- 知识库 registry（manifesto 元数据） ----------
  {
    file: 'src/data/knowledge/registry.ts',
    from: "import { FENGSHUI_ARTICLES } from './fengshui-manifest';",
    to: "import { FENGSHUI_ARTICLES } from './fengshui-manifest';\nimport { localizedValue, type Locale } from '@/i18n/body';",
  },
  {
    file: 'src/data/knowledge/registry.ts',
    from: 'export function allArticleMeta(): ArticleMeta[] {',
    to: 'export function allArticleMeta(locale?: Locale): ArticleMeta[] {',
  },
  {
    file: 'src/data/knowledge/registry.ts',
    from: '  return [...ARTICLE_MANIFEST, ...fromGanzhi, ...fromFengshui];',
    to: '  return localizedValue(\'knowledge-meta\', [...ARTICLE_MANIFEST, ...fromGanzhi, ...fromFengshui], locale);',
  },
  {
    file: 'src/data/knowledge/registry.ts',
    from: 'export function getMeta(slug: string): ArticleMeta | undefined {\n  return allArticleMeta().find((m) => m.slug === slug);',
    to: 'export function getMeta(slug: string, locale?: Locale): ArticleMeta | undefined {\n  return allArticleMeta(locale).find((m) => m.slug === slug);',
  },
  {
    file: 'src/data/knowledge/registry.ts',
    from: 'export function listMeta(category?: KnowledgeCategory): ArticleMeta[] {\n  const all = allArticleMeta();',
    to: 'export function listMeta(category?: KnowledgeCategory, locale?: Locale): ArticleMeta[] {\n  const all = allArticleMeta(locale);',
  },
];

for (const { file, from, to, times = 1 } of EDITS) {
  const abs = path.join(ROOT, file);
  if (!fs.existsSync(abs)) {
    console.error(`✗ 文件不存在：${file}`);
    failCount++;
    continue;
  }
  const src = fs.readFileSync(abs, 'utf8');
  const count = src.split(from).length - 1;
  if (count !== times) {
    console.error(`✗ 未命中(${count}/${times})：${file} :: ${from.slice(0, 60)}`);
    failCount++;
    continue;
  }
  fs.writeFileSync(abs, src.split(from).join(to), 'utf8');
  okCount++;
}

// registry 需要 Locale 类型导入
const regPath = path.join(ROOT, 'src/data/knowledge/registry.ts');
const reg = fs.readFileSync(regPath, 'utf8');
if (!reg.includes("type Locale")) {
  fs.writeFileSync(
    regPath,
    reg.replace(
      "import { localizedValue } from '@/i18n/body';",
      "import { localizedValue, type Locale } from '@/i18n/body';",
    ),
    'utf8',
  );
}

console.log(`接线完成：成功 ${okCount} / 失败 ${failCount}`);
if (failCount) process.exit(1);
