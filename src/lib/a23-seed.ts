// A23 共享 · 确定性 seed 派生（djb2 → base36 → parseInt(,36) → >>> 0）
// 供 guifa match-rules 与各页面使用；禁真随机。
// 兼容可变参数调用：seedFromParts(a,b,c...) 全部以 '|' 连接后哈希。
import { djb2 } from '@/lib/hash';

export function seedFromParts(...parts: Array<string | number | undefined | null>): number {
  const joined = parts
    .filter((p) => p !== undefined && p !== null && p !== '')
    .map((p) => String(p))
    .join('|');
  return parseInt(djb2(joined), 36) >>> 0;
}
