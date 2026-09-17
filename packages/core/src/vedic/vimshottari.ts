/**
 * @file Vimshottari Dasha（120 年九曜大运）— Phase2 起算
 * @传统依据 BPHS 通行口径：
 *   - 九曜年限（合计 120 年）：Ketu 7 / Shukra(Venus) 20 / Surya(Sun) 6 / Chandra(Moon) 10 /
 *     Mangala(Mars) 7 / Rahu 18 / Guru(Jupiter) 16 / Shani(Saturn) 19 / Budha(Mercury) 17。
 *   - 大运序列自出生月亮宿主星起，按 [Ketu→Shukra→Surya→Chandra→Mangala→Rahu→Guru→Shani→Budha] 循环。
 *   - 出生时本命宿已过比例 balance：出生大运已走完 balance×其年限，剩余 (1−balance)×年限。
 *   - Antardasha（Bhukti）：某主星大运内，自该主星起按同序展开 9 段，
 *     段长 = 大运年限 × 段主星年限 / 120。
 * 本文件只做确定性时间轴展开；日历年用 365.25 日/年（与星历日计数一致），不调用星历。
 */
import type { VimshottariLord } from './tables';

/** 九曜大运年限（合计 120 年；Budha=17 为标准值） */
export const VIMSHOTTARI_YEARS: Record<VimshottariLord, number> = {
  Ketu: 7,
  Shukra: 20,
  Surya: 6,
  Chandra: 10,
  Mangala: 7,
  Rahu: 18,
  Guru: 16,
  Shani: 19,
  Budha: 17,
};

/** 大运固定循环顺序 */
export const VIMSHOTTARI_ORDER: VimshottariLord[] = [
  'Ketu',
  'Shukra',
  'Surya',
  'Chandra',
  'Mangala',
  'Rahu',
  'Guru',
  'Shani',
  'Budha',
];

export const VIMSHOTTARI_TOTAL_YEARS = 120;
/** 1 年 = 365.25 日（Julian year，与星历日计数一致） */
const DAYS_PER_YEAR = 365.25;
const MS_PER_YEAR = DAYS_PER_YEAR * 86_400_000;

export const VIMSHOTTARI_LORD_LABELS: Record<
  VimshottariLord,
  { sanskrit: string; chinese: string }
> = {
  Ketu: { sanskrit: 'Ketu', chinese: '计都' },
  Shukra: { sanskrit: 'Shukra', chinese: '金星' },
  Surya: { sanskrit: 'Surya', chinese: '太阳' },
  Chandra: { sanskrit: 'Chandra', chinese: '月亮' },
  Mangala: { sanskrit: 'Mangala', chinese: '火星' },
  Rahu: { sanskrit: 'Rahu', chinese: '罗睺' },
  Guru: { sanskrit: 'Guru', chinese: '木星' },
  Shani: { sanskrit: 'Shani', chinese: '土星' },
  Budha: { sanskrit: 'Budha', chinese: '水星' },
};

export interface VimshottariPeriod {
  lord: VimshottariLord;
  lordSanskrit: string;
  lordLabel: string;
  startMs: number;
  endMs: number;
  /** 以年为单位的时长 */
  durationYears: number;
}

export interface VimshottariMaha extends VimshottariPeriod {
  antardashas: VimshottariPeriod[];
}

export interface VimshottariResult {
  /** 出生大运主星（本命宿主星） */
  birthLord: VimshottariLord;
  /** 出生本命宿已过比例 0..1 */
  balance: number;
  /** 自出生大运起，前 120 年主星序列（含各自 Antardasha） */
  mahadashas: VimshottariMaha[];
}

function lordMeta(lord: VimshottariLord) {
  return VIMSHOTTARI_LORD_LABELS[lord];
}

/**
 * 自出生时刻展开 Vimshottari 时间轴。
 * @param opts.birthMs 出生时刻（UTC ms）
 * @param opts.birthLord 本命宿主星
 * @param opts.balance 本命宿已过比例 0..1
 */
export function computeVimshottari(opts: {
  birthMs: number;
  birthLord: VimshottariLord;
  balance: number;
}): VimshottariResult {
  const { birthMs, birthLord, balance } = opts;
  if (balance < 0 || balance >= 1) {
    throw new Error('Vimshottari 起运 balance 需在 [0,1) 之间。');
  }
  const startIndex = VIMSHOTTARI_ORDER.indexOf(birthLord);
  if (startIndex < 0) {
    throw new Error(`未知的 Vimshottari 主星：${birthLord}`);
  }

  const mahadashas: VimshottariMaha[] = [];
  // 出生大运实际起点（balance 比例早于出生时刻）
  let cursorMs = birthMs - balance * VIMSHOTTARI_YEARS[birthLord] * MS_PER_YEAR;

  for (let i = 0; i < VIMSHOTTARI_ORDER.length; i++) {
    const lord = VIMSHOTTARI_ORDER[(startIndex + i) % VIMSHOTTARI_ORDER.length];
    const years = VIMSHOTTARI_YEARS[lord];
    const startMs = cursorMs;
    const endMs = startMs + years * MS_PER_YEAR;
    const meta = lordMeta(lord);

    // 该大运内的 Antardasha：自本主星起按序 9 段
    const antardashas: VimshottariPeriod[] = [];
    let aCursor = startMs;
    for (let j = 0; j < VIMSHOTTARI_ORDER.length; j++) {
      const alord = VIMSHOTTARI_ORDER[(startIndex + i + j) % VIMSHOTTARI_ORDER.length];
      const ay = (years * VIMSHOTTARI_YEARS[alord]) / VIMSHOTTARI_TOTAL_YEARS;
      const aStart = aCursor;
      const aEnd = aCursor + ay * MS_PER_YEAR;
      const ameta = lordMeta(alord);
      antardashas.push({
        lord: alord,
        lordSanskrit: ameta.sanskrit,
        lordLabel: ameta.chinese,
        startMs: aStart,
        endMs: aEnd,
        durationYears: Number(ay.toFixed(8)),
      });
      aCursor = aEnd;
    }

    mahadashas.push({
      lord,
      lordSanskrit: meta.sanskrit,
      lordLabel: meta.chinese,
      startMs,
      endMs,
      durationYears: years,
      antardashas,
    });
    cursorMs = endMs;
  }

  return { birthLord, balance, mahadashas };
}

/** 在已展开的时间轴上定位某时刻所处的 Mahadasha / Antardasha */
export function locateVimshottariAt(
  dasha: VimshottariResult,
  queryMs: number,
): { maha: VimshottariMaha; antar: VimshottariPeriod } | null {
  for (const maha of dasha.mahadashas) {
    if (queryMs >= maha.startMs && queryMs < maha.endMs) {
      const antar = maha.antardashas.find((a) => queryMs >= a.startMs && queryMs < a.endMs);
      return antar
        ? { maha, antar }
        : { maha, antar: maha.antardashas[maha.antardashas.length - 1] };
    }
  }
  return null;
}

/** ms → 'YYYY-MM-DD'（UTC） */
export function formatVimshottariDate(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
