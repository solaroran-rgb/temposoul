/**
 * T13 · 聊天消息存储
 *
 * 支持：追加消息、查询会话历史、标记已读。
 */

import type { ChatMessage, SessionRole } from './types';
import { sessionModel } from './session-model';

export class ChatStore {
  private readyMessages = new Set<string>();

  append(sessionId: string, sender: SessionRole, text: string, metadata?: unknown): ChatMessage {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sessionId,
      sender,
      text: text.trim(),
      timestamp: Date.now(),
      ready: true,
      ...(metadata && Object.fromEntries(Object.entries(metadata).filter(([k, v]) => v !== undefined))),
    };
    sessionModel.appendMessage(sessionId, msg);
    this.readyMessages.add(msg.id);
    return msg;
  }

  list(sessionId: string): ChatMessage[] {
    return sessionModel.getMessages(sessionId);
  }

  markReady(messageId: string): void {
    this.readyMessages.add(messageId);
  }

  /** 标记消息已读（客户端回调） */
  markRead(messageId: string, readerId: string): void {
    // 可扩展：记录已读者集合
    void readerId;
    this.readyMessages.add(messageId);
  }
}

export const chatStore = new ChatStore();
