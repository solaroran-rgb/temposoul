/**
 * A 域路由映射：ALL_URLS = 静态 14 + 动态 266 = 280
 * 收口确认卡修复①：补 TRANSITS.map(r => r.seo.slug)，断言 ALL_URLS.length === 280
 * 连带口径：sitemap 278→280（A 域）
 * 口径说明：FOUR_TRANSFORM_PAIRS 10 条为配对表页（/wiki/four-transform/pairs 静态）的数据行，
 * 无独立路由，不计入 280（与 v8.0 smoke-exp 算式 14+101+165=280 一致）
 */
import { STATIC_SEO } from './static-seo';
import { TEN_GODS } from './ten-gods';
import { SHEN_SHA } from './shen-sha';
import { FOUR_TRANSFORM } from './four-transform';
import { ZIWEI_PATTERNS } from './ziwei-patterns';
import { LIMIT_YEAR } from './limit-year';
import { TRANSITS } from './transits';
import { PALACE_STAR_ALL } from './palace-star-generator';

/** 动态数据源 slug 集合（含 TRANSITS 2 条，修复①） */
export const DYNAMIC_SLUGS: readonly string[] = [
  ...TEN_GODS.map((r) => r.seo.slug),
  ...SHEN_SHA.map((r) => r.seo.slug),
  ...FOUR_TRANSFORM.map((r) => r.seo.slug),
  ...ZIWEI_PATTERNS.map((r) => r.seo.slug),
  ...LIMIT_YEAR.map((r) => r.seo.slug),
  ...TRANSITS.map((r) => r.seo.slug), // 修复①补 TRANSITS
  ...PALACE_STAR_ALL.map((r) => r.seo.slug),
];

/** 全部 URL：静态 + 动态（不去重，保持 280 断言与专家稿一致；slug 唯一性由专用检查保证） */
export const ALL_URLS: readonly string[] = [
  ...Object.keys(STATIC_SEO),
  ...DYNAMIC_SLUGS,
];

/** 断言：静态 14 + 动态 266 = 280（修复①） */
if (ALL_URLS.length !== 280) {
  throw new Error(`[route-mapping] expected 280, got ${ALL_URLS.length} (static=${Object.keys(STATIC_SEO).length}, dynamic=${DYNAMIC_SLUGS.length})`);
}

/** 唯一 slug 数（供 sitemap 去重校验） */
export const UNIQUE_URLS = new Set(ALL_URLS).size;

/** 各数据源条数（供校验与报告） */
export const A_DOMAIN_COUNTS = {
  static: Object.keys(STATIC_SEO).length, // 14
  ten_gods: TEN_GODS.length, // 10
  shen_sha: SHEN_SHA.length, // 12
  four_transform: FOUR_TRANSFORM.length, // 56
  four_transform_pairs: 10, // 数据存在，无独立路由（配对表页数据行）
  ziwei_patterns: ZIWEI_PATTERNS.length, // 15
  limit_year: LIMIT_YEAR.length, // 3
  transits: TRANSITS.length, // 2
  palace_star: PALACE_STAR_ALL.length, // 168
} as const;

export const A_DOMAIN_TOTAL = ALL_URLS.length; // 280
