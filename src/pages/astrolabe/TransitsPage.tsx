// src/pages/astrolabe/TransitsPage.tsx
import { useEffect, useState, type FormEvent, type ReactElement } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { trackPageView, trackChartSubmit } from '@/lib/analytics';
import { applyGuard } from '@/lib/guard-utils';
import { formatApiError } from '@/types/page-state';
import type { PageState } from '@/types/page-state';
import {
  parseInputToBirth, buildNatalRequest, parseNatalResponse,
  type NatalPayload,
} from '@/lib/api-adapter';
import './transits-page.css';

export default function TransitsPage(): ReactElement {
  const [state, setState] = useState<PageState>('idle');
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [payload, setPayload] = useState<NatalPayload>({ summary: '', transits: [], solarReturn: '' });

  useEffect(() => { trackPageView('/astrolabe/transits'); }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError('');
    const parsed = parseInputToBirth(input);
    if (!parsed) { setError('请输入有效的出生信息（例：1990-06-15 08:30）。'); setState('error'); return; }
    setState('loading');
    try {
      trackChartSubmit({ mode: 'astrolabe-transits', trueSolarTime: false });
      const res = await fetch('/api/v1/astrolabe/natal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildNatalRequest(parsed)),
      });
      if (!res.ok) { setState('error'); setError(formatApiError(new Error(`HTTP ${res.status}`))); return; }
      const raw: unknown = await res.json();
      const next = parseNatalResponse(raw);
      setPayload(next);
      const hasAny = next.summary !== '' || next.transits.length > 0 || next.solarReturn !== '';
      if (!hasAny) { setState('ok-empty'); return; }
      setState(next.solarReturn !== '' ? 'ok' : 'degraded');
    } catch (err) {
      setState('error');
      setError(formatApiError(err));
    }
  }

  const hasResult = payload.summary !== '' || payload.transits.length > 0;

  return (
    <div className="transits-page">
      <PageTopbar title="行运 / 返照" onBack={() => window.history.back()} />
      <PrivacyHint />
      <form className="transits-page__form" onSubmit={onSubmit}>
        <label className="transits-page__label" htmlFor="transits-input">出生信息</label>
        <input id="transits-input" className="transits-page__input" value={input}
          onChange={(e) => setInput(e.target.value)} placeholder="例：1990-06-15 08:30" autoComplete="off" />
        <button type="submit" className="transits-page__submit" disabled={state === 'loading'}>
          {state === 'loading' ? '计算中…' : '开始计算'}
        </button>
      </form>
      {state === 'loading' && <div className="skeleton transits-page__skeleton" aria-hidden="true" />}
      {state === 'error' && <p className="transits-page__error">{error || '加载失败，请稍后重试。'}</p>}
      {state === 'ok-empty' && <p className="transits-page__empty">暂无结果。</p>}
      {state === 'degraded' && (
        <p className="transits-page__notice">返照端点暂不可用，当前仅展示本命盘与行运叠加部分。</p>
      )}
      {(state === 'ok' || state === 'degraded') && hasResult && (
        <section className="transits-page__result">
          <header className="transits-page__result-head">
            <h2 className="transits-page__heading">本命盘与行运</h2>
            <ConfidenceBadge confidence="probable" />
          </header>
          {payload.summary && <p className="transits-page__paragraph">{applyGuard(payload.summary)}</p>}
          {payload.transits.length > 0 && (
            <ul className="transits-page__list">
              {payload.transits.map((t, i) => <li key={i} className="transits-page__item">{applyGuard(t)}</li>)}
            </ul>
          )}
          {state === 'ok' && payload.solarReturn && (
            <section className="transits-page__solar">
              <h3 className="transits-page__subheading">返照盘</h3>
              <p className="transits-page__paragraph">{applyGuard(payload.solarReturn)}</p>
            </section>
          )}
        </section>
      )}
      <p className="transits-page__disclaimer">本工具为西占几何展示与时间说明，不构成命运预测或决策建议。</p>
    </div>
  );
}
