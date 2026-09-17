import type { EvaluateDeps, SancaiData, StageResult, WugeData } from './types';

export function numeralWuxing(n: number | null): string | null {
  if (n == null) return null;
  const tail = ((n % 10) + 10) % 10;
  if (tail === 1 || tail === 2) return '木';
  if (tail === 3 || tail === 4) return '火';
  if (tail === 5 || tail === 6) return '土';
  if (tail === 7 || tail === 8) return '金';
  return '水';
}

export function runSancai(
  wuge: StageResult<WugeData>,
  _deps?: EvaluateDeps,
): StageResult<SancaiData> {
  const empty: SancaiData = {
    heavenlyElement: null,
    humanElement: null,
    earthlyElement: null,
    text: null,
  };
  if (wuge.status !== 'complete' || wuge.data.heavenly == null)
    return {
      data: empty,
      status: 'unavailable',
      evidence: [],
      note: wuge.status === 'partial' ? '五格数据不完整，三才不展示' : '五格不可用，三才不计算',
    };

  const t = numeralWuxing(wuge.data.heavenly);
  const h = numeralWuxing(wuge.data.human);
  const e = numeralWuxing(wuge.data.earthly);
  const complete = Boolean(t && h && e);
  return {
    data: {
      heavenlyElement: t,
      humanElement: h,
      earthlyElement: e,
      text: complete ? `${t}${h}${e}` : null,
    },
    status: complete ? 'complete' : 'partial',
    evidence: complete
      ? [
          {
            fieldPath: 'folk.sancai',
            label: `三才配置 ${t}/${h}/${e}`,
            source: 'character-dossier',
            confidence: 'legendary',
            note: '文化习俗，非可验证结论',
          },
        ]
      : [],
    note: '文化习俗，非可验证结论',
  };
}
