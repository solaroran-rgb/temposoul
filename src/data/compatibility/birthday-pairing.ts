// B23-2 src/data/compatibility/birthday-pairing.ts
/**
 * 生日配对（趣味工具）数据契约 + 确定性文案池。
 * 维度：西洋星座 / 生肖 / 生命灵数。
 * 严禁婚恋强制结论；结果页 noindex。
 */
export type PairingLevel = 'harmony' | 'growth' | 'challenge' | 'neutral';

export interface BirthdayPairingResult {
  score: number;
  level: PairingLevel;
  dimensions: {
    zodiac: { score: number; summary: string };
    chineseZodiac: { score: number; summary: string };
    lifePathNumber: { score: number; summary: string; isMasterNumber: boolean };
  };
  advice: string;
  disclaimer: string;
  sharePrompt: string;
}

// ---------------------------------------------------------------------------
// 确定性基础查表（纯函数，无随机）
// ---------------------------------------------------------------------------

export interface WesternSign {
  name: string;
  start: [number, number]; // [month, day]
  end: [number, number];
}

export const WESTERN_SIGNS: WesternSign[] = [
  { name: '白羊座', start: [3, 21], end: [4, 19] },
  { name: '金牛座', start: [4, 20], end: [5, 20] },
  { name: '双子座', start: [5, 21], end: [6, 21] },
  { name: '巨蟹座', start: [6, 22], end: [7, 22] },
  { name: '狮子座', start: [7, 23], end: [8, 22] },
  { name: '处女座', start: [8, 23], end: [9, 22] },
  { name: '天秤座', start: [9, 23], end: [10, 23] },
  { name: '天蝎座', start: [10, 24], end: [11, 22] },
  { name: '射手座', start: [11, 23], end: [12, 21] },
  { name: '摩羯座', start: [12, 22], end: [1, 19] },
  { name: '水瓶座', start: [1, 20], end: [2, 18] },
  { name: '双鱼座', start: [2, 19], end: [3, 20] },
];

export function westernZodiac(dateISO: string): string {
  const m = Number(dateISO.slice(5, 7));
  const d = Number(dateISO.slice(8, 10));
  for (const s of WESTERN_SIGNS) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    const v = m * 100 + d;
    if (sm <= em) {
      if (v >= sm * 100 + sd && v <= em * 100 + ed) return s.name;
    } else {
      // 摩羯座跨年
      if (v >= sm * 100 + sd || v <= em * 100 + ed) return s.name;
    }
  }
  return '未知';
}

export const CHINESE_ZODIACS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'] as const;

/** 按公历年份粗判生肖（民俗工具精度；// 自查：严格分界应以立春为准，可接入 packages/core/calendar 立春表） */
export function chineseZodiacOfYear(year: number): string {
  return CHINESE_ZODIACS[((year - 4) % 12 + 12) % 12];
}

// ---------------------------------------------------------------------------
// 维度打分（确定性规则）
// ---------------------------------------------------------------------------

/** 西洋星座配对分：同相（火土风水四相）加分，对冲减分 */
export function zodiacScore(a: string, b: string): number {
  if (a === b) return 82;
  const fire = ['白羊座', '狮子座', '射手座'];
  const earth = ['金牛座', '处女座', '摩羯座'];
  const air = ['双子座', '天秤座', '水瓶座'];
  const water = ['巨蟹座', '天蝎座', '双鱼座'];
  const same = [fire, earth, air, water].some(
    (g) => g.includes(a) && g.includes(b),
  );
  const opposite: Record<string, string> = {
    白羊座: '天秤座', 金牛座: '天蝎座', 双子座: '射手座', 巨蟹座: '摩羯座',
    狮子座: '水瓶座', 处女座: '双鱼座',
  };
  if (same) return 86;
  if (opposite[a] === b || opposite[b] === a) return 74;
  return 62;
}

export function chineseZodiacScore(a: string, b: string): number {
  if (a === b) return 70;
  // 六冲：鼠马 牛羊 虎猴 兔鸡 龙狗 蛇猪
  const clash: Record<string, string> = {
    鼠: '马', 马: '鼠', 牛: '羊', 羊: '牛', 虎: '猴', 猴: '虎',
    兔: '鸡', 鸡: '兔', 龙: '狗', 狗: '龙', 蛇: '猪', 猪: '蛇',
  };
  if (clash[a] === b) return 48;
  // 三合六合友情分
  const friendly = ['鼠龙猴', '牛蛇鸡', '虎马狗', '兔羊猪'];
  for (const g of friendly) if (g.includes(a) && g.includes(b)) return 85;
  return 65;
}

// ---------------------------------------------------------------------------
// 档位文案池（同档位多条 → 由 seed 经 pickBySeed 抽取，保证确定性）
// ---------------------------------------------------------------------------

export const LEVEL_ADVICE: Record<PairingLevel, string[]> = {
  harmony: [
    '节奏比较合拍，适合多一些日常交流，把默契延续下去。',
    '两个人在很多事情上容易想到一块，遇到分歧时多听对方一句。',
  ],
  growth: [
    '差异里有互相补位的空间，慢慢来，不必急于求结论。',
    '彼此能带来新的视角，重要的是把感受讲清楚。',
  ],
  challenge: [
    '节奏差异会比较明显，留足各自空间，反而更容易长久。',
    '需要多一点耐心磨合，把分歧当成了解彼此的入口。',
  ],
  neutral: [
    '属于可以慢慢了解的类型，不必给自己下结论。',
    '结果只是一种趣味参考，相处还看日常怎么经营。',
  ],
};

export const LEVEL_LABEL: Record<PairingLevel, string> = {
  harmony: '合拍',
  growth: '互补',
  challenge: '磨合',
  neutral: '中性',
};

export const DISCLAIMER =
  '生日配对为趣味测试，结果不构成任何婚恋、合伙或人生决策的建议。关系如何，终究取决于双方的真实相处。';

export function buildSharePrompt(score: number, level: PairingLevel): string {
  return `我在 TempoSoul 测了生日配对，缘分指数 ${score} 分（${LEVEL_LABEL[level]}）。纯属娱乐，你也来测测看。`;
}

/** 由加权总分落档 */
export function levelFromScore(score: number): PairingLevel {
  if (score >= 80) return 'harmony';
  if (score >= 68) return 'growth';
  if (score < 55) return 'challenge';
  return 'neutral';
}
