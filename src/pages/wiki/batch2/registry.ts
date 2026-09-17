/**
 * A/B/C/D 域页面注册表：kind → 数据数组（供 B2List/B2Detail 通用组件消费）
 */
import {
  TEN_GODS, SHEN_SHA, FOUR_TRANSFORM, ZIWEI_PATTERNS, LIMIT_YEAR,
  TRANSITS, PALACE_STAR_ALL, PALACE_STAR_EXAMPLES,
  type AnyContentRecord,
} from '@/data/content/bazi-ziwei';
import { SOLAR_TERMS, ZIWEI_STARS_B, PALACES_B } from '@/data/content/calendar-astro';
import { BONE_WEIGHT, TAROT, DREAM_DICT, ICHING, NUMBER_DIVINATION, LOVE_DIVINATION } from '@/data/content/divination';
import { ZODIAC_ENCYCLOPEDIA, ZODIAC_PERSONALITY } from '@/data/content/western-name';

export type B2Kind =
  | 'ten_gods' | 'shen_sha' | 'four_transform' | 'ziwei_patterns'
  | 'limit_year' | 'transits' | 'palace_star'
  | 'solar_terms' | 'ziwei_stars_b' | 'palaces_b'
  | 'bone_weight' | 'tarot' | 'dream_dict' | 'iching'
  | 'number_divination' | 'love_divination'
  | 'zodiac_encyclopedia' | 'zodiac_personality';

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
  solar_terms: {
    kind: 'solar_terms', title: '二十四节气', desc: '24 节气详解与养生参考', listSlug: '/wiki/solar-terms', base: '/wiki/solar-terms',
    records: SOLAR_TERMS as readonly AnyContentRecord[],
  },
  ziwei_stars_b: {
    kind: 'ziwei_stars_b', title: '紫微十四主星', desc: '14 主星星性详解', listSlug: '/wiki/ziwei-stars', base: '/wiki/ziwei-stars',
    records: ZIWEI_STARS_B as readonly AnyContentRecord[],
  },
  palaces_b: {
    kind: 'palaces_b', title: '紫微十二宫', desc: '12 宫观察要点详解', listSlug: '/wiki/palaces', base: '/wiki/palaces',
    records: PALACES_B as readonly AnyContentRecord[],
  },
  bone_weight: {
    kind: 'bone_weight', title: '称骨算命', desc: '51 档骨重民俗解读', listSlug: '/wiki/bone_weight', base: '/wiki/bone_weight',
    records: BONE_WEIGHT as readonly AnyContentRecord[],
  },
  tarot: {
    kind: 'tarot', title: '塔罗牌义', desc: '78 张牌正逆位解读', listSlug: '/wiki/tarot/cards', base: '/wiki/tarot/cards',
    records: TAROT as readonly AnyContentRecord[],
  },
  dream_dict: {
    kind: 'dream_dict', title: '周公解梦', desc: '100 个梦境意象民俗解读', listSlug: '/wiki/dream', base: '/wiki/dream',
    records: DREAM_DICT as readonly AnyContentRecord[],
  },
  iching: {
    kind: 'iching', title: '易经六十四卦', desc: '64 卦卦义白话解读', listSlug: '/wiki/iching', base: '/wiki/iching',
    records: ICHING as readonly AnyContentRecord[],
  },
  number_divination: {
    kind: 'number_divination', title: '号码吉凶', desc: '81 数理民俗解读', listSlug: '/wiki/number-divination', base: '/wiki/number-divination',
    records: NUMBER_DIVINATION as readonly AnyContentRecord[],
  },
  love_divination: {
    kind: 'love_divination', title: '爱情占卜', desc: '10 种结果参考解读', listSlug: '/tools/love-divination/result', base: '/tools/love-divination/result',
    records: LOVE_DIVINATION as readonly AnyContentRecord[],
  },
  zodiac_encyclopedia: {
    kind: 'zodiac_encyclopedia', title: '星座百科', desc: '12 星座元素与守护星', listSlug: '/wiki/zodiac/encyclopedia', base: '/wiki/zodiac/encyclopedia',
    records: ZODIAC_ENCYCLOPEDIA as readonly AnyContentRecord[],
  },
  zodiac_personality: {
    kind: 'zodiac_personality', title: '星座人格', desc: '12 星座人格画像', listSlug: '/wiki/zodiac/personality', base: '/wiki/zodiac/personality',
    records: ZODIAC_PERSONALITY as readonly AnyContentRecord[],
  },
};

/** 静态详情 slug → 记录（transits 详情页等无 :id 路由的静态映射） */
export const STATIC_DETAIL_SLUG: Record<string, { kind: B2Kind; id: string }> = {
  '/wiki/transits/detail': { kind: 'transits', id: 'transit_planets' },
  '/wiki/solar-return/detail': { kind: 'transits', id: 'solar_return_axes' },
};

/** 手写示例（palace-star 3 条）供详情 */
export const PALACE_STAR_EXAMPLE_RECORDS = PALACE_STAR_EXAMPLES as readonly AnyContentRecord[];

/** 全域记录总数（B2 域） */
export const B2_TOTAL_RECORDS = Object.values(KIND_META).reduce((n, m) => n + m.records.length, 0);
