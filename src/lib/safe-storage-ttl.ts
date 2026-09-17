// src/lib/safe-storage-ttl.ts
import { safeStorage } from '@/lib/safe-storage';

export interface TtlEnvelope<T> {
  readonly v: T;
  readonly expiresAt: number;
}

export interface SafeStorageTtlApi {
  set<T>(key: string, value: T, ttlMs: number): void;
  get<T>(key: string): T | null;
  remove(key: string): void;
}

function createTtlCache(): SafeStorageTtlApi {
  return {
    set<T>(key: string, value: T, ttlMs: number): void {
      const envelope: TtlEnvelope<T> = { v: value, expiresAt: Date.now() + ttlMs };
      safeStorage.setJSON(key, envelope);
    },
    get<T>(key: string): T | null {
      const fallback: TtlEnvelope<T> | null = null;
      const raw = safeStorage.getJSON<TtlEnvelope<T> | null>(key, fallback);
      if (raw === null) return null;
      if (typeof raw.expiresAt !== 'number' || raw.expiresAt <= Date.now()) {
        safeStorage.remove(key);
        return null;
      }
      return raw.v;
    },
    remove(key: string): void {
      safeStorage.remove(key);
    },
  };
}

export const ttlCache: SafeStorageTtlApi = createTtlCache();
