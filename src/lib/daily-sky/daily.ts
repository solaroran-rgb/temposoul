// src/lib/daily-sky/daily.ts
// 每日星象 · 每日数据流装配（规格 §4 冻结签名）。
//   buildDailySky(profile?): DailySkyPayload
// 真实天象：Meeus 简化月相 / 日月黄经（与 src/lib/sky/moon.ts 同源算法，
//   此处自包含实现，避免引入 three.js WebGL 依赖，便于纯逻辑单测）。
// 数据算不出来时降级通用标题，禁编造具体度数 / 相位；全部文案过禁词兜底。

import { filterBannedWords, hasBannedWord } from '@/lib/client-compliance';
import {
  ZODIAC_SIGNS,
  generateDailyFortune,
  type ZodiacSignId,
} from '@/pages/fortune/lib/daily-fortune';
import { pickDailyQuote } from './corpus';
import { getDailyKey } from './dailyKey';
import type { DailySkyProfile } from './profile';

/** 全站统一合规句（唯一措辞）。 */
export const COMPLIANCE_LINE = '此为传统命理观点' as const;

/** 每日星象 payload（规格 §4 冻结字段，与分享片 share.ts 本地副本结构一致）。 */
export interface DailySkyPayload {
  /** 用户本地时区当天 YYYY-MM-DD */
  dateKey: string;
  /** IANA 时区 */
  timeZone: string;
  /** 月相名，如「盈凸月」 */
  moonPhase: string;
  /** 真实天象标题，如「月亮进入金牛座」 */
  skyEventTitle: string;
  /** 个性化中性观察行（禁吉凶断言 / 运势分） */
  personalNote: string;
  /** 可选：复用既有星座日运内容 */
  zodiacLine?: string;
  /** 文化引文 */
  quote: string;
  /** 引文出处 */
  source: string;
  /** 全站统一合规句 */
  compliance: typeof COMPLIANCE_LINE;
}

const DEG = Math.PI / 180;

function normalizeDeg(d: number): number {
  const t = d % 360;
  return t < 0 ? t + 360 : t;
}

/** dateKey(本地 YYYY-MM-DD) -> 儒略日（当日本地 12 时，UT 近似）。 */
function jdFromDateKey(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map((n) => Number.parseInt(n, 10));
  const ms = new Date(y, m - 1, d, 12, 0, 0).getTime();
  return ms / 86400000 + 2440587.5;
}

/** 太阳黄经（度），Meeus 25.2 简化。 */
function sunEclipticLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mr = M * DEG;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mr) +
    0.000289 * Math.sin(3 * Mr);
  return normalizeDeg(L0 + C);
}

/** 月球黄经（度），Meeus 47 低精度主项。 */
function moonEclipticLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const Lp = 218.316 + 481267.881 * T;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.52911 + 35999.05029 * T;
  const Mp = 134.963 + 477198.867 * T;
  const F = 93.272 + 483202.017 * T;
  const Dr = D * DEG;
  const Mr = M * DEG;
  const Mpr = Mp * DEG;
  const Fr = F * DEG;
  return normalizeDeg(
    Lp +
      6.289 * Math.sin(Mpr) +
      1.274 * Math.sin(2 * Dr - Mpr) +
      0.658 * Math.sin(2 * Dr) +
      0.214 * Math.sin(2 * Mpr) -
      0.186 * Math.sin(Mr) -
      0.114 * Math.sin(2 * Fr),
  );
}

/** 黄经 -> 黄道星座（index 0 = 白羊座 0°~30°）。 */
function signByLon(lonDeg: number): { id: ZodiacSignId; name: string } {
  const idx = Math.floor(normalizeDeg(lonDeg) / 30) % 12;
  const s = ZODIAC_SIGNS[idx];
  return { id: s.id as ZodiacSignId, name: s.name };
}

/** 日月距角（0~360）-> 八相月相名。 */
function moonPhaseName(elongationDeg: number): string {
  const e = normalizeDeg(elongationDeg);
  if (e < 22.5 || e >= 337.5) return '新月';
  if (e < 67.5) return '上蛾眉月';
  if (e < 112.5) return '上弦月';
  if (e < 157.5) return '盈凸月';
  if (e < 202.5) return '满月';
  if (e < 247.5) return '亏凸月';
  if (e < 292.5) return '下弦月';
  return '残月';
}

/** 生日 -> 太阳星座（按公历月日边界）；非法返回 null。 */
function sunSignByBirthday(birthday: string): ZodiacSignId | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthday);
  if (!m) return null;
  const mo = Number.parseInt(m[2], 10);
  const da = Number.parseInt(m[3], 10);
  // 边界：日期 <= 该 (月,日) 即归入对应星座；年末 12/22 后为摩羯。
  const boundaries: Array<[number, number, ZodiacSignId]> = [
    [1, 19, 'capricorn'],
    [2, 18, 'aquarius'],
    [3, 20, 'pisces'],
    [4, 19, 'aries'],
    [5, 20, 'taurus'],
    [6, 20, 'gemini'],
    [7, 22, 'cancer'],
    [8, 22, 'leo'],
    [9, 22, 'virgo'],
    [10, 23, 'libra'],
    [11, 22, 'scorpio'],
    [12, 21, 'sagittarius'],
  ];
  for (const [bm, bd, sign] of boundaries) {
    if (mo < bm || (mo === bm && da <= bd)) return sign;
  }
  return 'capricorn';
}

/** 中性文化观察池（无吉凶 / 无断言词 / 无禁词）。 */
const MOON_OBS = [
  '月相滋养的夜晚，适合回顾与整理。',
  '月色轻浅，把心绪放慢一些就好。',
  '星河流转，今日宜安静地听自己。',
  '清辉在天，适合把想法写下来再看。',
  '夜气清明，留出一段不被打扰的时间。',
];

/** 中性兜底文案（自身已过 hasBannedWord，测试亦会复核）。 */
const FALLBACK_TITLE = '今夜星象';
const FALLBACK_NOTE = '夜气清明，留出一段安静的时间。';

/**
 * 文案合规兜底：命中任一禁词 → 整条替换为中性 fallback；fallback 自身须干净。
 * 导出供单测直接断言。
 */
export function sanitizeField(raw: string, fallback: string): string {
  return hasBannedWord(raw) ? fallback : raw;
}

function obsSeed(dateKey: string): number {
  let h = 5381;
  for (let i = 0; i < dateKey.length; i += 1) h = ((h << 5) + h) ^ dateKey.charCodeAt(i);
  return h >>> 0;
}

/**
 * 装配每日星象 payload（规格 §4 冻结签名）。
 * - 有生日：personalNote 用「月亮过你的太阳」，并复用既有星座日运（zodiacLine）；
 * - 无生日：中性月相观察，省略 zodiacLine；
 * - 全字段最终再过 filterBannedWords 兜底。
 */
export function buildDailySky(profile?: DailySkyProfile): DailySkyPayload {
  const dateKey = getDailyKey();
  const tz =
    (profile?.timeZone && profile.timeZone.trim()) ||
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    'UTC';

  // —— 真实天象（Meeus 简化；任何异常降级通用标题，绝不编造度数）——
  const sky = ((): { moonPhase: string; skyEventTitle: string } => {
    try {
      const jd = jdFromDateKey(dateKey);
      const mLon = moonEclipticLongitude(jd);
      const sLon = sunEclipticLongitude(jd);
      const phase = moonPhaseName(mLon - sLon);
      const todaySign = signByLon(mLon);
      const ySign = signByLon(moonEclipticLongitude(jd - 1));
      const title =
        todaySign.id !== ySign.id ? `月亮进入${todaySign.name}座` : `月亮行经${todaySign.name}座`;
      return { moonPhase: phase, skyEventTitle: title };
    } catch {
      return { moonPhase: '月相渐移', skyEventTitle: FALLBACK_TITLE };
    }
  })();

  // —— 个性化观察行 ——
  const obs = MOON_OBS[obsSeed(dateKey) % MOON_OBS.length];
  const sunId = profile?.birthday ? sunSignByBirthday(profile.birthday) : null;
  let personalNote: string;
  if (sunId) {
    const sName = ZODIAC_SIGNS.find((s) => s.id === sunId)?.name ?? '';
    personalNote = `今日月亮过你的太阳（${sName}座）——${obs}`;
  } else {
    personalNote = obs;
  }

  // —— 星座日运行：只读复用既有每日内容，无生日则省略 ——
  let zodiacLine: string | undefined;
  if (sunId) {
    zodiacLine = sanitizeField(generateDailyFortune(dateKey, sunId).general, '今日宜静观其变。');
  }

  // —— 文化引文 ——
  const q = pickDailyQuote(dateKey);

  // 引文若命中禁词（理论上不会，引文库本身干净）整条替换为已知干净的中性引文。
  const FALLBACK_QUOTE = '仰以观于天文，以察时变。';

  const payload: DailySkyPayload = {
    dateKey,
    timeZone: tz,
    moonPhase: sky.moonPhase,
    skyEventTitle: filterBannedWords(sanitizeField(sky.skyEventTitle, FALLBACK_TITLE)),
    personalNote: filterBannedWords(sanitizeField(personalNote, FALLBACK_NOTE)),
    quote: filterBannedWords(sanitizeField(q.quote, FALLBACK_QUOTE)),
    source: q.source,
    compliance: COMPLIANCE_LINE,
  };
  if (zodiacLine) payload.zodiacLine = filterBannedWords(zodiacLine);
  return payload;
}
