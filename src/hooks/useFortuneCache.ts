// 修正：IT-5.11-9/12 依据；键排序保证 hash 确定性
import { useCallback, useRef } from 'react';
import { safeStorage } from '../lib/safe-storage';

const LRU_SIZE = 50;
const PREFIX = 'temposoul:fortune:';

const TTL_MS: Record<string, number> = {
  natal: 30 * 24 * 60 * 60 * 1000,
  full: 30 * 24 * 60 * 60 * 1000,
  dayun: 30 * 24 * 60 * 60 * 1000,
  year: 365 * 24 * 60 * 60 * 1000,
  month: 7 * 24 * 60 * 60 * 1000,
  day: 7 * 24 * 60 * 60 * 1000,
};
const DEFAULT_TTL = 30 * 24 * 60 * 60 * 1000;

interface CacheEntry {
  key: string;
  value: unknown;
  updatedAt: number;
}

function hashString(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/** 键排序序列化：保证 { a:1, b:2 } 与 { b:2, a:1 } 同 hash */
function stableStringify(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']';
  const o = v as Record<string, unknown>;
  const keys = Object.keys(o).sort();
  return '{' + keys.map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`).join(',') + '}';
}

export interface FortuneCacheKeyParts {
  scope: string;
  gender: string;
  dateType: string;
  year: number;
  month: number;
  day: number;
  timeIndex: number;
  targetYear?: number;
  school?: string;
  extra?: Record<string, unknown>;
  ttlScope?: string;
}

export interface FortuneCache {
  key: string;
  get: <T>() => T | null;
  set: (value: unknown) => void;
  clear: () => void;
}

export function useFortuneCache(parts: FortuneCacheKeyParts): FortuneCache {
  const memoryRef = useRef<Map<string, CacheEntry>>(new Map());

  const hashInput = stableStringify({
    g: parts.gender,
    dt: parts.dateType,
    y: parts.year,
    m: parts.month,
    d: parts.day,
    ti: parts.timeIndex,
    ty: parts.targetYear ?? null,
    s: parts.school ?? null,
    ex: parts.extra ?? null,
  });

  const key = `${PREFIX}${parts.scope}:${hashString(hashInput)}`;
  const ttl = TTL_MS[parts.ttlScope ?? ''] ?? DEFAULT_TTL;

  const get = useCallback(<T>(): T | null => {
    const mem = memoryRef.current.get(key);
    if (mem) {
      if (Date.now() - mem.updatedAt <= ttl) {
        memoryRef.current.delete(key);
        memoryRef.current.set(key, mem);
        return mem.value as T;
      }
      memoryRef.current.delete(key);
      safeStorage.remove(key);
    }
    const raw = safeStorage.getJSON<CacheEntry | null>(key, null);
    if (raw && typeof raw === 'object' && 'value' in raw && typeof raw.updatedAt === 'number') {
      if (Date.now() - raw.updatedAt > ttl) {
        safeStorage.remove(key);
        return null;
      }
      memoryRef.current.set(key, raw);
      if (memoryRef.current.size > LRU_SIZE) {
        const first = memoryRef.current.keys().next().value;
        if (first) memoryRef.current.delete(first);
      }
      return raw.value as T;
    }
    return null;
  }, [key, ttl]);

  const set = useCallback(
    (value: unknown) => {
      const entry: CacheEntry = { key, value, updatedAt: Date.now() };
      memoryRef.current.set(key, entry);
      if (memoryRef.current.size > LRU_SIZE) {
        const first = memoryRef.current.keys().next().value;
        if (first) memoryRef.current.delete(first);
      }
      safeStorage.setJSON(key, entry);
    },
    [key],
  );

  const clear = useCallback(() => {
    memoryRef.current.delete(key);
    safeStorage.remove(key);
  }, [key]);

  return { key, get, set, clear };
}
