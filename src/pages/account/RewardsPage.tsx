import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView } from '@/lib/analytics';
import { REWARD_RULES_SEED, RewardRule } from '@/data/account/rewards';
import './RewardsPage.css';

const TASK_LABELS: Record<RewardRule['action'], string> = {
  daily_login: '每日登录',
  share_result: '分享结果',
  complete_profile: '完善资料',
};

export default function RewardsPage() {
  const navigate = useNavigate();
  const [rules] = useState<RewardRule[]>(REWARD_RULES_SEED);
  // 完成状态占位：本地 useState，当前全部未完成
  const [doneMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    trackPageView('/account/rewards');
  }, []);

  return (
    <div className="rewards-page">
      <PageTopbar title="奖励积分" onBack={() => navigate(-1)} />
      <PrivacyHint />
      <p>不可提现，仅限平台内消费</p>
      <div className="tasks">
        {rules.map((r) => (
          <div key={r.id} className="task">
            <span className="task-name">{TASK_LABELS[r.action]}</span>
            <span className="task-credits">+{r.credits}积分</span>
            <span className="task-status">{doneMap[r.id] ? '已完成' : '未完成'}</span>
          </div>
        ))}
      </div>
      <div className="logs">
        <div className="empty">暂无流水</div>
      </div>
    </div>
  );
}
