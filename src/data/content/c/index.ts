/**
 * C 域（内容轻娱乐批）聚合出口
 * 6 项内容：格局详解库 10 + 塔罗学习 19 + 占星百科 27 + 国学典籍 10 + 育儿占星 12 + 星历表 1
 */
export type {
  CContentRecord,
  CAnyContentRecord,
  CAnyExtra,
  CContentCategory,
  CPatternExtendedExtra,
  CTarotCurriculumExtra,
  CAstrologyTermsExtra,
  CClassicsGuideExtra,
  CParentingAstrologyExtra,
  CEphemerisExtra,
} from './types';

export { PATTERN_EXTENDED, PATTERN_EXTENDED_COUNT } from './pattern-extended.data';
export { TAROT_CURRICULUM, TAROT_CURRICULUM_COUNT } from './tarot-curriculum.data';
export { ASTROLOGY_TERMS, ASTROLOGY_TERMS_COUNT } from './astrology-terms.data';
export { CLASSICS_GUIDES, CLASSICS_GUIDES_COUNT } from './classics-guides.data';
export { PARENTING_ASTROLOGY, PARENTING_ASTROLOGY_COUNT } from './parenting-astrology.data';
export { EPHEMERIS_2026, EPHEMERIS_2026_COUNT } from './ephemeris-2026.data';

import { PATTERN_EXTENDED_COUNT } from './pattern-extended.data';
import { TAROT_CURRICULUM_COUNT } from './tarot-curriculum.data';
import { ASTROLOGY_TERMS_COUNT } from './astrology-terms.data';
import { CLASSICS_GUIDES_COUNT } from './classics-guides.data';
import { PARENTING_ASTROLOGY_COUNT } from './parenting-astrology.data';
import { EPHEMERIS_2026_COUNT } from './ephemeris-2026.data';

/** C 域记录总数 = 10 + 19 + 27 + 10 + 12 + 1 = 79 */
export const C_DOMAIN_COUNT =
  PATTERN_EXTENDED_COUNT +
  TAROT_CURRICULUM_COUNT +
  ASTROLOGY_TERMS_COUNT +
  CLASSICS_GUIDES_COUNT +
  PARENTING_ASTROLOGY_COUNT +
  EPHEMERIS_2026_COUNT;
