import { asConfidence } from './types';
import type {
  DataStatus,
  EvaluateDeps,
  EvidenceItem,
  MeaningItem,
  NameInput,
  SemanticsData,
  StageResult,
} from './types';

export function runSemantics(input: NameInput, deps: EvaluateDeps): StageResult<SemanticsData> {
  const provider = deps.provider ?? deps.dossierProvider ?? (() => null);
  const chars = `${input.surname}${input.given}`.split('').filter(Boolean);
  const meanings: MeaningItem[] = [];
  const evidence: EvidenceItem[] = [];
  const missing: string[] = [];

  for (const ch of chars) {
    const d = provider(ch);
    const list = d?.meanings || [];
    if (!list.length) {
      missing.push(ch);
      continue;
    }
    for (const m of list) {
      meanings.push({
        char: ch,
        meaning: m.meaning,
        source: m.source,
        confidence: asConfidence(m.confidence),
      });
      evidence.push({
        fieldPath: `fact.semantics.${ch}`,
        label: `${ch}：${m.meaning}`,
        source: m.source || 'character-dossier',
        confidence: asConfidence(m.confidence),
      });
    }
  }

  const status: DataStatus =
    missing.length === 0 ? 'complete' : missing.length === chars.length ? 'unavailable' : 'partial';
  return {
    data: { meanings },
    status,
    evidence,
    note:
      status === 'unavailable'
        ? '文化习俗，非可验证结论；字义待编辑编撰'
        : '字义含典故出处，部分条目待人工审阅',
  };
}
