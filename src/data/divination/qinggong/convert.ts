// 自查：calendar/lunar.ts 导出名；以下为纯函数口径占位
import type { AgeConvention, LeapMonthRule } from './types';

export function toVirtualAge(gregorianAge: number, convention: AgeConvention): number {
  return convention === 'lunar-year-plus-one' ? gregorianAge + 1 : gregorianAge + 2;
}

export function normalizeLunarMonth(rawMonth: number, isLeap: boolean, rule: LeapMonthRule): number {
  if (!isLeap) return rawMonth;
  if (rule === 'merge-to-prev') return rawMonth === 1 ? 12 : rawMonth - 1;
  if (rule === 'merge-to-next') return rawMonth === 12 ? 1 : rawMonth + 1;
  return rawMonth;
}
