import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ADVISORS_SEED } from '@/data/consult/advisors';
import { MatchPreference, MatchResult } from '@/data/consult/match';
import { trackPageView } from '@/lib/analytics';
import './MatchPage.css';

export default function MatchPage() {
  const navigate = useNavigate();
  const [pref, setPref] = useState<MatchPreference>({ specialty: 'any', budget: 50000 });
  const [result, setResult] = useState<MatchResult | null>(null);

  const handleMatch = () => {
    trackPageView('/consult/match');
    const filtered = ADVISORS_SEED.filter(
      (a) =>
        (pref.specialty === 'any' || a.specialty === pref.specialty) &&
        (!pref.budget || a.price <= pref.budget),
    );
    if (filtered.length > 0) {
      const best = filtered.sort((a, b) => b.rating - a.rating || a.id.localeCompare(b.id))[0];
      setResult({ advisorId: best.id, score: Math.round(best.rating * 20), reason: '匹配度最高' });
    } else {
      setResult(null);
    }
  };

  return (
    <div className="match-page">
      <PageTopbar title="即时匹配" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <div className="form">
        <select
          value={pref.specialty}
          onChange={(e) =>
            setPref({ ...pref, specialty: e.target.value as MatchPreference['specialty'] })
          }
        >
          <option value="any">不限</option>
          <option value="bazi">八字</option>
        </select>
        <input
          type="number"
          placeholder="预算(分)"
          value={pref.budget}
          onChange={(e) => setPref({ ...pref, budget: +e.target.value })}
        />
        <button onClick={handleMatch}>匹配</button>
      </div>
      {result === null && <div className="empty">无匹配结果，请放宽条件</div>}
      {result && (
        <div className="result">
          推荐: {result.advisorId} (得分: {result.score})
        </div>
      )}
    </div>
  );
}
