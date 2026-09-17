import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { EXPERTS_SEED, ExpertShowcase } from '@/data/experts/team';
import { trackPageView } from '@/lib/analytics';
import './TeamPage.css';

export default function TeamPage() {
  const navigate = useNavigate();
  const [experts, setExperts] = useState<ExpertShowcase[]>([]);

  useEffect(() => {
    trackPageView('/experts');
    setExperts(EXPERTS_SEED.slice().sort((a, b) => a.id.localeCompare(b.id)));
  }, []);

  return (
    <div className="team-page">
      <PageTopbar title="专家团队" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <div className="grid">
        {experts.map((e) => (
          <div key={e.id} className="card">
            <img
              src="/avatar.png"
              onError={(ev: React.SyntheticEvent<HTMLImageElement>) => {
                (ev.target as HTMLImageElement).src = '/default.png';
              }}
            />
            <div>{e.name}</div>
            <div>{e.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
