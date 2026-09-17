import type { GufaSchool, GufaSubCategory } from './types';

export const GUFA_SUB_CATEGORIES: GufaSubCategory[] = [
  { school: 'sanming', key: 'zhengge', label: '正格', matchKeyPrefix: 'zheng-' },
  { school: 'sanming', key: 'biange', label: '变格', matchKeyPrefix: 'cong-' },
  { school: 'sanming', key: 'waige', label: '外格', matchKeyPrefix: 'wai-' },
  { school: 'guiguzi', key: 'jiaji', label: '甲己组', matchKeyPrefix: 'jia-' },
  { school: 'guiguzi', key: 'yigeng', label: '乙庚组', matchKeyPrefix: 'yi-' },
  { school: 'guiguzi', key: 'bingxin', label: '丙辛组', matchKeyPrefix: 'bing-' },
  { school: 'guiguzi', key: 'dingren', label: '丁壬组', matchKeyPrefix: 'ding-' },
  { school: 'guiguzi', key: 'wugui', label: '戊癸组', matchKeyPrefix: 'wu-' },
  { school: 'jiuxing', key: 'g1', label: '一白', matchKeyPrefix: '1' },
  { school: 'jiuxing', key: 'g2', label: '二黑', matchKeyPrefix: '2' },
  { school: 'jiuxing', key: 'g3', label: '三碧', matchKeyPrefix: '3' },
  { school: 'jiuxing', key: 'g4', label: '四绿', matchKeyPrefix: '4' },
  { school: 'jiuxing', key: 'g5', label: '五黄', matchKeyPrefix: '5' },
  { school: 'jiuxing', key: 'g6', label: '六白', matchKeyPrefix: '6' },
  { school: 'jiuxing', key: 'g7', label: '七赤', matchKeyPrefix: '7' },
  { school: 'jiuxing', key: 'g8', label: '八白', matchKeyPrefix: '8' },
  { school: 'jiuxing', key: 'g9', label: '九紫', matchKeyPrefix: '9' },
];

export function getSubCategories(school: GufaSchool): GufaSubCategory[] {
  return GUFA_SUB_CATEGORIES.filter((c) => c.school === school);
}

export function findSubCategory(school: GufaSchool, key: string): GufaSubCategory | undefined {
  return GUFA_SUB_CATEGORIES.find((c) => c.school === school && c.key === key);
}
