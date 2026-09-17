export interface RewardRule {
  id: string;
  action: 'daily_login' | 'share_result' | 'complete_profile';
  credits: number;
  period: 'daily' | 'once' | 'unlimited';
  ready: boolean;
}

export interface RewardLog {
  id: string;
  action: string;
  credits: number;
  createdAt: number;
}

// 任务列表 seed：每日登录 / 分享结果 / 完善资料
export const REWARD_RULES_SEED: RewardRule[] = [
  { id: 'rule-daily-login', action: 'daily_login', credits: 5, period: 'daily', ready: false },
  { id: 'rule-share-result', action: 'share_result', credits: 10, period: 'daily', ready: false },
  {
    id: 'rule-complete-profile',
    action: 'complete_profile',
    credits: 50,
    period: 'once',
    ready: false,
  },
];
