// src/data/vip/plans.ts
export interface VipPlan {
  id: string;
  name: string;
  priceLabel: string;      // 展示价格，如 "¥29/月"
  creditEquivalent?: number; // 对应 D 侧积分/币种，只读
  features: string[];
  ready: boolean;
}

export const VIP_PLANS_SEED: VipPlan[] = [
  {
    id: "vip-bronze",
    name: "青铜会员",
    priceLabel: "¥29/月",
    creditEquivalent: 2900,
    features: [
      "基础运势内容",
      "社区发帖权限",
      "每日 1 次免费求签",
    ],
    ready: false,
  },
  {
    id: "vip-gold",
    name: "黄金会员",
    priceLabel: "¥68/月",
    creditEquivalent: 6800,
    features: [
      "全部运势内容",
      "社区发帖 + 悬赏问答",
      "每日 3 次免费求签",
      "咨询师预约 9 折",
    ],
    ready: false,
  },
];
