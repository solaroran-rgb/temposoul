// src/data/community/posts.ts
export interface PostDetail {
  id: string;
  boardId: string;
  title: string;
  authorId: string;
  content: string;
  createdAt: string;
  ready: boolean;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  ready: boolean;
}

export const POSTS_SEED: PostDetail[] = [
  {
    id: 'post-001',
    boardId: 'naming',
    title: '请教“梓涵”这个名字的寓意',
    authorId: 'user_001',
    content:
      '孩子快出生了，身边很多人建议用“梓涵”。想从文化角度了解一下这个名字的寓意和时代感，也担心重名率会不会太高。',
    createdAt: '2026-09-15T10:00:00+08:00',
    ready: false,
  },
  {
    id: 'post-002',
    boardId: 'bazi',
    title: '日主强弱怎么判断？',
    authorId: 'user_002',
    content:
      '刚学八字，看了一些排盘案例，但对日主强弱的判断标准还比较模糊。希望有经验的朋友能简单讲讲判断思路。',
    createdAt: '2026-09-14T15:30:00+08:00',
    ready: false,
  },
];

export const POST_COMMENTS_SEED: PostComment[] = [
  {
    id: 'comment-001',
    postId: 'post-001',
    authorId: 'user_004',
    content: '“梓”有生机、桑梓之意，“涵”有包容、涵养之意，组合起来比较温柔。但近年重名率确实偏高。',
    createdAt: '2026-09-15T11:00:00+08:00',
    ready: false,
  },
  {
    id: 'comment-002',
    postId: 'post-001',
    authorId: 'user_005',
    content: '从音韵看，“梓涵”读起来顺口，字义也积极。如果在意重名，可以再考虑字形搭配。',
    createdAt: '2026-09-15T12:30:00+08:00',
    ready: false,
  },
];
