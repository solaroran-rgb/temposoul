/**
 * @file 吠陀占星（Jyotish / Vedic Astrology）基础查表层
 * @传统依据 Parashara Hora Shastra / Phaladeepika 通行口径：
 *   - 12 Rashi（黄道十二宫，Mesha 起算 0°）
 *   - 27 Nakshatra（每宿 13°20′，各 4 Pada，每 Pada 3°20′）
 *   - 每宿 Vimshottari 主星（Ketu→Shukra→Surya→Chandra→Mangala→Rahu→Guru→Shani→Budha 循环）
 * 本文件只做确定性查表与经度归一化，不调用星历；可复算不代表占星解释有效。
 */

export const DEG_PER_RASHI = 30;
export const NAKSHATRA_COUNT = 27;
export const NAKSHATRA_SPAN_DEG = 360 / NAKSHATRA_COUNT; // 13.333333…
export const PADA_COUNT = 4;
export const PADA_SPAN_DEG = NAKSHATRA_SPAN_DEG / PADA_COUNT; // 3.333333…

export interface RashiInfo {
  index: number;
  sanskrit: string;
  english: string;
  chinese: string;
}

/** 12 Rashi（Mesha 为第 0 宫，对应西洋白羊座 0°–30° 恒星黄经） */
export const RASHIS: RashiInfo[] = [
  { index: 0, sanskrit: 'Mesha', english: 'Aries', chinese: '白羊' },
  { index: 1, sanskrit: 'Vrishabha', english: 'Taurus', chinese: '金牛' },
  { index: 2, sanskrit: 'Mithuna', english: 'Gemini', chinese: '双子' },
  { index: 3, sanskrit: 'Karka', english: 'Cancer', chinese: '巨蟹' },
  { index: 4, sanskrit: 'Simha', english: 'Leo', chinese: '狮子' },
  { index: 5, sanskrit: 'Kanya', english: 'Virgo', chinese: '处女' },
  { index: 6, sanskrit: 'Tula', english: 'Libra', chinese: '天秤' },
  { index: 7, sanskrit: 'Vrishchika', english: 'Scorpio', chinese: '天蝎' },
  { index: 8, sanskrit: 'Dhanu', english: 'Sagittarius', chinese: '射手' },
  { index: 9, sanskrit: 'Makara', english: 'Capricorn', chinese: '摩羯' },
  { index: 10, sanskrit: 'Kumbha', english: 'Aquarius', chinese: '宝瓶' },
  { index: 11, sanskrit: 'Meena', english: 'Pisces', chinese: '双鱼' },
];

/** 9 Graha 的 Vimshottari 主星标签（梵 / 中文） */
export const GRAHA_LORD_LABELS = {
  Ketu: { sanskrit: 'Ketu', chinese: '计都' },
  Shukra: { sanskrit: 'Shukra', chinese: '金星' },
  Surya: { sanskrit: 'Surya', chinese: '太阳' },
  Chandra: { sanskrit: 'Chandra', chinese: '月亮' },
  Mangala: { sanskrit: 'Mangala', chinese: '火星' },
  Rahu: { sanskrit: 'Rahu', chinese: '罗睺' },
  Guru: { sanskrit: 'Guru', chinese: '木星' },
  Shani: { sanskrit: 'Shani', chinese: '土星' },
  Budha: { sanskrit: 'Budha', chinese: '水星' },
} as const;

export type VimshottariLord = keyof typeof GRAHA_LORD_LABELS;

export interface NakshatraInfo {
  index: number;
  sanskrit: string;
  chinese: string;
  lord: VimshottariLord;
  deity: string;
}

/** 27 Nakshatra（Ashwini 起算 0°；每宿 13°20′） */
export const NAKSHATRAS: NakshatraInfo[] = [
  { index: 0, sanskrit: 'Ashwini', chinese: '娄宿', lord: 'Ketu', deity: 'Ashvini Kumaras' },
  { index: 1, sanskrit: 'Bharani', chinese: '胃宿', lord: 'Shukra', deity: 'Yama' },
  { index: 2, sanskrit: 'Krittika', chinese: '昴宿', lord: 'Surya', deity: 'Agni' },
  { index: 3, sanskrit: 'Rohini', chinese: '毕宿', lord: 'Chandra', deity: 'Brahma' },
  { index: 4, sanskrit: 'Mrigashirsha', chinese: '觜宿', lord: 'Mangala', deity: 'Soma' },
  { index: 5, sanskrit: 'Ardra', chinese: '参宿', lord: 'Rahu', deity: 'Rudra' },
  { index: 6, sanskrit: 'Punarvasu', chinese: '井宿', lord: 'Guru', deity: 'Aditi' },
  { index: 7, sanskrit: 'Pushya', chinese: '鬼宿', lord: 'Shani', deity: 'Brihaspati' },
  { index: 8, sanskrit: 'Ashlesha', chinese: '柳宿', lord: 'Budha', deity: 'Nagas' },
  { index: 9, sanskrit: 'Magha', chinese: '星宿', lord: 'Ketu', deity: 'Pitris' },
  { index: 10, sanskrit: 'Purva Phalguni', chinese: '张宿', lord: 'Shukra', deity: 'Bhaga' },
  { index: 11, sanskrit: 'Uttara Phalguni', chinese: '翼宿', lord: 'Surya', deity: 'Aryaman' },
  { index: 12, sanskrit: 'Hasta', chinese: '轸宿', lord: 'Chandra', deity: 'Savitr' },
  { index: 13, sanskrit: 'Chitra', chinese: '角宿', lord: 'Mangala', deity: 'Tvashtar' },
  { index: 14, sanskrit: 'Swati', chinese: '亢宿', lord: 'Rahu', deity: 'Vayu' },
  { index: 15, sanskrit: 'Vishakha', chinese: '氐宿', lord: 'Guru', deity: 'Indragni' },
  { index: 16, sanskrit: 'Anuradha', chinese: '房宿', lord: 'Shani', deity: 'Mitra' },
  { index: 17, sanskrit: 'Jyeshtha', chinese: '心宿', lord: 'Budha', deity: 'Indra' },
  { index: 18, sanskrit: 'Mula', chinese: '尾宿', lord: 'Ketu', deity: 'Nirriti' },
  { index: 19, sanskrit: 'Purva Ashadha', chinese: '箕宿', lord: 'Shukra', deity: 'Apas' },
  { index: 20, sanskrit: 'Uttara Ashadha', chinese: '斗宿', lord: 'Surya', deity: 'Vishvedevas' },
  { index: 21, sanskrit: 'Shravana', chinese: '牛宿', lord: 'Chandra', deity: 'Vishnu' },
  { index: 22, sanskrit: 'Dhanishta', chinese: '女宿', lord: 'Mangala', deity: 'Vasus' },
  { index: 23, sanskrit: 'Shatabhisha', chinese: '虚宿', lord: 'Rahu', deity: 'Varuna' },
  { index: 24, sanskrit: 'Purva Bhadrapada', chinese: '危宿', lord: 'Guru', deity: 'Ajaikapada' },
  {
    index: 25,
    sanskrit: 'Uttara Bhadrapada',
    chinese: '室宿',
    lord: 'Shani',
    deity: 'Ahirbudhnya',
  },
  { index: 26, sanskrit: 'Revati', chinese: '壁宿', lord: 'Budha', deity: 'Pushan' },
];

/** 归一化黄经到 [0, 360) */
export function normalizeLongitude(longitude: number): number {
  if (!Number.isFinite(longitude)) {
    throw new Error('黄经必须是有限数字。');
  }
  const normalized = longitude % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

export interface RashiPosition {
  rashiIndex: number;
  rashi: RashiInfo;
  degreeInRashi: number;
}

/** 黄经 → Rashi（0–30° Mesha 起）与宫内度数 */
export function longitudeToRashi(longitude: number): RashiPosition {
  const lon = normalizeLongitude(longitude);
  const rashiIndex = Math.min(11, Math.floor(lon / DEG_PER_RASHI));
  return {
    rashiIndex,
    rashi: RASHIS[rashiIndex],
    degreeInRashi: Number((lon - rashiIndex * DEG_PER_RASHI).toFixed(8)),
  };
}

export interface NakshatraPosition {
  nakshatraIndex: number;
  nakshatra: NakshatraInfo;
  /** 进入本宿后的弧长（0–13.3333…） */
  within: number;
  /** 本宿已过比例 0..1 */
  elapsedRatio: number;
  pada: 1 | 2 | 3 | 4;
}

/** 黄经 → Nakshatra / Pada（边界：恰好落在宿首归下一宿首） */
export function longitudeToNakshatra(longitude: number): NakshatraPosition {
  const lon = normalizeLongitude(longitude);
  const nakshatraIndex = Math.min(NAKSHATRA_COUNT - 1, Math.floor(lon / NAKSHATRA_SPAN_DEG));
  const within = lon - nakshatraIndex * NAKSHATRA_SPAN_DEG;
  const elapsedRatio = Number((within / NAKSHATRA_SPAN_DEG).toFixed(8));
  const pada = Math.min(PADA_COUNT, Math.floor(within / PADA_SPAN_DEG) + 1) as 1 | 2 | 3 | 4;
  return {
    nakshatraIndex,
    nakshatra: NAKSHATRAS[nakshatraIndex],
    within: Number(within.toFixed(8)),
    elapsedRatio,
    pada,
  };
}

/** Whole Sign 宫位：以 Lagna 所在 Rashi 为第 1 宫，返回 1–12 */
export function wholeSignBhava(planetRashiIndex: number, lagnaRashiIndex: number): number {
  const diff = (((planetRashiIndex - lagnaRashiIndex) % 12) + 12) % 12;
  return diff + 1;
}

/** 把“度分”格式化为 “Mesha 12°34′” 风格 */
export function formatDegree(sanskrit: string, degreeInRashi: number): string {
  const degrees = Math.floor(degreeInRashi);
  const minutes = Math.round((degreeInRashi - degrees) * 60);
  return `${sanskrit} ${degrees}°${String(minutes).padStart(2, '0')}′`;
}
