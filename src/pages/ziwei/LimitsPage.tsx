// src/pages/ziwei/LimitsPage.tsx
import { useEffect, useState, type FormEvent, type ReactElement } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { trackPageView, trackChartSubmit } from '@/lib/analytics';
import { applyGuard } from '@/lib/guard-utils';
import { formatApiError } from '@/types/page-state';
import type { PageState } from '@/types/page-state';
import {
  parseInputToBirth, buildLimitsRequest, parseLimitsResponse,
  type LimitScope, type LimitSlice,
} from '@/lib/api-adapter';
import './limits-page.css';

export default function LimitsPage(): ReactElement {
  const [state, setState] = useState<PageState>('idle');
  const [scope, setScope] = useState<LimitScope>('decadal');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [slices, setSlices] = useState<LimitSlice[]>([]);

  useEffect(() => { trackPageView('/ziwei/limits'); }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError('');
    const parsed = parseInputToBirth(input);
    if (!parsed) { setError('请输入有效的出生信息（例：1990-06-15 08:30）。'); setState('error'); return; }
    setState('loading');
    try {
      trackChartSubmit({ mode: 'ziwei-limits', trueSolarTime: false });
      const res = await fetch('/api/v1/ziwei/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildLimitsRequest(parsed, scope)),
      });
      if (!res.ok) { setState('error'); setError(formatApiError(new Error(`HTTP ${res.status}`))); return; }
      const raw: unknown = await res.json();
      const next = parseLimitsResponse(raw);
      setSlices(next);
      setState(next.length === 0 ? 'ok-empty' : 'ok');
    } catch (err) {
      setState('error');
      setError(formatApiError(err));
    }
  }

  return (
    <div className="limits-page">
      <PageTopbar title="限年解析" onBack={() => window.history.back()} />
      <PrivacyHint />
      <form className="limits-page__form" onSubmit={onSubmit}>
        <label className="limits-page__label" htmlFor="limits-input">出生信息</label>
        <input id="limits-input" className="limits-page__input" value={input}
          onChange={(e) => setInput(e.target.value)} placeholder="例：1990-06-15 08:30" autoComplete="off" />
        <div className="limits-page__scope" role="group" aria-label="范围切换">
          <button type="button"
            className={scope === 'decadal' ? 'limits-page__scope-btn limits-page__scope-btn--active' : 'limits-page__scope-btn'}
            onClick={() => setScope('decadal')}>大限</button>
          <button type="button"
            className={scope === 'yearly' ? 'limits-page__scope-btn limits-page__scope-btn--active' : 'limits-page__scope-btn'}
            onClick={() => setScope('yearly')}>流年</button>
        </div>
        <button type="submit" className="limits-page__submit" disabled={state === 'loading'}>
          {state === 'loading' ? '计算中…' : '开始计算'}
        </button>
      </form>
      {state === 'loading' && <div className="skeleton limits-page__skeleton" aria-hidden="true" />}
      {state === 'error' && <p className="limits-page__error">{error || '加载失败，请稍后重试。'}</p>}
      {state === 'ok-empty' && <p className="limits-page__empty">暂无结果。</p>}
      {state === 'degraded' && <p className="limits-page__notice">数据受限，仅展示可用部分。</p>}
      {state === 'ok' && slices.length > 0 && (
        <section className="limits-page__timeline">
          <header className="limits-page__timeline-head">
            <h2 className="limits-page__heading">{scope === 'decadal' ? '大限' : '流年'}</h2>
            <ConfidenceBadge confidence="probable" />
          </header>
          <ol className="limits-page__list">
            {slices.map((s) => (
              <li key={`${s.index}-${s.range}`} className="limits-page__item">
                <span className="limits-page__item-range">{s.range}</span>
                <span className="limits-page__item-palace">{applyGuard(s.palace)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}
      <p className="limits-page__disclaimer">本工具为传统文化展示，不构成命运预测或决策建议。结果仅供自我参照。</p>
    </div>
  );
}
