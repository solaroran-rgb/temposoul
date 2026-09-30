// ============================================================
import { useEffect, useMemo, useState } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { getNewsArticles, getNewsMeta } from '@/i18n/body/content';
import { trackPageView } from '@/lib/analytics';
import { useAsyncPage } from '@/hooks/useAsyncPage';
import './NewsListPage.css';

const FILTERS = [
  { value: 'all', label: '全部' },
  { value: 'astrology', label: '星象' },
  { value: 'culture', label: '文化' },
  { value: 'nameology', label: '姓名学' },
] as const;

type FilterValue = typeof FILTERS[number]['value'];

export default function NewsListPage() {
  const [active, setActive] = useState<FilterValue>('all');
  const [pageState, retry] = useAsyncPage(getNewsArticles(), true);

  useEffect(() => { trackPageView('/news'); }, []);

  const filtered = useMemo(() => {
    const sorted = [...getNewsArticles()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return active === 'all' ? sorted : sorted.filter((a) => (a.category as string) === active);
  }, [active]);

  const renderContent = () => {
    if (pageState === 'loading') {
      return <div className="news-list__skeleton">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton news-card-skeleton" />)}</div>;
    }
    if (pageState === 'error') return <div className="news-list__error">加载失败。<button onClick={retry}>重试</button></div>;
    if (filtered.length === 0) return <div className="news-list__empty">该分类下暂无资讯。</div>;
    return (
      <div className="news-list__cards">
        {filtered.map((article) => (
          <a key={article.slug} href={`/news/${article.slug}`} className="news-card">
            <div className="news-card__header">
              <span className="news-card__category">{article.category}</span>
              <time dateTime={article.updatedAt}>{article.updatedAt.replaceAll('-', '.')}</time>
            </div>
            <h2 className="news-card__title">{article.title}</h2>
            <p className="news-card__description">{article.metaDescription}</p>
            <div className="news-card__footer">
              <ConfidenceBadge confidence={article.confidence} />
              <span>{article.sources[0]?.text ?? '内容编辑组'}</span>
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="news-list">
      <PageTopbar title={getNewsMeta().listTitle} onBack={() => window.history.back()} />
      <main className="news-list__main">
        <p className="news-list__description">{getNewsMeta().listDescription}</p>
        <div className="news-list__filters" role="tablist">
          {FILTERS.map((f) => (
            <button key={f.value} type="button" role="tab" aria-selected={active === f.value}
              className={`news-list__filter${active === f.value ? ' news-list__filter--active' : ''}`}
              onClick={() => setActive(f.value)}>
              {f.label}
            </button>
          ))}
        </div>
        {renderContent()}
        <PrivacyHint />
      </main>
    </div>
  );
}
