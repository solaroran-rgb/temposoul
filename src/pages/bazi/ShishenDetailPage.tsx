// src/pages/bazi/ShishenDetailPage.tsx
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { CitationBlock } from '@/components/knowledge/CitationBlock';
import { ContentBlocks } from '@/components/content/ContentBlocks';
import { trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import { findShishen } from '@/data/bazi/shishen';
import './shishen-page.css';

export default function ShishenDetailPage(): ReactElement {
  const { key } = useParams<{ key: string }>();
  const [state, setState] = useState<PageState>('loading');
  const entry = useMemo(() => (key ? findShishen(key) : undefined), [key]);
  useEffect(() => {
    trackPageView(`/bazi/shishen/${key ?? ''}`);
    if (!entry) { setState('ok-empty'); return; }
    setState(entry.ready ? 'ok' : 'degraded');
  }, [key, entry]);
  return (
    <article className="shishen-detail">
      <PageTopbar title={entry?.title ?? '十神详解'} onBack={() => window.history.back()} />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton shishen-detail__skeleton" aria-hidden="true" />}
      {state === 'error' && <p className="shishen-detail__error">加载失败，请稍后重试。</p>}
      {state === 'ok-empty' && <p className="shishen-detail__empty">未找到该词条。</p>}
      {(state === 'ok' || state === 'degraded') && entry && (
        <>
          {state === 'degraded' && <p className="shishen-detail__notice">内容完善中，当前为结构预览。</p>}
          <div className="shishen-detail__meta">
            <ConfidenceBadge confidence={entry.confidence} />
            <span className="shishen-detail__tag">关系：{entry.relation}</span>
            <span className="shishen-detail__tag">五行：{entry.wuxing}</span>
          </div>
          <ul className="shishen-detail__imagery">
            {entry.imagery.map((t) => <li key={t} className="shishen-detail__imagery-tag">{t}</li>)}
          </ul>
          <ContentBlocks blocks={entry.blocks} />
          {entry.citations.length > 0 && <CitationBlock sources={entry.citations.map(c => ({ text: c, confidence: 'verified' as const }))} />}
        </>
      )}
      <p className="shishen-detail__disclaimer">本文为传统文化科普，不构成命运预测或决策建议。</p>
    </article>
  );
}
