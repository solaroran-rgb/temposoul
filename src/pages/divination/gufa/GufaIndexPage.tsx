import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';
import { useNoindex } from '@/hooks/useNoindex';
import { GUFA_MANIFESTS, GUFA_SCHOOLS } from '@/data/divination/gufa';
import './GufaPage.css';

export default function GufaIndexPage() {
  useNoindex();
  useEffect(() => { trackPageView('/divination/gufa'); }, []);

  return (
    <div className="a23-page">
      <PageTopbar title="古法论命" onBack={() => window.history.back()} />
      <div className="a23-boundary-callout" role="note">
        古法论命为传统文化参考，不构成现实决策依据。
      </div>
      <div className="gufa-grid">
        {GUFA_SCHOOLS.map((school) => {
          const m = GUFA_MANIFESTS[school];
          return (
            <Link key={school} to={`/divination/gufa/${school}`} className="gufa-card">
              <h2>{m.displayName}</h2>
              <p>共 {m.entryCount} 条语料</p>
            </Link>
          );
        })}
      </div>
      <PrivacyHint />
    </div>
  );
}
