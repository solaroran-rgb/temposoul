/**
 * 袁天罡称骨（骨重）通行本 —— 数据层
 * 诚实标注：年月日时骨重表数值为民间流传通行本，版本众多、各本略有出入。
 * 以 CHENGGU_TABLE_VERIFIED = false 标记「尚未与权威纸质版本逐项核验」，
 * 核验前页面 confidence='legendary' 且不宣称 verified。
 * 60 首传统骨重诗属古籍文本，未核验前不录入、不编造，未收录档位走 CHENGGU_POEM_PENDING。
 */
export const CHENGGU_TABLE_VERIFIED = false;

export const CHENGGU_SOURCE = '袁天罡称骨法（民间流传通行本，版本待核验）';

/** 年骨重（干支年 -> 钱）。1 两 = 10 钱 */
export const YEAR_WEIGHT: Record<string, number> = {
  甲子: 12, 乙丑: 9, 丙寅: 6, 丁卯: 7, 戊辰: 12, 己巳: 5, 庚午: 9, 辛未: 8, 壬申: 7, 癸酉: 8,
  甲戌: 15, 乙亥: 9, 丙子: 16, 丁丑: 8, 戊寅: 8, 己卯: 19, 庚辰: 12, 辛巳: 6, 壬午: 8, 癸未: 7,
  甲申: 5, 乙酉: 15, 丙戌: 16, 丁亥: 16, 戊子: 15, 己丑: 7, 庚寅: 9, 辛卯: 12, 壬辰: 10, 癸巳: 7,
  甲午: 15, 乙未: 6, 丙申: 5, 丁酉: 14, 戊戌: 14, 己亥: 9, 庚子: 7, 辛丑: 7, 壬寅: 9, 癸卯: 12,
  甲辰: 8, 乙巳: 7, 丙午: 13, 丁未: 13, 戊申: 14, 己酉: 16, 庚戌: 9, 辛亥: 17, 壬子: 5, 癸丑: 7,
  甲寅: 12, 乙卯: 12, 丙辰: 8, 丁巳: 7, 戊午: 19, 己未: 6, 庚申: 8, 辛酉: 14, 壬戌: 6, 癸亥: 7,
};

/** 月骨重（农历月 1-12 -> 钱） */
export const MONTH_WEIGHT: number[] = [6, 7, 18, 9, 5, 16, 9, 15, 18, 8, 9, 5];

/** 日骨重（农历日 1-30 -> 钱） */
export const DAY_WEIGHT: number[] = [
  5, 10, 8, 15, 16, 15, 8, 16, 8, 16,
  9, 17, 8, 17, 10, 8, 9, 18, 5, 15,
  10, 9, 8, 9, 15, 18, 7, 8, 16, 6,
];

/** 时骨重（时辰地支 -> 钱） */
export const HOUR_WEIGHT: Record<string, number> = {
  子: 16, 丑: 6, 寅: 7, 卯: 10, 辰: 9, 巳: 16,
  午: 10, 未: 8, 申: 8, 酉: 9, 戌: 6, 亥: 6,
};

export const HOUR_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export interface ChengguPoem {
  /** 骨重档（两.钱，如 3.6 表示三两六钱） */
  level: string;
  /** 白话释义，非编造古文 */
  text: string;
  genderNote: { male: string; female: string } | null;
}

export const CHENGGU_POEMS: ChengguPoem[] = [
  {
    level: '2.1',
    text: '此档在传统说法中被描述为早年多波折、需依靠自身积累的阶段。',
    genderNote: { male: '偏向早年独立打拼的叙述。', female: '偏向早年需自立的叙述。' },
  },
  {
    level: '3.0',
    text: '此档被描述为中年逐步稳定、先劳后得的路径。',
    genderNote: { male: '强调中年后发力。', female: '强调中年渐入安定。' },
  },
  {
    level: '3.6',
    text: '此档被描述为才智与机遇兼具，同时提醒留意过度自信。',
    genderNote: null,
  },
  {
    level: '4.0',
    text: '此档被描述为平稳务实，靠持续积累获得成果。',
    genderNote: { male: '偏重事业稳步推进。', female: '偏重家庭与事业兼顾。' },
  },
  {
    level: '4.5',
    text: '此档被描述为中年之后渐入佳境的类型。',
    genderNote: null,
  },
  {
    level: '5.0',
    text: '此档被描述为资源与能力较均衡，起伏相对平缓。',
    genderNote: { male: '强调顺势而为。', female: '强调守成与开拓并重。' },
  },
];

export const CHENGGU_POEM_PENDING = '该骨重档位的判词尚未收录，需核验通行本后补充。';

export interface ChengguInput {
  /** 年干支（LunarInfo.year） */
  yearGanzhi: string;
  /** 农历月 1-12 */
  monthNumber: number;
  /** 农历日 1-30 */
  dayNumber: number;
  /** 时辰地支 */
  hourZhi: string;
  gender: 'male' | 'female';
}

export interface ChengguResult {
  yearWeight: number;
  monthWeight: number;
  dayWeight: number;
  hourWeight: number;
  totalQian: number;
  totalLabel: string;
  level: string;
  poem: string;
  genderNote: string;
  poemPending: boolean;
}

const NUM_CN = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

function toLabel(totalQian: number): string {
  const liang = Math.floor(totalQian / 10);
  const qian = totalQian % 10;
  const liangText = liang <= 9 ? NUM_CN[liang] : String(liang);
  const qianText = qian === 0 ? '零' : NUM_CN[qian];
  return `${liangText}两${qianText}钱`;
}

export function calcChenggu(input: ChengguInput): ChengguResult {
  const yearWeight = YEAR_WEIGHT[input.yearGanzhi] ?? 0;
  const monthWeight = MONTH_WEIGHT[Math.min(Math.max(input.monthNumber, 1), 12) - 1] ?? 0;
  const dayWeight = DAY_WEIGHT[Math.min(Math.max(input.dayNumber, 1), 30) - 1] ?? 0;
  const hourWeight = HOUR_WEIGHT[input.hourZhi] ?? 0;

  const totalQian = yearWeight + monthWeight + dayWeight + hourWeight;
  const liang = Math.floor(totalQian / 10);
  const qian = totalQian % 10;
  const level = `${liang}.${qian}`;

  const matched = CHENGGU_POEMS.find((p) => p.level === level);
  const genderNote =
    matched?.genderNote?.[input.gender] ?? (matched ? '' : '此档判词未区分男女说法。');

  return {
    yearWeight,
    monthWeight,
    dayWeight,
    hourWeight,
    totalQian,
    totalLabel: toLabel(totalQian),
    level,
    poem: matched?.text ?? CHENGGU_POEM_PENDING,
    genderNote,
    poemPending: !matched,
  };
}
