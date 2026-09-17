
// A11-5 · src/data/zhuge/384.ts · 384 签数据（首批 10 签占位）
import type { ZhugeSign } from './types';

const SRC = '据《诸葛神数》通行本整理';

const SEED_SIGNS: ZhugeSign[] = [
  { signId: 'zhuge-001', signNo: 1, signTitle: '第一签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '中吉', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
  { signId: 'zhuge-002', signNo: 2, signTitle: '第二签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '中平', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
  { signId: 'zhuge-003', signNo: 3, signTitle: '第三签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '上吉', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
  { signId: 'zhuge-004', signNo: 4, signTitle: '第四签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '中吉', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
  { signId: 'zhuge-005', signNo: 5, signTitle: '第五签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '中平', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
  { signId: 'zhuge-006', signNo: 6, signTitle: '第六签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '中吉', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
  { signId: 'zhuge-007', signNo: 7, signTitle: '第七签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '中平', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
  { signId: 'zhuge-008', signNo: 8, signTitle: '第八签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '上上', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
  { signId: 'zhuge-009', signNo: 9, signTitle: '第九签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '中吉', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
  { signId: 'zhuge-010', signNo: 10, signTitle: '第十签', poem: '（原文待内容组据通行本录入）', gloss: '（解曰待录入）', fortune: '中平', subject: '通用', source: SRC, confidence: 'legendary', ready: false },
];

export const ZHUGE_SIGNS: ZhugeSign[] = SEED_SIGNS;

export function listSigns(): ZhugeSign[] {
  return ZHUGE_SIGNS;
}

// 起数规则待回填——签名保留，调用抛错表示未实现
export function computeZhugeNo(_strokesA: number, _strokesB: number): number {
  throw new Error('起数规则开发中');
}

