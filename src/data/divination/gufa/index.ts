export * from './types';
export { SANMING_ENTRIES } from './sanming-tonghui';
export { GUIGUZI_ENTRIES } from './guiguzi';
export { JIUXING_ENTRIES } from './jiuxing';
export { GUFA_MANIFESTS, GUFA_SCHOOLS, isGufaSchool } from './manifest';
export { GUFA_SUB_CATEGORIES, getSubCategories, findSubCategory } from './sub-categories';
export { deriveMatchKey } from './match-rules';
export type { MatchInput, MatchResult } from './match-rules';

import { SANMING_ENTRIES } from './sanming-tonghui';
import { GUIGUZI_ENTRIES } from './guiguzi';
import { JIUXING_ENTRIES } from './jiuxing';
import type { GufaEntry, GufaSchool } from './types';

export const ENTRIES_BY_SCHOOL: Record<GufaSchool, GufaEntry[]> = {
  sanming: SANMING_ENTRIES,
  guiguzi: GUIGUZI_ENTRIES,
  jiuxing: JIUXING_ENTRIES,
};
