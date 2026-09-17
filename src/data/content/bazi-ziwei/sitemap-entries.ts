/**
 * A 域 sitemap 条目：280（静态 14 + 动态 266）
 * 收口确认卡连带：getSitemapEntries 278→280
 */
import { ALL_URLS, UNIQUE_URLS } from './route-mapping';
import { STATIC_SEO } from './static-seo';

export interface SitemapEntry {
  slug: string;
  title: string;
}

/** 静态条目（SEO 标题来自 STATIC_SEO） */
export function getStaticSitemapEntries(): SitemapEntry[] {
  return Object.entries(STATIC_SEO).map(([slug, seo]) => ({ slug, title: seo.title }));
}

/** 全部 sitemap 条目（静态 + 动态，280） */
export function getSitemapEntries(): SitemapEntry[] {
  const bySlug = new Map<string, string>();
  // 静态优先（页面级 SEO）
  for (const [slug, seo] of Object.entries(STATIC_SEO)) bySlug.set(slug, seo.title);
  // 动态补充
  for (const slug of ALL_URLS) {
    if (!bySlug.has(slug)) bySlug.set(slug, slug);
  }
  return Array.from(bySlug.entries()).map(([slug, title]) => ({ slug, title }));
}

/** 断言 sitemap 唯一条目 = 280 */
const SITEMAP_LEN = getSitemapEntries().length;
if (SITEMAP_LEN !== 280) {
  throw new Error(`[sitemap-entries] expected 280, got ${SITEMAP_LEN}`);
}

export { UNIQUE_URLS };
export const SITEMAP_COUNT = SITEMAP_LEN; // 280
