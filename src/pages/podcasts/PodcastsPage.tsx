//  共享 hook: useAsyncPage + useCategoryFilter (架构升级: DRY)
// ============================================================
import { useEffect, useMemo, useState, useCallback } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { PodcastCard } from '@/components/podcasts/PodcastCard';
import { AudioPlayer } from '@/components/podcasts/AudioPlayer';
import { podcasts, PODCAST_CATEGORIES, type PodcastCategory, type PodcastEpisode } from '@/data/podcasts';
import { trackPageView, trackEvent } from '@/lib/analytics';
import './PodcastsPage.css';

// ---- 共享 hook: 六态机 (升级点: 可在所有页面复用) ----
type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

function useAsyncPage<T>(dataSource: T[], ready: boolean): [PageState, () => void] {
  const [state, setState] = useState<PageState>('loading');
  useEffect(() => {
    const t = window.setTimeout(() => {
      setState(dataSource.length > 0 ? 'ok' : 'ok-empty');
    }, 0);
    return () => window.clearTimeout(t);
  }, [dataSource]);
  const retry = useCallback(() => {
    setState('loading');
    window.setTimeout(() => setState(dataSource.length > 0 ? 'ok' : 'ok-empty'), 0);
  }, [dataSource]);
  return [ready ? state : 'ok-empty', retry];
}

function useCategoryFilter<T>(items: T[], active: string, picker: (item: T) => boolean) {
  return useMemo(() => {
    if (active === 'all') return [...items];
    return items.filter(picker);
  }, [items, active, picker]);
}

export default function PodcastsPage() {
  const [activeCategory, setActiveCategory] = useState<PodcastCategory | 'all'>('all');
  const [activeEpisode, setActiveEpisode] = useState<PodcastEpisode | null>(null);
  const [pageState, retry] = useAsyncPage(podcasts, true);

  useEffect(() => {
    trackPageView('/podcasts');
  }, []);

  const filtered = useCategoryFilter(
    podcasts,
    activeCategory,
    (ep) => ep.category === activeCategory,
  ).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const handleCategorySwitch = (cat: PodcastCategory | 'all') => {
    if (cat === activeCategory) return;
    trackEvent('podcast_category_switch', { category: cat });
    setActiveCategory(cat);
    setActiveEpisode(null);
  };

  const renderContent = () => {
    if (pageState === 'loading') {
      return (
        <div className="podcasts-page__skeleton">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton podcast-card-skeleton" />)}
        </div>
      );
    }
    if (pageState === 'error') {
      return <div className="podcasts-page__error">加载失败。<button onClick={retry}>重试</button></div>;
    }
    if (filtered.length === 0) {
      return <div className="podcasts-page__empty">该分类下暂无节目。</div>;
    }
    return (
      <div className="podcasts-page__list">
        {filtered.map((ep) => (
          <PodcastCard key={ep.id} episode={ep} active={activeEpisode?.id === ep.id} onPlay={setActiveEpisode} />
        ))}
      </div>
    );
  };

  return (
    <div className="podcasts-page">
      <PageTopbar title="命理播客" onBack={() => window.history.back()} />
      <main className="podcasts-page__main">
        <div className="podcasts-page__tabs" role="tablist" aria-label="播客分类">
          {PODCAST_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              role="tab"
              aria-selected={activeCategory === c.value}
              className={`podcasts-page__tab${activeCategory === c.value ? ' podcasts-page__tab--active' : ''}`}
              onClick={() => handleCategorySwitch(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <AudioPlayer episode={activeEpisode} />
        {renderContent()}
        <PrivacyHint />
      </main>
    </div>
  );
}
