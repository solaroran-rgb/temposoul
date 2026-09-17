// src/pages/ziwei/PalaceStarPage.tsx
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
import { findPalaceStar, findPalaceBySlug, findStarBySlug } from '@/data/ziwei/palace-star';
import './palace-star-page.css';

export default function PalaceStarPage(): ReactElement {
  const { palace, star } = useParams<{ palace: string; star: string }>();
  const [state, setState] = useState<PageState>('loading');
  const palaceMeta = useMemo(() => (palace ? findPalaceBySlug(palace) : undefined), [palace]);
  const starMeta = useMemo(() => (star ? findStarBySlug(star) : undefined), [star]);
  const entry = useMemo(() => (palace && star ? findPalaceStar(palace, star) : undefined), [palace, star]);
  useEffect(() => {
    trackPageView(`/ziwei/palaces/${palace ?? ''}/${star ?? ''}`);
    if (!palaceMeta || !starMeta || !entry) { setState('ok-empty'); return; }
    setState(entry.ready ? 'ok' : 'degraded');
  }, [palace, star, palaceMeta, starMeta, entry]);
  return (
    <article className="palace-star">
      <PageTopbar title={entry ? entry.title : '宫星详解'} onBack={() => window.history.back()} />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton palace-star__skeleton" aria-hidden="true" />}
      {state === 'error' && <p className="palace-star__error">加载失败，请稍后重试。</p>}
      {state === 'ok-empty' && (
        <p className="palace-star__empty">
          未找到该宫星组合，或该组合语义不适用。<br />
          当前为 {palaceMeta?.name ?? '未知宫'} × {starMeta?.name ?? '未知星'}。
        </p>
      )}
      {(state === 'ok' || state === 'degraded') && entry && (
        <>
          {state === 'degraded' && <p className="palace-star__notice">内容完善中，当前为结构预览。</p>}
          <div className="palace-star__meta">
            <ConfidenceBadge confidence={entry.confidence} />
            <span className="palace-star__tag">{entry.palace}</span>
            <span className="palace-star__tag">{entry.star}</span>
          </div>
          <section className="palace-star__section">
            <h2 className="palace-star__heading">宫位含义</h2>
            <p className="palace-star__paragraph">{applyGuard(entry.palaceMeaning)}</p>
          </section>
          <section className="palace-star__section">
            <h2 className="palace-star__heading">星曜落宫</h2>
            <p className="palace-star__paragraph">{applyGuard(entry.starInPalace)}</p>
          </section>
          <ContentBlocks blocks={entry.blocks} />
          {entry.citations.length > 0 && <CitationBlock sources={entry.citations.map(c => ({ text: c, confidence: 'verified' as const }))} />}
        </>
      )}
      <p className="palace-star__disclaimer">本文为传统文化科普，不构成命运预测或决策建议。</p>
    </article>
  );
}
