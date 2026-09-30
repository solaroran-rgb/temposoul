/**
 * 社区 UGC KV 存储层
 * 
 * 设计：
 * - Post: KV_PREFIXES.POST + id → Post
 * - Post 索引（按版块+时间）：KV_PREFIXES.POST_BY_BOARD + boardId + ':' + createdAt + ':' + id → id
 * - Comment: KV_PREFIXES.COMMENT + id → Comment
 * - Comment 索引（按帖子+时间）：KV_PREFIXES.COMMENT_BY_POST + postId + ':' + createdAt + ':' + id → id
 * - Report: KV_PREFIXES.REPORT + id → Report
 * - Review: KV_PREFIXES.REVIEW + id → ReviewRecord
 * - Board: KV_PREFIXES.BOARD + id → Board (可选，初期用内存)
 * 
 * 注意：KV list 支持前缀查询 + limit，可用于分页。createdAt 按 ISO 字符串排序兼容字典序。
 */

import { KV_PREFIXES, type Post, type Comment, type Report, type ReviewRecord, type Board } from './models';

// 项目全局 KVNamespace（functions/worker.d.ts）的 list() 选项未含 reverse，
// 本存储层需要按 reverse 倒序分页，故在本地补一个最小结构类型面（仅类型，不改运行逻辑）。
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

export interface CommunityKVStore {
  // Post
  createPost(post: Post): Promise<void>;
  getPost(id: string): Promise<Post | null>;
  updatePost(id: string, patch: Partial<Post>): Promise<void>;
  deletePost(id: string): Promise<void>;
  listPosts(boardId: string | undefined, limit: number, cursor?: string): Promise<{ items: Post[]; cursor?: string }>;
  
  // Comment
  createComment(comment: Comment): Promise<void>;
  getComment(id: string): Promise<Comment | null>;
  updateComment(id: string, patch: Partial<Comment>): Promise<void>;
  deleteComment(id: string): Promise<void>;
  listComments(postId: string, limit: number, cursor?: string): Promise<{ items: Comment[]; cursor?: string }>;
  
  // Report
  createReport(report: Report): Promise<void>;
  getReport(id: string): Promise<Report | null>;
  updateReport(id: string, patch: Partial<Report>): Promise<void>;
  listReports(status?: string, limit?: number, cursor?: string): Promise<{ items: Report[]; cursor?: string }>;
  
  // Review
  createReview(review: ReviewRecord): Promise<void>;
  
  // Board (初期用内存，可选)
  listBoards(): Promise<Board[]>;
  
  // Rate limit
  checkRateLimit(key: string, max: number): Promise<{ allowed: boolean; current: number }>;
}

/** 生成按时间排序的复合键 */
function genTimeKey(prefix: string, entityId: string, createdAt: string): string {
  // ISO 字符串按字典序即按时间序，格式：prefix + entityId + ':' + createdAt + ':' + id
  return `${prefix}${entityId}:${createdAt}:${entityId}`;
}

export function createCommunityKVStore(kv: CommunityKV): CommunityKVStore {
  return {
    // ── Post ──
    async createPost(post: Post) {
      await Promise.all([
        kv.put(`${KV_PREFIXES.POST}${post.id}`, JSON.stringify(post)),
        kv.put(genTimeKey(KV_PREFIXES.POST_BY_BOARD, post.boardId, post.createdAt), post.id),
      ]);
    },
    
    async getPost(id: string): Promise<Post | null> {
      const raw = await kv.get(`${KV_PREFIXES.POST}${id}`);
      return raw ? JSON.parse(raw) : null;
    },
    
    async updatePost(id: string, patch: Partial<Post>) {
      const existing = await this.getPost(id);
      if (!existing) return;
      const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
      await kv.put(`${KV_PREFIXES.POST}${id}`, JSON.stringify(updated));
    },
    
    async deletePost(id: string) {
      const post = await this.getPost(id);
      if (!post) return;
      await Promise.all([
        kv.delete(`${KV_PREFIXES.POST}${id}`),
        kv.delete(genTimeKey(KV_PREFIXES.POST_BY_BOARD, post.boardId, post.createdAt)),
      ]);
    },
    
    async listPosts(boardId: string | undefined, limit: number, cursor?: string) {
      const prefix = boardId ? `${KV_PREFIXES.POST_BY_BOARD}${boardId}:` : KV_PREFIXES.POST_BY_BOARD;
      const listResult = await kv.list({ prefix, limit, cursor, reverse: true }); // reverse = 新到旧
      
      const items: Post[] = [];
      for (const key of listResult.keys) {
        const postId = key.name.split(':').pop()!;
        const post = await this.getPost(postId);
        if (post) items.push(post);
      }
      
      return {
        items,
        cursor: listResult.list_complete ? undefined : listResult.cursor,
      };
    },
    
    // ── Comment ──
    async createComment(comment: Comment) {
      await Promise.all([
        kv.put(`${KV_PREFIXES.COMMENT}${comment.id}`, JSON.stringify(comment)),
        kv.put(genTimeKey(KV_PREFIXES.COMMENT_BY_POST, comment.postId, comment.createdAt), comment.id),
      ]);
    },
    
    async getComment(id: string): Promise<Comment | null> {
      const raw = await kv.get(`${KV_PREFIXES.COMMENT}${id}`);
      return raw ? JSON.parse(raw) : null;
    },
    
    async updateComment(id: string, patch: Partial<Comment>) {
      const existing = await this.getComment(id);
      if (!existing) return;
      const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
      await kv.put(`${KV_PREFIXES.COMMENT}${id}`, JSON.stringify(updated));
    },
    
    async deleteComment(id: string) {
      const comment = await this.getComment(id);
      if (!comment) return;
      await Promise.all([
        kv.delete(`${KV_PREFIXES.COMMENT}${id}`),
        kv.delete(genTimeKey(KV_PREFIXES.COMMENT_BY_POST, comment.postId, comment.createdAt)),
      ]);
    },
    
    async listComments(postId: string, limit: number, cursor?: string) {
      const prefix = `${KV_PREFIXES.COMMENT_BY_POST}${postId}:`;
      const listResult = await kv.list({ prefix, limit, cursor, reverse: true });
      
      const items: Comment[] = [];
      for (const key of listResult.keys) {
        const commentId = key.name.split(':').pop()!;
        const comment = await this.getComment(commentId);
        if (comment) items.push(comment);
      }
      
      return {
        items,
        cursor: listResult.list_complete ? undefined : listResult.cursor,
      };
    },
    
    // ── Report ──
    async createReport(report: Report) {
      await kv.put(`${KV_PREFIXES.REPORT}${report.id}`, JSON.stringify(report));
    },
    
    async getReport(id: string): Promise<Report | null> {
      const raw = await kv.get(`${KV_PREFIXES.REPORT}${id}`);
      return raw ? JSON.parse(raw) : null;
    },
    
    async updateReport(id: string, patch: Partial<Report>) {
      const existing = await this.getReport(id);
      if (!existing) return;
      const updated = { ...existing, ...patch };
      await kv.put(`${KV_PREFIXES.REPORT}${id}`, JSON.stringify(updated));
    },
    
    async listReports(status?: string, limit = 20, cursor?: string) {
      const prefix = KV_PREFIXES.REPORT;
      const listResult = await kv.list({ prefix, limit, cursor, reverse: true });
      
      const items: Report[] = [];
      for (const key of listResult.keys) {
        const reportId = key.name.slice(prefix.length);
        const report = await this.getReport(reportId);
        if (report && (!status || report.status === status)) {
          items.push(report);
        }
      }
      
      return {
        items,
        cursor: listResult.list_complete ? undefined : listResult.cursor,
      };
    },
    
    // ── Review ──
    async createReview(review: ReviewRecord) {
      await kv.put(`${KV_PREFIXES.REVIEW}${review.id}`, JSON.stringify(review));
    },
    
    // ── Board ──
    async listBoards(): Promise<Board[]> {
      // 初期使用内存默认版块，后续可迁移到 KV
      return [
        { id: 'bazi', name: '八字命理', desc: '四柱八字的讨论与案例', postCount: 0 },
        { id: 'naming', name: '姓名学', desc: '起名、改名与姓名文化', postCount: 0 },
        { id: 'tarot', name: '塔罗占卜', desc: '塔罗牌阵与解读交流', postCount: 0 },
        { id: 'community', name: '社区闲聊', desc: '站务反馈与轻松话题', postCount: 0 },
      ];
    },
    
    // ── Rate limit ──
    async checkRateLimit(key: string, max: number) {
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

/** 生成短 ID */
export function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}