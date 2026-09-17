import { djb2 } from '@/lib/hash';
export const ZODIAC_SIGNS = [
  { id: 'aries', name: '白羊', symbol: '♈' },
  { id: 'taurus', name: '金牛', symbol: '♉' },
  { id: 'gemini', name: '双子', symbol: '♊' },
  { id: 'cancer', name: '巨蟹', symbol: '♋' },
  { id: 'leo', name: '狮子', symbol: '♌' },
  { id: 'virgo', name: '处女', symbol: '♍' },
  { id: 'libra', name: '天秤', symbol: '♎' },
  { id: 'scorpio', name: '天蝎', symbol: '♏' },
  { id: 'sagittarius', name: '射手', symbol: '♐' },
  { id: 'capricorn', name: '摩羯', symbol: '♑' },
  { id: 'aquarius', name: '水瓶', symbol: '♒' },
  { id: 'pisces', name: '双鱼', symbol: '♓' },
] as const;
export type ZodiacSignId = (typeof ZODIAC_SIGNS)[number]['id'];

const POOLS = {
  general: [
    '星象平稳，适合推进既定计划。',
    '能量活跃，可能有意外惊喜。',
    '宜静不宜动，多留时间思考。',
    '人际融洽，适合团队协作。',
  ],
  love: [
    '魅力上升，留意身边目光。',
    '适合安排轻松的约会。',
    '需要更多包容，避免口舌。',
    '保持自然真实的状态。',
  ],
  career: [
    '效率颇高，适合处理难题。',
    '注意细节，避免粗心返工。',
    '适合头脑风暴，灵感不断。',
    '保持低调，默默积累实力。',
  ],
  wealth: [
    '财运平稳，适合长期规划。',
    '偏财一般，避免冲动投资。',
    '可能有小额进账，保持理性。',
    '留意账目明细，防范漏洞。',
  ],
};
const COLORS = ['霓虹青', '赛博粉', '琥珀金', '虚空紫', '极光绿'];

function hashStr(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export interface DailyFortuneData {
  id: ZodiacSignId;
  name: string;
  symbol: string;
  date: string;
  general: string;
  love: string;
  career: string;
  wealth: string;
  luckyColor: string;
  luckyNumber: number;
  confidence: 'legendary';
}

export function generateDailyFortune(dateStr: string, signId: ZodiacSignId): DailyFortuneData {
  const sign = ZODIAC_SIGNS.find((s) => s.id === signId)!;
  const seed = hashStr(`${dateStr}-${signId}-temposoul-salt`);
  return {
    ...sign,
    date: dateStr,
    general: POOLS.general[seed % POOLS.general.length],
    love: POOLS.love[(seed >> 2) % POOLS.love.length],
    career: POOLS.career[(seed >> 4) % POOLS.career.length],
    wealth: POOLS.wealth[(seed >> 6) % POOLS.wealth.length],
    luckyColor: COLORS[seed % COLORS.length],
    luckyNumber: (seed % 9) + 1,
    confidence: 'legendary',
  };
}
// 假设 ZODIAC_SIGNS 已在文件上半部分定义并导出，此处不再重复定义

export type ZodiacScope = 'today' | 'week' | 'month' | 'year';
export interface ZodiacFortuneData {
  main: string;
  sub: string;
  seasonal: string;
  scope: ZodiacScope;
  signId: string;
  dateStr: string;
}

const CORPUS_MAIN = ['稳中求进', '蓄势待发', '贵人暗助', '宜守不宜攻', '柳暗花明'];
const CORPUS_SUB = ['注意财务规划', '人际沟通顺畅', '健康关注脾胃', '学习进修良机', '避免冲动决策'];
const CORPUS_SEASONAL = ['春气萌动宜规划', '阳气鼎盛行动强', '收获季节宜复盘', '藏养之时宜休养'];

export function generateZodiacFortune(
  dateStr: string,
  signId: string,
  scope: ZodiacScope,
): ZodiacFortuneData {
  const seed = parseInt(djb2(`${scope}|${dateStr}|${signId}`), 36) || 0;
  return {
    main: CORPUS_MAIN[Math.abs(seed) % CORPUS_MAIN.length],
    sub: CORPUS_SUB[Math.abs(seed >> 8) % CORPUS_SUB.length],
    seasonal: CORPUS_SEASONAL[Math.abs(seed >> 16) % CORPUS_SEASONAL.length],
    scope,
    signId,
    dateStr,
  };
}
