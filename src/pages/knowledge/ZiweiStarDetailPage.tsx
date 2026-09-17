// src/pages/knowledge/ZiweiStarDetailPage.tsx
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
import './ziwei-stars-page.css';

export function StarSourcesNote({ sources }: { sources: readonly string[] }): ReactElement {
  return (
    <ul className="ziwei-star-detail__sources">
      {sources.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export default function ZiweiStarDetailPage(): ReactElement {
  const navigate = useNavigate();
  const { starId = '' } = useParams<{ starId: string }>();
  const { load } = useDomainArticles({ category: 'ziwei-star' });
  const [state, setState] = useState<PageState>('idle');
  const [article, setArticle] = useState<DomainArticle | null>(null);

  useEffect(() => {
    trackPageView(`/knowledge/ziwei-stars/${starId}`);
    trackEvent('star_article_view', { star: starId });
    if (starId === '') {
      setState('ok-empty');
      seoGate.applyToDocument('noindex');
      return;
    }
    setState('loading');
    try {
      const found = load(starId);
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
  }, [starId, load]);

  return (
    <div className="ziwei-star-detail">
      <PageTopbar
        title={article !== null ? article.title : '主星详解'}
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
            <p key={i} className="ziwei-star-detail__body">{guardText(block.text)}</p>
          ))}
          <StarSourcesNote sources={article.sources} />
        </>
      )}
      {state === 'ok-empty' && <p className="ziwei-star-detail__body">未指定主星，请从列表选择。</p>}
      {state === 'degraded' && (
        <p className="ziwei-star-detail__body">该主星详解正文尚在整理中（ready=false），暂不提供全文。</p>
      )}
      {state === 'error' && <p className="ziwei-star-detail__body">详解加载失败，请重试。</p>}
      <p className="ziwei-star-detail__disclaimer">本页为文化概念整理，仅供娱乐参考，不构成任何断言。</p>
    </div>
  );
}
