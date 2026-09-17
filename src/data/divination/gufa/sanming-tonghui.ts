import type { GufaEntry, GufaSourceRef } from './types';

const SOURCE: GufaSourceRef = { text: '《三命通会》', edition: '明·万民英 通行本', confidence: 'legendary' };
const DISCLAIMER = '古法论命为传统文化参考，不构成现实决策依据。';

interface Seed { matchKey: string; title: string; body: string }

const READY_SEEDS: Seed[] = [
  { matchKey: 'zheng-guan', title: '正官格', body: '正官格取月令正官透干为用，论贵气与秩序，古法以官星是否得地为观察重点。' },
  { matchKey: 'qi-sha', title: '七杀格', body: '七杀格取月令七杀为用，古法重制化之道，讲究以食神制杀或印化杀。' },
  { matchKey: 'zheng-cai', title: '正财格', body: '正财格以月令正财为用，古法论财之根源与守成，重身财两停。' },
  { matchKey: 'pian-cai', title: '偏财格', body: '偏财格以月令偏财为用，古法论流动之财与交际，重身强能任。' },
  { matchKey: 'zheng-yin', title: '正印格', body: '正印格以月令正印为用，古法论母缘与学识，重官印相生。' },
  { matchKey: 'pian-yin', title: '偏印格', body: '偏印格以月令偏印为用，古法论偏门才艺与孤克，重食伤吐秀。' },
  { matchKey: 'shi-shen', title: '食神格', body: '食神格以月令食神为用，古法论福气与才艺，重财食相生。' },
  { matchKey: 'shang-guan', title: '伤官格', body: '伤官格以月令伤官为用，古法论才华与锋芒，重伤官配印。' },
  { matchKey: 'yang-ren', title: '羊刃格', body: '羊刃格以月令羊刃为用，古法论刚烈与魄力，重制刃之法。' },
  { matchKey: 'jian-lu', title: '建禄格', body: '建禄格以月令建禄为用，古法论自食其力与独立，重格局清纯。' },
  { matchKey: 'cong-cai', title: '从财格', body: '从财格论日主无根而从财，古法以顺从为吉，忌比劫分夺。' },
  { matchKey: 'cong-sha', title: '从杀格', body: '从杀格论日主无根而从杀，古法以顺从为吉，忌食伤制杀。' },
];

export const SANMING_ENTRIES: GufaEntry[] = [
  ...READY_SEEDS.map((s, i) => ({
    id: `sanming-${String(i + 1).padStart(3, '0')}`, school: 'sanming' as const,
    matchKey: s.matchKey, title: s.title, body: s.body,
    source: SOURCE, confidence: 'legendary' as const, ready: true, disclaimer: DISCLAIMER,
  })),
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `sanming-${String(i + 13).padStart(3, '0')}`, school: 'sanming' as const,
    matchKey: `sanming-placeholder-${i + 1}`, title: `格局语料占位 ${i + 1}`,
    body: '该格局语料整理中，敬请期待。',
    source: SOURCE, confidence: 'legendary' as const, ready: false, disclaimer: DISCLAIMER,
  })),
];
