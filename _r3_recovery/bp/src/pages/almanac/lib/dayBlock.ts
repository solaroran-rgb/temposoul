// B'11-1 src/pages/almanac/lib/dayBlock.ts
/**
 * 黄历月历色块纯函数算法
 * @module B'11-1
 */
export type DayBlockColor = 'auspicious' | 'inauspicious' | 'neutral';

export function calcDayBlock(recommends: string[], avoids: string[]): DayBlockColor {
  const recLen = recommends?.length ?? 0;
  const avoLen = avoids?.length ?? 0;
  if (recLen >= 3 && recLen > avoLen) return 'auspicious';
  if (avoLen >= 3 && avoLen > recLen) return 'inauspicious';
  return 'neutral';
}
