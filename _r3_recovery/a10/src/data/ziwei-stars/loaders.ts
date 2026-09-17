
// A9-4 · 显式映射表 + 就绪白名单（修正：未就绪星返回 null，不加载任何文件）
import type { ZiweiStarDoc, StarId } from './types';

/** 唯一就绪白名单（StarsPage 与 loadStarDoc 共享） */
export const READY_STAR_IDS: readonly StarId[] = ['ziwei', 'tianfu', 'qisha'] as const;
const READY_SET = new Set<StarId>(READY_STAR_IDS);

/** 就绪星 id → 真实文档加载器；未就绪 id 无映射 */
const STAR_LOADERS: Partial<Record<StarId, () => Promise<{ default: ZiweiStarDoc }>>> = {
  ziwei: () => import('./ziwei'),
  tianfu: () => import('./tianfu'),
  qisha: () => import('./qisha'),
};

export function isStarReady(id: StarId): boolean {
  return READY_SET.has(id);
}

export async function loadStarDoc(id: StarId): Promise<ZiweiStarDoc | null> {
  if (!READY_SET.has(id)) return null;
  const loader = STAR_LOADERS[id];
  if (!loader) return null;
  try {
    const m = await loader();
    return m.default;
  } catch { return null; }
}

