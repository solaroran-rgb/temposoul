// src/lib/direction-calculator.ts
export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
export type HeavenlyStem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
export type EarthlyBranch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

const STEMS: HeavenlyStem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES: EarthlyBranch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const WU_SHU_DUN_START: Record<HeavenlyStem, HeavenlyStem> = {
  '甲': '甲', '己': '甲', '乙': '丙', '庚': '丙', '丙': '戊', '辛': '戊', '丁': '庚', '壬': '庚', '戊': '壬', '癸': '壬'
};

const STEM_WEALTH_DIR: Record<HeavenlyStem, Direction> = {
  '甲': 'NE', '乙': 'SW', '丙': 'SW', '丁': 'SW', '戊': 'N', '己': 'N', '庚': 'SE', '辛': 'E', '壬': 'S', '癸': 'S'
};
const STEM_JOY_DIR: Record<HeavenlyStem, Direction> = {
  '甲': 'NE', '乙': 'NW', '丙': 'SW', '丁': 'S', '戊': 'SE', '己': 'NE', '庚': 'NW', '辛': 'SW', '壬': 'S', '癸': 'SE'
};
const STEM_FORTUNE_DIR: Record<HeavenlyStem, Direction> = {
  '甲': 'SE', '乙': 'SE', '丙': 'W', '丁': 'W', '戊': 'N', '己': 'N', '庚': 'SW', '辛': 'SW', '壬': 'NW', '癸': 'NW'
};

const OPPOSITE: Record<Direction, Direction> = {
  'N': 'S', 'NE': 'SW', 'E': 'W', 'SE': 'NW', 'S': 'N', 'SW': 'NE', 'W': 'E', 'NW': 'SE'
};

function getHourStem(dayStem: HeavenlyStem, hourBranch: EarthlyBranch): HeavenlyStem {
  const startStem = WU_SHU_DUN_START[dayStem];
  const startIndex = STEMS.indexOf(startStem);
  const branchIndex = BRANCHES.indexOf(hourBranch);
  return STEMS[(startIndex + branchIndex) % 10];
}

export interface HourlyDirection {
  hourBranch: EarthlyBranch;
  timeRange: string;
  wealth: Direction;
  joy: Direction;
  fortune: Direction;
}

const TIME_RANGES: Record<EarthlyBranch, string> = {
  '子': '23:00-01:00', '丑': '01:00-03:00', '寅': '03:00-05:00', '卯': '05:00-07:00',
  '辰': '07:00-09:00', '巳': '09:00-11:00', '午': '11:00-13:00', '未': '13:00-15:00',
  '申': '15:00-17:00', '酉': '17:00-19:00', '戌': '19:00-21:00', '亥': '21:00-23:00'
};

export function buildHourlyDirections(dayStem: HeavenlyStem): HourlyDirection[] {
  return BRANCHES.map(branch => {
    const hourStem = getHourStem(dayStem, branch);
    return { hourBranch: branch, timeRange: TIME_RANGES[branch], wealth: STEM_WEALTH_DIR[hourStem], joy: STEM_JOY_DIR[hourStem], fortune: STEM_FORTUNE_DIR[hourStem] };
  });
}

export function getMahjongLuckySeat(wealthDir: Direction): Direction { return OPPOSITE[wealthDir]; }

export function extractDayStem(ganzhi: string): HeavenlyStem | null {
  const stem = ganzhi.charAt(0) as HeavenlyStem;
  return STEMS.includes(stem) ? stem : null;
}

export function getCurrentHourBranch(): EarthlyBranch {
  const hour = new Date().getHours();
  const index = Math.floor(((hour + 1) % 24) / 2);
  return BRANCHES[index];
}

// 新增：方位角度映射，用于 CSS 旋转动画
export const DIR_ANGLES: Record<Direction, number> = {
  N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315
};
