import { safeStorage } from '@/lib/safe-storage';
import { makeCacheKey } from './deterministic';

interface TtlEnvelope<T> {
  value: T;
  expiresAt: number;
}

/** UX 记忆键读取：过期即删 */
export function readUx<T>(domain: string, ...parts: string[]): T | null {
  const key = makeCacheKey(domain, ...parts);
  const raw = safeStorage.getJSON<TtlEnvelope<T> | null>(key, null);
  if (!raw) return null;
  if (typeof raw.expiresAt !== 'number' || raw.expiresAt < Date.now()) {
    safeStorage.remove(key);
    return null;
  }
  return raw.value;
}

/** UX 记忆键写入：应用层 TTL 信封 */
export function writeUx<T>(domain: string, value: T, ttlMs: number, ...parts: string[]): void {
  const key = makeCacheKey(domain, ...parts);
  const envelope: TtlEnvelope<T> = { value, expiresAt: Date.now() + ttlMs };
  safeStorage.setJSON(key, envelope);
}

export function removeUx(domain: string, ...parts: string[]): void {
  safeStorage.remove(makeCacheKey(domain, ...parts));
}

export const TTL_1H = 60 * 60 * 1000;
export const TTL_7D = 7 * 24 * 60 * 60 * 1000;
export const TTL_30D = 30 * 24 * 60 * 60 * 1000;
