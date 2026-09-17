// src/pages/knowledge/ZiweiPalacesListPage.tsx
import { useEffect } from 'react';
import type { ReactElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';
import { seoGate } from '@/lib/seo-gate';
import { useDomainArticles } from '@/pages/knowledge/lib/useDomainArticles';
import type { DomainArticleMeta } from '@/pages/knowledge/lib/useDomainArticles';
import './ziwei-palaces-page.css';

export function PalaceMetaCard({ meta }: { meta: DomainArticleMeta }): ReactElement {
  return (
    <li className="ziwei-palaces-list__item">
      <Link to={`/knowledge/ziwei-palaces/${meta.slug}`}>
        <span className="ziwei-palaces-list__title">{meta.title}</span>
        <span className="ziwei-palaces-list__summary">{meta.summary}</span>
      </Link>
    </li>
  );
}

export default function ZiweiPalacesListPage(): ReactElement {
  const navigate = useNavigate();
  const { state, metas } = useDomainArticles({ category: 'ziwei-palace' });

  useEffect(() => {
    trackPageView('/knowledge/ziwei-palaces');
    seoGate.applyToDocument('index');
  }, []);

  return (
    <div className="ziwei-palaces-list">
      <PageTopbar
        title="紫微十二宫"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate('/');
        }}
      />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton" />}
      {state === 'ok' && (
        <ul className="ziwei-palaces-list__grid">
          {metas.map((meta) => (
            <PalaceMetaCard key={meta.slug} meta={meta} />
          ))}
        </ul>
      )}
      {state === 'ok-empty' && <p className="ziwei-palaces-list__empty">暂无宫位条目。</p>}
      {state === 'degraded' && <p className="ziwei-palaces-list__empty">内容加载中，请稍后。</p>}
      {state === 'error' && <p className="ziwei-palaces-list__empty">列表加载失败，请重试。</p>}
    </div>
  );
}
