/**
 * 线程 C · SEO 内容详情页
 * 路由：/seo/:slug
 */
import { Link, Navigate, useParams } from 'react-router-dom';
import { getSeoArticle, listSeoByTopic, SEO_TOPIC_META } from '@/data/content/seo50';
import { useDocumentMeta } from '@/lib/use-document-meta';
import './seo.css';

export default function SeoDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getSeoArticle(slug) : undefined;

  useDocumentMeta({ title: article ? `${article.title} | 命律` : '文章未找到' });

  if (!article) {
    return <Navigate to="/seo" replace />;
  }

  const topic = SEO_TOPIC_META[article.topic];
  const related = listSeoByTopic(article.topic)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 4);

  return (
    <div className="seo-page">
      <nav className="seo-crumb">
        <Link to="/">首页</Link> / <Link to="/seo">SEO 科普</Link> /{' '}
        <Link to={topic.path}>{topic.label}</Link> / <span>{article.title}</span>
      </nav>

      <article className="seo-article">
        <header>
          <h1>{article.title}</h1>
          <p className="seo-desc">{article.summary}</p>
        </header>

        {article.blocks.map((b, i) => {
          if (b.kind === 'paragraph') {
            return (
              <section className="seo-section" key={i}>
                <p>{b.text}</p>
              </section>
            );
          }
          if (b.kind === 'list') {
            return (
              <section className="seo-section" key={i}>
                <ul>
                  {b.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              </section>
            );
          }
          return (
            <div className="seo-callout" key={i}>
              {b.text}
            </div>
          );
        })}

        <footer className="seo-meta">
          <p>
            仅供娱乐与自我觉察，不构成专业建议；不预测命运、不做宿命断言。AI 生成待专家审计。来源：
            {article.sourceRef}（{article.updatedAt}）
          </p>
        </footer>
      </article>

      {related.length > 0 && (
        <section className="seo-related">
          <h2>同主题阅读</h2>
          <ul>
            {related.map((r) => (
              <li key={r.id}>
                <Link to={`/seo/${r.slug}`}>{r.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
