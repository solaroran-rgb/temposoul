/**
 * N-09 社区扩展实体模型（悬赏 / 悬赏回答 / 分享墙 / 案例 / 积分托管）
 *
 * 与既有 models.ts 分离：本文件只新增实体，不改既有 Post/Comment/Report/Board 定义（零连带）。
 * 契约来源：WP-16 心灵社区（悬赏状态机 冻结→采纳释放→过期退回 + 异常分支 ≥6 条）
 *          + L-05 施工卡 N-09（boards / threads / threads/:id / replies / bounty / cases）
 */

// ── 悬赏 ──────────────────────────────────────────────────────────────────

/**
 * 悬赏状态机：
 *   open ──(作者撤单 / 过期)──> closed   [积分退回]
 *   open ──(采纳回答)─────────> solved   [积分释放给回答者]
 *   solved / closed 为终态，不可再流转。
 */
export type BountyStatus = 'open' | 'solved' | 'closed';

export interface BountyQuestion {
  id: string;
  title: string;
  description: string;
  /** 悬赏积分（只读来源：账户余额托管，不在前端硬编码） */
  rewardPoints: number;
  status: BountyStatus;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  /** 采纳的回答 id（status=solved 时必有） */
  acceptedAnswerId?: string;
  answerCount: number;
  /** 过期时间，过期后由读取侧惰性结算为 closed + 退回 */
  expiresAt: string;
  /** 结算标记：积分是否已退回/释放，防重复结算 */
  settled: boolean;
  /** 反假红线：无真实数据时不伪造，该条是否为真实 UGC */
  ready: boolean;
}

export type BountyAnswerStatus = 'pending' | 'accepted' | 'rejected';

export interface BountyAnswer {
  id: string;
  bountyId: string;
  authorId: string;
  content: string;
  status: BountyAnswerStatus;
  createdAt: string;
  updatedAt?: string;
}

/** 悬赏积分托管流水（冻结/释放/退回） */
export type EscrowAction = 'freeze' | 'release' | 'refund';

export interface EscrowEntry {
  id: string;
  bountyId: string;
  action: EscrowAction;
  points: number;
  /** freeze/refund 记作者；release 记回答者 */
  userId: string;
  createdAt: string;
  note?: string;
}

// ── 分享墙 ────────────────────────────────────────────────────────────────

/** 与前端分享卡片 ShareCardType 对齐（单一真值源，避免两套分类） */
export type WallShareType = 'birth' | 'bazi' | 'tarot' | 'numerology' | 'name' | 'starmark';
export type WallShareStatus = 'published' | 'hidden';

export interface WallShare {
  id: string;
  userId: string;
  type: WallShareType;
  /** 被分享对象的 id（排盘/报告/星标/星象事件） */
  refId: string;
  title: string;
  summary: string;
  /** 分享令牌，用于生成可公开访问的分享链 */
  shareToken: string;
  likeCount: number;
  status: WallShareStatus;
  createdAt: string;
  updatedAt?: string;
  ready: boolean;
}

// ── 真实案例 ──────────────────────────────────────────────────────────────

export type CaseCategory = 'bazi' | 'ziwei' | 'tarot' | 'fengshui' | 'naming' | 'divination';
export type CaseStatus = 'pending' | 'approved' | 'rejected' | 'deleted';

export interface CommunityCase {
  id: string;
  authorId: string;
  category: CaseCategory;
  title: string;
  summary: string;
  content: string;
  status: CaseStatus;
  feedbackCount: number;
  ratingSum: number;
  createdAt: string;
  updatedAt?: string;
  ready: boolean;
}

export interface CaseFeedback {
  id: string;
  caseId: string;
  authorId: string;
  /** 1~5 分 */
  rating: number;
  comment: string;
  createdAt: string;
}

// ── 枚举白名单（契约字段逐字命中） ────────────────────────────────────────

export const BOUNTY_STATUSES: BountyStatus[] = ['open', 'solved', 'closed'];
export const WALL_TYPES: WallShareType[] = ['birth', 'bazi', 'tarot', 'numerology', 'name', 'starmark'];
export const CASE_CATEGORIES: CaseCategory[] = ['bazi', 'ziwei', 'tarot', 'fengshui', 'naming', 'divination'];

/** 悬赏积分上下限（防止刷分 / 负数悬赏） */
export const BOUNTY_REWARD_MIN = 10;
export const BOUNTY_REWARD_MAX = 500;

/** 默认悬赏有效期（天） */
export const BOUNTY_TTL_DAYS = 7;

// ── KV 键前缀（新增段，不覆盖 models.ts 既有前缀） ────────────────────────

export const EXT_KV_PREFIXES = {
  BOUNTY: 'community:bounty:',
  BOUNTY_INDEX: 'community:bounty:idx:',
  ANSWER: 'community:answer:',
  ANSWER_BY_BOUNTY: 'community:answer:bounty:',
  ESCROW: 'community:escrow:',
  WALL: 'community:wall:',
  WALL_INDEX: 'community:wall:idx:',
  WALL_LIKE: 'community:wall:like:',
  CASE: 'community:case:',
  CASE_INDEX: 'community:case:idx:',
  CASE_FEEDBACK: 'community:case:feedback:',
  POINTS: 'community:points:',
} as const;
