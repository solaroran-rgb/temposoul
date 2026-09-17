// src/data/community/bounty.ts
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
