// B'11-2 src/pages/fortune/lib/daily-fortune.ts (扩展段)
/**
 * 运势引擎扩展 - generateZodiacFortune
 * @module B'11-2
 */
import { djb2 } from '@/lib/hash';
// 假设 ZODIAC_SIGNS 已在文件上半部分定义并导出，此处不再重复定义

export type ZodiacScope = 'today' | 'week' | 'month' | 'year';
export interface ZodiacFortuneData {
  main: string; sub: string; seasonal: string;
  scope: ZodiacScope; signId: string; dateStr: string;
}

const CORPUS_MAIN = ['稳中求进', '蓄势待发', '贵人暗助', '宜守不宜攻', '柳暗花明'];
const CORPUS_SUB = ['注意财务规划', '人际沟通顺畅', '健康关注脾胃', '学习进修良机', '避免冲动决策'];
const CORPUS_SEASONAL = ['春气萌动宜规划', '阳气鼎盛行动强', '收获季节宜复盘', '藏养之时宜休养'];

export function generateZodiacFortune(dateStr: string, signId: string, scope: ZodiacScope): ZodiacFortuneData {
  const seed = djb2(`${scope}|${dateStr}|${signId}`);
  return {
    main: CORPUS_MAIN[Math.abs(seed) % CORPUS_MAIN.length],
    sub: CORPUS_SUB[Math.abs(seed >> 8) % CORPUS_SUB.length],
    seasonal: CORPUS_SEASONAL[Math.abs(seed >> 16) % CORPUS_SEASONAL.length],
    scope, signId, dateStr,
  };
}
