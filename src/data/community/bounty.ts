// src/data/community/bounty.ts
// ⚠ 2026-10-08（T-11）：BOUNTY_SEED 已停止消费 —— BountyListPage 改为读取
//   GET /api/v1/community/bounty（N-09 canonical 端点）。反假红线：不再用演示假数据兜底页面。
//   本文件当前仅保留 BountyQuestion / BountyStatus 类型作为前端契约类型来源；
//   BOUNTY_SEED 待确认无其他引用后移除（暂留，避免连带破坏）。
export type BountyStatus = 'open' | 'solved' | 'closed';

export interface BountyQuestion {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;   // 悬赏积分（只读来源：账户余额）
  status: BountyStatus;
  authorId: string;
  createdAt: string;
  acceptedAnswerId?: string;
  ready: boolean;
}

export const BOUNTY_SEED: BountyQuestion[] = [
  {
    id: 'bounty-001',
    title: '帮忙分析一个八字案例',
    description: '朋友给了一个八字排盘，想请懂行的朋友帮忙分析一下日主强弱和用神方向。',
    rewardPoints: 50,
    status: 'open',
    authorId: 'user_006',
    createdAt: '2026-09-16T09:00:00+08:00',
    ready: false,
  },
  {
    id: 'bounty-002',
    title: '求推荐适合“五行缺木”的单字',
    description: '宝宝姓氏为林，想让名字里补一点木，但不想用太生僻的字，有哪些推荐？',
    rewardPoints: 30,
    status: 'solved',
    authorId: 'user_007',
    createdAt: '2026-09-14T14:20:00+08:00',
    acceptedAnswerId: 'answer-001',
    ready: false,
  },
];
