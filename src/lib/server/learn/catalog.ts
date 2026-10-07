/**
 * N-14 课程目录（服务端权威真值源）
 *
 * 纪律：
 *   - 价格/权益状态只从服务端读，前端不得硬编码；
 *   - 课时正文复用 src/data/content/learn（与前端同源，单一真值源）；
 *   - 反假红线：当前全部课程 access=free / priceCents=0，未开售前不虚构价格。
 */

import { ZIWEI_TUTORIAL } from '../../../data/content/learn/ziwei-tutorial.data';
import { DIV_TUTORIAL } from '../../../data/content/learn/divination-tutorial.data';
import { LEARN_DISCLAIMER, type LessonRecord } from '../../../data/content/learn/types';

export type CourseAccess = 'free' | 'member';
export type LearnLevel = 'beginner' | 'elementary';

export interface CourseMeta {
  id: string;
  slug: string;
  title: string;
  desc: string;
  level: LearnLevel;
  access: CourseAccess;
  /** 价格单位：分；free 恒为 0 */
  priceCents: number;
  currency: 'CNY';
  lessons: readonly LessonRecord[];
  aiPendingReview: true;
}

export const COURSES: readonly CourseMeta[] = [
  {
    id: 'course-ziwei',
    slug: 'ziwei',
    title: '紫微斗数入门',
    desc: '从十四主星、十二宫到四化与大运，六章建立读盘的基本框架。',
    level: 'beginner',
    access: 'free',
    priceCents: 0,
    currency: 'CNY',
    lessons: ZIWEI_TUTORIAL,
    aiPendingReview: true,
  },
  {
    id: 'course-divination',
    slug: 'divination',
    title: '占卜入门',
    desc: '六爻、梅花与塔罗的入门路径，四章讲清起卦、取象与解读边界。',
    level: 'beginner',
    access: 'free',
    priceCents: 0,
    currency: 'CNY',
    lessons: DIV_TUTORIAL,
    aiPendingReview: true,
  },
];

export function findCourse(idOrSlug: string): CourseMeta | undefined {
  return COURSES.find(c => c.id === idOrSlug || c.slug === idOrSlug);
}

export function findLesson(idOrSlug: string): { course: CourseMeta; lesson: LessonRecord } | undefined {
  for (const course of COURSES) {
    for (const lesson of course.lessons) {
      if (lesson.id === idOrSlug || lesson.slug === idOrSlug) return { course, lesson };
    }
  }
  return undefined;
}

export function sortedLessons(course: CourseMeta, level?: string | null): readonly LessonRecord[] {
  return [...course.lessons]
    .filter(l => !level || l.level === level)
    .sort((a, b) => a.order - b.order);
}

export function toCourseSummary(c: CourseMeta) {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    desc: c.desc,
    level: c.level,
    access: c.access,
    priceCents: c.priceCents,
    currency: c.currency,
    lessonCount: c.lessons.length,
    totalReadMinutes: c.lessons.reduce((s, l) => s + l.readMinutes, 0),
    aiPendingReview: c.aiPendingReview,
    updatedAt: c.lessons.reduce(
      (latest, l) => (l.updatedAt > latest ? l.updatedAt : latest),
      c.lessons[0]?.updatedAt ?? ''
    ),
  };
}

export function toLessonListItem(l: LessonRecord) {
  return {
    id: l.id,
    slug: l.slug,
    title: l.title,
    summary: l.summary,
    order: l.order,
    level: l.level,
    readMinutes: l.readMinutes,
    sectionCount: l.sections.length,
    updatedAt: l.updatedAt,
  };
}

export function toLessonDetail(l: LessonRecord) {
  return {
    ...toLessonListItem(l),
    sections: l.sections,
    takeaways: l.takeaways,
    compliance: l.compliance,
    source: l.source,
    disclaimer: LEARN_DISCLAIMER,
  };
}

/** keyset 分页（禁 OFFSET）：cursor = 上一页最后一项 id */
export function keysetSlice<T extends { id: string }>(
  sorted: readonly T[],
  cursor: string,
  limit: number
): { items: T[]; nextCursor: string | null } {
  const start = cursor ? sorted.findIndex(x => x.id === cursor) + 1 : 0;
  const slice = sorted.slice(start, start + limit);
  const last = slice[slice.length - 1];
  return {
    items: slice,
    nextCursor: start + limit < sorted.length && last ? last.id : null,
  };
}
