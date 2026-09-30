/**
 * gen-sitemap —— 生成 public/sitemap.xml
 *
 * 数据源：
 *  1. src/data/content/bazi-ziwei/sitemap-entries.ts 的 getSitemapEntries()（A 域 280 条：静态 SEO 14 + 动态 266）
 *  2. 应用壳静态路由（/、/tutorial、/records、/privacy，沿用旧 sitemap 的 changefreq/priority）
 *
 * 输出：覆盖 public/sitemap.xml，保留既有 <loc>/<changefreq>/<priority> 条目结构。
 * 运行：pnpm exec tsx --tsconfig tsconfig.app.json scripts/gen-sitemap.ts
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getSitemapEntries, SITEMAP_COUNT } from '../src/data/content/bazi-ziwei/sitemap-entries';

const ROOT = process.cwd();
const OUT = join(ROOT, 'public', 'sitemap.xml');
const SITE = 'https://www.temposoul.com';

interface RouteEntry {
  slug: string;
  changefreq: string;
  priority: string;
}

/** 应用壳静态路由（沿用旧 sitemap.xml 既有优先级，保持结构不变） */
const SHELL_ROUTES: RouteEntry[] = [
  { slug: '/', changefreq: 'weekly', priority: '1.0' },
  { slug: '/tutorial', changefreq: 'monthly', priority: '0.6' },
  { slug: '/records', changefreq: 'monthly', priority: '0.5' },
  { slug: '/privacy', changefreq: 'yearly', priority: '0.3' },
];

/** 内容页按前缀分配 changefreq/priority（壳路由之外的 280 条） */
function contentPriority(slug: string): { changefreq: string; priority: string } {
  if (slug.startsWith('/tools/')) return { changefreq: 'monthly', priority: '0.8' };
  if (slug.startsWith('/wiki/')) return { changefreq: 'monthly', priority: '0.7' };
  return { changefreq: 'weekly', priority: '0.6' };
}

function escapeXml(slug: string): string {
  return slug.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildUrl(entry: RouteEntry): string {
  const loc = `${SITE}${escapeXml(entry.slug)}`;
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority}</priority>`,
    '  </url>',
  ].join('\n');
}

function main(): void {
  const content = getSitemapEntries();
  if (content.length !== SITEMAP_COUNT) {
    throw new Error(`[gen-sitemap] getSitemapEntries()=${content.length} 与 SITEMAP_COUNT=${SITEMAP_COUNT} 不一致`);
  }

  // 壳路由优先，内容页追加，按 slug 去重（壳路由胜出）
  const seen = new Set<string>();
  const out: RouteEntry[] = [];
  for (const r of SHELL_ROUTES) {
    if (!seen.has(r.slug)) {
      seen.add(r.slug);
      out.push(r);
    }
  }
  for (const e of content) {
    if (seen.has(e.slug)) continue;
    seen.add(e.slug);
    out.push({ slug: e.slug, ...contentPriority(e.slug) });
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- 生产域名：www.temposoul.com（由 scripts/gen-sitemap.ts 生成，勿手改） -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    out.map(buildUrl).join('\n'),
    '</urlset>',
    '',
  ].join('\n');

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, xml, 'utf-8');

  const shellCount = SHELL_ROUTES.length;
  console.log(`[gen-sitemap] 写入 ${OUT}`);
  console.log(`  壳路由 ${shellCount} + 内容 ${content.length} = ${out.length} 条 URL（去重后）`);
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);
if (isMain) {
  main();
}
