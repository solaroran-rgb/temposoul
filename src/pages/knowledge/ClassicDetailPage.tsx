// ============================================================
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ChapterToc } from '@/components/knowledge/ChapterToc';
import { ArticleBlocks } from '@/components/knowledge/ArticleBlocks';
import { CitationBlock } from '@/components/knowledge/CitationBlock';
import { FooterDisclaimer } from '@/components/knowledge/FooterDisclaimer';
import { getClassicsArticles } from '@/i18n/body/content';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView } from '@/lib/analytics';
import { useAsyncPage } from '@/hooks/useAsyncPage';

export default function ClassicDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const article = getClassicsArticles().find((item) => item.slug === slug);
  const [pageState] = useAsyncPage(article ? [article] : [], Boolean(article));

  useEffect(() => { trackPageView(`/knowledge/classics/${slug ?? ''}`); }, [slug]);

  if (pageState === 'loading') {
    return (
      <div className="classic-detail">
        <PageTopbar title="典籍详情" onBack={() => window.history.back()} />
        <main><div className="skeleton classic-detail__title-skeleton" /></main>
      </div>
    );
  }
  if (pageState === 'ok-empty' || !article) {
    return (
      <div className="classic-detail">
        <PageTopbar title="典籍详情" onBack={() => window.history.back()} />
        <main className="classic-detail__empty"><p>未找到该典籍。</p><Link to="/knowledge/classics">返回列表</Link></main>
      </div>
    );
  }
  return (
    <div className="classic-detail">
      <PageTopbar title="典籍详情" onBack={() => window.history.back()} />
      <main className="classic-detail__main">
        <article>
          <header>
            <h1 className="classic-detail__title">{guardText(article.title)}</h1>
            <p>{article.metaDescription}</p>
          </header>
          <ChapterToc sections={article.sections} />
          {/* ArticleBlocks 根据 heading 【原文】/【注】自动加前缀样式, 不新增块类型 */}
          <ArticleBlocks sections={article.sections} />
          <CitationBlock sources={article.sources} />
          <FooterDisclaimer disclaimer={article.disclaimer} sources={article.sources} />
        </article>
        <PrivacyHint />
      </main>
    </div>
  );
}
