// src/pages/divination/lib/love-seed.ts
import { stableHash } from '@/data/content/deterministic';

export type ZodiacSignId = string;

export interface RandomOptionsCompat {
  readonly seed?: string | number;
}

export interface LoveSeedInput {
  readonly left: ZodiacSignId;
  readonly right: ZodiacSignId;
  readonly dateKey: string;
}

export interface LoveSeedApi {
  derive(input: LoveSeedInput): number;
  toOptions(seed: number): RandomOptionsCompat;
}

export const loveSeed: LoveSeedApi = {
  derive(input: LoveSeedInput): number {
    const raw = `${input.left}|${input.right}|${input.dateKey}`;
    return stableHash(raw) >>> 0;
  },
  toOptions(seed: number): RandomOptionsCompat {
    return { seed };
  },
};
