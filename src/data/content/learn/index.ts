/**
 * 入门教程域（learn）聚合出口
 * 紫微入门 6 章 + 占卜入门 4 章 = 10 章
 */
export type {
  LessonRecord,
  LearnSection,
  LearnLevel,
  LearnDomainNote,
  LearnCompliance,
  LearnSource,
} from './types';
export { LEARN_DISCLAIMER } from './types';

export { ZIWEI_TUTORIAL, ZIWEI_TUTORIAL_COUNT } from './ziwei-tutorial.data';
export { DIV_TUTORIAL, DIV_TUTORIAL_COUNT } from './divination-tutorial.data';

import { ZIWEI_TUTORIAL_COUNT } from './ziwei-tutorial.data';
import { DIV_TUTORIAL_COUNT } from './divination-tutorial.data';

/** learn 域章节总数 = 6 + 4 = 10 */
export const LEARN_TOTAL_CHAPTERS = ZIWEI_TUTORIAL_COUNT + DIV_TUTORIAL_COUNT;
