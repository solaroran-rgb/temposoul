// src/data/astrolabe/retrograde-folklore.ts
export interface RetrogradeFolkloreEntry {
  readonly key: string;
  readonly title: string;
  readonly text: string;
  readonly confidence: 'verified' | 'probable' | 'legendary';
}

export const RETROGRADE_FOLKLORE: readonly RetrogradeFolkloreEntry[] = [
  { key: 'comm', title: '沟通与文书', text: '民俗认为水星逆行期间沟通、文书与合约易生反复，宜复核后再确认。此为文化说法，不构成任何决策依据。', confidence: 'legendary' },
  { key: 'travel', title: '出行与行程', text: '民俗认为水逆期行程易有变动，宜预留缓冲时间。此为文化说法，仅供娱乐参考。', confidence: 'legendary' },
  { key: 'return', title: '土星回归', text: '土星约每 29.5 年回归本命位置一次，民俗视其为人生阶段复盘的象征。个人回归年需结合本命盘，本页暂不提供个人推算。', confidence: 'probable' },
];
