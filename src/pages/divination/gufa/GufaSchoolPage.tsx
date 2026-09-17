import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useNoindex } from '@/hooks/useNoindex';
import { seedFromParts } from '@/lib/a23-seed';
import { seedToIndex } from '@/lib/deterministic';
import {
  GUFA_MANIFESTS, isGufaSchool, ENTRIES_BY_SCHOOL, deriveMatchKey, getSubCategories,
  type GufaEntry,
} from '@/data/divination/gufa';
import { ERR_A23_INVALID_SCHOOL, ERR_A23_ENGINE_UNAVAILABLE } from '@/lib/a23-errors';
import './GufaPage.css';

type State = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function GufaSchoolPage() {
  useNoindex();
  const { school } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState<State>('idle');
  const [entry, setEntry] = useState<GufaEntry | null>(null);
  const [errCode, setErrCode] = useState<string | null>(null);

  const valid = isGufaSchool(school);

  useEffect(() => {
    if (!valid) { navigate('/divination/gufa', { replace: true }); return; }
    trackPageView(`/divination/gufa/${school}`);
  }, [valid, school, navigate]);

  const subCats = useMemo(() => (valid ? getSubCategories(school) : []), [valid, school]);

  const compute = useCallback(() => {
    if (!valid) { setErrCode(ERR_A23_INVALID_SCHOOL); setState('error'); return; }
    setState('loading');
    try {
      const fourPillars = ['placeholder-year', 'placeholder-month', 'placeholder-day', 'placeholder-hour'];
      const { matchKey, rulesetVersion } = deriveMatchKey(school, { fourPillars });
      const pool = ENTRIES_BY_SCHOOL[school];
      const idx = seedToIndex(seedFromParts(fourPillars.join('|'), school, rulesetVersion), pool.length);
      const picked = pool[idx];
      setEntry(picked);
      setState(picked.ready ? 'ok' : 'ok-empty');
      trackEvent('gufa_entry_view', { school, entry_id: picked.id, match_key: matchKey });
    } catch {
      setErrCode(ERR_A23_ENGINE_UNAVAILABLE);
      setState('error');
    }
  }, [valid, school]);

  if (!valid) return null;
  const m = GUFA_MANIFESTS[school];

  return (
    <div className="a23-page">
      <PageTopbar title={m.displayName} onBack={() => navigate('/divination/gufa')} />
      <div className="a23-boundary-callout" role="note">古法论命为传统文化参考，不构成现实决策依据。</div>

      <nav className="gufa-subcategories">
        {subCats.map((c) => (
          <Link key={c.key} to={`/divination/gufa/${school}/${c.key}`}>{c.label}</Link>
        ))}
      </nav>

      {state === 'idle' && (
        <div role="status">
          <p>请先完成四柱排盘或点击下方按钮开始解读。</p>
          <button className="a23-cta" onClick={compute}>开始解读</button>
        </div>
      )}

      {state === 'loading' && (
        <div className="a23-skeleton" role="status" aria-live="polite">
          <div className="a23-skeleton-row" /><div className="a23-skeleton-row" /><div className="a23-skeleton-row" />
        </div>
      )}

      {state === 'ok' && entry && (
        <article className="gufa-entry-card">
          <h2>{entry.title}</h2>
          <p>{entry.body}</p>
          <small>{entry.source.text} · {entry.source.edition} · <span className="a23-badge">{entry.confidence}</span></small>
          <p>{entry.disclaimer}</p>
        </article>
      )}

      {state === 'ok-empty' && <div role="status">{m.emptyMessage}</div>}
      {state === 'degraded' && <div role="alert" className="a23-error">{m.degradedMessage}</div>}
      {state === 'error' && <div role="alert" className="a23-error">错误码：{errCode}</div>}

      <PrivacyHint />
    </div>
  );
}
