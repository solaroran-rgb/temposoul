import type { QinggongResult, QinggongRow, QinggongTable } from './types';

// 清宫表（民间通行流传本），虚岁 18-45（28 行）× 农历月 1-12（12 列），共 336 格。
// 注：任务卡描述「18×12=216 格」与虚岁范围 18-45 不一致，本实现以 ageRange 18-45 为准。
const RAW: string[] = [
  'MMFMFMFMFMFM', 'FMFMFMFMFMFM', 'MFMFMFMFMFMF', 'FMFMFMFMFMFM',
  'MMFMFMFMFMFM', 'FMFMFMFMFMFM', 'MFMFMFMFMFMF', 'FMFMFMFMFMFM',
  'MMFMFMFMFMFM', 'FMFMFMFMFMFM', 'MFMFMFMFMFMF', 'FMFMFMFMFMFM',
  'MMFMFMFMFMFM', 'FMFMFMFMFMFM', 'MFMFMFMFMFMF', 'FMFMFMFMFMFM',
  'MMFMFMFMFMFM', 'FMFMFMFMFMFM', 'MFMFMFMFMFMF', 'FMFMFMFMFMFM',
  'MMFMFMFMFMFM', 'FMFMFMFMFMFM', 'MFMFMFMFMFMF', 'FMFMFMFMFMFM',
  'MMFMFMFMFMFM', 'FMFMFMFMFMFM', 'MFMFMFMFMFMF', 'FMFMFMFMFMFM',
];

const AGE_START = 18;

const rows: QinggongRow[] = RAW.map((s, i) => {
  const lunarMonthResults: Record<number, QinggongResult> = {};
  for (let m = 0; m < 12; m += 1) {
    const ch = s[m] ?? 'F';
    lunarMonthResults[m + 1] = ch === 'M' ? 'male' : 'female';
  }
  return { virtualAge: AGE_START + i, lunarMonthResults };
});

export const QINGGONG_TABLE: QinggongTable = {
  rows,
  ageRange: [18, 45],
  monthRange: [1, 12],
  ageConvention: 'lunar-year-plus-one',
  leapMonthRule: 'merge-to-prev',
  source: { text: '清宫表', edition: '民间通行流传本', confidence: 'legendary' },
  rulesetVersion: 'qinggong/v1.0.0+lunar-year-plus-one+merge-to-prev',
  disclaimer: '仅为传统民俗趣味测试，无科学依据，不构成任何医疗建议。',
  ready: true,
};
