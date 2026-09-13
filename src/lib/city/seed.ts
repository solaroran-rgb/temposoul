/** 确定性随机源：同名城市 → 同布局，刷新/回访零跳变 */

export function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

export function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SeededRandom {
  next(): number;
  range(min: number, max: number): number;
  pick<T>(arr: readonly T[]): T;
}

export function seededRandom(seedKey: string): SeededRandom {
  const next = mulberry32(xmur3(seedKey)());
  return {
    next,
    range: (min, max) => min + next() * (max - min),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
  };
}

/** 数值型稳定 hash（服务端伪随机估高度用，同坐标恒定同结果） */
export function fnv1a(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}