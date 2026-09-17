// B'11-6 src/pages/divination/lib/lingsign-loaders.ts
/**
 * 灵签显式映射加载器 (裁决2)
 * @module B'11-6
 */

export interface LingSign {
  signId: string;
  signNo: number;
  signTitle: string;
  poem: string;
  gloss: string;
  fortune: string;
  subject: string;
  source: string;
  ready: boolean;
}
export interface LingSignModule {
  SIGNS: LingSign[];
  EXPECTED_COUNT: number;
  READY: boolean;
}
export type LingSignCode = 'guanyin' | 'guandi' | 'huangdaxian' | 'yuelao' | 'lvzu';

export const LING_SIGN_LOADERS: Record<LingSignCode, () => Promise<LingSignModule>> = {
  guanyin: () => import('@/data/lingsign/guanyin'),
  guandi: () => import('@/data/lingsign/guandi'),
  huangdaxian: () => import('@/data/lingsign/huangdaxian'),
  yuelao: () => import('@/data/lingsign/yuelao'),
  lvzu: () => import('@/data/lingsign/lvzu'),
};

export function isValidCode(code: string): code is LingSignCode {
  return code in LING_SIGN_LOADERS;
}

export async function loadLingSignData(code: LingSignCode): Promise<LingSignModule> {
  const mod = await LING_SIGN_LOADERS[code]();
  // 严格校验：即使 ready=false，也不能超过预期数量，且签号必须唯一
  if (mod.SIGNS.length > mod.EXPECTED_COUNT) throw new Error(`[LingSign] ${code} 签文超出预期数量`);
  if (new Set(mod.SIGNS.map((s) => s.signNo)).size !== mod.SIGNS.length)
    throw new Error(`[LingSign] ${code} 签号重复`);
  return mod;
}

export function drawRandomSign(signs: LingSign[], seed: number): LingSign {
  const ready = signs.filter((s) => s.ready);
  const pool = ready.length > 0 ? ready : signs;
  return pool[Math.abs(seed) % pool.length];
}
