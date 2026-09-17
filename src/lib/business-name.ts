// src/lib/business-name.ts
import { djb2 } from '@/lib/hash';
import { pickManyBySeed } from '@/lib/deterministic';
import { INDUSTRY_WUXING } from '@/data/onomastics/industry-wuxing';
import { getLuckyStroke } from '@/data/onomastics/lucky-strokes';
import { BUSINESS_NAME_WORDS } from '@/data/onomastics/business-name-words';
import { getOwnerWuxingPreference } from '@/data/onomastics/owner-wuxing-map';

export interface BusinessNameCandidate {
  name: string;
  strokes: number[];
  wuxing: string[];
  meaning: string;
  score: number;
  isLucky: boolean;
}

export interface BusinessNameRequest {
  industryId: string;
  ownerSurname?: string;
  ownerBirthYear?: number;
}

export function generateBusinessNames(
  request: BusinessNameRequest,
  count: number = 10,
): BusinessNameCandidate[] {
  const industry = INDUSTRY_WUXING.find((i) => i.industryId === request.industryId);
  if (!industry) return [];

  const seedStr = `${request.industryId}|${request.ownerSurname ?? ''}|${request.ownerBirthYear ?? ''}|${new Date().toDateString()}`;
  const seed = parseInt(djb2(seedStr), 36) >>> 0;

  const preferred: string[] = [industry.wuxing];
  if (request.ownerBirthYear) {
    const owner = getOwnerWuxingPreference(request.ownerBirthYear);
    if (owner) {
      preferred.push(...owner.preferredWuxing);
    }
  }

  const candidateWords = BUSINESS_NAME_WORDS.filter((w) => preferred.includes(w.wuxing));

  if (candidateWords.length < 2) return [];

  const results: BusinessNameCandidate[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count * 2 && results.length < count; i++) {
    const [first, second] = pickManyBySeed(candidateWords, seed + i, 2);
    if (!first || !second) break;

    const name = (request.ownerSurname ?? '') + first.char + second.char;
    if (usedNames.has(name)) continue;
    usedNames.add(name);

    const strokes = [first.strokes, second.strokes];
    const wuxing = [first.wuxing, second.wuxing];
    const meaning = `${first.meaning} · ${second.meaning}`;
    const totalStrokes = strokes.reduce((a, b) => a + b, 0);
    const lucky = getLuckyStroke(totalStrokes);
    const score = lucky.isLucky ? 85 : 60;

    results.push({ name, strokes, wuxing, meaning, score, isLucky: lucky.isLucky });
  }

  return results;
}
