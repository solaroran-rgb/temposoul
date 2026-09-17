import type { GufaEntry, GufaSourceRef } from './types';

const SOURCE: GufaSourceRef = { text: '《洛书》九星体系', edition: '九星落宫通行口诀', confidence: 'legendary' };
const DISCLAIMER = '九星论命为传统文化参考，不构成现实决策依据。';

interface Seed { matchKey: string; title: string; body: string }

const READY_SEEDS: Seed[] = [
  { matchKey: '1', title: '一白贪狼', body: '一白属水，古法论智巧与远行，落宫吉凶看组合。' },
  { matchKey: '2', title: '二黑巨门', body: '二黑属土，古法论稳健与包容，落宫吉凶看组合。' },
  { matchKey: '3', title: '三碧禄存', body: '三碧属木，古法论进取与争执，落宫吉凶看组合。' },
  { matchKey: '4', title: '四绿文曲', body: '四绿属木，古法论文采与学识，落宫吉凶看组合。' },
  { matchKey: '5', title: '五黄廉贞', body: '五黄属土，古法论中枢与权威，落宫吉凶看组合。' },
  { matchKey: '6', title: '六白武曲', body: '六白属金，古法论决断与担当，落宫吉凶看组合。' },
  { matchKey: '7', title: '七赤破军', body: '七赤属金，古法论变通与锋芒，落宫吉凶看组合。' },
  { matchKey: '8', title: '八白左辅', body: '八白属土，古法论积累与守成，落宫吉凶看组合。' },
  { matchKey: '9', title: '九紫右弼', body: '九紫属火，古法论喜庆与声名，落宫吉凶看组合。' },
  { matchKey: '1-6', title: '一六相合', body: '一白与六白同宫，古法论金水相生，主聪慧。' },
  { matchKey: '2-7', title: '二七相合', body: '二黑与七赤同宫，古法论土金相生，主务实。' },
  { matchKey: '3-8', title: '三八相合', body: '三碧与八白同宫，古法论木土相成，主进取。' },
];

export const JIUXING_ENTRIES: GufaEntry[] = [
  ...READY_SEEDS.map((s, i) => ({
    id: `jiuxing-${String(i + 1).padStart(3, '0')}`, school: 'jiuxing' as const,
    matchKey: s.matchKey, title: s.title, body: s.body,
    source: SOURCE, confidence: 'legendary' as const, ready: true, disclaimer: DISCLAIMER,
  })),
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `jiuxing-${String(i + 13).padStart(3, '0')}`, school: 'jiuxing' as const,
    matchKey: `jiuxing-placeholder-${i + 1}`, title: `九星语料占位 ${i + 1}`,
    body: '该九星语料整理中，敬请期待。',
    source: SOURCE, confidence: 'legendary' as const, ready: false, disclaimer: DISCLAIMER,
  })),
];
