import { mergeContent } from '@/data/content/merge';
import { TAROT_SKELETONS } from './generated/skeletons';
import { MAJOR_PATCHES } from './content/major';
import { MINOR_PATCHES } from './content/minor';
import { MAJOR_AI_PATCHES } from './content/major-ai';
import { MINOR_AI_PATCHES } from './content/minor-ai';
import type { BaseContentRecord } from '@/data/content/types';

export const TAROT_CONTENT_VERSION = 1;
export const TAROT_UPDATED_AT = '2026-09-18T00:00:00.000Z';

export const TAROT_LEXICON: BaseContentRecord[] = mergeContent(
  TAROT_SKELETONS,
  [...MAJOR_PATCHES, ...MINOR_PATCHES, ...MAJOR_AI_PATCHES, ...MINOR_AI_PATCHES],
  {
    contentVersion: TAROT_CONTENT_VERSION,
    updatedAt: TAROT_UPDATED_AT,
    defaultSourceRef: ['tarotCards (@temposoul/core/divination)'],
  },
);

export const TAROT_FULL_COUNT = TAROT_LEXICON.filter((r) => r.completeness === 'full').length;
