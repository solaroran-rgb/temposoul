/** FNV-1a 32 位：同 seed 恒定同结果（禁真随机） */
export function stableHash(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function stableKey(value: unknown): string {
  if (value && typeof value === 'object') {
    const r = value as { id?: unknown; slug?: unknown };
    return String(r.id ?? r.slug ?? '');
  }
  return String(value);
}

/** 确定性排序：score 主序 + 稳定次序；禁止 Math.random */
export function stableRank<T>(items: T[], seed: string, score: (t: T) => number): T[] {
  return [...items].sort((a, b) => {
    const diff = score(b) - score(a);
    if (diff !== 0) return diff;
    const ha = stableHash(`${seed}:${stableKey(a)}`);
    const hb = stableHash(`${seed}:${stableKey(b)}`);
    if (ha === hb) return 0;
    return ha < hb ? -1 : 1;
  });
}

/** 缓存键：统一 temposoul: 前缀 */
export function makeCacheKey(domain: string, ...parts: string[]): string {
  return `temposoul:${domain}:${parts.filter((p) => p !== undefined && p !== '').join(':')}`;
}
