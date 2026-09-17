// src/lib/stable-hash.ts
// Deterministic string hash (FNV-1a) — stable across runs, used for seed selection.

export function stableHash(input: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0);
}
