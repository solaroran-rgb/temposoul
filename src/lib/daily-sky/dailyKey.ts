// src/lib/daily-sky/dailyKey.ts
// 每日星象 · 日键与 24h 刷新判定（规格 §4 冻结接口）。
// 24h 刷新唯一依据：用户本地 IANA 时区当天 YYYY-MM-DD，
// 与 localStorage `daily-sky:lastSeen` 不等即视为跨天。

const LAST_SEEN_KEY = 'daily-sky:lastSeen';

/** localStorage 环境兜底：SSR / 隐私模式 / 单测环境不可用时返回 null，调用方静默降级。 */
function storage(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* 某些浏览器隐私模式访问 localStorage 直接抛错 */
  }
  return null;
}

/** 用户本地 IANA 时区当天日期，格式 YYYY-MM-DD。24h 刷新判定唯一依据。 */
export function getDailyKey(): string {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  // en-CA 的长格式即 YYYY-MM-DD；用正则双保险抽取，避免个别运行时返回斜杠格式。
  const raw = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  const m = /(\d{4})[/-](\d{2})[/-](\d{2})/.exec(raw);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : raw;
}

/**
 * 是否跨天（localStorage `daily-sky:lastSeen` 与今日 key 不等）。
 * 跨天时把今日 key 写入记录，同日后续调用返回 false。
 * 无 localStorage 环境（SSR / 单测未注入）一律返回 false，不抛错。
 */
export function refreshIfNewDay(): boolean {
  const key = getDailyKey();
  const s = storage();
  if (!s) return false;
  let last: string;
  try {
    last = s.getItem(LAST_SEEN_KEY) || '';
  } catch {
    last = '';
  }
  if (last !== key) {
    try {
      s.setItem(LAST_SEEN_KEY, key);
    } catch {
      /* 写入失败不阻塞刷新判定 */
    }
    return true;
  }
  return false;
}
