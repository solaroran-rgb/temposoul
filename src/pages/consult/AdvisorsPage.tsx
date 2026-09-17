import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ADVISORS_SEED, Advisor } from '@/data/consult/advisors';
import { trackPageView } from '@/lib/analytics';
import { safeStorage } from '@/lib/safe-storage';
import { guardText } from '@/lib/assertions-guard';
import './AdvisorsPage.css';

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function AdvisorsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [tab, setTab] = useState<string>('all');

  useEffect(() => {
    trackPageView('/consult');
    const cached = safeStorage.getJSON<Advisor[] | null>('temposoul:consult:advisors:list', null);
    if (cached) {
      setAdvisors(cached);
      setStatus(cached.length ? 'ok' : 'ok-empty');
    } else {
      setAdvisors(ADVISORS_SEED);
      safeStorage.setJSON('temposoul:consult:advisors:list', ADVISORS_SEED);
      setStatus(ADVISORS_SEED.length ? 'ok' : 'ok-empty');
    }
  }, []);

  const filtered = advisors
    .filter((a) => tab === 'all' || a.specialty === tab)
    .sort((a, b) => b.rating - a.rating || a.id.localeCompare(b.id));

  return (
    <div className="advisors-page">
      <PageTopbar title="咨询师列表" onBack={() => navigate(-1)} />
      <PrivacyHint />
      {status === 'loading' && <div className="skeleton" />}
      {status === 'ok-empty' && <div className="empty">暂无匹配咨询师</div>}
      {status === 'ok' && (
        <>
          <div className="tabs">
            {['all', 'bazi', 'tarot', 'astrology'].map((t) => (
              <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
          <div className="list">
            {filtered.map((a) => (
              <div key={a.id} className="card">
                <div className="name">
                  {a.name} {a.isOnline && <span className="online-dot" />}
                </div>
                <div className="intro">{guardText(a.intro)}</div>
                <div className="price">¥{(a.price / 100).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
