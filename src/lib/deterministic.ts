import { djb2 } from './hash';

export function dateSeed(dateKey: string): number {
  return parseInt(djb2(dateKey), 36) || 0;
}

export function seqSeed(dateKey: string, clickSeq: number): number {
  return parseInt(djb2(`${dateKey}:${clickSeq}`), 36) || 0;
}

export function seedToIndex(seed: number, length: number): number {
  if (length <= 0) return 0;
  return Math.abs(seed) % length;
}

export function pickBySeed<T>(items: T[], seed: number): T {
  return items[seedToIndex(seed, items.length)];
}

export function pickManyBySeed<T>(items: T[], seed: number, count: number): T[] {
  const arr = [...items];
  let s = seed >>> 0;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(count, arr.length));
}
