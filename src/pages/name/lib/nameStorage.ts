/**
 * 历史记录适配层（契约 v3.2 §6：优先复用 safe-storage.ts / history-records.ts）
 * v1 缺陷：直接写 window.localStorage，SSR / 隐私模式下会抛错且绕开既有封装 —— 改为能力探测 + 回退。
 * PII 最小化：仅存 surname / given / type / script / 结果摘要，出生日期不落库（决策 15）。
 */
export interface NameRecordLite {
  id: string;
  surname: string;
  given: string;
  type: string;
  script: string;
  summary: string;
  createdAt: string;
}

const KEY = 'temposoul:name-test:records';
const MAX = 20;

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

async function safeStorage(): Promise<StorageLike | null> {
  try {
    const mod = (await import('../../../lib/safe-storage')) as unknown as {
      safeGetItem?: (k: string) => string | null;
      safeSetItem?: (k: string, v: string) => void;
    };
    if (typeof mod.safeGetItem === 'function' && typeof mod.safeSetItem === 'function') {
      return {
        getItem: (k) => mod.safeGetItem?.(k) ?? null,
        setItem: (k, v) => mod.safeSetItem?.(k, v),
      };
    }
  } catch {
    // 模块不可用：回退 localStorage
  }
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
}

export async function loadNameRecords(): Promise<NameRecordLite[]> {
  const s = await safeStorage();
  if (!s) return [];
  try {
    const raw = s.getItem(KEY);
    return raw ? (JSON.parse(raw) as NameRecordLite[]) : [];
  } catch {
    return [];
  }
}

export async function saveNameRecord(
  record: Omit<NameRecordLite, 'id' | 'createdAt'>,
): Promise<void> {
  const s = await safeStorage();
  if (!s) return;
  const list = await loadNameRecords();
  const next: NameRecordLite = {
    ...record,
    id: `name-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  s.setItem(KEY, JSON.stringify([next, ...list].slice(0, MAX)));
}
