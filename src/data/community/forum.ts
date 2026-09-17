// src/data/community/forum.ts
export interface ForumBoard {
  id: string;
  name: string;
  desc: string;
  postCount: number;
  ready: boolean;
}

export interface ForumPost {
  id: string;
  boardId: string;
  title: string;
  authorId: string;
  excerpt: string;
  replyCount: number;
  createdAt: string;
  ready: boolean;
}

export const FORUM_BOARDS: ForumBoard[] = [
  { id: 'bazi', name: '八字命理', desc: '四柱八字的讨论与案例', postCount: 12, ready: false },
  { id: 'naming', name: '姓名学', desc: '起名、改名与姓名文化', postCount: 8, ready: false },
  { id: 'tarot', name: '塔罗占卜', desc: '塔罗牌阵与解读交流', postCount: 5, ready: false },
  { id: 'community', name: '社区闲聊', desc: '站务反馈与轻松话题', postCount: 3, ready: false },
];

export const FORUM_POSTS: ForumPost[] = [
  { id: 'post-001', boardId: 'naming', title: '请教“梓涵”这个名字的寓意', authorId: 'user_001', excerpt: '孩子快出生了，想请教大家这个名字的寓意和时代感……', replyCount: 3, createdAt: '2026-09-15T10:00:00+08:00', ready: false },
  { id: 'post-002', boardId: 'bazi', title: '日主强弱怎么判断？', authorId: 'user_002', excerpt: '刚学八字，看到案例不知道日主强弱，求指点……', replyCount: 5, createdAt: '2026-09-14T15:30:00+08:00', ready: false },
  { id: 'post-003', boardId: 'tarot', title: '韦特塔罗初学者选哪副牌？', authorId: 'user_003', excerpt: '想入坑塔罗，但版本太多，求推荐……', replyCount: 2, createdAt: '2026-09-13T08:20:00+08:00', ready: false },
  { id: 'post-004', boardId: 'community', title: '新功能预告：分享墙即将上线', authorId: 'admin', excerpt: '分享墙支持生成生辰卡、八字卡、塔罗卡、灵数卡和姓名卡……', replyCount: 0, createdAt: '2026-09-16T09:00:00+08:00', ready: false },
];
