// B23-2 src/lib/numerology.ts
/**
 * 生命灵数（Numerology）纯函数引擎。
 * 规则：公历出生年(4位)+月+日 各位数字求和；若中间结果为 11 / 22 / 33 主数，则不归约，
 * 直接作为生命灵数主数返回。同输入永远同输出，无随机、无外部依赖。
 *
 * 文献依据：流行生命数字学通行规则（主数 11/22/33 不还原为 2/4/6）。
 * // 自查：packages/core 未提供同构生命灵数模块，此为本地新建实现。
 */

const MASTER_NUMBERS = new Set([11, 22, 33]);

function reduceDigitSum(n: number): number {
  let x = n;
  while (x >= 10 && !MASTER_NUMBERS.has(x)) {
    let s = 0;
    for (const ch of String(x)) s += Number(ch);
    x = s;
  }
  return x;
}

export interface LifePathResult {
  number: number;
  isMasterNumber: boolean;
}

/**
 * 由公历日期（YYYY-MM-DD）计算生命灵数。
 * 例：1990-01-01 → 1+9+9+0+0+1+0+1 = 21 → 3。
 */
export function calcLifePath(dateISO: string): LifePathResult {
  const digits = dateISO.replace(/[-]/g, '');
  let sum = 0;
  for (const ch of digits) {
    const d = Number(ch);
    if (Number.isFinite(d)) sum += d;
  }
  const reduced = reduceDigitSum(sum);
  return { number: reduced, isMasterNumber: MASTER_NUMBERS.has(reduced) };
}

/** 两个生命灵数之间的兼容分（0-100），确定性查表。 */
export function lifePathCompatibilityScore(a: number, b: number): number {
  const pair = [Math.min(a, b), Math.max(a, b)].join('-');
  // 主数视为其根数参与查表，但保留主数加成
  const roots = (n: number) => (n === 11 ? 2 : n === 22 ? 4 : n === 33 ? 6 : n);
  const r = [roots(a), roots(b)].sort((x, y) => x - y).join('-');
  const ideal: Record<string, number> = {
    '1-5': 85, '1-3': 82, '2-6': 88, '2-8': 80, '3-5': 84, '3-7': 70,
    '4-6': 83, '4-8': 86, '5-7': 78, '6-9': 79, '7-9': 72, '1-9': 75,
  };
  const base = ideal[pair] ?? ideal[r] ?? 60 + ((a + b) % 21);
  const masterBonus = (MASTER_NUMBERS.has(a) || MASTER_NUMBERS.has(b)) ? 4 : 0;
  return Math.max(0, Math.min(100, base + masterBonus));
}
