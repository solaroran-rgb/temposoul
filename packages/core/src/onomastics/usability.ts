import type { EvaluateDeps, NameInput, StageResult, UsabilityData } from './types';

export function runUsability(input: NameInput, deps: EvaluateDeps): StageResult<UsabilityData> {
  const provider = deps.provider ?? deps.dossierProvider ?? (() => null);
  const chars = `${input.surname}${input.given}`.split('').filter(Boolean);
  const levels = chars.map((c) => provider(c)?.rareCharLevel ?? null);
  const risks = chars.flatMap((c) => provider(c)?.inputRisk ?? []);

  let rareCharLevel: UsabilityData['rareCharLevel'] = 'unknown';
  if (levels.some((l) => l === 'very-rare')) rareCharLevel = 'very-rare';
  else if (levels.some((l) => l === 'rare')) rareCharLevel = 'rare';
  else if (levels.length > 0 && levels.every((l) => l === 'common')) rareCharLevel = 'common';

  const conformsToStandard = levels.length > 0 && levels.every((l) => l === 'common');
  const status = levels.every((l) => l === null)
    ? 'unavailable'
    : levels.some((l) => l === null)
      ? 'partial'
      : 'complete';

  return {
    data: { conformsToStandard, rareCharLevel, inputRisk: risks },
    status,
    evidence: risks.length
      ? [
          {
            fieldPath: 'fact.usability',
            label: `录入风险：${
              risks
                .filter((r) => !r.supported)
                .map((r) => r.system)
                .join('、') || '无'
            }`,
            source: 'character-dossier',
            confidence: 'verified',
          },
        ]
      : [],
    note: '生僻字在公安/银行/学籍/航旅系统的可录入性存在现实差异，请以实际登记结果为准',
  };
}
