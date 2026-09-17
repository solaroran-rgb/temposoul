import { QINGGONG_TABLE } from './table';
import type { QinggongQuery, QinggongResultPayload } from './types';

export function lookupQinggong(q: QinggongQuery): QinggongResultPayload | null {
  const { virtualAge, lunarMonth } = q;
  const [minAge, maxAge] = QINGGONG_TABLE.ageRange;
  const [minM, maxM] = QINGGONG_TABLE.monthRange;
  if (virtualAge < minAge || virtualAge > maxAge) return null;
  if (lunarMonth < minM || lunarMonth > maxM) return null;
  const row = QINGGONG_TABLE.rows.find((r) => r.virtualAge === virtualAge);
  if (!row) return null;
  const result = row.lunarMonthResults[lunarMonth];
  if (!result) return null;
  return {
    result, virtualAge, lunarMonth,
    rulesetVersion: QINGGONG_TABLE.rulesetVersion,
    computedAt: new Date().toISOString(),
    sourceNote: `${QINGGONG_TABLE.source.text}（${QINGGONG_TABLE.source.edition}）`,
  };
}

export { QINGGONG_TABLE } from './table';
export * from './types';
