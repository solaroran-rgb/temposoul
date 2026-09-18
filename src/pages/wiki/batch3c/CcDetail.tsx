/**
 * C 域详情页（通用组件，按 kind + id 渲染）
 * id 匹配：路由 :id 为 slug 末段，与记录 seo.slug 末段比对
 */
import { Link, Navigate, useParams } from 'react-router-dom';
import { CC_KIND_META, type CcKind } from './registry';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './c3c.css';

export interface CcDetailProps {
  kind: CcKind;
}

export default function CcDetail({ kind }: CcDetailProps) {
  const { id = '' } = useParams();
  const meta = CC_KIND_META[kind];

  const record = meta.records.find(
    (r) => r.id.endsWith(`_${id}`) || r.seo.slug.endsWith(`/${id}`) || r.id === id,
  );

  useDocumentMeta({ title: record?.seo.title ?? meta.title });

  // 星历表是工具页，无详情路由，直接跳列表
  if (kind === 'c_ephemeris') {
    return <Navigate to={meta.listSlug} replace />;
  }

  if (!record) return <Navigate to={meta.listSlug} replace />;

  return (
    <div className="c3c-page">
      <nav className="c3c-crumb">
        <Link to="/">首页</Link> / <Link to={meta.listSlug}>{meta.title}</Link> /{' '}
        <span>{record.seo.title}</span>
      </nav>
      <article className="c3c-article">
        <header>
          <h1>{record.seo.title}</h1>
          <p className="c3c-desc">{record.seo.description}</p>
        </header>
        <section className="c3c-body">
          <p>{record.body.plain_reading}</p>
        </section>
        <section className="c3c-loop">
          <h2>解读参考</h2>
          <ul>
            <li>
              <strong>核心提示：</strong>
              {record.body.insight_loop.insight}
            </li>
            <li>
              <strong>成因：</strong>
              {record.body.insight_loop.cause}
            </li>
            <li>
              <strong>表现：</strong>
              {record.body.insight_loop.manifestation}
            </li>
            <li>
              <strong>注意：</strong>
              {record.body.insight_loop.risk}
            </li>
            <li>
              <strong>建议：</strong>
              {record.body.insight_loop.suggestion}
            </li>
            <li>
              <strong>行动：</strong>
              {record.body.insight_loop.action}
            </li>
          </ul>
        </section>
        <footer className="c3c-meta">
          <p>
            内容来源：{record.source.classic}·{record.source.chapter}
          </p>
          <p>本内容为命理文化参考维度，不构成吉凶断言与决策依据。</p>
        </footer>
      </article>
    </div>
  );
}
