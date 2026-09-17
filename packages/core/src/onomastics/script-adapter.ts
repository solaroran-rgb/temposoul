import type { EvaluateDeps, NameInput, ScriptAdaptData, StageResult } from './types';

export function detectScript(text: string): 'han' | 'latin' | 'unknown' {
  if (!text) return 'unknown';
  if (/[\u4e00-\u9fff]/.test(text)) return 'han';
  if (/[A-Za-z]/.test(text)) return 'latin';
  return 'unknown';
}

export function runScriptAdapt(
  input: NameInput,
  _deps?: EvaluateDeps,
): StageResult<ScriptAdaptData> {
  const full = `${input.surname} ${input.given}`.trim();
  const words = full.split(/[\s-]+/).filter(Boolean);
  const syllables = words.flatMap((w) => w.toLowerCase().match(/[a-z']+/g) ?? []);
  const initials = words.map((w) => w[0]?.toUpperCase() ?? '').join('');
  return {
    data: {
      syllables,
      length: full.replace(/[\s-]/g, '').length,
      initials,
      meaning: undefined,
      culturalNotes: '拉丁轨不做康熙笔画与五格计算；中文语境联想仅供参考',
    },
    status: words.length ? 'complete' : 'unavailable',
    evidence: words.length
      ? [
          {
            fieldPath: 'script.adapt',
            label: `音节 ${syllables.length} 个，首字母 ${initials}`,
            source: 'onomastics/script-adapter',
            confidence: 'verified',
          },
        ]
      : [],
    note: '泰文/越南文/谚文按契约决策 3 挂 P2',
  };
}
