import { safeStorage } from '../../../lib/safe-storage';

export type QuotaBucket = 'name-test' | 'name-generator' | 'name-report';
const LIMITS: Record<QuotaBucket, number> = {
  'name-test': Infinity,
  'name-generator': 3,
  'name-report': 1,
};

export interface QuotaState {
  limit: number;
  used: number;
  remaining: number;
  locked: boolean;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function keyOf(b: QuotaBucket): string {
  return `name-quota:${b}:${todayKey()}`;
}

export function readQuota(b: QuotaBucket): QuotaState {
  const limit = LIMITS[b];
  const used = safeStorage.getJSON<{ used?: number }>(keyOf(b), {}).used ?? 0;
  return {
    limit,
    used,
    remaining: limit === Infinity ? Infinity : Math.max(limit - used, 0),
    locked: used >= limit,
  };
}
export function consumeQuota(b: QuotaBucket): QuotaState {
  const s = readQuota(b);
  safeStorage.setJSON(keyOf(b), { used: s.used + 1 });
  return readQuota(b);
}
