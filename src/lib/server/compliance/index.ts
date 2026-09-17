import { BLACKLISTS, CRISIS_INTERVENTION_MESSAGE } from './blacklist';

export interface ComplianceCheckResult {
  ok: boolean;
  hits: string[];
  crisisIntervention: boolean;
  message?: string;
}

// O(N) 复杂度扫描，支持上下文豁免
export function checkReportText(text: string): ComplianceCheckResult {
  const hits: string[] = [];
  let crisisIntervention = false;

  for (const [category, config] of Object.entries(BLACKLISTS)) {
    for (const term of config.terms) {
      let index = text.indexOf(term);
      while (index !== -1) {
        // 检查豁免词：如果命中词前面 15 字符内包含豁免词，则视为误杀，跳过
        const contextWindow = text.substring(Math.max(0, index - 15), index + term.length);
        const isExempt = config.exemptions.some((ex) => contextWindow.includes(ex));

        if (!isExempt) {
          hits.push(`${category}:${term}`);
          if (category === 'psychological_crisis') {
            crisisIntervention = true;
          }
        }
        index = text.indexOf(term, index + 1);
      }
    }
  }

  return {
    ok: hits.length === 0,
    hits,
    crisisIntervention,
    message: crisisIntervention ? CRISIS_INTERVENTION_MESSAGE : undefined,
  };
}
