import { EntertainmentEntry } from './types';

export interface ZhugeEntry extends EntertainmentEntry {
  signNo: number;
  poem: string;
  gloss: string;
  fortune: string;
  subject: string;
}

export const ZHUGE_ENTRIES: ZhugeEntry[] = Array.from({ length: 384 }, (_, i) => {
  const signNo = i + 1;
  return {
    id: `zhuge-${signNo}`,
    title: `第${signNo}签`,
    body: '诸葛神算签文数据准备中。',
    signNo,
    poem: '签文待补',
    gloss: '释义待补',
    fortune: '中',
    subject: '通用',
    source: { text: '诸葛神算', confidence: 'legendary' },
    confidence: 'legendary',
    ready: false,
    disclaimer: '诸葛神算仅供文化娱乐参考，不构成决策依据。',
  };
});
