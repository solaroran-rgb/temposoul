// src/data/astrolabe/retrograde-periods.ts
export interface RetrogradePeriod {
  readonly planet: 'mercury' | 'saturn';
  readonly kind: 'retrograde' | 'return';
  readonly startKey: string;
  readonly endKey: string;
  readonly note: string;
  readonly sources: string;
}

const SRC = '公开通行水星逆行历表（近似至日），构建期静态表';

export const RETROGRADE_PERIODS: readonly RetrogradePeriod[] = [
  { planet: 'mercury', kind: 'retrograde', startKey: '2024-04-01', endKey: '2024-04-25', note: '2024 第一次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2024-08-05', endKey: '2024-08-28', note: '2024 第二次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2024-11-25', endKey: '2024-12-15', note: '2024 第三次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2025-03-15', endKey: '2025-04-07', note: '2025 第一次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2025-07-18', endKey: '2025-08-11', note: '2025 第二次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2025-11-09', endKey: '2025-11-29', note: '2025 第三次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2026-02-26', endKey: '2026-03-20', note: '2026 第一次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2026-06-29', endKey: '2026-07-23', note: '2026 第二次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2026-10-24', endKey: '2026-11-13', note: '2026 第三次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2027-02-10', endKey: '2027-03-04', note: '2027 第一次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2027-06-13', endKey: '2027-07-07', note: '2027 第二次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2027-10-07', endKey: '2027-10-27', note: '2027 第三次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2028-01-26', endKey: '2028-02-17', note: '2028 第一次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2028-05-29', endKey: '2028-06-22', note: '2028 第二次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2028-09-21', endKey: '2028-10-11', note: '2028 第三次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2029-01-14', endKey: '2029-02-04', note: '2029 第一次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2029-05-11', endKey: '2029-06-03', note: '2029 第二次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2029-09-10', endKey: '2029-09-30', note: '2029 第三次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2030-01-03', endKey: '2030-01-24', note: '2030 第一次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2030-04-24', endKey: '2030-05-17', note: '2030 第二次水逆', sources: SRC },
  { planet: 'mercury', kind: 'retrograde', startKey: '2030-08-30', endKey: '2030-09-23', note: '2030 第三次水逆', sources: SRC },
];

export function periodsOfYear(year: number): readonly RetrogradePeriod[] {
  const prefix = `${year}-`;
  return RETROGRADE_PERIODS.filter((p) => p.startKey.startsWith(prefix));
}
