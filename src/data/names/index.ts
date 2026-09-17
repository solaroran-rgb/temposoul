import { mergeContent } from '@/data/content/merge';
import { NAME_CHAR_SKELETONS, NAME_STROKE_NOTE } from './generated/skeletons';
import { NAME_CHAR_PATCHES } from './content/base';
import type { BaseContentRecord } from '@/data/content/types';

export const NAMES_CONTENT_VERSION = 1;
export const NAMES_UPDATED_AT = '2026-09-16T00:00:00.000Z';

/** 轻量筛选索引（进主包）；详情档案按分片加载 */
export interface NameCharIndexItem {
  char: string;
  slug: string;
  pinyin: string;
  kangxiStrokes: number;
  radical: string;
  wuxing: string;
  ready: boolean;
}

export const NAME_CHARS: BaseContentRecord[] = mergeContent(
  NAME_CHAR_SKELETONS,
  NAME_CHAR_PATCHES,
  {
    contentVersion: NAMES_CONTENT_VERSION,
    updatedAt: NAMES_UPDATED_AT,
    defaultSourceRef: ['@temposoul/core/onomastics (CharDossierLike)'],
  },
);

export const NAME_INDEX: NameCharIndexItem[] = NAME_CHARS.map((r) => {
  const f = r.domainFields as {
    pinyin?: string;
    kangxiStrokes?: number;
    radical?: string;
    wuxing?: string;
  };
  return {
    char: r.title,
    slug: r.slug,
    pinyin: f.pinyin ?? '',
    kangxiStrokes: f.kangxiStrokes ?? 0,
    radical: f.radical ?? '',
    wuxing: f.wuxing ?? '',
    ready: r.ready,
  };
});

export { NAME_STROKE_NOTE };

/** 详情按需载入（不进主包） */
export async function loadNameCharDetail(slug: string): Promise<BaseContentRecord | undefined> {
  await import('./content/base');
  return NAME_CHARS.find((r) => r.slug === slug);
}
