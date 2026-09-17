import { asConfidence } from './types';
import type {
  CharDossierLike,
  DataStatus,
  EvidenceItem,
  EvaluateDeps,
  NameInput,
  StageResult,
  StrokesData,
} from './types';

export const RADICAL_VARIANT_RULES: Record<string, { as: string; strokes: number }> = {
  氵: { as: '水', strokes: 4 },
  忄: { as: '心', strokes: 4 },
  扌: { as: '手', strokes: 4 },
  艹: { as: '艸', strokes: 6 },
  王: { as: '玉', strokes: 5 },
  衤: { as: '衣', strokes: 6 },
  犭: { as: '犬', strokes: 4 },
  '⻖': { as: '阜', strokes: 8 },
  月: { as: '肉', strokes: 6 },
  辶: { as: '辵', strokes: 7 },
};

export function resolveStrokes(d?: CharDossierLike | null): {
  strokes: number | null;
  note?: string;
  confidence?: CharDossierLike['confidence'];
} {
  if (!d) return { strokes: null, note: '该字未收录', confidence: 'unavailable' };
  if (typeof d.kangxiStrokes === 'number')
    return {
      strokes: d.kangxiStrokes,
      note: d.radicalVariantRule ?? undefined,
      confidence: d.confidence ?? 'verified',
    };
  return { strokes: null, note: '该字缺康熙笔画数据', confidence: 'unavailable' };
}

export function runStrokes(input: NameInput, deps: EvaluateDeps): StageResult<StrokesData> {
  const provider = deps.provider ?? deps.dossierProvider ?? (() => null);
  const chars = `${input.surname}${input.given}`.split('').filter(Boolean);
  const perChar: StrokesData['perChar'] = [];
  const missing: string[] = [];
  const evidence: EvidenceItem[] = [];
  let total: number | null = 0;

  for (const ch of chars) {
    const r = resolveStrokes(provider(ch));
    if (r.strokes == null) {
      missing.push(ch);
      total = null;
      perChar.push({ char: ch, strokes: null });
      continue;
    }
    perChar.push({ char: ch, strokes: r.strokes });
    if (total != null) total += r.strokes;
    evidence.push({
      fieldPath: `strokes.${ch}`,
      label: `${ch} 康熙笔画 ${r.strokes}`,
      source: 'character-dossier',
      confidence: asConfidence(r.confidence),
      note: r.note,
    });
  }

  const status: DataStatus =
    missing.length === 0 ? 'complete' : missing.length === chars.length ? 'unavailable' : 'partial';
  return {
    data: { perChar, total, missing },
    status,
    evidence,
    note: missing.length ? `缺笔画数据：${missing.join('、')}` : undefined,
  };
}
