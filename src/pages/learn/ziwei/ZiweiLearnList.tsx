/**
 * 学习中心主入口（/learn/ziwei）：服务端优先 + 静态降级。
 *
 * - 顶部「课程目录」：GET /api/v1/courses 渲染 4 门课程卡片；
 *   徽标/CTA 规则：
 *     access=free & priceCents=0 → 「免费」；
 *     access=member → 「会员专享」，未登录卡片改为「登录查看」跳 /login；
 *     无既有路由的课程（bazi/tarot/astro）→ 「敬请期待」，不可点击（路由表冻结，不新增）。
 *   目录失败 → 隐藏目录并显示降级提示，不白屏。
 * - 下方「当前课程章节」：GET /api/v1/courses/ziwei-101 课时清单；
 *   失败 → 降级回本地静态 ZIWEI_TUTORIAL 渲染。
 *
 * DivLearnList 仍走共享 LessonListPage 静态数据，本页不改动共享组件，保证向后兼容。
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { fetchCourses, fetchCourseDetail, type CourseSummary } from '@/lib/learn/api';
import { ZIWEI_TUTORIAL } from '@/data/content/learn';
import '../shared/learn.css';

/** 服务端课程 slug → 前端既有路由（路由表冻结：仅 ziwei-101 有对应页面）。 */
const COURSE_ROUTES: Record<string, string> = {
  'ziwei-101': '/learn/ziwei',
};

function levelLabel(level: string): string {
  if (level === 'beginner') return '入门';
  if (level === 'elementary') return '进阶';
  return level;
}

/** 单张课程卡片：free / member / 未登录 / 无路由 四种组合各自有明确行为。 */
function CourseCard({ course }: { course: CourseSummary }) {
  const { user } = useAuth();
  const route = COURSE_ROUTES[course.slug];
  const isFree = course.access === 'free' && course.priceCents === 0;
  const isMember = course.access === 'member';
  const needLogin = isMember && !user;
  const clickable = Boolean(route) && !needLogin;

  const body = (
    <>
      <div className="learn-course__badges">
        {isFree && <span className="learn-tag learn-tag--free">免费</span>}
        {isMember && <span className="learn-tag learn-tag--member">会员专享</span>}
        {!route && <span className="learn-tag learn-tag--soon">敬请期待</span>}
      </div>
      <h3>{course.title}</h3>
      <p>{course.desc}</p>
      <span className="learn-card__meta">
        {levelLabel(course.level)} · {course.lessonCount} 章 · 约 {course.totalReadMinutes} 分钟
      </span>
      {needLogin && <span className="learn-course__cta">登录查看 →</span>}
    </>
  );

  if (clickable) {
    return (
      <Link to={route} className="learn-card learn-course">
        {body}
      </Link>
    );
  }
  if (needLogin) {
    return (
      <Link to="/login" className="learn-card learn-course">
        {body}
      </Link>
    );
  }
  return <div className="learn-card learn-course is-static">{body}</div>;
}

export default function ZiweiLearnList() {
  useDocumentMeta({ title: '学习中心 · 紫微入门' });

  const [courses, setCourses] = useState<CourseSummary[] | null>(null);
  const [catalogError, setCatalogError] = useState(false);
  const [lessonsError, setLessonsError] = useState(false);
  /** 服务端课时清单；null = 未拿到（走静态降级渲染）。 */
  const [serverLessons, setServerLessons] = useState<
    { id: string; slug: string; title: string; summary: string; order: number; level: string; readMinutes: number }[] | null
  >(null);

  useEffect(() => {
    let alive = true;
    fetchCourses().then((res) => {
      if (!alive) return;
      if (res.ok && Array.isArray(res.data.items)) setCourses(res.data.items);
      else setCatalogError(true);
    });
    fetchCourseDetail('ziwei-101').then((res) => {
      if (!alive) return;
      if (res.ok && Array.isArray(res.data.lessons)) setServerLessons(res.data.lessons);
      else setLessonsError(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  /** 章节统一视图模型：服务端课时与静态 ZIWEI_TUTORIAL 同构。 */
  const chapters = useMemo(() => {
    const toHref = (slug: string) => `/learn/ziwei/${slug.split('/').pop() ?? slug}`;
    if (serverLessons) {
      return [...serverLessons]
        .sort((a, b) => a.order - b.order)
        .map((l) => ({
          key: l.id,
          title: l.title,
          summary: l.summary,
          order: l.order,
          level: l.level,
          readMinutes: l.readMinutes,
          href: toHref(l.slug),
        }));
    }
    return [...ZIWEI_TUTORIAL]
      .sort((a, b) => a.order - b.order)
      .map((r) => ({
        key: r.id,
        title: r.title,
        summary: r.summary,
        order: r.order,
        level: r.level,
        readMinutes: r.readMinutes,
        href: toHref(r.slug),
      }));
  }, [serverLessons]);

  return (
    <div className="learn-page">
      <header className="learn-hero">
        <h1>学习中心 · 紫微入门</h1>
        <p className="learn-desc">命理文化入门课程：星曜、十二宫、命盘结构、四化、大运与实操。</p>
        <p className="learn-note">仅供娱乐与自我觉察，不构成对个人命运的断言或任何专业建议。</p>
        <span className="learn-badge">AI 生成 · 待专家审计</span>
      </header>

      <section className="learn-catalog">
        <h2 className="learn-section-title">课程目录</h2>
        {catalogError && <p className="learn-note">课程目录暂不可用，请稍后再试。</p>}
        {courses && courses.length > 0 && (
          <div className="learn-catalog-grid">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="learn-section-title">当前课程章节 · 紫微入门教程</h2>
        {lessonsError && <p className="learn-note">在线课时暂不可用，已展示本地章节内容。</p>}
        <div className="learn-grid">
          {chapters.map((ch) => (
            <Link key={ch.key} to={ch.href} className="learn-card">
              <span className="learn-card__no">第 {ch.order} 章</span>
              <h3>{ch.title}</h3>
              <p>{ch.summary}</p>
              <span className="learn-card__meta">
                {levelLabel(ch.level)} · 约 {ch.readMinutes} 分钟
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="learn-meta">
        <p>本课程为命理文化入门参考，内容由 AI 生成、待专家审计。</p>
      </footer>
    </div>
  );
}
