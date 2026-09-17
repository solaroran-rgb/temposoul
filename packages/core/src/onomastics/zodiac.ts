import { findSolarTermEvidence } from '../calendar/index';
import type { DataStatus, EvaluateDeps, NameInput, StageResult, ZodiacData } from './types';

const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

function lichunDate(year: number): string | null {
  try {
    const ev = findSolarTermEvidence('立春', year) as { date?: string } | null | undefined;
    return ev?.date ? String(ev.date) : null;
  } catch {
    return null;
  }
}
function animalOf(year: number): string {
  return ZODIAC[(((year - 4) % 12) + 12) % 12];
}
export function zodiacOfYear(year: number): string {
  return animalOf(year);
}

export function runZodiac(input: NameInput, deps: EvaluateDeps = {}): StageResult<ZodiacData> {
  const roots = deps.zodiacRootTable ?? {};
  const empty: StageResult<ZodiacData> = {
    data: { zodiac: '', likedRoots: [], avoidedRoots: [], basis: 'unknown' },
    status: 'unavailable',
    evidence: [],
    note: '未提供出生年份，生肖维度不参与',
  };
  if (!input.birthYear && !input.birthDate) return empty;
  const year = input.birthYear ?? Number(String(input.birthDate).slice(0, 4));
  if (!Number.isFinite(year)) return empty;

  let refYear = year;
  let basis: ZodiacData['basis'] = 'lunar-new-year';
  let status: DataStatus = 'partial';
  let note = '按农历年近似（未提供完整出生日期），非立春精确分界';

  const lc = lichunDate(year);
  if (lc && input.birthDate) {
    const t = new Date(input.birthDate).getTime();
    const l = new Date(lc).getTime();
    if (Number.isFinite(t) && Number.isFinite(l)) {
      refYear = t < l ? year - 1 : year;
      basis = 'lichun';
      status = 'complete';
      note = `以立春日（${lc.slice(0, 10)}）为界`;
    }
  }

  const animal = animalOf(refYear);
  return {
    data: {
      zodiac: animal,
      likedRoots: roots[animal]?.liked ?? [],
      avoidedRoots: roots[animal]?.avoided ?? [],
      basis,
    },
    status,
    evidence: [
      {
        fieldPath: 'folk.zodiac',
        label: `生肖 ${animal}（${basis === 'lichun' ? '立春分界' : '农历年近似'}）`,
        source: '@temposoul/core/calendar findSolarTermEvidence',
        confidence: status === 'complete' ? 'verified' : 'probable',
        note,
      },
    ],
    note,
  };
}
