/**
 * @file 吠陀占星（Jyotish）主入口 — generateVedicChart
 * @description Phase1 交付 D1 本命盘骨架：
 *   1. 民用钟表时间 → UT（复用 buildAstronomicalTimeEvidence）
 *   2. Lahiri Ayanamsa 换算恒星黄经
 *   3. 九曜回归黄经（astronomy-engine）+ 平均/真交点 → Rahu/Ketu
 *   4. Lagna（上升点）+ Whole Sign 12 Bhava
 *   5. 出生月亮 Nakshatra / Pada / 起运平衡度
 *   6. evidenceTrail 同构（对齐 qiZheng/astrolabe）
 * Phase2/3 才接入 Vimshottari Dasha、Varga 分盘、Yoga/Dosha。
 */
import { daysInSolarMonth } from '../calendar/date-validation';
import { buildAstronomicalTimeEvidence } from '../calendar/astronomical-time';
import { buildVedicAyanamsaInfo, lahiriAyanamsa, tropicalToSidereal } from './ayanamsa';
import {
  getDecimalYear,
  grahaBody,
  isRetrograde,
  lagnaLongitude,
  meanNodeLongitude,
  tropicalEclipticLongitude,
  trueNodeLongitude,
} from './ephemeris';
import {
  formatDegree,
  longitudeToNakshatra,
  longitudeToRashi,
  normalizeLongitude,
  wholeSignBhava,
  GRAHA_LORD_LABELS,
} from './tables';
import { longitudeToNavamsa } from './varga';
import { computeVimshottari, formatVimshottariDate } from './vimshottari';
import { computeYogaDosha } from './yoga-dosha';
import { buildVedicEvidenceTrail } from './vedicEvidence';
import type { VedicBirthInput, VedicData, VedicPoint, VedicVargaPlacement } from './types';

const GRAHA_LABELS: Record<
  'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu',
  { label: string; sanskrit: string }
> = {
  Sun: { label: '太阳', sanskrit: 'Surya' },
  Moon: { label: '月亮', sanskrit: 'Chandra' },
  Mars: { label: '火星', sanskrit: 'Mangala' },
  Mercury: { label: '水星', sanskrit: 'Budha' },
  Jupiter: { label: '木星', sanskrit: 'Guru' },
  Venus: { label: '金星', sanskrit: 'Shukra' },
  Saturn: { label: '土星', sanskrit: 'Shani' },
  Rahu: { label: '罗睺', sanskrit: 'Rahu' },
  Ketu: { label: '计都', sanskrit: 'Ketu' },
};

const PLANET_ORDER: Array<keyof typeof GRAHA_LABELS> = [
  'Sun',
  'Moon',
  'Mars',
  'Mercury',
  'Jupiter',
  'Venus',
  'Saturn',
  'Rahu',
  'Ketu',
];

function requireNumber(value: unknown, label: string): number {
  if (typeof value !== 'string') {
    throw new Error(`吠陀排盘需要填写有效的${label}`);
  }
  const text = value.trim();
  if (!/^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(text)) {
    throw new Error(`吠陀排盘需要填写有效的${label}`);
  }
  const number = Number(text);
  if (!Number.isFinite(number)) {
    throw new Error(`吠陀排盘需要填写有效的${label}`);
  }
  return number;
}

function assertIntegerRange(value: number, label: string, min: number, max: number): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${label}需在 ${min}-${max} 之间。`);
  }
}

function assertNumberRange(value: number, label: string, min: number, max: number): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new Error(`${label}需在 ${min} 到 ${max} 之间。`);
  }
}

function readOptionalText(value: unknown, fallback: string): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'string') throw new Error('吠陀排盘文本字段必须是字符串。');
  return value.trim() || fallback;
}

function formatDateTime(birth: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}): string {
  return `${birth.year}-${String(birth.month).padStart(2, '0')}-${String(birth.day).padStart(2, '0')} ${String(birth.hour).padStart(2, '0')}:${String(birth.minute).padStart(2, '0')}`;
}

function buildPoint(opts: {
  key: keyof typeof GRAHA_LABELS | 'Lagna';
  tropicalLongitude: number;
  ayanamsaDegrees: number;
  lagnaRashiIndex: number;
  retrograde: boolean;
}): VedicPoint {
  const sidereal = tropicalToSidereal(opts.tropicalLongitude, opts.ayanamsaDegrees);
  const rashiPos = longitudeToRashi(sidereal);
  const nakPos = longitudeToNakshatra(sidereal);
  const isLagna = opts.key === 'Lagna';
  const meta = isLagna
    ? { label: '上升', sanskrit: 'Lagna' }
    : GRAHA_LABELS[opts.key as keyof typeof GRAHA_LABELS];
  return {
    name: opts.key,
    label: meta.label,
    sanskrit: meta.sanskrit,
    tropicalLongitude: Number(opts.tropicalLongitude.toFixed(6)),
    siderealLongitude: Number(sidereal.toFixed(6)),
    rashi: `${rashiPos.rashi.sanskrit} / ${rashiPos.rashi.chinese}`,
    rashiIndex: rashiPos.rashiIndex,
    degreeInRashi: Number(rashiPos.degreeInRashi.toFixed(4)),
    nakshatra: nakPos.nakshatra.sanskrit,
    nakshatraIndex: nakPos.nakshatraIndex,
    pada: nakPos.pada,
    bhava: wholeSignBhava(rashiPos.rashiIndex, opts.lagnaRashiIndex),
    retrograde: isLagna ? false : opts.retrograde,
    formatted: formatDegree(rashiPos.rashi.sanskrit, rashiPos.degreeInRashi),
  };
}

/**
 * 生成吠陀（Jyotish）本命盘（Phase1：D1 骨架）。
 *
 * 使用 Lahiri（Chitra Paksha）恒星黄道 + Whole Sign 宫位制；九曜含罗睺计都，
 * 交点默认平均节点。真太阳时仅作传统时间参考证据，不替换排盘瞬间。
 *
 * @param input 出生信息（字段风格对齐 AstrolabeBirthInput）
 * @returns VedicData（含 lagna/grahas/nakshatra/evidenceTrail）
 */
/**
 * 生成可直接交给在线 AI 的自包含吠陀排盘正文（与 qi_zheng.prompt 同构）。
 * 只陈述盘面事实与传统依据，不作确定性断语（合规红线：娱乐/参考视角）。
 */
function buildVedicPrompt(
  result: VedicData,
  yogaDosha: ReturnType<typeof computeYogaDosha>,
): string {
  const lines: string[] = [];
  lines.push('【吠陀占星 · Jyotish / Parashari】');
  lines.push(
    `出生时间：${result.birth.dateTime}（${result.birth.location}，时区 UTC${result.birth.timezone >= 0 ? '+' : ''}${result.birth.timezone}）。`,
  );
  lines.push(
    `岁差体系：Lahiri（Chitrapaksha），本盘 Ayanamsa ${result.ayanamsa.degrees.toFixed(4)}°；黄经采用恒星黄经（sidereal）。`,
  );
  lines.push(
    `上升（Lagna）：${result.lagna.formatted}（${result.lagna.rashi}，第 ${result.lagna.bhava} 宫）；宫位制：Whole Sign。`,
  );
  lines.push('九曜落位：');
  for (const g of result.grahas) {
    lines.push(
      `  ${g.label}（${g.sanskrit}）：${g.formatted}，第 ${g.bhava} 宫，${g.nakshatra} 第 ${g.pada} 拍${g.retrograde ? '，逆行（R）' : ''}`,
    );
  }
  lines.push(
    `出生月亮宿（Janma Nakshatra）：${result.nakshatra.birthMoon.sanskrit} 第 ${result.nakshatra.birthMoon.pada} 拍，宿主 ${result.nakshatra.birthMoon.lordLabel}，起运已过 ${(result.nakshatra.birthMoon.balance * 100).toFixed(2)}%。`,
  );
  const mahas = result.vimshottari?.mahadashas ?? [];
  if (mahas.length) {
    lines.push(
      `Vimshottari 大运序列：${mahas
        .map(
          (m) =>
            `${m.lordLabel} ${m.durationYears}年（${formatVimshottariDate(m.startMs)} 起）`,
        )
        .join('；')}。`,
    );
  }
  const d9 = result.vargas?.D9;
  if (d9) {
    lines.push(
      `D9 Navamsa：${d9.placements.map((p) => `${p.label}→${p.rashi}`).join('；')}。`,
    );
  }
  const activeYogas = yogaDosha.yogas.filter((y) => y.active);
  lines.push(
    `Yoga 判定：${activeYogas.length ? activeYogas.map((y) => `${y.name}（${y.condition}）`).join('；') : '本次未命中已实现的 Yoga 条目'}。`,
  );
  const activeDoshas = yogaDosha.doshas.filter((d) => d.active);
  lines.push(
    `Dosha 判定：${activeDoshas.length ? activeDoshas.map((d) => `${d.name}[${d.severity}]（${d.condition}）`).join('；') : '本次未命中已实现的 Dosha 条目'}。`,
  );
  lines.push(
    `尚未自动化、需命理顾问终审的条目：${yogaDosha.pendingExpertReview.map((p) => p.item).join('、')}。`,
  );
  lines.push(
    '解读口径：以上为星象结构的参考性描述，不构成对健康、法律、财务或人生事件的确定性判断。',
  );
  return lines.join('\n');
}

export function generateVedicChart(input: VedicBirthInput): VedicData {
  const year = requireNumber(input.year, '出生年份');
  const month = requireNumber(input.month, '出生月份');
  const day = requireNumber(input.day, '出生日期');
  const hour = requireNumber(input.hour, '出生小时');
  const minute = requireNumber(input.minute, '出生分钟');
  const latitude = requireNumber(input.latitude, '出生地纬度');
  const longitude = requireNumber(input.longitude, '出生地经度');

  assertIntegerRange(year, '出生年份', 1900, 2100);
  assertIntegerRange(month, '出生月份', 1, 12);
  const maxDay = daysInSolarMonth(year, month);
  if (!Number.isInteger(day) || day < 1 || day > maxDay) {
    throw new Error(`日期需在 1-${maxDay} 之间。`);
  }
  assertIntegerRange(hour, '出生小时', 0, 23);
  assertIntegerRange(minute, '出生分钟', 0, 59);
  assertNumberRange(latitude, '出生地纬度', -90, 90);
  assertNumberRange(longitude, '出生地经度', -180, 180);
  if (input.timezone === undefined && !input.timeZoneId) {
    throw new Error('时区或 IANA 时区名至少需要提供一项。');
  }
  const fixedTimezone =
    input.timezone === undefined ? undefined : requireNumber(input.timezone, '时区');
  if (fixedTimezone !== undefined) {
    assertNumberRange(fixedTimezone, '时区', -12, 14);
  }

  const nodeMode = input.nodeMode ?? 'mean';

  const astroTime = buildAstronomicalTimeEvidence({
    year,
    month,
    day,
    hour,
    minute,
    second: 0,
    timezone: fixedTimezone,
    timeZoneId: input.timeZoneId,
  });
  const utcMs = astroTime.unixMilliseconds;
  const decimalYear = getDecimalYear(utcMs);
  const ayanamsaDegrees = lahiriAyanamsa(decimalYear);
  const ayanamsaInfo: VedicData['ayanamsa'] = {
    ...buildVedicAyanamsaInfo(decimalYear),
    degrees: Number(ayanamsaDegrees.toFixed(6)),
  };

  // Lagna（上升点，回归黄经）
  const lagnaTropical = lagnaLongitude(utcMs, latitude, longitude);
  const lagnaSidereal = tropicalToSidereal(lagnaTropical, ayanamsaDegrees);
  const lagnaRashiIndex = longitudeToRashi(lagnaSidereal).rashiIndex;

  const lagna = buildPoint({
    key: 'Lagna',
    tropicalLongitude: lagnaTropical,
    ayanamsaDegrees,
    lagnaRashiIndex,
    retrograde: false,
  });

  // 七政（日/月/水/金/火/木/土）
  const grahas: VedicPoint[] = PLANET_ORDER.filter((k) => k !== 'Rahu' && k !== 'Ketu').map(
    (key) => {
      const body = grahaBody(key as 'Sun');
      const tropical = tropicalEclipticLongitude(body, utcMs);
      return buildPoint({
        key,
        tropicalLongitude: tropical,
        ayanamsaDegrees,
        lagnaRashiIndex,
        retrograde: isRetrograde(body, utcMs),
      });
    },
  );

  // Rahu / Ketu（平均交点默认；Ketu = Rahu + 180°）
  const rahuTropical = nodeMode === 'true' ? trueNodeLongitude(utcMs) : meanNodeLongitude(utcMs);
  const ketuTropical = normalizeLongitude(rahuTropical + 180);
  grahas.push(
    buildPoint({
      key: 'Rahu',
      tropicalLongitude: rahuTropical,
      ayanamsaDegrees,
      lagnaRashiIndex,
      retrograde: false,
    }),
    buildPoint({
      key: 'Ketu',
      tropicalLongitude: ketuTropical,
      ayanamsaDegrees,
      lagnaRashiIndex,
      retrograde: false,
    }),
  );

  // 出生月亮 Nakshatra（Dasha 起运锚点）
  const moonNak = longitudeToNakshatra(
    tropicalToSidereal(tropicalEclipticLongitude(grahaBody('Moon'), utcMs), ayanamsaDegrees),
  );
  const moonLord = GRAHA_LORD_LABELS[moonNak.nakshatra.lord];

  // Phase2：D1 / D9 分盘落位（Lagna + 九曜）
  const allPoints: VedicPoint[] = [lagna, ...grahas];
  const d1Placements: VedicVargaPlacement[] = allPoints.map((p) => ({
    name: p.name,
    label: p.label,
    sanskrit: p.sanskrit,
    rashi: p.rashi,
    rashiIndex: p.rashiIndex,
    navamsaInSign: Math.min(8, Math.floor(p.degreeInRashi / (30 / 9))),
  }));
  const d9Placements: VedicVargaPlacement[] = allPoints.map((p) => {
    const nav = longitudeToNavamsa(p.siderealLongitude);
    return {
      name: p.name,
      label: p.label,
      sanskrit: p.sanskrit,
      rashi: `${nav.rashi.sanskrit} / ${nav.rashi.chinese}`,
      rashiIndex: nav.rashiIndex,
      navamsaInSign: nav.navamsaInSign,
    };
  });
  const vargas: VedicData['vargas'] = {
    D1: { name: 'D1', label: 'Rasi（本命盘）', placements: d1Placements },
    D9: { name: 'D9', label: 'Navamsa（九分盘）', placements: d9Placements },
  };

  // Phase2：Vimshottari 大运起算（月亮宿主星 + 已过比例 balance）
  const vimshottari = computeVimshottari({
    birthMs: utcMs,
    birthLord: moonNak.nakshatra.lord,
    balance: moonNak.elapsedRatio,
  });

  // Yoga / Dosha 判定（1.2-102 / 1.2-103）：基于 D1 盘面确定性推导
  const yogaDosha = computeYogaDosha(lagna, grahas);

  const locationName = readOptionalText(input.locationName, '');
  const standardBirth = { year, month, day, hour, minute };
  const result: VedicData = {
    birth: {
      name: readOptionalText(input.name, '未命名'),
      gender: input.gender,
      dateTime: formatDateTime(standardBirth),
      location:
        locationName.length > 0
          ? `${locationName}（${latitude.toFixed(4)}, ${longitude.toFixed(4)}）`
          : `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      latitude,
      longitude,
      timezone: astroTime.timezone,
      timeZoneId: astroTime.timeZoneId,
      astronomicalTime: astroTime,
    },
    ayanamsa: ayanamsaInfo,
    lagna,
    grahas,
    nakshatra: {
      birthMoon: {
        name: moonNak.nakshatra.sanskrit,
        sanskrit: moonNak.nakshatra.sanskrit,
        pada: moonNak.pada,
        lord: moonNak.nakshatra.lord,
        lordLabel: moonLord.chinese,
        balance: moonNak.elapsedRatio,
      },
    },
    chartLayout: {
      style: input.chartStyle ?? 'north',
      lagnaRashi: lagna.rashi,
    },
    vimshottari,
    vargas,
    yogas: yogaDosha.yogas,
    doshas: yogaDosha.doshas,
    yogaDoshaSummary: yogaDosha.summary,
    yogaDoshaPendingReview: yogaDosha.pendingExpertReview,
    timestamp: Date.now(),
  };
  result.prompt = buildVedicPrompt(result, yogaDosha);
  result.evidenceTrail = buildVedicEvidenceTrail(result);
  return result;
}

export {
  longitudeToRashi,
  longitudeToNakshatra,
  normalizeLongitude,
  RASHIS,
  NAKSHATRAS,
  GRAHA_LORD_LABELS,
} from './tables';
export { lahiriAyanamsa, tropicalToSidereal } from './ayanamsa';
export { longitudeToNavamsa, navamsaStartSign, NAVAMSA_SPAN_DEG } from './varga';
export {
  computeVimshottari,
  locateVimshottariAt,
  formatVimshottariDate,
  VIMSHOTTARI_YEARS,
  VIMSHOTTARI_ORDER,
  VIMSHOTTARI_LORD_LABELS,
} from './vimshottari';
export {
  meanNodeLongitude,
  trueNodeLongitude,
  lagnaLongitude,
  obliquityOfEcliptic,
  getDecimalYear,
} from './ephemeris';
export type {
  VedicBirthInput,
  VedicData,
  VedicPoint,
  VedicVarga,
  VedicVargaPlacement,
  VedicNodeMode,
  VedicChartStyle,
  VedicGender,
} from './types';
