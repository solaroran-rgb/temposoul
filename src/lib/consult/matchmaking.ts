/**
 * T13 · 专家连线二期 · 撮合队列服务
 *
 * 纯内存实现，无外部依赖。
 * 支持：入队 / 出队 / 超时释放 / 状态机。
 */

import type {
  Advisor,
  MatchEntry,
  MatchStatus,
  IMatchmakingService,
  Specialty,
} from './types';

const MATCH_TIMEOUT_MS = 60_000; // 60s 超时

export class InMemoryMatchmakingService implements IMatchmakingService {
  private queue: MatchEntry[] = [];
  private advisorIndex: Map<string, Advisor> = new Map();
  private nextEntryId = 1;

  setAdvisors(advisors: Advisor[]): void {
    this.advisorIndex = new Map(advisors.map((a) => [a.id, a]));
  }

  joinQueue(userId: string, specialty: Specialty): MatchEntry {
    const entry: MatchEntry = {
      id: `match-${String(this.nextEntryId++)}`,
      userId,
      specialty,
      queuedAt: Date.now(),
      status: 'pending',
    };
    this.queue.push(entry);
    return entry;
  }

  leaveQueue(userId: string): void {
    this.queue = this.queue.filter((e) => e.userId !== userId && e.status !== 'matched');
  }

  /**
   * 撮合逻辑：
   * 1. 过滤出线上且空闲的专家（按 specialty 匹配，优先 rating 高）
   * 2. 为队列头部 entry 分配专家
   * 3. 超时未接的 entry 标记 timed_out
   */
  processTicks(): void {
    const now = Date.now();
    const timedOut = this.queue.filter(
      (e) => e.status === 'pending' && now - e.queuedAt > MATCH_TIMEOUT_MS,
    );
    for (const entry of timedOut) {
      entry.status = 'timed_out';
    }
    this.queue = this.queue.filter((e) => e.status !== 'timed_out');

    // 尝试撮合 pending 的条目
    const pending = this.queue.filter((e) => e.status === 'pending');
    for (const entry of pending) {
      if (entry.status !== 'pending') continue;
      const candidate = this.findBestAdvisor(entry.specialty);
      if (candidate) {
        entry.matchedAdvisorId = candidate.id;
        entry.status = 'matched';
        entry.matchedAt = now;
      }
    }
  }

  pollQueue(userId: string): MatchEntry | null {
    // 每次轮询前刷新超时
    this.processTicks();
    return (
      this.queue.find((e) => e.userId === userId) ?? null
    );
  }

  getActiveMatches(): MatchEntry[] {
    this.processTicks();
    return this.queue.filter((e) => e.status === 'pending' || e.status === 'matched');
  }

  getMatchedAdvisor(advisorId: string): Advisor | undefined {
    return this.advisorIndex.get(advisorId);
  }

  private findBestAdvisor(specialty: Specialty): Advisor | null {
    const candidates = Array.from(this.advisorIndex.values()).filter(
      (a) => a.isOnline && a.specialty === specialty,
    );
    if (candidates.length === 0) return null;
    return candidates.sort((a, b) => b.rating - a.rating)[0]!;
  }
}
