/**
 * T13 · 会话模型 — 专家连线期后端数据层
 *
 * 纯内存实现，进程重启后数据清空。
 * 所有操作线程安全（Node.js 单线程事件循环）。
 */

import type { Conversation, ChatMessage, SessionStatus } from './types';

export class SessionModel {
  private conversations = new Map<string, Conversation>();
  private messages = new Map<string, ChatMessage[]>();

  create(userId: string, advisorId: string): Conversation {
    const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = Date.now();
    const conv: Conversation = {
      id,
      userId,
      advisorId,
      status: 'idle',
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(id, conv);
    this.messages.set(id, []);
    return conv;
  }

  getById(id: string): Conversation | undefined {
    return this.conversations.get(id);
  }

  updateStatus(id: string, status: SessionStatus): void {
    const conv = this.conversations.get(id);
    if (!conv) return;
    conv.status = status;
    conv.updatedAt = Date.now();
  }

  setStatus(status: SessionStatus, id: string): void {
    this.updateStatus(id, status);
  }

  appendMessage(sessionId: string, message: ChatMessage): void {
    const msgs = this.messages.get(sessionId);
    if (msgs) msgs.push(message);
  }

  getMessages(sessionId: string): ChatMessage[] {
    return this.messages.get(sessionId) ?? [];
  }

  listByUser(userId: string): Conversation[] {
    return Array.from(this.conversations.values()).filter((c) => c.userId === userId);
  }

  listByAdvisor(advisorId: string): Conversation[] {
    return Array.from(this.conversations.values()).filter((c) => c.advisorId === advisorId);
  }

  /** 活跃会话（等待 / 已匹配 / 进行中） */
  activeSessions(): Conversation[] {
    return Array.from(this.conversations.values()).filter((c) =>
      ['waiting', 'matched', 'active'].includes(c.status),
    );
  }
}

export const sessionModel = new SessionModel();
