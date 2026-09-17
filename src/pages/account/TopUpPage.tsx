import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { TIERS_SEED } from '@/data/account/credits';
import './TopUpPage.css';

export default function TopUpPage() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="topup-page">
      <PageTopbar title="积分充值" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <div className="tiers">
        {TIERS_SEED.slice()
          .sort((a, b) => a.credits - b.credits)
          .map((t) => (
            <div key={t.id} className="tier">
              {t.credits}积分 - {t.priceLabel}
            </div>
          ))}
      </div>
      <label>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        同意《虚拟财产服务协议》
      </label>
      <button disabled={!agreed}>支付 (契约缺口: 支付网关未接)</button>
    </div>
  );
}
