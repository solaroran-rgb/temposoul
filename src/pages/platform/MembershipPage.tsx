import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMembershipStatus, canUseAiFeature } from '../../types/membership';

export const MembershipPage: React.FC = () => {
  const navigate = useNavigate();
  const status = useMembershipStatus();
  const canUse = canUseAiFeature(status);

  return (
    <div className="membership-page">
      <h2 className="membership-page__title">我的会员权益</h2>
      <div className="membership-page__card">
        <div className="membership-page__tier">
          当前方案:
          <span className={status.tier === 'pro' ? 'text-pro' : 'text-free'}>
            {status.tier === 'pro' ? 'Pro 会员' : '基础版'}
          </span>
        </div>
        <div className="membership-page__quota">
          <h4>AI深度解读额度</h4>
          <p className="membership-page__quota-text">
            今日剩余:<strong>{status.aiQuota.limit - status.aiQuota.used}</strong>/
            {status.aiQuota.limit}次
          </p>
          <p className="membership-page__quota-hint">免费层为规则骨架解读（0 次 AI 深度解读）；AI 深度解读为订阅/单次权益。</p>
        </div>
        {!canUse && status.tier === 'free' && (
          <div className="membership-page__actions">
            <button className="btn-secondary" onClick={() => navigate('/pricing#single')}>
              购买单次报告(¥39)
            </button>
            <button className="btn-primary" onClick={() => navigate('/pricing#pro')}>
              升级Pro会员(¥29/月)
            </button>
          </div>
        )}
        {status.tier === 'pro' && status.subscription.manageUrl && (
          <a
            href={status.subscription.manageUrl}
            className="membership-page__manage"
            target="_blank"
            rel="noopener noreferrer"
          >
            管理订阅
          </a>
        )}
      </div>
    </div>
  );
};

export default MembershipPage;
