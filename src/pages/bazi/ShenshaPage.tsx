// src/pages/bazi/ShenshaPage.tsx
import { useEffect, useState, type ReactElement } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { ContentBlocks } from '@/components/content/ContentBlocks';
import { trackPageView } from '@/lib/analytics';
import { applyGuard } from '@/lib/guard-utils';
import type { PageState } from '@/types/page-state';
import { shenshaPack } from '@/data/bazi/shensha';
import './shensha-page.css';

export default function ShenshaPage(): ReactElement {
  const [state, setState] = useState<PageState>('loading');
  useEffect(() => {
    trackPageView('/bazi/shensha');
    setState(shenshaPack.entries.length === 0 ? 'ok-empty' : 'ok');
  }, []);
  return (
    <div className="shensha-page">
      <PageTopbar title="神煞专题" onBack={() => window.history.back()} />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton shensha-page__skeleton" aria-hidden="true" />}
      {state === 'error' && <p className="shensha-page__error">加载失败，请稍后重试。</p>}
      {state === 'ok-empty' && <p className="shensha-page__empty">暂无内容。</p>}
      {state === 'ok' && (
        <section className="shensha-page__list">
          {shenshaPack.entries.map((e) => (
            <article key={e.key} id={e.key} className="shensha-page__section">
              <header className="shensha-page__head">
                <h2 className="shensha-page__title">{e.title}</h2>
                <ConfidenceBadge confidence={e.confidence} />
              </header>
              <dl className="shensha-page__dl">
                <dt>查法</dt><dd>{applyGuard(e.rule)}</dd>
                <dt>文化意象</dt><dd>{e.imagery.join('、')}</dd>
                <dt>边界</dt><dd>{applyGuard(e.boundary)}</dd>
              </dl>
              <ContentBlocks blocks={e.blocks} />
            </article>
          ))}
        </section>
      )}
      <p className="shensha-page__disclaimer">本文为传统文化科普，不构成命运预测或决策建议。</p>
    </div>
  );
}
