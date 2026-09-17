// B'11-4 src/data/astro-compat/matrix.ts
/**
 * 星座配对规则矩阵
 * @module B'11-4
 */
export interface CompatibilityScore {
  total: number;
  attraction: number;
  communication: number;
  risk: number;
  values: number;
}

const ELEMENTS: Record<string, string> = {
  aries: 'fire',
  leo: 'fire',
  sagittarius: 'fire',
  taurus: 'earth',
  virgo: 'earth',
  capricorn: 'earth',
  gemini: 'air',
  libra: 'air',
  aquarius: 'air',
  cancer: 'water',
  scorpio: 'water',
  pisces: 'water',
};

const ELEMENT_COMPAT: Record<string, Record<string, number>> = {
  fire: { fire: 80, earth: 55, air: 90, water: 45 },
  earth: { fire: 55, earth: 80, air: 45, water: 90 },
  air: { fire: 90, earth: 45, air: 80, water: 55 },
  water: { fire: 45, earth: 90, air: 55, water: 80 },
};

export function calculateCompatibility(a: string, b: string): CompatibilityScore {
  const ea = ELEMENTS[a] ?? 'fire';
  const eb = ELEMENTS[b] ?? 'fire';
  const base = ELEMENT_COMPAT[ea]?.[eb] ?? 50;
  const modAdj = a === b ? -3 : 0;
  const total = Math.min(100, Math.max(0, base + modAdj));
  return {
    total,
    attraction: Math.min(100, Math.max(0, base + 5)),
    communication: Math.min(100, Math.max(0, ea === eb ? 85 : 65)),
    risk: Math.min(100, Math.max(0, 100 - base)),
    values: Math.min(100, Math.max(0, ea === eb ? 80 : 60)),
  };
}
