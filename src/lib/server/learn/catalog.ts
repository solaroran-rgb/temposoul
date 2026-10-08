/**
 * N-14 课程目录（服务端权威真值源）
 *
 * 课程（对齐 B 线 N-14，共 4 门，id 即 B 线课程 id）：
 *   - bazi-101    八字入门
 *   - ziwei-101    紫微斗数入门
 *   - tarot-101    塔罗入门
 *   - astro-201    西洋占星入门
 *
 * 纪律：
 *   - 价格/权益状态只从服务端读，前端不得硬编码；
 *   - 课时正文复用 src/data/content/learn（与前端同源，单一真值源）；
 *   - 反假红线：当前全部课程 access=free / priceCents=0，未开售前不虚构价格；
 *   - 占卜入门（divination-tutorial.data.ts）不在 B 线 4 门内，已从本目录移除，
 *     文件保留供前端静态降级页使用。
 */

import { ZIWEI_TUTORIAL } from '../../../data/content/learn/ziwei-tutorial.data';
import { BAZI_TUTORIAL } from '../../../data/content/learn/bazi-tutorial.data';
import { TAROT_TUTORIAL } from '../../../data/content/learn/tarot-tutorial.data';
import { ASTRO_TUTORIAL } from '../../../data/content/learn/astro-tutorial.data';
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
    id: 'bazi-101',
    slug: 'bazi-101',
    title: '八字入门',
    desc: '四柱、干支、五行十神到用神，五章建立子平命理的文化框架与理性边界。',
    level: 'beginner',
    access: 'free',
    priceCents: 0,
    currency: 'CNY',
    lessons: BAZI_TUTORIAL,
    aiPendingReview: true,
  },
  {
    id: 'ziwei-101',
    slug: 'ziwei-101',
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
    id: 'tarot-101',
    slug: 'tarot-101',
    title: '塔罗入门',
    desc: '七十八张牌的构成、大小阿卡那与牌阵解读，五章把塔罗用成自我对话的镜子。',
    level: 'beginner',
    access: 'free',
    priceCents: 0,
    currency: 'CNY',
    lessons: TAROT_TUTORIAL,
    aiPendingReview: true,
  },
  {
    id: 'astro-201',
    slug: 'astro-201',
    title: '西洋占星入门',
    desc: '星盘、黄道十二宫、行星到宫位相位，五章读懂一张本命盘的大意。',
    level: 'beginner',
    access: 'free',
    priceCents: 0,
    currency: 'CNY',
    lessons: ASTRO_TUTORIAL,
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
