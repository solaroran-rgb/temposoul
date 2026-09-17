
// A9-3 · 5 档映射 + 纯函数（修正：移除死参数 dayBranch 与未使用常量）
export type MarriageTier = 'mutual' | 'one-sided' | 'guarded' | 'social' | 'stable';

export interface MarriageNote {
  tier: MarriageTier;
  title: string;
  body: string;
  source: string;
  note: string;
  confidence: 'legendary';
}

export const MARRIAGE_TIERS: Record<MarriageTier, MarriageNote> = {
  mutual: {
    tier: 'mutual', title: '双向呼应',
    body: '配偶宫与年/月/时支存在合的关系，情感表达上倾向于相互回应；实际关系以现实互动为准。',
    source: '命律内容组整理', note: '非传统固定口径', confidence: 'legendary',
  },
  'one-sided': {
    tier: 'one-sided', title: '单侧呼应',
    body: '配偶宫仅与某一柱存在合的关系，情感表达上较侧重一方主动；实际关系需双方共同营造。',
    source: '命律内容组整理', note: '非传统固定口径', confidence: 'legendary',
  },
  guarded: {
    tier: 'guarded', title: '内敛独立',
    body: '配偶宫与相关神煞组合，情感表达较内敛、独立性强；这并非缺陷，而是不同的相处节奏。',
    source: '命律内容组整理', note: '非传统固定口径', confidence: 'legendary',
  },
  social: {
    tier: 'social', title: '社交亲和',
    body: '配偶宫带桃花类神煞，社交层面亲和度高；具体关系以实际相处为准。',
    source: '命律内容组整理', note: '非传统固定口径', confidence: 'legendary',
  },
  stable: {
    tier: 'stable', title: '稳定基调',
    body: '配偶宫无显著特殊组合，情感表达趋于稳定常规；生活节奏由双方共同定义。',
    source: '命律内容组整理', note: '非传统固定口径', confidence: 'legendary',
  },
};

export interface MarriageTierInput {
  shenshaUnion: string[];
}

export function resolveMarriageTier(input: MarriageTierInput): MarriageTier {
  const s = input.shenshaUnion;
  const has = (kw: string) => s.some(x => typeof x === 'string' && x.includes(kw));
  if (has('红鸾') || has('天喜')) return 'mutual';
  if (has('孤辰') || has('寡宿')) return 'guarded';
  if (has('桃花') || has('咸池')) return 'social';
  return 'stable';
}

