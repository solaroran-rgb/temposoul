/**
 * A 域页面注册表：kind → 数据数组（供 B2List/B2Detail 通用组件消费）
 */
import {
  TEN_GODS, SHEN_SHA, FOUR_TRANSFORM, ZIWEI_PATTERNS, LIMIT_YEAR,
  TRANSITS, PALACE_STAR_ALL, PALACE_STAR_EXAMPLES,
  type AnyContentRecord,
} from '@/data/content/bazi-ziwei';

export type B2Kind =
  | 'ten_gods' | 'shen_sha' | 'four_transform' | 'ziwei_patterns'
  | 'limit_year' | 'transits' | 'palace_star';

export interface KindMeta {
  kind: B2Kind;
  title: string;
  desc: string;
  listSlug: string;
  base: string;
  records: readonly AnyContentRecord[];
}

export const KIND_META: Record<B2Kind, KindMeta> = {
  ten_gods: {
    kind: 'ten_gods', title: '十神详解', desc: '八字十神含义与白话解读', listSlug: '/wiki/ten-gods', base: '/wiki/ten-gods',
    records: TEN_GODS as readonly AnyContentRecord[],
  },
  shen_sha: {
    kind: 'shen_sha', title: '八字神煞专题', desc: '12 大核心神煞详解', listSlug: '/wiki/shen-sha', base: '/wiki/shen-sha',
    records: SHEN_SHA as readonly AnyContentRecord[],
  },
  four_transform: {
    kind: 'four_transform', title: '紫微四化详解', desc: '化禄化权化科化忌×十四主星', listSlug: '/wiki/four-transform', base: '/wiki/four-transform',
    records: FOUR_TRANSFORM as readonly AnyContentRecord[],
  },
  ziwei_patterns: {
    kind: 'ziwei_patterns', title: '紫微斗数格局大全', desc: '15 大主格局白话解读', listSlug: '/wiki/ziwei-patterns', base: '/wiki/ziwei-patterns',
    records: ZIWEI_PATTERNS as readonly AnyContentRecord[],
  },
  limit_year: {
    kind: 'limit_year', title: '紫微限年', desc: '大限小限流年怎么看', listSlug: '/wiki/limit-year-guide', base: '/wiki/limit-year',
    records: LIMIT_YEAR as readonly AnyContentRecord[],
  },
  transits: {
    kind: 'transits', title: '行运与太阳返照', desc: '西占行运与返照解读框架', listSlug: '/wiki/transits', base: '/wiki',
    records: TRANSITS as readonly AnyContentRecord[],
  },
  palace_star: {
    kind: 'palace_star', title: '紫微十二宫×主星', desc: '12 宫 14 主星组合解读', listSlug: '/wiki/palace-star', base: '/wiki/palace-star',
    records: PALACE_STAR_ALL as readonly AnyContentRecord[],
  },
};

/** 静态详情 slug → 记录（transits 详情页等无 :id 路由的静态映射） */
export const STATIC_DETAIL_SLUG: Record<string, { kind: B2Kind; id: string }> = {
  '/wiki/transits/detail': { kind: 'transits', id: 'transit_planets' },
  '/wiki/solar-return/detail': { kind: 'transits', id: 'solar_return_axes' },
};

/** 手写示例（palace-star 3 条）供详情 */
export const PALACE_STAR_EXAMPLE_RECORDS = PALACE_STAR_EXAMPLES as readonly AnyContentRecord[];
