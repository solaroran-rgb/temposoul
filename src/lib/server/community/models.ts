/**
 * 社区模块数据模型
 */

// ── 帖子 ──
export interface Post {
  id: string;
  boardId: string;
  title: string;
  authorId: string;
  excerpt: string;
  content: string;
  status: PostStatus;
  replyCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type PostStatus = 'pending' | 'approved' | 'rejected' | 'deleted';

// ── 评论 ──
export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt?: string;
}

export type CommentStatus = 'pending' | 'approved' | 'rejected' | 'deleted';

// ── 举报 ──
export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'post' | 'comment';
  reason: string;
  status: ReportStatus;
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  actionTaken?: string;
}

export type ReportStatus = 'pending' | 'resolved' | 'dismissed';

// ── 审核记录 ──
export interface ReviewRecord {
  id: string;
  targetType: 'post' | 'comment' | 'report';
  targetId: string;
  action: 'approve' | 'reject' | 'delete';
  reviewerId: string;
  reason: string;
  createdAt: string;
}

// ── 版块 ──
export interface Board {
  id: string;
  name: string;
  desc: string;
  postCount: number;
}

// ── KV 键前缀常量 ──
export const KV_PREFIXES = {
  POST: 'community:post:',
  POST_BY_BOARD: 'community:post:board:',
  COMMENT: 'community:comment:',
  COMMENT_BY_POST: 'community:comment:post:',
  REPORT: 'community:report:',
  REVIEW: 'community:review:',
  BOARD: 'community:board:',
} as const;

// ── 限流配置 ──
export const RATE_LIMITS = {
  POST_PER_MINUTE: 5,
  COMMENT_PER_MINUTE: 10,
  REPORT_PER_MINUTE: 3,
  WINDOW_MS: 60_000,
  TTL_SECONDS: 120,
} as const;

// ── 长度限制 ──
export const LENGTH_LIMITS = {
  TITLE_MAX: 100,
  CONTENT_MAX: 10_000,
  COMMENT_MAX: 2_000,
  REASON_MAX: 500,
  EXCERPT_MAX: 100,
} as const;