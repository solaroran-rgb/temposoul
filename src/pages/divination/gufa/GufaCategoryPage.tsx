import { useEffect, useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useNoindex } from '@/hooks/useNoindex';
import {
  GUFA_MANIFESTS, isGufaSchool, ENTRIES_BY_SCHOOL, findSubCategory,
} from '@/data/divination/gufa';
import './GufaPage.css';

export default function GufaCategoryPage() {
  useNoindex();
  const { school, category } = useParams();

  const valid = isGufaSchool(school);
  const sub = useMemo(
    () => (valid && category ? findSubCategory(school, category) : undefined),
    [valid, school, category],
  );

  useEffect(() => {
    if (!valid || !category) return;
    trackPageView(`/divination/gufa/${school}/${category}`);
    if (sub) trackEvent('gufa_category_view', { school, category });
  }, [valid, school, category, sub]);

  if (!valid) return <Navigate to="/divination/gufa" replace />;
  if (category && !sub) return <Navigate to={`/divination/gufa/${school}`} replace />;

  const m = GUFA_MANIFESTS[school];
  const entries = sub ? ENTRIES_BY_SCHOOL[school].filter((e) => e.matchKey.startsWith(sub.matchKeyPrefix)) : [];

  return (
    <div className="a23-page">
      <PageTopbar title={`${m.displayName} · ${sub?.label ?? ''}`} onBack={() => window.history.back()} />
      <div className="a23-boundary-callout" role="note">古法论命为传统文化参考，不构成现实决策依据。</div>

      {entries.length === 0 ? (
        <div role="status">{m.emptyMessage}</div>
      ) : (
        <div className="gufa-entry-list">
          {entries.map((e) => (
            <article key={e.id} className="gufa-entry-card">
              <h3>{e.title}</h3>
              <p>{e.ready ? e.body : '语料整理中'}</p>
              <small>{e.source.text} · <span className="a23-badge">{e.confidence}</span></small>
            </article>
          ))}
        </div>
      )}

      <PrivacyHint />
    </div>
  );
}
