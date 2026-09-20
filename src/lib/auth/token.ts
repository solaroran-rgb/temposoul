/**
 * 统一认证 token 存取层（ND-1 修复）。
 *
 * 历史上 `ts_auth_token` 字面量散落在 PremiumGate / AuthContext / PricingPage /
 * RefundPage / TenDimReportPage 五处，且部分用裸 localStorage、部分走 safeStorage，
 * 隐私模式（localStorage 被禁）下读写不一致。本模块收敛为单一键名常量 +
 * safeStorage 背书的 get/set/clear，杜绝键名漂移与隐私模式异常。
 */
import { safeStorage } from '@/lib/safe-storage';

/** 全局唯一认证 token 存储键名，所有读写必须经此常量。 */
export const AUTH_TOKEN_KEY = 'ts_auth_token';

/** 读取当前认证 token（隐私模式 / storage 不可用时返回 null）。 */
export function getAuthToken(): string | null {
  return safeStorage.get(AUTH_TOKEN_KEY);
}

/** 写入认证 token（成功返回 true）。 */
export function setAuthToken(token: string): boolean {
  return safeStorage.set(AUTH_TOKEN_KEY, token);
}

/** 清除认证 token（登出时调用，静默忽略存储异常）。 */
export function clearAuthToken(): void {
  safeStorage.remove(AUTH_TOKEN_KEY);
}
