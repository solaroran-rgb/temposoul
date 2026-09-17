import { evaluateNameProfile } from '@temposoul/core/onomastics';
import type { NameInput, NameProfile } from '@temposoul/core/onomastics';
import {
  CHAR_INDEX,
  charsByMeaning,
  ensureAllChunks,
} from '../../../data/character-dossier/character-index';
import { dossierProvider, getZodiacRootTable } from '../../../data/character-dossier/loader';

export interface SuggestConstraints {
  surname: string;
  length: 1 | 2;
  meanings: string[];
  script: 'han' | 'latin';
  gender?: 'male' | 'female' | 'neutral';
  avoidChars?: string[];
  maxStroke?: number;
  limit?: number;
  maxScan?: number;
}
export interface Candidate {
  name: string;
  profile: NameProfile;
  score: number;
  highlights: string[];
  risks: string[];
}

function poolOf(c: SuggestConstraints): string[] {
  const byMeaning = charsByMeaning(c.meanings);
  const base = byMeaning.length ? byMeaning : Object.keys(CHAR_INDEX);
  return base.filter((ch) => {
    if (c.avoidChars?.includes(ch)) return false;
    const d = CHAR_INDEX[ch];
    if (!d || d.status === 'unavailable') return false;
    if (c.maxStroke && typeof d.kangxiStrokes === 'number' && d.kangxiStrokes > c.maxStroke)
      return false;
    return true;
  });
}

function* combos(pool: string[], surname: string, length: 1 | 2): Generator<string> {
  if (length === 1) {
    for (const g of pool) yield `${surname}${g}`;
    return;
  }
  for (const g1 of pool) for (const g2 of pool) yield `${surname}${g1}${g2}`;
}

export function cultureFitScore(p: NameProfile): number {
  let s = 100;
  if (p.fact.phonetics.data.tongueTwister) s -= 30;
  s -= 8 * p.fact.phonetics.data.homophoneRisks.length;
  if (p.fact.semantics.data.meanings.some((m) => m.confidence === 'disputed')) s -= 8;
  if (p.fact.glyph.data.rareCharLevel === 'very-rare') s -= 25;
  else if (p.fact.glyph.data.rareCharLevel === 'rare') s -= 12;
  if (p.folk.wuge.status === 'partial') s -= 5;
  return Math.max(0, s);
}

export async function suggestNames(c: SuggestConstraints): Promise<Candidate[]> {
  await ensureAllChunks();
  const pool = poolOf(c);
  const limit = c.limit ?? 50;
  const maxScan = c.maxScan ?? 4000;
  const seen = new Set<string>();
  const out: Candidate[] = [];
  let scanned = 0;

  for (const name of combos(pool, c.surname, c.length)) {
    if (scanned >= maxScan) break;
    scanned++;
    if (seen.has(name)) continue;
    seen.add(name);
    const input: NameInput = {
      surname: c.surname,
      given: name.slice(c.surname.length),
      type: 'person',
      script: c.script,
      gender: c.gender ?? 'neutral',
    };
    const profile = evaluateNameProfile(input, {
      dossierProvider,
      zodiacRootTable: getZodiacRootTable(),
    });
    out.push({
      name,
      profile,
      score: cultureFitScore(profile),
      highlights: buildHighlights(profile),
      risks: buildRisks(profile),
    });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, limit);
}

function buildHighlights(p: NameProfile): string[] {
  const h: string[] = [];
  if (p.fact.semantics.data.meanings.length)
    h.push(
      `字义：${p.fact.semantics.data.meanings
        .slice(0, 2)
        .map((m) => m.meaning)
        .join('、')}`,
    );
  if (p.fact.phonetics.data.pinyin.length)
    h.push(`读音：${p.fact.phonetics.data.pinyin.join(' ')}`);
  if (p.culture.genderTendency) h.push(`倾向：${p.culture.genderTendency}`);
  return h;
}
function buildRisks(p: NameProfile): string[] {
  const r: string[] = [];
  if (p.fact.phonetics.data.tongueTwister) r.push('相邻字声韵接近，朗读可能拗口');
  for (const x of p.fact.phonetics.data.homophoneRisks) r.push(`${x.dialect}谐音：${x.word}`);
  if (p.fact.glyph.data.rareCharLevel === 'very-rare') r.push('含极生僻字，登记/录入可能受限');
  if (p.dataStatus['fact.strokes'] === 'unavailable') r.push('部分字笔画数据准备中');
  return r;
}
