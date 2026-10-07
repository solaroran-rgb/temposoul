/**
 * Build-time SEO prerender for the 7-language x 21-system = 147 locale pages.
 *
 * Route shape: /<lang>/<system>  (lang ∈ zh/en/ja/ko/th/vi/es)
 *
 * Vite emits one SPA shell (dist/index.html). This script copies that shell to
 * dist/<lang>/<system>/index.html and injects per-locale metadata plus a
 * crawlable static body skeleton (h1 + S1..S5 sections + compliance footer), so
 * crawlers see real translated content and a 7-way hreflang cluster instead of
 * 147 copies of the home page.
 *
 * Deterministic & idempotent: every file is overwritten, no timestamps, no
 * randomness. Safe to re-run after any vite build.
 *
 * Run (tsx, so it can import the TS data source directly):
 *   pnpm exec tsx --tsconfig tsconfig.app.json scripts/gen-multilang-seo.mjs
 *
 * Upstream data: src/data/seo-pages/multilang-pages.ts (MULTILANG_PAGES, 147).
 * Red line: never edit the content data; this script only renders it.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MULTILANG_PAGES } from '../src/data/seo-pages/multilang-pages.ts';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIR, '..');
const DIST = join(ROOT, 'dist');
const BASE_INDEX = join(DIST, 'index.html');
const SITE = 'https://www.temposoul.com';

/** The 7 hreflang languages in cluster order. x-default points at /zh/<system>. */
const HREFLANG_LANGS = Object.freeze(['zh', 'en', 'ja', 'ko', 'th', 'vi', 'es']);

/** lang -> OpenGraph locale token. */
const OG_LOCALE = Object.freeze({
  zh: 'zh_CN',
  en: 'en_US',
  ja: 'ja_JP',
  ko: 'ko_KR',
  th: 'th_TH',
  vi: 'vi_VN',
  es: 'es_ES',
});

/** lang -> <html lang="..."> token. */
const HTML_LANG = Object.freeze({
  zh: 'zh-CN',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  th: 'th',
  vi: 'vi',
  es: 'es',
});

function fail(msg) {
  console.error(`[gen-multilang-seo] ${msg}`);
  process.exit(1);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceTitle(src, title) {
  return src.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
}

function replaceMetaContent(src, attr, key, content) {
  // [^>]* spans newlines, so multiline <meta ...> tags in the shell match fine.
  const tagRe = new RegExp(`<meta\\b(?=[^>]*\\b${attr}="${escapeRegExp(key)}")[^>]*>`, 'i');
  const match = src.match(tagRe);
  const escaped = escapeHtml(content);
  if (!match) {
    return src.replace(/<\/head>/i, `    <meta ${attr}="${key}" content="${escaped}" />\n  </head>`);
  }
  const original = match[0];
  const replacement = /\bcontent="[^"]*"/is.test(original)
    ? original.replace(/\bcontent="[^"]*"/is, `content="${escaped}"`)
    : original.replace(/\s*\/?\s*>$/, ` content="${escaped}" />`);
  return src.replace(tagRe, () => replacement);
}

function replaceCanonical(src, canonical) {
  const tagRe = /<link\b(?=[^>]*\brel="canonical")[^>]*>/i;
  const tag = `<link rel="canonical" href="${canonical}" />`;
  if (!tagRe.test(src)) return src.replace(/<\/head>/i, `    ${tag}\n  </head>`);
  return src.replace(tagRe, tag);
}

/** Strip existing alternates, then inject the 7-language cluster + x-default after canonical. */
function replaceHreflang(src, system, pageLang) {
  const alternateRe = /<link\b(?=[^>]*\brel="alternate")(?=[^>]*\bhreflang="[^"]+")[^>]*>\s*/gi;
  let out = src.replace(alternateRe, '');
  const links = HREFLANG_LANGS.map(
    (l) => `    <link rel="alternate" hreflang="${l}" href="${SITE}/${l}/${system}"${l === pageLang ? ' data-active="1"' : ''} />`,
  );
  links.push(`    <link rel="alternate" hreflang="x-default" href="${SITE}/zh/${system}" />`);
  const block = links.join('\n');
  // Inject right after the canonical link (which already points at this page).
  out = out.replace(
    /(<link\b(?=[^>]*\brel="canonical")[^>]*>)/i,
    `$1\n${block}`,
  );
  return out;
}

function buildJsonLd(page, canonical) {
  const inLanguage = HTML_LANG[page.lang] ?? page.lang;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: '命律 TempoSoul',
        url: `${SITE}/`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        name: '命律 TempoSoul',
        url: `${SITE}/`,
        inLanguage: ['zh-CN', 'en', 'ja', 'ko', 'th', 'vi', 'es'],
      },
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        headline: page.h1,
        description: page.description,
        url: canonical,
        mainEntityOfPage: canonical,
        inLanguage,
        image: `${SITE}/pwa-512x512.png`,
        isPartOf: { '@id': `${SITE}/#website` },
        author: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: page.systemName, item: canonical },
        ],
      },
    ],
  };
}

function replaceJsonLd(src, jsonLd) {
  const safeJson = JSON.stringify(jsonLd, null, 2).replace(/<\/script/gi, '<\\/script');
  const script = `<script type="application/ld+json" data-multilang-seo>\n${safeJson}\n    </script>`;
  const scriptRe = /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/i;
  if (!scriptRe.test(src)) return src.replace(/<\/head>/i, `    ${script}\n  </head>`);
  return src.replace(scriptRe, script);
}

/** Render S1..S5 sections + compliance footer as crawlable static HTML. */
function buildBodySkeleton(page) {
  const parts = [];
  parts.push(`    <!-- multilang-seo:${page.slug} (static crawlable skeleton; SPA hydrates #root) -->`);
  parts.push(`    <h1 data-multilang-seo>${escapeHtml(page.h1)}</h1>`);
  for (const sec of page.sections) {
    parts.push(`    <section data-multilang-section>`);
    parts.push(`      <h2>${escapeHtml(sec.heading)}</h2>`);
    for (const para of sec.paragraphs) {
      parts.push(`      <p>${escapeHtml(para)}</p>`);
    }
    parts.push(`    </section>`);
  }
  parts.push(`    <footer data-multilang-compliance>`);
  parts.push(`      <p>${escapeHtml(page.compliance)}</p>`);
  parts.push(`    </footer>`);
  return parts.join('\n');
}

function injectSeo(src, page) {
  const canonical = `${SITE}${page.slug}`;
  let out = src;

  // html lang
  out = out.replace(/<html\b[^>]*>/i, `<html lang="${HTML_LANG[page.lang] ?? page.lang}">`);

  out = replaceTitle(out, page.title);
  out = replaceMetaContent(out, 'name', 'description', page.description);
  out = replaceMetaContent(out, 'property', 'og:type', 'article');
  out = replaceMetaContent(out, 'property', 'og:locale', OG_LOCALE[page.lang] ?? 'en_US');
  out = out.replace(/<meta\b(?=[^>]*\bproperty="og:locale:alternate")[^>]*>\s*/gi, '');
  out = replaceMetaContent(out, 'property', 'og:title', page.title);
  out = replaceMetaContent(out, 'property', 'og:description', page.description);
  out = replaceMetaContent(out, 'property', 'og:image', `${SITE}/pwa-512x512.png`);
  out = replaceMetaContent(out, 'property', 'og:url', canonical);
  out = replaceMetaContent(out, 'property', 'og:site_name', '命律 TempoSoul');
  out = replaceMetaContent(out, 'name', 'twitter:card', 'summary_large_image');
  out = replaceMetaContent(out, 'name', 'twitter:title', page.title);
  out = replaceMetaContent(out, 'name', 'twitter:description', page.description);
  out = replaceMetaContent(out, 'name', 'twitter:image', `${SITE}/pwa-512x512.png`);

  out = replaceCanonical(out, canonical);
  out = replaceHreflang(out, page.system, page.lang);

  // Neutralize the shell's "only Chinese hreflang" note so it doesn't contradict
  // the 7-way cluster we just injected.
  out = out.replace(
    /\s*<!-- 默认抓取版本为中文；其他语言待拥有独立、可索引 URL 后再加入 hreflang。 -->/,
    '\n    <!-- 7 语 hreflang 集群由 gen-multilang-seo 注入；x-default 指向 /zh/<system>。 -->',
  );

  out = replaceJsonLd(out, buildJsonLd(page, canonical));

  // Inject the crawlable body skeleton right after <body>, before #root.
  out = out.replace(
    /<body([^>]*)>/i,
    `<body$1>\n${buildBodySkeleton(page)}`,
  );

  return out;
}

// ---- main ----
if (!existsSync(BASE_INDEX)) {
  fail(`dist/index.html 不存在：${BASE_INDEX}（请先 vite build + prerender-titles）`);
}
if (!Array.isArray(MULTILANG_PAGES) || MULTILANG_PAGES.length === 0) {
  fail('MULTILANG_PAGES 为空或不是数组');
}

const baseHtml = readFileSync(BASE_INDEX, 'utf8');
const seen = new Set();
let written = 0;

for (const page of MULTILANG_PAGES) {
  if (!page || typeof page.slug !== 'string') fail('页位缺少 slug');
  // slug is /<lang>/<system>; derive rel path and validate shape.
  const m = page.slug.match(/^\/(zh|en|ja|ko|th|vi|es)\/([a-z0-9-]+)$/);
  if (!m) fail(`非法页位 slug：${page.slug}`);
  if (page.lang !== m[1]) fail(`lang(${page.lang}) 与 slug 首段(${m[1]}) 不一致：${page.slug}`);
  if (page.system !== m[2]) fail(`system(${page.system}) 与 slug 末段(${m[2]}) 不一致：${page.slug}`);
  if (seen.has(page.slug)) fail(`重复页位：${page.slug}`);
  seen.add(page.slug);

  const rel = page.slug.replace(/^\/+/, '');
  const outDir = join(DIST, rel);
  const outFile = join(outDir, 'index.html');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outFile, injectSeo(baseHtml, page), 'utf8');

  // Regression guard: never emit `<body<!-- ...` (mirrors prerender-titles).
  if (readFileSync(outFile, 'utf8').includes('<body<!--')) {
    fail(`${page.slug}: 生成了非法 body 起始标签 <body<!--`);
  }
  written += 1;
}

console.log(`[gen-multilang-seo] 注入 ${written} 个多语页位（dist/<lang>/<system>/index.html）`);
console.log(`[gen-multilang-seo] hreflang=7 语互链 + x-default；正文骨架 S1-S5 + 合规句已注入 <body>`);
if (written !== MULTILANG_PAGES.length) fail(`注入数量 ${written} 与数据 ${MULTILANG_PAGES.length} 不一致`);
console.log('[gen-multilang-seo] 完成（幂等，重复运行覆盖写无差异）。');
