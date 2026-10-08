// src/lib/growth/streak.ts
// 连续登录成长 + 每日免费解读（规格 §2.1 冻结接口）。
// 全部 localStorage 记账（无后端依赖）；断签重置边界：
//   lastVisitKey=昨天 → current+1；=今天 → current 不变（同日不叠加）；否则 → 重置为 1。
// 日期键只读引用 src/lib/daily-sky/dailyKey.ts 的 getDailyKey（本地 IANA）。
// 里程碑纯荣誉/内容权益，无现金措辞；bestStreak 只增不减。

import { getDailyKey } from '@/lib/daily-sky/dailyKey';

const STREAK_KEY = 'growth:streak';
const FREE_READ_PREFIX = 'growth:freeRead:';

export interface StreakState {
  /** 当前连续天数 */
  current: number;
  /** 最近一次访问的本地日期键 YYYY-MM-DD（null=从未） */
  lastVisitKey: string | null;
  /** 历史最佳连续天数 */
  bestStreak: number;
  /** 更新时间 ISO */
  updatedAt: string;
}

const EMPTY_STATE: StreakState = {
  current: 0,
  lastVisitKey: null,
  bestStreak: 0,
  updatedAt: '',
};

/** localStorage 环境兜底：SSR / 隐私模式 / 单测未注入时静默降级，调用方不抛错。 */
function storage(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* 某些浏览器隐私模式访问 localStorage 直接抛错 */
  }
  return null;
}

/** 本地日历日期键偏移 offsetDays 天（按本地时区落日历日，DST 安全）。 */
function shiftLocalKey(key: string, offsetDays: number): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return key;
  // 日历算术（而非毫秒加减）保证跨月/跨年/DST 后仍落在正确的本地日历日。
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]) + offsetDays);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const raw = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
  const mm = /(\d{4})[/-](\d{2})[/-](\d{2})/.exec(raw);
  return mm ? `${mm[1]}-${mm[2]}-${mm[3]}` : raw;
}

export function getStreakState(): StreakState {
  const s = storage();
  if (!s) return { ...EMPTY_STATE };
  try {
    const raw = s.getItem(STREAK_KEY);
    if (!raw) return { ...EMPTY_STATE };
    const p = JSON.parse(raw) as Partial<StreakState>;
    return {
      current: typeof p.current === 'number' && p.current >= 0 ? p.current : 0,
      lastVisitKey: typeof p.lastVisitKey === 'string' ? p.lastVisitKey : null,
      bestStreak: typeof p.bestStreak === 'number' && p.bestStreak >= 0 ? p.bestStreak : 0,
      updatedAt: typeof p.updatedAt === 'string' ? p.updatedAt : '',
    };
  } catch {
    return { ...EMPTY_STATE };
  }
}

/**
 * 记录一次访问并按断签边界推进连续天数。
 * - 同日重复调用：current 不变（不叠加）；
 * - 昨日访问：current+1；
 * - 其余（首次 / 断签 ≥2 天）：重置为 1；bestStreak 全程只增不减。
 */
export function markVisit(): StreakState {
  const s = storage();
  const today = getDailyKey();
  const prev = getStreakState();

  if (prev.lastVisitKey === today) {
    return prev;
  }

  const current = prev.lastVisitKey === shiftLocalKey(today, -1) ? prev.current + 1 : 1;
  const next: StreakState = {
    current,
    lastVisitKey: today,
    bestStreak: Math.max(prev.bestStreak, current),
    updatedAt: new Date().toISOString(),
  };

  if (s) {
    try {
      s.setItem(STREAK_KEY, JSON.stringify(next));
    } catch {
      /* 写入失败不阻塞访问记账 */
    }
  }
  return next;
}

export const STREAK_MILESTONES: readonly {
  days: number;
  key: 'd7' | 'd30' | 'd100';
  title: string;
  kind: 'topic' | 'badge' | 'title';
  description: string;
}[] = [
  {
    days: 7,
    key: 'd7',
    title: '《月亮周期×情绪》文化专题',
    kind: 'topic',
    description: '连续 7 天 · 《月亮周期×情绪》文化专题',
  },
  {
    days: 30,
    key: 'd30',
    title: '星象收藏家',
    kind: 'badge',
    description: '连续 30 天 · 星象收藏家徽章',
  },
  {
    days: 100,
    key: 'd100',
    title: '观星者',
    kind: 'title',
    description: '连续 100 天 · 观星者称号',
  },
];

/** 返回已达成的里程碑 key 列表（按 days 升序）。 */
export function unlockedMilestones(state: StreakState): Array<'d7' | 'd30' | 'd100'> {
  const out: Array<'d7' | 'd30' | 'd100'> = [];
  for (const m of STREAK_MILESTONES) {
    if (state.current >= m.days) out.push(m.key);
  }
  return out;
}

/** 每日免费解读是否已用（1 次/日；localStorage `growth:freeRead:{dateKey}`，跨天重置不叠加）。 */
export function getFreeReadUsedToday(dateKey?: string): boolean {
  const s = storage();
  if (!s) return false;
  const key = FREE_READ_PREFIX + (dateKey ?? getDailyKey());
  try {
    return s.getItem(key) === '1';
  } catch {
    return false;
  }
}

/** 标记今日免费解读已用（幂等：同日重复调用不叠加次数）。 */
export function markFreeReadUsedToday(dateKey?: string): void {
  const s = storage();
  if (!s) return;
  const key = FREE_READ_PREFIX + (dateKey ?? getDailyKey());
  try {
    s.setItem(key, '1');
  } catch {
    /* 写入失败不阻塞 */
  }
}
