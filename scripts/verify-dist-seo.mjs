// verify-dist-seo.mjs
// 产物 SEO / 元数据断言 ** Gate B（软门禁）**
// 用法：node scripts/verify-dist-seo.mjs [distDir]
// 退出码：0 = 通过；非 0 = 断言失败（CI 中设 continue-on-error：可见但不阻断）。
//
// 与 verify-dist-integrity.mjs（Gate A，硬门禁）的分工：
//   Gate A 只管「产物完整性」，失败即全站白屏，绝无正当漂移 -> 硬阻断。
//   本文件管「SEO 策略口径」：canonical / hreflang / OG·Twitter / title·description
//   唯一性 / smoke-expectations 对齐 / 页面数口径 / JSON-LD / BreadcrumbList /
//   robots / sitemap。这些会随内容、路由、语种正常漂移，属于内容工单而非线上事故，
//   因此降级为软门禁：报红要修，但不该因为某个页面 title 没对齐就卡住发布。
// 判定逻辑本身未做任何改动，仅从 verify-dist-integrity.mjs 物理拆分而来。

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('dist');

// smoke-expectations 相对「本脚本所在目录的上一级 = repo root」解析，
// 不再依赖进程 CWD —— 从任意目录调用都不会误报「smoke-expectations 不存在」。
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const SMOKE_PATH = path.join(REPO_ROOT, 'build', 'smoke-expectations.json');

const errors = [];
const ok = (msg) => console.log(`  ✓ ${msg}`);
const fail = (msg) => { errors.push(msg); console.log(`  ✗ ${msg}`); };

console.log(`\n[verify-dist-seo] 校验产物 SEO: ${DIST}\n`);

// 0) index.html 存在（Gate A 已保证；这里再兜一次，避免 Gate B 被单独调用时崩掉）
const indexPath = path.join(DIST, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error(`[verify-dist-seo] dist/index.html 不存在: ${indexPath}`);
  process.exit(1);
}
const html = fs.readFileSync(indexPath, 'utf8');

// 1) 280 个 A 域 prerender 页 SEO 完整性与差异化
if (!fs.existsSync(SMOKE_PATH)) {
  fail(`smoke-expectations 不存在: ${SMOKE_PATH}`);
} else {
  const smoke = JSON.parse(fs.readFileSync(SMOKE_PATH, 'utf8'));
  const expectations = Array.isArray(smoke.expectations) ? smoke.expectations : [];
  const expectedTotal = smoke.total ?? expectations.length;
  const titles = new Map();
  const descriptions = new Map();
  let seoPagesOk = 0;

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const getTitle = (source) => source.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';
  const getMeta = (source, attr, key) => {
    const tag = source.match(
      new RegExp(`<meta\\b(?=[^>]*\\b${attr}="${escapeRegExp(key)}")[^>]*>`, 'i'),
    )?.[0];
    return tag?.match(/\bcontent="([^"]*)"/i)?.[1] ?? '';
  };
  const getCanonical = (source) => {
    const tag = source.match(/<link\b(?=[^>]*\brel="canonical")[^>]*>/i)?.[0];
    return tag?.match(/\bhref="([^"]*)"/i)?.[1] ?? '';
  };
  const getAlternates = (source) => {
    const tags = source.match(/<link\b(?=[^>]*\brel="alternate")(?=[^>]*\bhreflang="[^"]+")[^>]*>/gi) ?? [];
    return tags.map((tag) => ({
      lang: tag.match(/\bhreflang="([^"]*)"/i)?.[1] ?? '',
      href: tag.match(/\bhref="([^"]*)"/i)?.[1] ?? '',
    }));
  };

  if (expectations.length !== expectedTotal) {
    fail(`SEO expectation 数量 ${expectations.length} 与 total ${expectedTotal} 不一致`);
  }

  const rootAlternates = getAlternates(html)
    .map((item) => `${item.lang}:${item.href}`)
    .sort();
  const expectedRootAlternates = [
    'x-default:https://www.temposoul.com/',
    'zh-CN:https://www.temposoul.com/',
  ].sort();
  if (getCanonical(html) !== 'https://www.temposoul.com/') fail('首页 canonical 不匹配生产域');
  if (JSON.stringify(rootAlternates) !== JSON.stringify(expectedRootAlternates)) {
    fail('首页 hreflang 应仅声明真实的 zh-CN 与 x-default URL');
  }
  if (/property="og:locale:alternate"/i.test(html)) fail('首页存在无独立 URL 支撑的 og:locale:alternate');
  if (getMeta(html, 'property', 'og:image') !== 'https://www.temposoul.com/pwa-512x512.png') {
    fail('首页 og:image 不是绝对生产 URL');
  }
  if (getMeta(html, 'name', 'twitter:image') !== 'https://www.temposoul.com/pwa-512x512.png') {
    fail('首页 twitter:image 不是绝对生产 URL');
  }

  for (const entry of expectations) {
    const rel = entry.slug.replace(/^\/+/, '');
    const file = path.join(DIST, rel, 'index.html');
    if (!fs.existsSync(file)) {
      fail(`缺失 prerender HTML: ${entry.slug}`);
      continue;
    }

    const source = fs.readFileSync(file, 'utf8');
    const canonical = `https://www.temposoul.com${entry.slug}`;
    const title = getTitle(source);
    const description = getMeta(source, 'name', 'description');
    const ogTitle = getMeta(source, 'property', 'og:title');
    const ogDescription = getMeta(source, 'property', 'og:description');
    const ogUrl = getMeta(source, 'property', 'og:url');
    const twitterTitle = getMeta(source, 'name', 'twitter:title');
    const twitterDescription = getMeta(source, 'name', 'twitter:description');
    const alternates = getAlternates(source);
    const jsonLdText = source.match(
      /<script\b[^>]*type="application\/ld\+json"[^>]*data-prerender-seo[^>]*>([\s\S]*?)<\/script>/i,
    )?.[1];

    if (!title || !title.includes(entry.title)) fail(`${entry.slug}: title 缺失或未保留主题词`);
    if (!description) fail(`${entry.slug}: description 缺失`);
    if (getCanonical(source) !== canonical) fail(`${entry.slug}: canonical 不匹配`);
    if (ogTitle !== title || twitterTitle !== title) fail(`${entry.slug}: OG/Twitter title 未与 title 对齐`);
    if (ogDescription !== description || twitterDescription !== description) {
      fail(`${entry.slug}: OG/Twitter description 未与 description 对齐`);
    }
    if (ogUrl !== canonical) fail(`${entry.slug}: og:url 不匹配`);
    if (getMeta(source, 'property', 'og:image') !== 'https://www.temposoul.com/pwa-512x512.png') {
      fail(`${entry.slug}: og:image 不是绝对生产 URL`);
    }
    if (getMeta(source, 'name', 'twitter:image') !== 'https://www.temposoul.com/pwa-512x512.png') {
      fail(`${entry.slug}: twitter:image 不是绝对生产 URL`);
    }

    const alternateKey = alternates.map((item) => `${item.lang}:${item.href}`).sort();
    const expectedAlternates = [`x-default:${canonical}`, `zh-CN:${canonical}`].sort();
    if (JSON.stringify(alternateKey) !== JSON.stringify(expectedAlternates)) {
      fail(`${entry.slug}: hreflang 应仅声明真实的 zh-CN 与 x-default canonical`);
    }
    if (/property="og:locale:alternate"/i.test(source)) {
      fail(`${entry.slug}: 存在无独立 URL 支撑的 og:locale:alternate`);
    }

    if (!jsonLdText) {
      fail(`${entry.slug}: 缺失 prerender JSON-LD`);
    } else {
      try {
        const jsonLd = JSON.parse(jsonLdText);
        const graph = Array.isArray(jsonLd['@graph']) ? jsonLd['@graph'] : [];
        const expectedType = entry.slug.startsWith('/tools/') ? 'WebApplication' : 'Article';
        if (!graph.some((node) => node?.['@type'] === expectedType && node?.url === canonical)) {
          fail(`${entry.slug}: JSON-LD 缺失 ${expectedType} 页面节点`);
        }
        if (!graph.some((node) => node?.['@type'] === 'BreadcrumbList')) {
          fail(`${entry.slug}: JSON-LD 缺失 BreadcrumbList`);
        }
      } catch {
        fail(`${entry.slug}: JSON-LD 不是合法 JSON`);
      }
    }

    if (source.includes('<body<!--')) fail(`${entry.slug}: body 起始标签被注释破坏`);
    if (titles.has(title)) fail(`${entry.slug}: title 与 ${titles.get(title)} 重复`);
    else titles.set(title, entry.slug);
    if (descriptions.has(description)) {
      fail(`${entry.slug}: description 与 ${descriptions.get(description)} 重复`);
    } else descriptions.set(description, entry.slug);
    seoPagesOk += 1;
  }

  if (seoPagesOk === expectedTotal && titles.size === expectedTotal && descriptions.size === expectedTotal) {
    ok(`${expectedTotal} 个 prerender 页 title/description 唯一，SEO 元数据与 JSON-LD 完整`);
  }
}

// 2) robots / sitemap 基础口径；738 全域尚未全部 prerender 时只提示，不阻断本轮构建
const robotsPath = path.join(DIST, 'robots.txt');
const sitemapPath = path.join(DIST, 'sitemap.xml');
if (!fs.existsSync(robotsPath)) {
  fail('dist/robots.txt 不存在');
} else {
  const robots = fs.readFileSync(robotsPath, 'utf8');
  if (!robots.includes('Sitemap: https://www.temposoul.com/sitemap.xml')) {
    fail('robots.txt 未指向生产 sitemap');
  } else ok('robots.txt 指向生产 sitemap');
}
if (!fs.existsSync(sitemapPath)) {
  fail('dist/sitemap.xml 不存在');
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const uniqueUrls = new Set(urls);
  if (urls.length !== uniqueUrls.size) fail(`sitemap 存在 ${urls.length - uniqueUrls.size} 条重复 URL`);
  if (urls.some((url) => !url.startsWith('https://www.temposoul.com/'))) {
    fail('sitemap 含非生产域 URL');
  }
  if (urls.length === 738) ok('sitemap 符合四域口径 738');
  else console.warn(`  ! sitemap 当前 ${urls.length} 条，未达到四域口径 738（A280+B50+C384+D24）`);
}

// 汇总
console.log('');
if (errors.length > 0) {
  console.error(`[verify-dist-seo] ✗ 校验失败，共 ${errors.length} 项:`);
  for (const e of errors) console.error(`    - ${e}`);
  process.exit(1);
}
console.log('[verify-dist-seo] ✓ 全部断言通过');
