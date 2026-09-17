import { MANSION_ENTRIES } from './index';

export interface BirthMansionResult {
  mansionId: string;
  mansionName: string;
  solarLongitude: number;
  rulesetVersion: string;
}

const RULESET_VERSION = 'birth-mansion/v1.0.0';

// 粗近似（非精确天文历算），仅用于工具演示；接入 calendar/astronomical-facts.ts 后替换。
function approxSolarLongitude(month: number, day: number): number {
  const dayOfYear = (month - 1) * 30 + day;
  return (dayOfYear / 365) * 360;
}

export function lookupBirthMansion(month: number, day: number): BirthMansionResult {
  const lon = approxSolarLongitude(month, day);
  const entry = MANSION_ENTRIES.find((m) => {
    const [s, e] = m.astro.raRange;
    if (s <= e) return lon >= s && lon < e;
    return lon >= s || lon < e;
  }) ?? MANSION_ENTRIES[0];
  return {
    mansionId: entry.id, mansionName: entry.name,
    solarLongitude: lon, rulesetVersion: RULESET_VERSION,
  };
}

export { RULESET_VERSION as BIRTH_MANSION_RULESET_VERSION };

/** 合规免责声明：二十八宿生辰宿度为传统天文民俗参考，不构成任何决策依据 */
export const birth_mansion_disclaimer =
  '二十八宿生辰宿度为传统天文与民俗文化参考，非精确天文历算结论，不构成命运、健康或任何重大决策的依据。';
