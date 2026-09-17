// ============================================================
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ArticleToc } from '@/components/knowledge/ArticleToc';
import { ArticleBody } from '@/components/knowledge/ArticleBody';
import { FooterDisclaimer } from '@/components/knowledge/FooterDisclaimer';
import { newsArticles } from '@/data/news';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView } from '@/lib/analytics';
import { useAsyncPage } from '@/hooks/useAsyncPage';
import './NewsDetailPage.css';

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = newsArticles.find((item) => item.slug === slug);
  const [pageState] = useAsyncPage(article ? [article] : [], Boolean(article));

  useEffect(() => { trackPageView(`/news/${slug ?? ''}`); }, [slug]);

  if (pageState === 'loading') {
    return (
      <div className="news-detail">
        <PageTopbar title="资讯详情" onBack={() => window.history.back()} />
        <main className="news-detail__main">
          <div className="skeleton news-detail__title-skeleton" />
          <div className="skeleton news-detail__body-skeleton" />
        </main>
      </div>
    );
  }
  if (pageState === 'ok-empty' || !article) {
    return (
      <div className="news-detail">
        <PageTopbar title="资讯详情" onBack={() => window.history.back()} />
        <main className="news-detail__main">
          <div className="news-detail__empty"><p>未找到该资讯。</p><Link to="/news">返回列表</Link></div>
        </main>
      </div>
    );
  }
  return (
    <div className="news-detail">
      <PageTopbar title="资讯详情" onBack={() => window.history.back()} />
      <main className="news-detail__main">
        <article>
          <header>
            <div className="news-detail__meta">
              <span>{article.category}</span>
              <time dateTime={article.updatedAt}>{article.updatedAt.replaceAll('-', '.')}</time>
            </div>
            <h1>{guardText(article.title)}</h1>
            <p>{article.metaDescription}</p>
          </header>
          <ArticleToc items={article.sections.map((s) => ({ id: s.heading, heading: s.heading, level: s.level }))} />
          <ArticleBody sections={article.sections} />
          <FooterDisclaimer disclaimer={article.disclaimer} sources={article.sources} />
        </article>
        <PrivacyHint />
      </main>
    </div>
  );
}
