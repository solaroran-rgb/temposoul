// ============================================================
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { CLASSICS_META } from '@/data/classics';
import { trackPageView } from '@/lib/analytics';
import { useAsyncPage } from '@/hooks/useAsyncPage';
import './ClassicsListPage.css';

export default function ClassicsListPage() {
  const [pageState, retry] = useAsyncPage(CLASSICS_META as unknown as readonly object[], true);
  useEffect(() => { trackPageView('/knowledge/classics'); }, []);

  const renderContent = () => {
    if (pageState === 'loading') return <div className="classics-list__skeleton">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton classics-card-skeleton" />)}</div>;
    if (pageState === 'error') return <div className="classics-list__error">加载失败。<button onClick={retry}>重试</button></div>;
    if (pageState === 'ok-empty') return <div className="classics-list__empty">暂无典籍内容。</div>;
    return (
      <div className="classics-list__grid">
        {CLASSICS_META.map((c) => (
          <Link key={c.slug} to={`/knowledge/classics/${c.slug}`} className="classic-card">
            <h2 className="classic-card__title">{c.title}</h2>
            <p className="classic-card__author">{c.author} · {c.dynasty}</p>
            <p className="classic-card__description">{c.description}</p>
            <div className="classic-card__footer">
              <span>{c.chapterCount} 章</span>
              {!c.ready && <span className="classic-card__badge">整理中</span>}
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="classics-list">
      <PageTopbar title="国学典籍" onBack={() => window.history.back()} />
      <main className="classics-list__main">
        <p className="classics-list__intro">汇集中国传统文化核心典籍，提供原文选读、注释与学术背景。</p>
        {renderContent()}
        <PrivacyHint />
      </main>
    </div>
  );
}
