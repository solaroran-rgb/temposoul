/** T13 · 专家连线二期 · 类型定义 */

// ── 专家 ──────────────────────────────────────────────────────────────────────
export type Specialty = 'bazi' | 'ziwei' | 'tarot' | 'astrology' | 'other';

export interface Advisor {
  id: string;
  name: string;
  specialty: Specialty;
  rating: number;
  isOnline: boolean;
  intro: string;
  price: number;
  ready: boolean;
}

// ── 会话 ──────────────────────────────────────────────────────────────────────
export type SessionRole = 'user' | 'advisor';
export type SessionStatus = 'idle' | 'waiting' | 'matched' | 'active' | 'ended';

export interface Conversation {
  id: string;
  userId: string;
  advisorId: string;
  status: SessionStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: SessionRole;
  text: string;
  timestamp: number;
  ready: boolean;
}

// ── 撮合队列 ──────────────────────────────────────────────────────────────────
export type MatchStatus = 'pending' | 'matched' | 'timed_out' | 'expired';

export interface MatchEntry {
  id: string;
  userId: string;
  specialty: Specialty;
  queuedAt: number;
  status: MatchStatus;
  matchedAdvisorId?: string;
  matchedAt?: number;
}

// ── RTC 接口抽象 ──────────────────────────────────────────────────────────────
export type RtcSessionStatus = 'pending' | 'creating' | 'joined' | 'left' | 'failed';
export type RtcRole = 'host' | 'guest';
export type MediaMode = 'audio' | 'video';

export interface RtcSession {
  id: string;
  sessionId: string;          // 关联 Conversation.id
  userId: string;
  advisorId: string;
  role: RtcRole;
  mediaMode: MediaMode;
  status: RtcSessionStatus;
  token?: string;
  channel?: string;
  userIdTag?: string;
  createdAt: number;
  joinedAt?: number;
}

export interface RtcSignalingEvent {
  type: 'offer' | 'answer' | 'candidate' | 'leave' | 'error';
  sessionId: string;
  from: string;
  to?: string;
  payload?: unknown;
  timestamp: number;
}

// ── 接口定义 ──────────────────────────────────────────────────────────────────
export interface IMatchmakingService {
  joinQueue(userId: string, specialty: Specialty): MatchEntry;
  leaveQueue(userId: string): void;
  processTicks(): void;
  pollQueue(userId: string): MatchEntry | null;
  getActiveMatches(): MatchEntry[];
}

export interface IRtcService {
  createSession(sessionId: string, userId: string, advisorId: string, mediaMode: MediaMode): RtcSession;
  joinSession(sessionId: string, userId: string): RtcSession | null;
  leaveSession(sessionId: string, userId: string): void;
  getSignalEvents(sessionId: string, from?: string): RtcSignalingEvent[];
  relaySignal(fromUserId: string, sessionId: string, event: RtcSignalingEvent): void;
  getActiveSessions(): RtcSession[];
}

// ── API 响应契约 ──────────────────────────────────────────────────────────────
export interface ApiSuccess<T> {
  ok: true;
  data: T;
  meta: { service: string; version: string; timestamp: string };
}

export interface ApiFailure {
  ok: false;
  error: { code: string; message: string };
  meta: { service: string; version: string; timestamp: string };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
