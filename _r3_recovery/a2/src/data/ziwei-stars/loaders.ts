
> 说明：此文件上一轮已交付，但本地未收到——本轮为确保与 `types.ts` 别名/主名同时兼容而重新输出完整版本。

// A11-4 · src/data/ziwei-stars/loaders.ts · 显式映射表 + 就绪白名单
// 修正：类型引用兼容 StarArticleData 与别名 ZiweiStarDoc

import type { StarArticleData, StarId } from './types';

/** 唯一就绪白名单（StarsPage 与 loadStarDoc 共享；须与 14 个数据文件的 ready 单源一致） */
export const READY_STAR_IDS: readonly StarId[] = ['ziwei', 'tianfu', 'qisha'] as const;
const READY_SET = new Set<StarId>(READY_STAR_IDS);

/** 就绪星 id → 真实文档加载器；未就绪 id 无映射 */
const STAR_LOADERS: Partial<Record<StarId, () => Promise<{ default: StarArticleData }>>> = {
  ziwei: () => import('./ziwei'),
  tianfu: () => import('./tianfu'),
  qisha: () => import('./qisha'),
};

export function isStarReady(id: StarId): boolean {
  return READY_SET.has(id);
}

export async function loadStarDoc(id: StarId): Promise<StarArticleData | null> {
  if (!READY_SET.has(id)) return null;
  const loader = STAR_LOADERS[id];
  if (!loader) return null;
  try {
    const m = await loader();
    return m.default;
  } catch { return null; }
}

