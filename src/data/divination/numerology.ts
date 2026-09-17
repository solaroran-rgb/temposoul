import { EntertainmentEntry } from './types';

export interface NumerologyEntry extends EntertainmentEntry {
  number: number;
  isMaster: boolean;
}

const RAW: [number, boolean, string, string][] = [
  [1, false, '数字1', '象征开创与独立。'],
  [2, false, '数字2', '象征合作与平衡。'],
  [3, false, '数字3', '象征表达与创意。'],
  [4, false, '数字4', '象征秩序与稳定。'],
  [5, false, '数字5', '象征自由与变化。'],
  [6, false, '数字6', '象征关怀与责任。'],
  [7, false, '数字7', '象征探索与内省。'],
  [8, false, '数字8', '象征成就与资源。'],
  [9, false, '数字9', '象征博爱与完成。'],
  [11, true, '主数11', '象征直觉与启发。'],
  [22, true, '主数22', '象征愿景与建造。'],
  [33, true, '主数33', '象征疗愈与奉献。'],
];

export const NUMEROLOGY_ENTRIES: NumerologyEntry[] = RAW.map(([number, isMaster, title, body]) => ({
  id: `numerology-${number}`,
  title,
  body,
  number,
  isMaster,
  source: { text: '生命灵数民俗', confidence: 'probable' },
  confidence: 'probable',
  ready: true,
  disclaimer: '生命灵数仅供文化娱乐与自我反思参考，不构成人格定论。',
}));
