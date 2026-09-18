/**
 * 合婚报告库 · 详情页
 * :id 与记录 slug 末段（如 /reports/hehun/day-master）比对。
 */
import { Link, Navigate, useParams } from 'react-router-dom';
import { HEHUN_REPORTS, HEHUN_DISCLAIMER } from '@/data/content/hehun';
import { useDocumentMeta } from '@/lib/use-document-meta';
import '../../learn/shared/learn.css';

export default function HehunDetail() {
  const { id = '' } = useParams();
  const sorted = [...HEHUN_REPORTS].sort((a, b) => a.order - b.order);
  const record = sorted.find((r) => r.slug.endsWith(`/${id}`) || r.slug === id);

  useDocumentMeta({ title: record ? `${record.title} · 合婚报告` : '合婚报告' });

  if (!record) return <Navigate to="/reports/hehun" replace />;

  const idx = sorted.findIndex((r) => r.id === record.id);
  const prev = idx > 0 ? sorted[idx - 1] : undefined;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : undefined;

  return (
    <div className="learn-page">
      <nav className="learn-crumb">
        <Link to="/">首页</Link> / <Link to="/reports/hehun">合婚报告</Link> /{' '}
        <span>{record.title}</span>
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
          <h2>本篇要点</h2>
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
          <p>{HEHUN_DISCLAIMER}</p>
          <p>
            来源：{record.source.classic} · {record.source.topic}（更新于 {record.updatedAt}）
          </p>
        </footer>
      </article>
    </div>
  );
}
