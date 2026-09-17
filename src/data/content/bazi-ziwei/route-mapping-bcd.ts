/**
 * B/C/D 域路由映射：全站 738 = A280 + B50 + C384 + D24
 * 来源：批2 专家稿口径（A278/B50/C384/D24=736 修正为 A280——TRANSITS 补入）
 * 全站总路由 = 146 基线 + 738 = 884
 */
import { ALL_URLS as A_URLS, A_DOMAIN_TOTAL } from './route-mapping';
import { SOLAR_TERMS, ZIWEI_STARS_B, PALACES_B } from '../calendar-astro';
import { BONE_WEIGHT, TAROT, DREAM_DICT, ICHING, NUMBER_DIVINATION, LOVE_DIVINATION } from '../divination';
import { ZODIAC_ENCYCLOPEDIA, ZODIAC_PERSONALITY } from '../western-name';

/** B 域 slug（50） */
export const B_DYNAMIC_SLUGS: readonly string[] = [
  ...SOLAR_TERMS.map((r) => r.seo.slug), // 24
  ...ZIWEI_STARS_B.map((r) => r.seo.slug), // 14
  ...PALACES_B.map((r) => r.seo.slug), // 12
];

/** C 域 slug（384） */
export const C_DYNAMIC_SLUGS: readonly string[] = [
  ...BONE_WEIGHT.map((r) => r.seo.slug), // 51
  ...TAROT.map((r) => r.seo.slug), // 78
  ...DREAM_DICT.map((r) => r.seo.slug), // 100
  ...ICHING.map((r) => r.seo.slug), // 64
  ...NUMBER_DIVINATION.map((r) => r.seo.slug), // 81
  ...LOVE_DIVINATION.map((r) => r.seo.slug), // 10
];

/** D 域 slug（24） */
export const D_DYNAMIC_SLUGS: readonly string[] = [
  ...ZODIAC_ENCYCLOPEDIA.map((r) => r.seo.slug), // 12
  ...ZODIAC_PERSONALITY.map((r) => r.seo.slug), // 12
];

export const BCD_DYNAMIC_SLUGS: readonly string[] = [
  ...B_DYNAMIC_SLUGS,
  ...C_DYNAMIC_SLUGS,
  ...D_DYNAMIC_SLUGS,
];

/** 全站 URL：A + B + C + D = 738 */
export const SITE_ALL_URLS: readonly string[] = [
  ...A_URLS,
  ...BCD_DYNAMIC_SLUGS,
];

/** 断言：A280 + B50 + C384 + D24 = 738 */
export const B_DOMAIN_COUNT = B_DYNAMIC_SLUGS.length;
export const C_DOMAIN_COUNT = C_DYNAMIC_SLUGS.length;
export const D_DOMAIN_COUNT = D_DYNAMIC_SLUGS.length;

if (B_DOMAIN_COUNT !== 50) {
  throw new Error(`[route-mapping-bcd] expected B=50, got ${B_DOMAIN_COUNT}`);
}
if (C_DOMAIN_COUNT !== 384) {
  throw new Error(`[route-mapping-bcd] expected C=384, got ${C_DOMAIN_COUNT}`);
}
if (D_DOMAIN_COUNT !== 24) {
  throw new Error(`[route-mapping-bcd] expected D=24, got ${D_DOMAIN_COUNT}`);
}
if (SITE_ALL_URLS.length !== 738) {
  throw new Error(`[route-mapping-bcd] expected 738, got ${SITE_ALL_URLS.length} (A=${A_DOMAIN_TOTAL}, B=${B_DOMAIN_COUNT}, C=${C_DOMAIN_COUNT}, D=${D_DOMAIN_COUNT})`);
}

/** 总路由（含 146 基线）= 884 */
export const TOTAL_ROUTES = 146 + SITE_ALL_URLS.length;
