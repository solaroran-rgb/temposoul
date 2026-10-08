// src/lib/growth/hidden-card.ts
// 分享激励细部 · 隐藏卡（文化深度版）解锁标记与内容（规格 §2.4 冻结签名）。
//
// 冻结接口（逐字实现，B4 接线片按此消费）：
//   isHiddenCardUnlocked(dateKey?): boolean
//   unlockHiddenCard(dateKey?): void
//   getHiddenCardContent(dateKey?): HiddenCardContent
//
// - 解锁标记：localStorage `growth:hiddenCard:{dateKey}`，dateKey 缺省用 getDailyKey()。
// - 内容：文化深度版（非预测、非吉凶），按 dateKey 种子从独立引文库确定性选取——
//   djb2 种子思路参考 daily-sky/corpus.ts 的 pickDailyQuote，但引文库与哈希在此独立
//   实现，避免与每日片形成循环依赖。
// - 全部文案过 filterBannedWords；任一字段命中禁词 → 整条中性兜底。
// - 隐藏卡=内容权益，无现金措辞；合规句对齐全站统一的「此为传统命理观点」。

import { filterBannedWords, hasBannedWord } from '@/lib/client-compliance';
import { getDailyKey } from '@/lib/daily-sky/dailyKey';

/** 全站统一合规句（对齐 daily.ts COMPLIANCE_LINE，全站唯一措辞）。 */
export const COMPLIANCE_LINE = '此为传统命理观点' as const;

/** 隐藏卡内容（规格 §2.4 冻结字段）。 */
export interface HiddenCardContent {
  /** 文化专题名，如「月亮与情绪 · 文化深度」 */
  theme: string;
  /** 文化引文（禁词过滤） */
  quote: string;
  /** 出处 */
  source: string;
  /** 文化观察（中性，非预测，禁吉凶/运势措辞） */
  note: string;
  /** 全站统一合规句 */
  compliance: typeof COMPLIANCE_LINE;
}

/** localStorage 环境兜底：SSR / 隐私模式 / 单测未注入时静默降级。 */
function storage(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* 某些浏览器隐私模式访问 localStorage 直接抛错 */
  }
  return null;
}

const lockKey = (dateKey: string): string => `growth:hiddenCard:${dateKey}`;

/** 是否已解锁当日隐藏卡（默认今日 dateKey）。未解锁 / 无存储环境一律 false。 */
export function isHiddenCardUnlocked(dateKey?: string): boolean {
  const s = storage();
  if (!s) return false;
  try {
    return s.getItem(lockKey(dateKey ?? getDailyKey())) === '1';
  } catch {
    return false;
  }
}

/** 解锁当日隐藏卡（分享成功后由接线片调用）。无存储环境静默降级。 */
export function unlockHiddenCard(dateKey?: string): void {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(lockKey(dateKey ?? getDailyKey()), '1');
  } catch {
    /* 写入失败不阻塞分享主流程 */
  }
}

/** 独立文化引文库：均为可考的天文/星象文化名句（不与每日片共用，避免循环依赖）。 */
interface HiddenCardEntry {
  theme: string;
  quote: string;
  source: string;
  note: string;
}

const HIDDEN_CARD_LIBRARY: readonly HiddenCardEntry[] = [
  {
    theme: '月亮与阴精 · 文化深度',
    quote: '月者，阴之精也。',
    source: '《淮南子·天文训》',
    note: '古人以阴阳分类天象，把月亮归为阴的精气，与夜晚、清寒相联系；这是一种文化观察框架。',
  },
  {
    theme: '仰观天文 · 文化深度',
    quote: '仰以观于天文，俯以察于地理。',
    source: '《周易·系辞上》',
    note: '观象传统强调抬头看天、低头察地，把天象与地上的秩序对照着看。',
  },
  {
    theme: '敬授人时 · 文化深度',
    quote: '历象日月星辰，敬授人时。',
    source: '《尚书·尧典》',
    note: '上古设官观察日月星辰，是为了把节令谨慎地颁授给民众，指导农时作息。',
  },
  {
    theme: '天汉星光 · 文化深度',
    quote: '维天有汉，监亦有光。',
    source: '《诗经·小雅·大东》',
    note: '古人把银河视作天上的水光，如一面可照的镜子；这是诗意的天象想象。',
  },
  {
    theme: '天行有常 · 文化深度',
    quote: '天行有常，不为尧存，不为桀亡。',
    source: '《荀子·天论》',
    note: '这是一种规律观：天象运行自有常规，不因人间治乱而改变。',
  },
  {
    theme: '月魄盈亏 · 文化深度',
    quote: '月光生于日之所照，魄生于日之所蔽。',
    source: '张衡《灵宪》',
    note: '张衡已用日光照射解释月相明暗，是古代对月相成因的朴素观察。',
  },
  {
    theme: '日月相推 · 文化深度',
    quote: '日往则月来，月往则日来，日月相推而明生焉。',
    source: '《周易·系辞下》',
    note: '古人以往来推移解释光明与时间的更替，强调相因相成的节奏。',
  },
  {
    theme: '盈虚消息 · 文化深度',
    quote: '天地盈虚，与时消息。',
    source: '《周易·丰卦·彖传》',
    note: '万物随时间而盈满或亏虚，古人以此描述节律，而非定数断言。',
  },
  {
    theme: '北斗七政 · 文化深度',
    quote: '北斗七星，所谓旋玑玉衡以齐七政。',
    source: '《史记·天官书》',
    note: '古人以北斗斗柄指向定季节、正方位，是古代天文观测的实用部分。',
  },
  {
    theme: '星次分野 · 文化深度',
    quote: '星纪，斗、牵牛也。',
    source: '《尔雅·释天》',
    note: '古代把周天划成星次，以配地上的区域，是一种天文与地理对应的文化体系。',
  },
  {
    theme: '长久之道 · 文化深度',
    quote: '天地所以能长且久者，以其不自生。',
    source: '《道德经》第七章',
    note: '道家以天地不自营生故能长久作喻，讲的是一种处世态度，而非占断。',
  },
  {
    theme: '星河传说 · 文化深度',
    quote: '迢迢牵牛星，皎皎河汉女。',
    source: '《古诗十九首》',
    note: '牵牛织女是星河之上的诗意形象，后世演为七夕传说，寄寓离别与思念。',
  },
  {
    theme: '悬象著明 · 文化深度',
    quote: '悬象著明，莫大乎日月。',
    source: '《周易·系辞上》',
    note: '高悬而最明亮的天象莫过于日月，古人以此为最显著的观察对象。',
  },
  {
    theme: '观乎天文 · 文化深度',
    quote: '观乎天文，以察时变。',
    source: '《周易·贲卦·彖传》',
    note: '观察天象是为了察觉时节变化，落在农时与生活节律上，供静观看待。',
  },
];

/** 任一字段命中禁词时的整条中性兜底（兜底文案自身已过 hasBannedWord）。 */
const FALLBACK_CONTENT: HiddenCardContent = {
  theme: '星象如常 · 文化深度',
  quote: '今夜星象如常，宜静观与整理。',
  source: '中性观察',
  note: '把夜晚留给安静与整理，不预断明日。',
  compliance: COMPLIANCE_LINE,
};

/** 确定性字符串哈希（djb2 变种），仅用于按 dateKey 取条——同日恒定不跳动。 */
function seedHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
  }
  return h >>> 0;
}

/**
 * 取当日隐藏卡（文化深度版）内容：按 dateKey 种子确定性选取。
 * - 同 dateKey 恒定同一条；不同 dateKey 允许不同；
 * - theme/quote/source/note 任一命中禁词 → 整条替换为 FALLBACK_CONTENT。
 */
export function getHiddenCardContent(dateKey?: string): HiddenCardContent {
  const key = dateKey ?? getDailyKey();
  const idx = seedHash(`growth|hiddenCard|${key}`) % HIDDEN_CARD_LIBRARY.length;
  const entry = HIDDEN_CARD_LIBRARY[idx];

  // 任一字段命中禁词（理论上引文库本身干净）→ 整条中性兜底。
  if (hasBannedWord(entry.theme + entry.quote + entry.source + entry.note)) {
    return FALLBACK_CONTENT;
  }

  return {
    theme: filterBannedWords(entry.theme),
    quote: filterBannedWords(entry.quote),
    source: filterBannedWords(entry.source),
    note: filterBannedWords(entry.note),
    compliance: COMPLIANCE_LINE,
  };
}
