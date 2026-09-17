import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { PROGRAM_SEED } from '@/data/affiliate/program';
import { trackPageView } from '@/lib/analytics';
import './ProgramPage.css';

export default function ProgramPage() {
  const navigate = useNavigate();
  const [program] = useState(PROGRAM_SEED);

  useEffect(() => {
    trackPageView('/affiliate');
  }, []);

  return (
    <div className="program-page">
      <PageTopbar title="联盟营销" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <p>层级不超过3级，佣金税前/代扣代缴</p>
      <div className="tiers">
        {program.tiers
          .slice()
          .sort((a, b) => b.commissionRate - a.commissionRate)
          .map((t) => (
            <div key={t.id}>
              {t.name} - {t.commissionRate * 100}%
            </div>
          ))}
      </div>
      {program.applyUrl ? (
        <a href={program.applyUrl}>申请</a>
      ) : (
        <div>暂未开放申请 (契约缺口: 提现打款网关未建)</div>
      )}
    </div>
  );
}
