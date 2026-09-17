// src/pages/vip/VipPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { VIP_PLANS_SEED, VipPlan } from '@/data/vip/plans';
import { trackPageView, trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function VipPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('loading');
  const [plans, setPlans] = useState<VipPlan[]>([]);

  useEffect(() => {
    trackPageView('/vip');
    const timer = setTimeout(() => {
      setPlans(VIP_PLANS_SEED);
      setStatus(VIP_PLANS_SEED.length > 0 ? 'ok' : 'ok-empty');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handlePurchaseClick = (plan: VipPlan) => {
    trackEvent('vip_purchase_click', { planId: plan.id });
  };

  if (status === 'loading') {
    return (
      <div>
        <PageTopbar title="会员中心" onBack={() => navigate(-1)} />
        <PrivacyHint />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    );
  }

  return (
    <div>
      <PageTopbar title="会员中心" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <div className="vip-plans">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div key={plan.id} className="vip-card">
              <h3 className="vip-name">{plan.name}</h3>
              <div className="vip-price">{plan.priceLabel}</div>
              {plan.creditEquivalent !== undefined && (
                <div className="vip-credit">等价 {plan.creditEquivalent} 积分</div>
              )}
              <ul className="vip-features">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className="vip-buy-btn"
                onClick={() => handlePurchaseClick(plan)}
              >
                购买
              </button>
              <p className="contract-gap">契约缺口：支付网关未接入，按钮为占位</p>
            </div>
          ))
        ) : (
          <div className="empty-tip">暂无会员套餐</div>
        )}
      </div>
    </div>
  );
}
