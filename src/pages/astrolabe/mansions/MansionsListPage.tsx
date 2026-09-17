import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';
import { useDocumentSeo } from '@/hooks/useDocumentSeo';
import { MANSION_ENTRIES } from '@/data/astrolabe/mansions';
import { MANSION_LIST_SEO } from '@/data/astrolabe/mansions/seo';
import './MansionsPage.css';

export default function MansionsListPage() {
  useDocumentSeo(MANSION_LIST_SEO);
  useEffect(() => { trackPageView('/astrolabe/mansions'); }, []);

  return (
    <div className="a23-page">
      <PageTopbar title="宿度详解" onBack={() => window.history.back()} />
      <div className="a23-boundary-callout a23-boundary-callout--info" role="note">
        天文层为现代星表数据，民俗层为传统文化参考，请分开理解。
      </div>
      <div className="mansion-grid">
        {MANSION_ENTRIES.map((m) => (
          <Link key={m.id} to={`/astrolabe/mansions/${m.id}`} className="mansion-card">
            <h2>{m.name}</h2>
            <p>{m.astro.distanceStarName} · {m.astro.distanceStarWestern}</p>
            <small>{m.astro.eclipticLongitudeDeg}° · {m.astro.accuracyGrade}</small>
          </Link>
        ))}
      </div>
      <PrivacyHint />
    </div>
  );
}
