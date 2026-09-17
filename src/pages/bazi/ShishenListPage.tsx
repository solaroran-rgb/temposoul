// src/pages/bazi/ShishenListPage.tsx
import { useEffect, useState, type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import { shishenPack } from '@/data/bazi/shishen';
import './shishen-page.css';

export default function ShishenListPage(): ReactElement {
  const [state, setState] = useState<PageState>('loading');
  useEffect(() => {
    trackPageView('/bazi/shishen');
    setState(shishenPack.entries.length === 0 ? 'ok-empty' : 'ok');
  }, []);
  return (
    <div className="shishen-list">
      <PageTopbar title="十神详解" onBack={() => window.history.back()} />
      <PrivacyHint />
      {state === 'loading' && <div className="skeleton shishen-list__skeleton" aria-hidden="true" />}
      {state === 'error' && <p className="shishen-list__error">加载失败，请稍后重试。</p>}
      {state === 'ok-empty' && <p className="shishen-list__empty">暂无内容。</p>}
      {state === 'ok' && (
        <ul className="shishen-list__grid">
          {shishenPack.entries.map((e) => (
            <li key={e.key} className="shishen-list__item">
              <Link className="shishen-list__link" to={`/bazi/shishen/${e.key}`}>
                <span className="shishen-list__title">{e.title}</span>
                <span className="shishen-list__summary">{e.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="shishen-list__disclaimer">本文为传统文化科普，不构成命运预测或决策建议。</p>
    </div>
  );
}
