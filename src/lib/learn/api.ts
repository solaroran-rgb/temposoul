/**
 * 学习中心端点消费层（服务端契约已冻结，按此消费）：
 * - GET /api/v1/courses            → { items: CourseSummary[], cursor, total }
 * - GET /api/v1/courses/:id        → { ...summary, lessons: CourseLessonSummary[], disclaimer }
 * - GET /api/v1/lessons/:id        → LessonDetail（:id 支持 lesson id 或 slug）
 *
 * 本批 4 门课（bazi-101 / ziwei-101 / tarot-101 / astro-201）全 free、priceCents=0；
 * 类型层仍保留 access=member / gated / entitlementRequired 分支供前端判断登录态。
 */
import { fetchJson, type FetchResult } from '@/lib/http/fetch-json';

export type CourseAccess = 'free' | 'member' | (string & {});

export interface CourseSummary {
  id: string;
  slug: string;
  title: string;
  desc: string;
  level: string;
  access: CourseAccess;
  priceCents: number;
  currency: string;
  lessonCount: number;
  totalReadMinutes: number;
  aiPendingReview: boolean;
  updatedAt: string;
}

export interface CoursesResponse {
  items: CourseSummary[];
  cursor: string | null;
  total: number;
}

export interface CourseLessonSummary {
  id: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  level: string;
  readMinutes: number;
  sectionCount: number;
  updatedAt: string;
}

export interface CourseDetail extends CourseSummary {
  lessons: CourseLessonSummary[];
  disclaimer: string;
}

export interface LessonSection {
  heading: string;
  paragraphs: string[];
}

export interface LessonDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  level: string;
  readMinutes: number;
  sectionCount: number;
  updatedAt: string;
  sections: LessonSection[];
  takeaways: string[];
  compliance: unknown;
  source: unknown;
  disclaimer: string;
  courseId: string;
  gated: boolean;
  entitlementRequired: boolean;
}

export function fetchCourses(timeoutMs = 8000): Promise<FetchResult<CoursesResponse>> {
  return fetchJson<CoursesResponse>('/api/v1/courses', { timeoutMs });
}

export function fetchCourseDetail(idOrSlug: string, timeoutMs = 8000): Promise<FetchResult<CourseDetail>> {
  return fetchJson<CourseDetail>(`/api/v1/courses/${encodeURIComponent(idOrSlug)}`, { timeoutMs });
}

export function fetchLesson(idOrSlug: string, timeoutMs = 8000): Promise<FetchResult<LessonDetail>> {
  return fetchJson<LessonDetail>(`/api/v1/lessons/${encodeURIComponent(idOrSlug)}`, { timeoutMs });
}
