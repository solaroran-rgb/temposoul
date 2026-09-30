// F03 · 首页双分流门：用户分流（普通 / 专业）选择的持久化与埋点
// 选择写入 localStorage，跨会话生效；后续深度游标（F01）等卡片可复用 readUserTrack()。
import { safeStorage } from './safe-storage';
import { trackEvent } from './analytics';

export type UserTrack = 'casual' | 'pro';

const STORAGE_KEY = 'ts_user_track';

export function readUserTrack(): UserTrack | null {
  const raw = safeStorage.get(STORAGE_KEY);
  return raw === 'casual' || raw === 'pro' ? raw : null;
}

export function writeUserTrack(track: UserTrack): void {
  safeStorage.set(STORAGE_KEY, track);
}

export function trackUserTrackSelect(track: UserTrack, source: string): void {
  trackEvent('home_gate_select', { track, source });
}
