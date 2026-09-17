/**
 * A 域（排盘深化/命理专题）聚合出口
 * 收口确认卡口径：A 域 280 条路由（静态14 + 动态266），全站 sitemap A280+B50+C384+D24=738
 */
export { STATIC_SEO } from './static-seo';
export { TEN_GODS, TEN_GODS_COUNT } from './ten-gods';
export { SHEN_SHA, SHEN_SHA_COUNT } from './shen-sha';
export { FOUR_TRANSFORM, FOUR_TRANSFORM_COUNT, FOUR_TRANSFORM_TYPE_LABELS, LAYER_READING } from './four-transform';
export { FOUR_TRANSFORM_PAIRS, FOUR_TRANSFORM_PAIRS_COUNT } from './four-transform-pairs';
export { ZIWEI_PATTERNS, ZIWEI_PATTERNS_COUNT } from './ziwei-patterns';
export { LIMIT_YEAR, LIMIT_YEAR_COUNT } from './limit-year';
export { TRANSITS, TRANSITS_COUNT } from './transits';
export {
  PALACES, MAIN_STARS, PALACE_STAR_INDEX, PALACE_STAR_EXAMPLES,
  PALACE_STAR_INDEX_COUNT, PALACE_PINYIN_MAP, STAR_PINYIN,
} from './palace-star';
export {
  PALACE_STAR_ALL, PALACE_STAR_ALL_COUNT, PALACE_STAR_TEMPLATE_COUNT, getPalaceStarById,
} from './palace-star-generator';
export { PALACE_IMPACT, PALACE_NAMES, PALACE_PINYIN } from './shared/palace-impact';
export { ALL_URLS, DYNAMIC_SLUGS, UNIQUE_URLS, A_DOMAIN_COUNTS, A_DOMAIN_TOTAL } from './route-mapping';
export { getSitemapEntries, getStaticSitemapEntries, SITEMAP_COUNT } from './sitemap-entries';
export type {
  ContentRecord, AnyContentRecord, AnyExtra, ContentSeo, ContentSource,
  ContentCompliance, ContentReview, ContentBody, TenGodExtra, ShenShaExtra,
  FourTransformExtra, FourTransformPairExtra, ZiweiPatternExtra, LimitYearExtra,
  PalaceStarExtra, TransitExtra, ContentDomain, SourceSystem, ReviewStatus,
} from './types';
export { WORD_FLOOR, CATEGORIES } from './types';
