// src/pages/ziwei/PatternDetailPage.tsx
import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { CitationBlock } from '@/components/knowledge/CitationBlock';
import { ContentBlocks } from '@/components/content/ContentBlocks';
import { trackPageView } from '@/lib/analytics';
import { applyGuard } from '@/lib/guard-utils';
import type { PageState } from '@/types/page-state';
import { findPattern } from '@/data/ziwei/patterns';
import './pattern-page.css';

export default function PatternDetailPage(): ReactElement {
  const { key } = useParams<{ key: string }>();
  const [state, setState] = useState<PageState>('loading');
  const entry = useMemo(() => (key ? findPattern(key) : undefined), [key]);
  useEffect(() => {
    trackPageView(`/ziwei/patterns/${key ?? ''}`);
    if (!entry) { setState('ok-empty'); return; }
    setState(entry.ready ? 'ok' : 'degraded');
  }, [key, entry]);
  return (
    <article className="pattern-detail">
      <PageTopbar title={entry?.title ?? '格局专题'} onBack={() => window.history.back()} />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton pattern-detail__skeleton" aria-hidden="true" />}
      {state === 'error' && <p className="pattern-detail__error">加载失败，请稍后重试。</p>}
      {state === 'ok-empty' && <p className="pattern-detail__empty">未找到该格局。</p>}
      {(state === 'ok' || state === 'degraded') && entry && (
        <>
          {state === 'degraded' && <p className="pattern-detail__notice">内容完善中，当前为结构预览。</p>}
          <div className="pattern-detail__meta">
            <ConfidenceBadge confidence={entry.confidence} />
            <span className="pattern-detail__tier">{entry.tier === 'main' ? '主格' : '次格'}</span>
          </div>
          <section className="pattern-detail__section">
            <h2 className="pattern-detail__heading">成格判据</h2>
            <ul className="pattern-detail__ul">{entry.criteria.map((c, i) => <li key={i}>{applyGuard(c)}</li>)}</ul>
          </section>
          <section className="pattern-detail__section">
            <h2 className="pattern-detail__heading">破格条件</h2>
            <ul className="pattern-detail__ul">{entry.breakCriteria.map((c, i) => <li key={i}>{applyGuard(c)}</li>)}</ul>
          </section>
          <section className="pattern-detail__section">
            <h2 className="pattern-detail__heading">释义</h2>
            <ContentBlocks blocks={entry.blocks} />
          </section>
          {entry.citations.length > 0 && <CitationBlock sources={entry.citations.map(c => ({ text: c, confidence: 'verified' as const }))} />}
        </>
      )}
      <p className="pattern-detail__disclaimer">本文为传统文化科普，不构成命运预测或决策建议。</p>
    </article>
  );
}
