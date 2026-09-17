import type { GufaEntry, GufaSourceRef } from './types';

const SOURCE: GufaSourceRef = { text: '《鬼谷子》命理口诀', edition: '通行本', confidence: 'legendary' };
const DISCLAIMER = '鬼谷子论命为传统文化参考，不构成现实决策依据。';

interface Seed { matchKey: string; title: string; body: string }

const READY_SEEDS: Seed[] = [
  { matchKey: 'jia-ji', title: '甲己合土', body: '甲己合化土，古法论中正之合，讲究信义与包容。' },
  { matchKey: 'yi-geng', title: '乙庚合金', body: '乙庚合化金，古法论仁义之合，讲究刚柔并济。' },
  { matchKey: 'bing-xin', title: '丙辛合水', body: '丙辛合化水，古法论威制之合，讲究智谋与变通。' },
  { matchKey: 'ding-ren', title: '丁壬合木', body: '丁壬合化木，古法论仁寿之合，讲究涵养与生机。' },
  { matchKey: 'wu-gui', title: '戊癸合火', body: '戊癸合化火，古法论无情之合，讲究决断与担当。' },
  { matchKey: 'zi-chou', title: '子丑六合', body: '子丑六合，古法论暗中相助，讲究默契与守成。' },
  { matchKey: 'yin-hai', title: '寅亥六合', body: '寅亥六合，古法论木水相生，讲究生发与涵养。' },
  { matchKey: 'mao-xu', title: '卯戌六合', body: '卯戌六合，古法论火木相合，讲究热烈与成就。' },
  { matchKey: 'chen-you', title: '辰酉六合', body: '辰酉六合，古法论金土相成，讲究务实与凝聚。' },
  { matchKey: 'si-shen', title: '巳申六合', body: '巳申六合，古法论火金相炼，讲究磨砺与转化。' },
  { matchKey: 'wu-wei', title: '午未六合', body: '午未六合，古法论火土相生，讲究包容与长养。' },
  { matchKey: 'chong-zi-wu', title: '子午相冲', body: '子午相冲，古法论水火交战，讲究调和与转化。' },
];

export const GUIGUZI_ENTRIES: GufaEntry[] = [
  ...READY_SEEDS.map((s, i) => ({
    id: `guiguzi-${String(i + 1).padStart(3, '0')}`, school: 'guiguzi' as const,
    matchKey: s.matchKey, title: s.title, body: s.body,
    source: SOURCE, confidence: 'legendary' as const, ready: true, disclaimer: DISCLAIMER,
  })),
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `guiguzi-${String(i + 13).padStart(3, '0')}`, school: 'guiguzi' as const,
    matchKey: `guiguzi-placeholder-${i + 1}`, title: `口诀语料占位 ${i + 1}`,
    body: '该口诀语料整理中，敬请期待。',
    source: SOURCE, confidence: 'legendary' as const, ready: false, disclaimer: DISCLAIMER,
  })),
];
