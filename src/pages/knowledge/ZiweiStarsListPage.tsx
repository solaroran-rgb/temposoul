// src/pages/knowledge/ZiweiStarsListPage.tsx
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';
import { seoGate } from '@/lib/seo-gate';
import { useDomainArticles } from '@/pages/knowledge/lib/useDomainArticles';
import type { DomainArticleMeta } from '@/pages/knowledge/lib/useDomainArticles';
import './ziwei-stars-page.css';

export function StarMetaCard({ meta }: { meta: DomainArticleMeta }): ReactElement {
  return (
    <li className="ziwei-stars-list__item">
      <Link to={`/knowledge/ziwei-stars/${meta.slug}`}>
        <span className="ziwei-stars-list__title">{meta.title}</span>
        <span className="ziwei-stars-list__summary">{meta.summary}</span>
      </Link>
    </li>
  );
}

export default function ZiweiStarsListPage(): ReactElement {
  const navigate = useNavigate();
  const { state, metas } = useDomainArticles({ category: 'ziwei-star' });

  useEffect(() => {
    trackPageView('/knowledge/ziwei-stars');
    seoGate.applyToDocument('index');
  }, []);

  return (
    <div className="ziwei-stars-list">
      <PageTopbar
        title="紫微十四主星"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate('/');
        }}
      />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton" />}
      {state === 'ok' && (
        <ul className="ziwei-stars-list__grid">
          {metas.map((meta) => (
            <StarMetaCard key={meta.slug} meta={meta} />
          ))}
        </ul>
      )}
      {state === 'ok-empty' && <p className="ziwei-stars-list__empty">暂无主星条目。</p>}
      {state === 'degraded' && <p className="ziwei-stars-list__empty">内容加载中，请稍后。</p>}
      {state === 'error' && <p className="ziwei-stars-list__empty">列表加载失败，请重试。</p>}
    </div>
  );
}
