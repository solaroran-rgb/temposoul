import type { EvaluateDeps, NameInput, StageResult, WugeData } from './types';
import { runStrokes } from './strokes';

const FOLK_NOTE = '五格剖象源自 20 世纪初日本熊崎氏体系并经港台传布，属民俗，非可验证结论';

export function runWuge(input: NameInput, deps: EvaluateDeps): StageResult<WugeData> {
  const sSum = runStrokes({ ...input, given: '' }, deps);
  const gSum = runStrokes({ ...input, surname: '' }, deps);
  const sChars = input.surname.split('').filter(Boolean);
  const gChars = input.given.split('').filter(Boolean);
  const empty: WugeData = {
    heavenly: null,
    human: null,
    earthly: null,
    outer: null,
    total: null,
    eightyOne: null,
  };

  const missingCount = sSum.data.missing.length + gSum.data.missing.length;
  if (missingCount === sChars.length + gChars.length)
    return {
      data: empty,
      status: 'unavailable',
      evidence: [],
      note: `全部字缺笔画数据，五格不可用。${FOLK_NOTE}`,
    };

  const heavenly = sSum.data.total != null ? sSum.data.total + 1 : null;
  const earthly =
    gSum.data.total != null ? (gChars.length === 1 ? gSum.data.total + 1 : gSum.data.total) : null;
  const lastS = sSum.data.perChar[sSum.data.perChar.length - 1]?.strokes ?? null;
  const firstG = gSum.data.perChar[0]?.strokes ?? null;
  const human = lastS != null && firstG != null ? lastS + firstG : null;
  const total =
    sSum.data.total != null && gSum.data.total != null ? sSum.data.total + gSum.data.total : null;

  let outer: number | null = null;
  if (total != null && human != null)
    outer = sChars.length === 1 && gChars.length === 1 ? 2 : total - human;
  if (outer != null && outer < 1) outer = null;

  const status = missingCount > 0 ? 'partial' : 'complete';
  return {
    data: { heavenly, human, earthly, outer, total, eightyOne: null },
    status,
    evidence:
      status === 'complete'
        ? [
            {
              fieldPath: 'folk.wuge',
              label: `五格 ${heavenly}/${human}/${earthly}/${outer}/${total}`,
              source: 'character-dossier',
              confidence: 'legendary',
              note: FOLK_NOTE,
            },
          ]
        : [],
    note:
      missingCount > 0
        ? `部分字缺笔画（${[...sSum.data.missing, ...gSum.data.missing].join('、')}）。${FOLK_NOTE}`
        : FOLK_NOTE,
  };
}

export function calculateWuge(
  surname: string,
  given: string,
  provider: EvaluateDeps['dossierProvider'],
): StageResult<WugeData> {
  return runWuge({ surname, given, type: 'person', script: 'han' }, { dossierProvider: provider });
}
