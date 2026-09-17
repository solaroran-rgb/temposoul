import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';
import './FreeTrialPage.css';

export default function FreeTrialPage() {
  const navigate = useNavigate();
  // 基于时间差的倒计时：刷新不重置起点
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    trackPageView('/consult/free');
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const elapsed = Math.floor((now - startedAt) / 1000);
  const secondsLeft = Math.max(0, 180 - elapsed);
  const state: 'active' | 'expired' = secondsLeft <= 0 ? 'expired' : 'active';

  return (
    <div className="free-page">
      <PageTopbar title="免费咨询" onBack={() => navigate(-1)} />
      <PrivacyHint />
      {state === 'active' ? (
        <div className="timer">剩余时间: {secondsLeft}s</div>
      ) : (
        <div className="expired-mask">
          <p>体验已结束</p>
          <button>转付费咨询</button>
        </div>
      )}
    </div>
  );
}
