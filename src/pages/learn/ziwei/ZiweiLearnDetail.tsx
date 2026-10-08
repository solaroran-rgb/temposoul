/**
 * 紫微入门教程 · 章节详情页（/learn/ziwei/:chapter）：服务端优先 + 静态降级。
 *
 * - 成功：GET /api/v1/lessons/:chapter（支持 slug）渲染服务端 sections/takeaways/disclaimer；
 *   lessons 标记 gated & entitlementRequired 且未登录 → 显示「登录查看」门，不渲染正文。
 * - 失败/404：回退本地静态 ZIWEI_TUTORIAL 按 slug 查找（复用共享 LessonDetailPage，
 *   该组件对 DivLearnDetail 的行为完全不变）；找不到 → 「未找到该课时」空态，可返回。
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth/AuthContext';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { fetchLesson, type LessonDetail } from '@/lib/learn/api';
import { ZIWEI_TUTORIAL, LEARN_DISCLAIMER } from '@/data/content/learn';
import LessonDetailPage from '../shared/LessonDetailPage';
import '../shared/learn.css';

export default function ZiweiLearnDetail() {
  const { chapter = '' } = useParams();
  const { user } = useAuth();

  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setLesson(null);
    setFailed(false);
    fetchLesson(chapter).then((res) => {
      if (!alive) return;
      if (res.ok) setLesson(res.data);
      else setFailed(true);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [chapter]);

  /** 静态降级：仅在服务端失败后才去本地词库按 slug 找。 */
  const fallback = useMemo(
    () =>
      failed
        ? ZIWEI_TUTORIAL.find((r) => r.slug === chapter || r.slug.endsWith(`/${chapter}`))
        : undefined,
    [failed, chapter],
  );

  useDocumentMeta({
    title: lesson
      ? `${lesson.title} · 紫微入门`
      : fallback
        ? `${fallback.title} · 紫微入门`
        : '紫微入门',
  });

  if (loading) {
    return (
      <div className="learn-page">
        <p className="learn-note">正在加载本章内容…</p>
      </div>
    );
  }

  // 服务端正文（含 member 门控判断）
  if (lesson) {
    if (lesson.gated && lesson.entitlementRequired && !user) {
      return (
        <div className="learn-page">
          <div className="learn-gate">
            <p>本章为会员专享内容，登录后即可阅读。</p>
            <Link to="/login" className="learn-course__cta">
              登录查看 →
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="learn-page">
        <nav className="learn-crumb">
          <Link to="/">首页</Link> / <Link to="/learn/ziwei">紫微入门教程</Link> /{' '}
          <span>第 {lesson.order} 章</span>
        </nav>
        <article className="learn-article">
          <header>
            <h1>{lesson.title}</h1>
            <p className="learn-article__summary">{lesson.summary}</p>
            <span className="learn-badge">AI 生成 · 待专家审计</span>
          </header>

          {lesson.sections.map((s, i) => (
            <section key={i} className="learn-section">
              <h2>{s.heading}</h2>
              {s.paragraphs.map((p, j) => (
                <p key={j}>{p}</p>
              ))}
            </section>
          ))}

          {lesson.takeaways.length > 0 && (
            <section className="learn-takeaways">
              <h2>本章要点</h2>
              <ul>
                {lesson.takeaways.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </section>
          )}

          <nav className="learn-nav">
            <Link to="/learn/ziwei">← 返回课程目录</Link>
          </nav>

          <footer className="learn-meta">
            <p>{lesson.disclaimer || LEARN_DISCLAIMER}</p>
            <p>更新于 {lesson.updatedAt}</p>
          </footer>
        </article>
      </div>
    );
  }

  // 静态降级：本地 ZIWEI_TUTORIAL 命中 → 走共享详情组件（DivLearnDetail 同款渲染，组件零改动）
  if (fallback) {
    return (
      <LessonDetailPage records={ZIWEI_TUTORIAL} courseTitle="紫微入门教程" basePath="/learn/ziwei" />
    );
  }

  // 空态：服务端失败且本地也找不到该章节
  return (
    <div className="learn-page">
      <div className="learn-gate">
        <p>未找到该课时。</p>
        <Link to="/learn/ziwei">← 返回课程目录</Link>
      </div>
    </div>
  );
}
