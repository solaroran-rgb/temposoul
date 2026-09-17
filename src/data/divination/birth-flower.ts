import { EntertainmentEntry } from './types';

export interface BirthFlowerEntry extends EntertainmentEntry {
  monthDay: string;
  flowerName: string;
  symbolism: string;
}

const RAW: [number, string, string, string][] = [
  [1, '1月1日', '梅花', '坚韧与希望'],
  [2, '2月1日', '杏花', '温柔与新生'],
  [3, '3月1日', '桃花', '活力与缘分'],
  [4, '4月1日', '牡丹', '丰盛与自信'],
  [5, '5月1日', '石榴花', '热情与生命力'],
  [6, '6月1日', '荷花', '清雅与自持'],
  [7, '7月1日', '紫薇', '魅力与好运'],
  [8, '8月1日', '桂花', '收获与芬芳'],
  [9, '9月1日', '菊花', '高洁与长寿'],
  [10, '10月1日', '芙蓉', '从容与美丽'],
  [11, '11月1日', '山茶', '理想与谦逊'],
  [12, '12月1日', '水仙', '自省与吉祥'],
];

export const BIRTH_FLOWER_ENTRIES: BirthFlowerEntry[] = RAW.map(([month, monthDay, flowerName, symbolism]) => ({
  id: `birth-flower-${month}`,
  title: `${monthDay}生日花语`,
  body: `${flowerName}象征${symbolism}。`,
  monthDay: `${month}-1`,
  flowerName,
  symbolism,
  source: { text: '生日花语民俗', confidence: 'legendary' },
  confidence: 'legendary',
  ready: true,
  disclaimer: '生日花语仅供文化娱乐参考，不构成命运判断。',
}));
