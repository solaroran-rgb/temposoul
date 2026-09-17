/**
 * C23-5 名字热度 · 本地计数 + 两层防刷
 * 文件路径：src/lib/name-popularity.ts
 * 第一层：会话去重（同 session 同名字只计 1 次）
 * 第二层：10min 时间窗 + 停留 ≥3s 才计入
 * 键：temposoul:names:popularity:*；禁 IP（前端无 IP）
 */
import { safeStorage } from '@/lib/safe-storage';
import { trackEvent } from '@/lib/analytics';

const NS = 'temposoul:names:popularity';
const VIEWS_KEY = `${NS}:views`;
const SESSION_KEY = `${NS}:session`;
const WINDOW_MS = 10 * 60 * 1000; // 10 分钟
const DWELL_MS = 3000; // 停留 3 秒

export interface NamePopularityEntry {
  nameId: string;
  name: string;
  views: number;
  seedViews: number;
  lastViewedAt: number;
  /** 防刷：当前计次的会话 id（不对外展示） */
  sessionId?: string;
}

function getSessionId(): string {
  let sid = safeStorage.get(SESSION_KEY);
  if (!sid) {
    sid = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    safeStorage.set(SESSION_KEY, sid);
  }
  return sid;
}

function loadViews(): Record<string, NamePopularityEntry> {
  return safeStorage.getJSON<Record<string, NamePopularityEntry>>(VIEWS_KEY, {});
}

function saveViews(v: Record<string, NamePopularityEntry>) {
  safeStorage.setJSON(VIEWS_KEY, v);
}

/**
 * 记录一次名字浏览。
 * @param nameId 名字 id
 * @param name 显示名
 * @param dwellMs 实际停留毫秒（由调用方在 onMouseLeave/onHide 时传入）
 */
export function recordNameView(nameId: string, name: string, dwellMs = 0): void {
  // 第二层：停留不足 3 秒不计
  if (dwellMs > 0 && dwellMs < DWELL_MS) {
    trackEvent('name_card_view', { nameId, counted: false, reason: 'short_dwell' });
    return;
  }

  const sid = getSessionId();
  const views = loadViews();
  const now = Date.now();
  const existing = views[nameId];

  // 第一层：会话去重
  if (existing) {
    if (existing.sessionId === sid) {
      trackEvent('name_card_view', { nameId, counted: false, reason: 'session_dup' });
      return;
    }
    // 第二层：10 分钟时间窗
    if (now - existing.lastViewedAt < WINDOW_MS) {
      trackEvent('name_card_view', { nameId, counted: false, reason: 'time_window' });
      return;
    }
    views[nameId] = {
      ...existing,
      views: existing.views + 1,
      lastViewedAt: now,
      sessionId: sid,
    };
  } else {
    views[nameId] = {
      nameId,
      name,
      views: 1,
      seedViews: 0,
      lastViewedAt: now,
      sessionId: sid,
    };
  }
  saveViews(views);
  trackEvent('name_card_view', { nameId, counted: true });
}

/** 周榜：近 7 天 */
export function listWeekly(seed: Record<string, number>): NamePopularityEntry[] {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return listAll(seed).filter((e) => e.lastViewedAt >= weekAgo);
}

/** 总榜：全量累计（本地计数 + 种子热度） */
export function listAll(seed: Record<string, number>): NamePopularityEntry[] {
  const local = loadViews();
  const merged: Record<string, NamePopularityEntry> = {};
  // 先灌种子
  for (const [nameId, seedViews] of Object.entries(seed)) {
    merged[nameId] = {
      nameId,
      name: nameId,
      views: 0,
      seedViews,
      lastViewedAt: 0,
    };
  }
  // 合并本地计数
  for (const [nameId, entry] of Object.entries(local)) {
    if (merged[nameId]) {
      merged[nameId] = {
        ...merged[nameId],
        views: entry.views,
        lastViewedAt: entry.lastViewedAt,
        name: entry.name,
      };
    } else {
      merged[nameId] = { ...entry, seedViews: 0 };
    }
  }
  return Object.values(merged).sort((a, b) => b.seedViews + b.views - (a.seedViews + a.views));
}
