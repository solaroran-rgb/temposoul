// A9-4 · 显式映射表 + 就绪白名单（修正：未就绪星返回 null，不加载任何文件）
import type { ZiweiStarDoc, StarId } from './types';

/** 唯一就绪白名单（StarsPage 与 loadStarDoc 共享）
 * 2026-09-18：AI 补齐 11 颗主星（天机/太阳/武曲/天同/廉贞/太阴/贪狼/巨门/天相/天梁/破军）后，14 主星全部就绪；
 * 新增内容 source 标记「AI生成待专家审计」，待专家复核后转正。 */
export const READY_STAR_IDS: readonly StarId[] = [
  'ziwei',
  'tianji',
  'taiyang',
  'wuqu',
  'tongtian',
  'lianzhen',
  'tianfu',
  'taiyin',
  'tanlang',
  'jumen',
  'tianxiang',
  'tianliang',
  'qisha',
  'pojun',
] as const;
const READY_SET = new Set<StarId>(READY_STAR_IDS);

/** 就绪星 id → 真实文档加载器；未就绪 id 无映射 */
const STAR_LOADERS: Partial<Record<StarId, () => Promise<{ default: ZiweiStarDoc }>>> = {
  ziwei: () => import('./ziwei'),
  tianji: () => import('./tianji'),
  taiyang: () => import('./taiyang'),
  wuqu: () => import('./wuqu'),
  tongtian: () => import('./tongtian'),
  lianzhen: () => import('./lianzhen'),
  tianfu: () => import('./tianfu'),
  taiyin: () => import('./taiyin'),
  tanlang: () => import('./tanlang'),
  jumen: () => import('./jumen'),
  tianxiang: () => import('./tianxiang'),
  tianliang: () => import('./tianliang'),
  qisha: () => import('./qisha'),
  pojun: () => import('./pojun'),
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
  } catch {
    return null;
  }
}
