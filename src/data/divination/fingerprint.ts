import { EntertainmentEntry } from './types';

export interface FingerprintEntry extends EntertainmentEntry {
  douCount: number;
}

const RAW: [number, string, string, boolean][] = [
  [0, '无斗', '民俗中常以指纹形态作趣味联想，无科学定论。', true],
  [1, '一斗', '一斗穷？民俗说法，仅供娱乐。', true],
  [2, '二斗', '二斗富？民俗说法，仅供娱乐。', true],
  [3, '三斗', '三斗四斗开当铺？民俗说法，仅供娱乐。', true],
  [4, '四斗', '四斗五斗卖豆腐？民俗说法，仅供娱乐。', true],
  [5, '五斗', '五斗六斗骑花马？民俗说法，仅供娱乐。', false],
  [6, '六斗', '六斗七斗做官？民俗说法，仅供娱乐。', false],
  [7, '七斗', '七斗八斗把官做？民俗说法，仅供娱乐。', false],
  [8, '八斗', '八斗九斗十斗全？民俗说法，仅供娱乐。', false],
  [9, '九斗', '九斗十斗享清福？民俗说法，仅供娱乐。', false],
  [10, '十斗', '十斗全，民俗中视为少见形态。', false],
];

export const FINGERPRINT_ENTRIES: FingerprintEntry[] = RAW.map(([douCount, title, body, ready]) => ({
  id: `fingerprint-${douCount}`,
  title,
  body,
  douCount,
  source: { text: '民间指纹民俗', confidence: 'legendary' },
  confidence: 'legendary',
  ready,
  disclaimer: '指纹斗数仅为民间趣味说法，不具科学预测功能。',
}));
