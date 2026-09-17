// src/pages/ziwei/PatternListPage.tsx
import { useEffect, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import { patternPack } from '@/data/ziwei/patterns';
import './pattern-page.css';

export default function PatternListPage(): ReactElement {
  const [state, setState] = useState<PageState>('loading');
  useEffect(() => {
    trackPageView('/ziwei/patterns');
    setState(patternPack.entries.length === 0 ? 'ok-empty' : 'ok');
  }, []);
  return (
    <div className="pattern-list">
      <PageTopbar title="格局专题" onBack={() => window.history.back()} />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton pattern-list__skeleton" aria-hidden="true" />}
      {state === 'error' && <p className="pattern-list__error">加载失败，请稍后重试。</p>}
      {state === 'ok-empty' && <p className="pattern-list__empty">暂无内容。</p>}
      {state === 'ok' && (
        <ul className="pattern-list__grid">
          {patternPack.entries.map((e) => (
            <li key={e.key} className="pattern-list__item">
              <Link className="pattern-list__link" to={`/ziwei/patterns/${e.key}`}>
                <span className="pattern-list__title">{e.title}</span>
                <span className="pattern-list__summary">{e.summary}</span>
                <span className="pattern-list__tier">{e.tier === 'main' ? '主格' : '次格'}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="pattern-list__disclaimer">本文为传统文化科普，不构成命运预测或决策建议。</p>
    </div>
  );
}
