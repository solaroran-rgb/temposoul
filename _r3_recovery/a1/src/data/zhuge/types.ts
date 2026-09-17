
// A11-5 · src/data/zhuge/types.ts · 诸葛签类型
export type ZhugeFortune = '上上' | '上吉' | '中吉' | '中平' | '下平' | '下下';

export interface ZhugeSign {
  signId: string;
  signNo: number;
  signTitle: string;
  poem: string;
  gloss: string;
  fortune: ZhugeFortune;
  subject: string;
  source: string;
  confidence: 'legendary';
  ready: boolean;
}

export const EXPECTED_COUNT = 384;

export function validateSigns(signs: ZhugeSign[]): { ok: boolean; reason?: string } {
  if (signs.length > EXPECTED_COUNT) return { ok: false, reason: '签数超过 384' };
  const ids = new Set<number>();
  for (const s of signs) {
    if (ids.has(s.signNo)) return { ok: false, reason: `重复签号 ${s.signNo}` };
    ids.add(s.signNo);
  }
  return { ok: true };
}

