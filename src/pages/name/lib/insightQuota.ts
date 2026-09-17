/**
 * AI 深度解读每日免费额度（契约 v3.2 决策 22：未付费用户每日 3 次，超出弹 PremiumGate）
 * 纯函数 + 存储适配：计数按自然日（本地时区）滚动，不上传、不含 PII。
 */
const KEY = 'temposoul:name-insight:quota';
const DAILY_FREE = 3;

export interface QuotaState {
  date: string;
  used: number;
  remaining: number;
  locked: boolean;
}

export function todayKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, '0');
  const d = `${now.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function readQuota(storage: Storage | null): QuotaState {
  const date = todayKey();
  if (!storage) return { date, used: 0, remaining: DAILY_FREE, locked: false };
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return { date, used: 0, remaining: DAILY_FREE, locked: false };
    const p = JSON.parse(raw) as { date?: string; used?: number };
    if (p.date !== date) return { date, used: 0, remaining: DAILY_FREE, locked: false };
    const used = typeof p.used === 'number' ? p.used : 0;
    return { date, used, remaining: Math.max(DAILY_FREE - used, 0), locked: used >= DAILY_FREE };
  } catch {
    return { date, used: 0, remaining: DAILY_FREE, locked: false };
  }
}

export function consumeQuota(storage: Storage | null): QuotaState {
  const next = readQuota(storage);
  const state: QuotaState = {
    date: next.date,
    used: next.used + 1,
    remaining: Math.max(DAILY_FREE - (next.used + 1), 0),
    locked: next.used + 1 >= DAILY_FREE,
  };
  try {
    storage?.setItem(KEY, JSON.stringify({ date: state.date, used: state.used }));
  } catch {
    // 存储不可用：不阻塞，本次按已消耗处理
  }
  return state;
}

export const DAILY_FREE_LIMIT = DAILY_FREE;
