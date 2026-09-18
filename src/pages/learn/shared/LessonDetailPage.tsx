/**
 * 入门教程通用详情页组件（按 records + :chapter 渲染单章）
 * :chapter 与记录 slug 末段（如 /learn/ziwei/ziwei-stars 末段 ziwei-stars）比对。
 */
import { Link, Navigate, useParams } from 'react-router-dom';
import type { LessonRecord } from '@/data/content/learn';
import { LEARN_DISCLAIMER } from '@/data/content/learn';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './learn.css';

export interface LessonDetailPageProps {
  records: readonly LessonRecord[];
  courseTitle: string;
  basePath: string;
}

export default function LessonDetailPage({
  records,
  courseTitle,
  basePath,
}: LessonDetailPageProps) {
  const { chapter = '' } = useParams();
  const sorted = [...records].sort((a, b) => a.order - b.order);
  const record = sorted.find((r) => r.slug.endsWith(`/${chapter}`) || r.slug === chapter);

  useDocumentMeta({ title: record ? `${record.title} · ${courseTitle}` : courseTitle });

  if (!record) return <Navigate to={basePath} replace />;

  const idx = sorted.findIndex((r) => r.id === record.id);
  const prev = idx > 0 ? sorted[idx - 1] : undefined;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : undefined;

  return (
    <div className="learn-page">
      <nav className="learn-crumb">
        <Link to="/">首页</Link> / <Link to={basePath}>{courseTitle}</Link> /{' '}
        <span>第 {record.order} 章</span>
      </nav>
      <article className="learn-article">
        <header>
          <h1>{record.title}</h1>
          <p className="learn-article__summary">{record.summary}</p>
          <span className="learn-badge">AI 生成 · 待专家审计</span>
        </header>

        {record.sections.map((s, i) => (
          <section key={i} className="learn-section">
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
          </section>
        ))}

        <section className="learn-takeaways">
          <h2>本章要点</h2>
          <ul>
            {record.takeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>

        <nav className="learn-nav">
          {prev ? <Link to={prev.slug}>← {prev.title}</Link> : <span />}
          {next && <Link to={next.slug}>{next.title} →</Link>}
        </nav>

        <footer className="learn-meta">
          <p>{LEARN_DISCLAIMER}</p>
          <p>
            来源：{record.source.classic} · {record.source.chapter}（更新于 {record.updatedAt}）
          </p>
        </footer>
      </article>
    </div>
  );
}
