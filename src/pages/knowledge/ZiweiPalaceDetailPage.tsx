// src/pages/knowledge/ZiweiPalaceDetailPage.tsx
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { seoGate } from '@/lib/seo-gate';
import { useDomainArticles } from '@/pages/knowledge/lib/useDomainArticles';
import type { DomainArticle } from '@/pages/knowledge/lib/useDomainArticles';
import type { PageState } from '@/types/page-state';
import './ziwei-palaces-page.css';

export function PalaceSourcesNote({ sources }: { sources: readonly string[] }): ReactElement {
  return (
    <ul className="ziwei-palace-detail__sources">
      {sources.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export default function ZiweiPalaceDetailPage(): ReactElement {
  const navigate = useNavigate();
  const { palaceId = '' } = useParams<{ palaceId: string }>();
  const { load } = useDomainArticles({ category: 'ziwei-palace' });
  const [state, setState] = useState<PageState>('idle');
  const [article, setArticle] = useState<DomainArticle | null>(null);

  useEffect(() => {
    trackPageView(`/knowledge/ziwei-palaces/${palaceId}`);
    trackEvent('palace_article_view', { palace: palaceId });
    if (palaceId === '') {
      setState('ok-empty');
      seoGate.applyToDocument('noindex');
      return;
    }
    setState('loading');
    try {
      const found = load(palaceId);
      if (found === null) {
        setArticle(null);
        setState('degraded');
        seoGate.applyToDocument('noindex');
        return;
      }
      setArticle(found);
      setState('ok');
      seoGate.applyToDocument(
        seoGate.policyFor('content-article', { ready: found.ready, completeness: found.completeness }),
      );
    } catch {
      setState('error');
      seoGate.applyToDocument('noindex');
    }
  }, [palaceId, load]);

  return (
    <div className="ziwei-palace-detail">
      <PageTopbar
        title={article !== null ? article.title : '宫位详解'}
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate('/');
        }}
      />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton" />}
      {state === 'ok' && article !== null && (
        <>
          <ConfidenceBadge confidence={article.confidence} />
          {article.blocks.map((block, i) => (
            <p key={i} className="ziwei-palace-detail__body">{guardText(block.text)}</p>
          ))}
          <PalaceSourcesNote sources={article.sources} />
        </>
      )}
      {state === 'ok-empty' && <p className="ziwei-palace-detail__body">未指定宫位，请从列表选择。</p>}
      {state === 'degraded' && (
        <p className="ziwei-palace-detail__body">该宫位详解正文尚在整理中（ready=false），暂不提供全文。</p>
      )}
      {state === 'error' && <p className="ziwei-palace-detail__body">详解加载失败，请重试。</p>}
      <p className="ziwei-palace-detail__disclaimer">本页为文化概念整理，仅供娱乐参考，不构成任何断言。</p>
    </div>
  );
}
