// src/lib/guard-utils.ts
// 集中归一化 guardText 返回值。R4 前本地侧核对后仅改此文件。
import { guardText } from '@/lib/assertions-guard';

export function applyGuard(text: string): string {
  const raw: unknown = guardText(text);
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (obj.ok === false) return '';
    if (typeof obj.text === 'string') return obj.text;
    if (typeof obj.safe === 'string') return obj.safe;
  }
  return text;
}
