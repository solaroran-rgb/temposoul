/**
 * C23-4 名字大全 · 统一索引
 * 文件路径：src/data/names/catalog-index.ts
 * 合并男 300 + 女 300 = 600 条；提供筛选纯函数
 */
import type { NameCatalogEntry } from './catalog-male';
import { MALE_NAMES } from './catalog-male';
import { FEMALE_NAMES } from './catalog-female';

export type { NameCatalogEntry } from './catalog-male';

export const ALL_NAMES: NameCatalogEntry[] = [...MALE_NAMES, ...FEMALE_NAMES];

export interface NameFilter {
  gender: 'male' | 'female' | 'all';
  surname?: string;
  firstChar?: string;
  lastChar?: string;
  strokeMin?: number;
  strokeMax?: number;
  wuxing?: string;
  keyword?: string;
}

/** 筛选纯函数：同条件必同结果 */
export function filterNames(
  filter: NameFilter,
  source: NameCatalogEntry[] = ALL_NAMES,
): NameCatalogEntry[] {
  return source.filter((n) => {
    if (filter.gender !== 'all' && n.gender !== filter.gender) return false;
    if (filter.surname && n.surname !== filter.surname) return false;
    if (filter.firstChar && n.given[0] !== filter.firstChar) return false;
    if (filter.lastChar && n.given[n.given.length - 1] !== filter.lastChar) return false;
    if (filter.strokeMin !== undefined && n.strokes < filter.strokeMin) return false;
    if (filter.strokeMax !== undefined && n.strokes > filter.strokeMax) return false;
    if (filter.wuxing && !n.wuxing.includes(filter.wuxing)) return false;
    if (filter.keyword && !n.meaning.includes(filter.keyword)) return false;
    return true;
  });
}

export const NAME_TOTAL = ALL_NAMES.length;
export const MALE_TOTAL = MALE_NAMES.length;
export const FEMALE_TOTAL = FEMALE_NAMES.length;

/** 姓氏去重列表（供下拉） */
export const NAME_SURNAMES: string[] = [...new Set(ALL_NAMES.map((n) => n.surname))];
/** 五行去重列表 */
export const NAME_WUXING_OPTIONS: string[] = ['金', '木', '水', '火', '土'];
