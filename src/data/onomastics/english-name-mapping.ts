// src/data/onomastics/english-name-mapping.ts
export const ENGLISH_NAME_MAPPING: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < alphabet.length; i++) {
    map[alphabet[i]] = (i % 9) + 1;
  }
  return map;
})();

export function letterToNumber(letter: string): number {
  const key = letter.toLowerCase();
  return ENGLISH_NAME_MAPPING[key] ?? 0;
}

/**
 * 生命数字归约：循环内中途拦截主数 11/22/33。
 * - preserveMaster=true（默认）时，任何一步归约结果落在 [11,22,33] 即保留为主数，
 *   不再继续压成单位数。
 * - 对 ≤9 的数直接返回；对主数本身（11/22/33）直接返回。
 */
export function reduceToDigit(number: number, preserveMaster = true): number {
  let n = Math.abs(Math.floor(number));
  if (preserveMaster && [11, 22, 33].includes(n)) return n;
  while (n > 9) {
    n = n
      .toString()
      .split('')
      .reduce((sum, d) => sum + parseInt(d, 10), 0);
    if (preserveMaster && [11, 22, 33].includes(n)) return n;
  }
  return n;
}

/** 合规免责声明：英文名字数学为趣味民俗测算，不构成决策依据 */
export const ENGLISH_NAME_DISCLAIMER =
  '英文名字数学（毕达哥拉斯数字学）为文化趣味测算，结果仅供娱乐与民俗参考，不构成人生、学业、职业、情感或命名决策的依据。';
