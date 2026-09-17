// 平台级 Hook 抽象，降低 A/B/C 域接入成本（专家 D 第6轮交付）
// import { useAuth } from '@/contexts/AuthContext'; // 待本地 AuthContext 完善后接入

export interface UserMembershipStatus {
  tier: 'free' | 'pro';
  aiQuota: { limit: number; used: number; resetsAt: string };
  subscription: { isActive: boolean; nextBillingDate?: string; manageUrl?: string };
}

export const canUseAiFeature = (status: UserMembershipStatus): boolean => {
  return status.tier === 'pro' || status.aiQuota.used < status.aiQuota.limit;
};

// 平台级 Hook：供业务组件统一读取会员状态
export const useMembershipStatus = (): UserMembershipStatus => {
  // const { membership } = useAuth();
  // if (membership) return membership;
  // P0 降级 Mock：待 AuthContext 接入后替换
  return {
    tier: 'free',
    aiQuota: { limit: 3, used: 0, resetsAt: new Date(Date.now() + 86400000).toISOString() },
    subscription: { isActive: false },
  };
};
