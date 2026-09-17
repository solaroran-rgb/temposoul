import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { AdvisorProfile } from '@/data/consult/profile';
import { ReviewList } from '@/components/consult/ReviewList';
import { trackPageView } from '@/lib/analytics';
import './AdvisorProfilePage.css';

export default function AdvisorProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AdvisorProfile | null>(null);

  useEffect(() => {
    trackPageView('/consult/advisors/:id');
    // Mock data
    const mock: AdvisorProfile = {
      id: 'adv-001',
      base: {
        id: 'adv-001',
        name: '李大师',
        specialty: 'bazi',
        rating: 4.8,
        isOnline: true,
        intro: '精通',
        price: 29900,
        ready: false,
      },
      bio: '详细介绍...',
      rates: [{ text: '详批', price: 29900 }],
      onlineStatus: 'online',
      ready: false,
    };
    setProfile(mock);
  }, []);

  if (!profile) return <div className="skeleton" />;

  return (
    <div className="profile-page">
      <PageTopbar title={profile.base.name} onBack={() => navigate(-1)} />
      <PrivacyHint />
      <div className="bio">{profile.bio}</div>
      <div className="rates">
        {profile.rates
          .slice()
          .sort((a, b) => a.price - b.price)
          .map((r) => (
            <div key={r.text}>
              {r.text} ¥{(r.price / 100).toFixed(2)}
            </div>
          ))}
      </div>
      <button>预约 (契约缺口: 排班系统未建)</button>
      <ReviewList advisorId={profile.id} />
    </div>
  );
}
