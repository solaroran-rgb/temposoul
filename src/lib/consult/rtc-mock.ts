/**
 * T13 · 专家连线二期 · RTC 接口抽象 + mock 实现
 *
 * 第三方 RTC 服务（LiveKit / 自建 SFU 等）选型待用户拍板。
 * 本实现提供可替换接口层，全流程可跑通但使用 mock token/channel。
 */

import type {
  RtcSession,
  RtcSignalingEvent,
  IRtcService,
  MediaMode,
} from './types';

const RTC_TOKEN_PREFIX = 'mock-rtc-token-';
const RTC_CHANNEL_PREFIX = 'temposoul-';

export class MockRtcService implements IRtcService {
  private sessions: Map<string, RtcSession> = new Map();
  private signals: Map<string, RtcSignalingEvent[]> = new Map();
  private nextId = 1;

  createSession(
    sessionId: string,
    userId: string,
    advisorId: string,
    mediaMode: MediaMode,
  ): RtcSession {
    const session: RtcSession = {
      id: `rtc-${String(this.nextId++)}`,
      sessionId,
      userId,
      advisorId,
      role: 'host',
      mediaMode,
      status: 'creating',
      token: RTC_TOKEN_PREFIX + session.id,
      channel: RTC_CHANNEL_PREFIX + sessionId,
      createdAt: Date.now(),
    };
    this.sessions.set(session.id, session);
    this.signals.set(session.sessionId, []);
    this.signals.get(session.sessionId)!.push({
      type: 'offer',
      sessionId,
      from: userId,
      payload: { sdpType: 'offer', sdp: 'mock-offer-sdp' },
      timestamp: Date.now(),
    });
    return session;
  }

  joinSession(sessionId: string, userId: string): RtcSession | null {
    const session = Array.from(this.sessions.values()).find(
      (s) => s.sessionId === sessionId,
    );
    if (!session || session.status !== 'creating') return null;
    session.userId = userId;
    session.advisorId = userId;
    session.role = 'guest';
    session.status = 'joined';
    session.joinedAt = Date.now();
    this.signals.get(session.sessionId)!.push({
      type: 'answer',
      sessionId,
      from: userId,
      to: session.userId,
      payload: { sdpType: 'answer', sdp: 'mock-answer-sdp' },
      timestamp: Date.now(),
    });
    return session;
  }

  leaveSession(sessionId: string, userId: string): void {
    const session = Array.from(this.sessions.values()).find(
      (s) => s.sessionId === sessionId && s.userId === userId,
    );
    if (!session) return;
    session.status = 'left';
    this.signals.get(session.sessionId)!.push({
      type: 'leave',
      sessionId,
      from: userId,
      timestamp: Date.now(),
    });
  }

  getSignalEvents(sessionId: string, from?: string): RtcSignalingEvent[] {
    const events = this.signals.get(sessionId) ?? [];
    return from ? events.filter((e) => e.from === from || e.to === from) : events;
  }

  relaySignal(fromUserId: string, sessionId: string, event: RtcSignalingEvent): void {
    const existing = this.signals.get(sessionId) ?? [];
    existing.push({ ...event, from: fromUserId, timestamp: Date.now() });
    this.signals.set(sessionId, existing);
  }

  getActiveSessions(): RtcSession[] {
    return Array.from(this.sessions.values()).filter(
      (s) => s.status === 'creating' || s.status === 'joined',
    );
  }
}
