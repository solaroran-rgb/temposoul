import { mergeContent } from '@/data/content/merge';
import { HEXAGRAM_SKELETONS } from './generated/skeletons';
import { HEXAGRAM_PATCHES } from './content/base';
import { HEXAGRAM_AI_PATCHES } from './content/base-ai';
import type { BaseContentRecord } from '@/data/content/types';

export const YIJING_CONTENT_VERSION = 1;
export const YIJING_UPDATED_AT = '2026-09-18T00:00:00.000Z';

export const HEXAGRAMS: BaseContentRecord[] = mergeContent(
  HEXAGRAM_SKELETONS,
  [...HEXAGRAM_PATCHES, ...HEXAGRAM_AI_PATCHES],
  {
    contentVersion: YIJING_CONTENT_VERSION,
    updatedAt: YIJING_UPDATED_AT,
    defaultSourceRef: ['hexagramsData (@temposoul/core/divination)'],
  },
);

export const HEXAGRAM_FULL_COUNT = HEXAGRAMS.filter((r) => r.completeness === 'full').length;
