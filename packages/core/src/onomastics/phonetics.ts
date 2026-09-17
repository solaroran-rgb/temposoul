import { asConfidence } from './types';
import type {
  DataStatus,
  EvaluateDeps,
  EvidenceItem,
  HomophoneRisk,
  NameInput,
  PhoneticsData,
  StageResult,
} from './types';

export function stripTone(p: string): string {
  return p
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
export function splitSyllables(list: string[]): string[] {
  return list.filter((p) => Boolean(p && p.trim()));
}
export function isTongueTwister(list: string[]): boolean {
  const n = list.map(stripTone);
  for (let i = 1; i < n.length; i++) {
    const a = n[i - 1],
      b = n[i];
    if (!a || !b) continue;
    if (a === b) return true;
    const va = a.replace(/^[^aeiouüv]+/, ''),
      vb = b.replace(/^[^aeiouüv]+/, '');
    if (va && va === vb && a[0] === b[0]) return true;
  }
  return false;
}

export function runPhonetics(input: NameInput, deps: EvaluateDeps): StageResult<PhoneticsData> {
  const provider = deps.provider ?? deps.dossierProvider ?? (() => null);
  const chars = `${input.surname}${input.given}`.split('').filter(Boolean);
  const pinyin: string[] = [];
  const tones: number[] = [];
  const missing: string[] = [];
  const evidence: EvidenceItem[] = [];

  for (const ch of chars) {
    const d = provider(ch);
    if (d?.pinyin) {
      pinyin.push(d.pinyin);
      tones.push(typeof d.tone === 'number' ? d.tone : 0);
      evidence.push({
        fieldPath: `fact.phonetics.${ch}`,
        label: `${ch}：${d.pinyin}（第 ${d.tone ?? 0} 声）`,
        source: d.source || 'character-dossier',
        confidence: asConfidence(d.confidence),
      });
    } else missing.push(ch);
  }

  const risks: HomophoneRisk[] = (deps.homophoneTable || [])
    .filter((h) => chars.includes(h.char))
    .map((h) => ({ dialect: h.dialect, word: h.word, note: h.note, confidence: 'probable' }));

  const status: DataStatus =
    missing.length === 0 ? 'complete' : missing.length === chars.length ? 'unavailable' : 'partial';
  const twister = isTongueTwister(pinyin);
  const notes = [
    missing.length
      ? missing.length === chars.length
        ? '全部字缺读音数据'
        : `部分字缺读音（${missing.join('、')}）`
      : '',
    twister ? '相邻字声韵接近，朗读可能拗口' : '',
    '重名度：暂无权威开放数据，不做估算',
  ].filter(Boolean);

  return {
    data: {
      pinyin,
      tones,
      syllables: splitSyllables(pinyin),
      tongueTwister: twister,
      homophoneRisks: risks,
      duplicateRate: null,
    },
    status,
    evidence,
    note: notes.join('；'),
  };
}
