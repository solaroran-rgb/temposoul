/**
 * N-09 社区扩展存储层（悬赏 / 分享墙 / 案例 / 积分托管）
 *
 * 复用 AUTH_KV（与既有 forum 存储同命名空间），只新增键前缀，不动既有键（零连带）。
 * 索引键格式：`prefix + createdAt + ':' + id` —— ISO 字典序即时间序，支持 keyset 分页（禁 OFFSET）。
 */

import {
  EXT_KV_PREFIXES,
  BOUNTY_REWARD_MIN,
  BOUNTY_REWARD_MAX,
  BOUNTY_TTL_DAYS,
  type BountyQuestion,
  type BountyAnswer,
  type BountyStatus,
  type EscrowAction,
  type EscrowEntry,
  type WallShare,
  type WallShareType,
  type CommunityCase,
  type CaseCategory,
  type CaseFeedback,
} from './entities';

type CommunityKV = Omit<KVNamespace, 'list'> & {
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
    reverse?: boolean;
  }): Promise<{
    keys: Array<{ name: string; metadata?: unknown; value?: string }>;
    list_complete: boolean;
    cursor?: string;
  }>;
};

export interface Page<T> {
  items: T[];
  cursor?: string;
}

function timeKey(prefix: string, createdAt: string, id: string): string {
  return `${prefix}${createdAt}:${id}`;
}

function idFromKey(keyName: string): string {
  return keyName.slice(keyName.lastIndexOf(':') + 1);
}

export interface CommunityExtStore {
  // 积分
  getBalance(userId: string): Promise<number>;
  grantPoints(userId: string, points: number, note: string): Promise<number>;
  freezePoints(userId: string, points: number, bountyId: string): Promise<void>;
  settleEscrow(entry: Omit<EscrowEntry, 'id' | 'createdAt'>): Promise<void>;

  // 悬赏
  createBounty(input: {
    title: string;
    description: string;
    rewardPoints: number;
    authorId: string;
  }): Promise<BountyQuestion>;
  getBounty(id: string): Promise<BountyQuestion | null>;
  updateBounty(id: string, patch: Partial<BountyQuestion>): Promise<BountyQuestion | null>;
  listBounties(status: BountyStatus | undefined, limit: number, cursor?: string): Promise<Page<BountyQuestion>>;

  // 悬赏回答
  createAnswer(input: { bountyId: string; authorId: string; content: string }): Promise<BountyAnswer>;
  getAnswer(id: string): Promise<BountyAnswer | null>;
  updateAnswer(id: string, patch: Partial<BountyAnswer>): Promise<BountyAnswer | null>;
  listAnswers(bountyId: string, limit: number, cursor?: string): Promise<Page<BountyAnswer>>;

  // 分享墙
  createWallShare(input: {
    userId: string;
    type: WallShareType;
    refId: string;
    title: string;
    summary: string;
  }): Promise<WallShare>;
  getWallShare(id: string): Promise<WallShare | null>;
  listWallShares(type: WallShareType | undefined, limit: number, cursor?: string): Promise<Page<WallShare>>;
  toggleLike(shareId: string, userId: string): Promise<{ liked: boolean; likeCount: number }>;

  // 案例
  createCase(input: {
    authorId: string;
    category: CaseCategory;
    title: string;
    summary: string;
    content: string;
  }): Promise<CommunityCase>;
  getCase(id: string): Promise<CommunityCase | null>;
  listCases(category: CaseCategory | undefined, limit: number, cursor?: string): Promise<Page<CommunityCase>>;
  createCaseFeedback(input: {
    caseId: string;
    authorId: string;
    rating: number;
    comment: string;
  }): Promise<CaseFeedback | null>;
  listCaseFeedback(caseId: string, limit: number, cursor?: string): Promise<Page<CaseFeedback>>;

  // 限流
  checkRateLimit(key: string, max: number): Promise<{ allowed: boolean; current: number }>;
}

/** 生成短 ID */
function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function createCommunityExtStore(kv: CommunityKV): CommunityExtStore {
  async function readJSON<T>(key: string): Promise<T | null> {
    const raw = await kv.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async function listByPrefix<T>(
    prefix: string,
    limit: number,
    cursor: string | undefined,
    mapper: (id: string) => Promise<T | null>
  ): Promise<Page<T>> {
    const res = await kv.list({ prefix, limit, cursor, reverse: true });
    const items: T[] = [];
    for (const key of res.keys) {
      const item = await mapper(idFromKey(key.name));
      if (item) items.push(item);
    }
    return { items, cursor: res.list_complete ? undefined : res.cursor };
  }

  return {
    // ── 积分 ──────────────────────────────────────────────────────────────
    async getBalance(userId: string) {
      const raw = await kv.get(`${EXT_KV_PREFIXES.POINTS}${userId}`);
      return raw ? Number(raw) || 0 : 0;
    },

    async grantPoints(userId: string, points: number, note: string) {
      const current = await this.getBalance(userId);
      const next = Math.max(0, current + points);
      await kv.put(`${EXT_KV_PREFIXES.POINTS}${userId}`, String(next));
      await this.settleEscrow({ bountyId: 'system', action: 'release', points, userId, note });
      return next;
    },

    async freezePoints(userId: string, points: number, bountyId: string) {
      const current = await this.getBalance(userId);
      const next = Math.max(0, current - points);
      await kv.put(`${EXT_KV_PREFIXES.POINTS}${userId}`, String(next));
      await this.settleEscrow({ bountyId, action: 'freeze', points, userId, note: '悬赏冻结' });
    },

    async settleEscrow(entry) {
      const row: EscrowEntry = {
        ...entry,
        id: genId('esc'),
        createdAt: new Date().toISOString(),
      };
      await kv.put(`${EXT_KV_PREFIXES.ESCROW}${row.id}`, JSON.stringify(row));
    },

    // ── 悬赏 ──────────────────────────────────────────────────────────────
    async createBounty(input) {
      const reward = Math.trunc(input.rewardPoints);
      if (!Number.isFinite(reward) || reward < BOUNTY_REWARD_MIN || reward > BOUNTY_REWARD_MAX) {
        throw new StoreError('invalid_reward_points', 400);
      }
      const balance = await this.getBalance(input.authorId);
      if (balance < reward) {
        throw new StoreError('insufficient_points', 402);
      }
      const now = new Date();
      const bounty: BountyQuestion = {
        id: genId('bounty'),
        title: input.title,
        description: input.description,
        rewardPoints: reward,
        status: 'open',
        authorId: input.authorId,
        createdAt: now.toISOString(),
        answerCount: 0,
        expiresAt: new Date(now.getTime() + BOUNTY_TTL_DAYS * 86_400_000).toISOString(),
        settled: false,
        ready: true,
      };
      await kv.put(`${EXT_KV_PREFIXES.BOUNTY}${bounty.id}`, JSON.stringify(bounty));
      await kv.put(timeKey(EXT_KV_PREFIXES.BOUNTY_INDEX, bounty.createdAt, bounty.id), bounty.id);
      await this.freezePoints(input.authorId, reward, bounty.id);
      return bounty;
    },

    async getBounty(id) {
      return readJSON<BountyQuestion>(`${EXT_KV_PREFIXES.BOUNTY}${id}`);
    },

    async updateBounty(id, patch) {
      const existing = await this.getBounty(id);
      if (!existing) return null;
      const updated: BountyQuestion = {
        ...existing,
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      await kv.put(`${EXT_KV_PREFIXES.BOUNTY}${id}`, JSON.stringify(updated));
      return updated;
    },

    async listBounties(status, limit, cursor) {
      const all = await listByPrefix<BountyQuestion>(EXT_KV_PREFIXES.BOUNTY_INDEX, limit, cursor, id =>
        this.getBounty(id)
      );
      // 惰性过期结算：open 且已过期 → closed + 退回
      const now = Date.now();
      const items: BountyQuestion[] = [];
      for (const b of all.items) {
        let item = b;
        if (item.status === 'open' && !item.settled && new Date(item.expiresAt).getTime() < now) {
          await this.settleEscrow({
            bountyId: item.id,
            action: 'refund',
            points: item.rewardPoints,
            userId: item.authorId,
            note: '过期退回',
          });
          const refunded = (await this.getBalance(item.authorId)) + item.rewardPoints;
          await kv.put(`${EXT_KV_PREFIXES.POINTS}${item.authorId}`, String(refunded));
          item =
            (await this.updateBounty(item.id, { status: 'closed', settled: true })) ?? item;
        }
        if (!status || item.status === status) items.push(item);
      }
      return { items, cursor: all.cursor };
    },

    // ── 悬赏回答 ──────────────────────────────────────────────────────────
    async createAnswer(input) {
      const answer: BountyAnswer = {
        id: genId('ans'),
        bountyId: input.bountyId,
        authorId: input.authorId,
        content: input.content,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      await kv.put(`${EXT_KV_PREFIXES.ANSWER}${answer.id}`, JSON.stringify(answer));
      await kv.put(timeKey(EXT_KV_PREFIXES.ANSWER_BY_BOUNTY + input.bountyId + ':', answer.createdAt, answer.id), answer.id);
      const bounty = await this.getBounty(input.bountyId);
      if (bounty) await this.updateBounty(input.bountyId, { answerCount: bounty.answerCount + 1 });
      return answer;
    },

    async getAnswer(id) {
      return readJSON<BountyAnswer>(`${EXT_KV_PREFIXES.ANSWER}${id}`);
    },

    async updateAnswer(id, patch) {
      const existing = await this.getAnswer(id);
      if (!existing) return null;
      const updated: BountyAnswer = { ...existing, ...patch, updatedAt: new Date().toISOString() };
      await kv.put(`${EXT_KV_PREFIXES.ANSWER}${id}`, JSON.stringify(updated));
      return updated;
    },

    async listAnswers(bountyId, limit, cursor) {
      return listByPrefix<BountyAnswer>(`${EXT_KV_PREFIXES.ANSWER_BY_BOUNTY}${bountyId}:`, limit, cursor, id =>
        this.getAnswer(id)
      );
    },

    // ── 分享墙 ────────────────────────────────────────────────────────────
    async createWallShare(input) {
      const share: WallShare = {
        id: genId('wall'),
        userId: input.userId,
        type: input.type,
        refId: input.refId,
        title: input.title,
        summary: input.summary,
        shareToken: Math.random().toString(36).slice(2, 12) + Date.now().toString(36),
        likeCount: 0,
        status: 'published',
        createdAt: new Date().toISOString(),
        ready: true,
      };
      await kv.put(`${EXT_KV_PREFIXES.WALL}${share.id}`, JSON.stringify(share));
      await kv.put(timeKey(EXT_KV_PREFIXES.WALL_INDEX, share.createdAt, share.id), share.id);
      return share;
    },

    async getWallShare(id) {
      return readJSON<WallShare>(`${EXT_KV_PREFIXES.WALL}${id}`);
    },

    async listWallShares(type, limit, cursor) {
      const page = await listByPrefix<WallShare>(EXT_KV_PREFIXES.WALL_INDEX, limit, cursor, id =>
        this.getWallShare(id)
      );
      const items = page.items.filter(s => s.status === 'published' && (!type || s.type === type));
      return { items, cursor: page.cursor };
    },

    async toggleLike(shareId, userId) {
      const share = await this.getWallShare(shareId);
      if (!share) throw new StoreError('share_not_found', 404);
      const likeKey = `${EXT_KV_PREFIXES.WALL_LIKE}${shareId}:${userId}`;
      const existing = await kv.get(likeKey);
      let likeCount = share.likeCount;
      let liked: boolean;
      if (existing) {
        await kv.delete(likeKey);
        likeCount = Math.max(0, likeCount - 1);
        liked = false;
      } else {
        await kv.put(likeKey, '1');
        likeCount += 1;
        liked = true;
      }
      await kv.put(`${EXT_KV_PREFIXES.WALL}${shareId}`, JSON.stringify({ ...share, likeCount }));
      return { liked, likeCount };
    },

    // ── 案例 ──────────────────────────────────────────────────────────────
    async createCase(input) {
      const row: CommunityCase = {
        id: genId('case'),
        authorId: input.authorId,
        category: input.category,
        title: input.title,
        summary: input.summary,
        content: input.content,
        status: 'pending',
        feedbackCount: 0,
        ratingSum: 0,
        createdAt: new Date().toISOString(),
        ready: true,
      };
      await kv.put(`${EXT_KV_PREFIXES.CASE}${row.id}`, JSON.stringify(row));
      await kv.put(timeKey(EXT_KV_PREFIXES.CASE_INDEX, row.createdAt, row.id), row.id);
      return row;
    },

    async getCase(id) {
      return readJSON<CommunityCase>(`${EXT_KV_PREFIXES.CASE}${id}`);
    },

    async listCases(category, limit, cursor) {
      const page = await listByPrefix<CommunityCase>(EXT_KV_PREFIXES.CASE_INDEX, limit, cursor, id =>
        this.getCase(id)
      );
      const items = page.items.filter(c => c.status === 'approved' && (!category || c.category === category));
      return { items, cursor: page.cursor };
    },

    async createCaseFeedback(input) {
      const target = await this.getCase(input.caseId);
      if (!target) return null;
      const fb: CaseFeedback = {
        id: genId('cfb'),
        caseId: input.caseId,
        authorId: input.authorId,
        rating: Math.min(5, Math.max(1, Math.trunc(input.rating))),
        comment: input.comment,
        createdAt: new Date().toISOString(),
      };
      await kv.put(`${EXT_KV_PREFIXES.CASE_FEEDBACK}${fb.id}`, JSON.stringify(fb));
      await kv.put(
        `${EXT_KV_PREFIXES.CASE}${input.caseId}`,
        JSON.stringify({
          ...target,
          feedbackCount: target.feedbackCount + 1,
          ratingSum: target.ratingSum + fb.rating,
        })
      );
      return fb;
    },

    async listCaseFeedback(caseId, limit, cursor) {
      const page = await listByPrefix<CaseFeedback>(EXT_KV_PREFIXES.CASE_FEEDBACK, limit, cursor, id =>
        readJSON<CaseFeedback>(`${EXT_KV_PREFIXES.CASE_FEEDBACK}${id}`)
      );
      return { items: page.items.filter(f => f.caseId === caseId), cursor: page.cursor };
    },

    // ── 限流 ──────────────────────────────────────────────────────────────
    async checkRateLimit(key, max) {
      const minute = Math.floor(Date.now() / 60_000);
      const rlKey = `rl:${key}:${minute}`;
      const current = parseInt((await kv.get(rlKey)) || '0', 10);
      const allowed = current < max;
      if (allowed) {
        await kv.put(rlKey, String(current + 1), { expirationTtl: 120 });
      }
      return { allowed, current: current + (allowed ? 1 : 0) };
    },
  };
}

/** 存储层业务错误（携带 HTTP 状态码，由路由层统一转译） */
export class StoreError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'StoreError';
  }
}

/** 积分动作白名单导出，供路由层校验使用 */
export const EXT_RATE_LIMITS = {
  BOUNTY_PER_MINUTE: 3,
  ANSWER_PER_MINUTE: 10,
  WALL_PER_MINUTE: 10,
  CASE_PER_MINUTE: 5,
} as const;

export type { EscrowAction, BountyStatus };
