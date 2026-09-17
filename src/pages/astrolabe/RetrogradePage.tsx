// src/pages/astrolabe/RetrogradePage.tsx
import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { seoGate } from '@/lib/seo-gate';
import { ttlCache } from '@/lib/safe-storage-ttl';
import type { PageState } from '@/types/page-state';
import { periodsOfYear } from '@/data/astrolabe/retrograde-periods';
import type { RetrogradePeriod } from '@/data/astrolabe/retrograde-periods';
import { RETROGRADE_FOLKLORE } from '@/data/astrolabe/retrograde-folklore';
import './retrograde-page.css';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const YEAR_OPTIONS = [2024, 2025, 2026, 2027, 2028, 2029, 2030] as const;

export function RetrogradePeriodCard({ period }: { period: RetrogradePeriod }): ReactElement {
  return (
    <li className="retrograde-page__card">
      <span className="retrograde-page__card-note">{period.note}</span>
      <span className="retrograde-page__card-range">{period.startKey} ~ {period.endKey}</span>
    </li>
  );
}

export function PersonalReturnPlaceholder(): ReactElement {
  return (
    <p className="retrograde-page__personal-placeholder">
      个人土星回归推算需结合本命盘，该能力即将上线，当前仅展示通用周期。
    </p>
  );
}

export default function RetrogradePage(): ReactElement {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('idle');
  const [year, setYear] = useState<number>(2026);
  const [periods, setPeriods] = useState<readonly RetrogradePeriod[]>([]);

  useEffect(() => {
    trackPageView('/astrolabe/retrograde');
    seoGate.applyToDocument(seoGate.policyFor('static-topic'));
  }, []);

  useEffect(() => {
    setState('loading');
    const cacheKey = `temposoul:astro:retrograde:${year}`;
    try {
      const cached = ttlCache.get<readonly RetrogradePeriod[]>(cacheKey);
      if (cached !== null) {
        setPeriods(cached);
        setState(cached.length > 0 ? 'ok' : 'ok-empty');
        return;
      }
      const list = periodsOfYear(year);
      ttlCache.set(cacheKey, list, CACHE_TTL_MS);
      setPeriods(list);
      setState(list.length > 0 ? 'ok' : 'ok-empty');
    } catch {
      try {
        const fallbackList = periodsOfYear(year);
        setPeriods(fallbackList);
        setState('degraded');
      } catch {
        setState('error');
      }
    }
  }, [year]);

  const folkloreLines = useMemo(
    () =>
      RETROGRADE_FOLKLORE.map((entry) => ({
        key: entry.key,
        title: entry.title,
        text: guardText(entry.text),
        confidence: entry.confidence,
      })),
    [],
  );

  return (
    <div className="retrograde-page">
      <PageTopbar
        title="水逆与土星回归"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate('/');
        }}
      />
      <PrivacyHint />
      <label className="retrograde-page__year-label">
        年份
        <select
          className="retrograde-page__year-select"
          value={year}
          onChange={(e) => {
            const next = Number(e.target.value);
            trackEvent('retrograde_period_view', { planet: 'mercury', year: next });
            setYear(next);
          }}
        >
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </label>
      {state === 'loading' && <div className="skeleton" />}
      {state === 'ok' && (
        <ul className="retrograde-page__list">
          {periods.map((p) => (
            <RetrogradePeriodCard key={p.startKey} period={p} />
          ))}
        </ul>
      )}
      {state === 'ok-empty' && <p className="retrograde-page__empty">该年份暂无通用窗口记录。</p>}
      {state === 'degraded' && (
        <p className="retrograde-page__empty">本地缓存不可用，已降级为直读静态周期表。</p>
      )}
      {state === 'error' && <p className="retrograde-page__error">周期数据加载失败，请稍后重试。</p>}
      <PersonalReturnPlaceholder />
      <section className="retrograde-page__folklore">
        {folkloreLines.map((line) => (
          <article key={line.key} className="retrograde-page__folklore-item">
            <h3>{line.title}</h3>
            <p>{line.text}</p>
            <ConfidenceBadge confidence={line.confidence} />
          </article>
        ))}
      </section>
      <p className="retrograde-page__disclaimer">本页内容为民俗文化与天文周期整理，仅供娱乐参考，不构成医疗、法律或投资建议。</p>
    </div>
  );
}
