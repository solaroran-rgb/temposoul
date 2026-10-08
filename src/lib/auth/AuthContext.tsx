import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { safeStorage } from '@/lib/safe-storage';
import {
  fetchMe,
  loginAccount,
  logoutAccount,
  registerAccount,
  requestOtp,
  verifyOtp,
  type AuthUser,
} from './api';
import { AUTH_TOKEN_KEY } from './token';
import { trackSignup } from '@/lib/analytics';
import { settleInvite } from '@/lib/growth/invite';

// token 键名统一走 ./token（ND-1 修复）
const TOKEN_KEY = AUTH_TOKEN_KEY;

// S-6b B2：登录/注册成功后结算邀请。不阻塞登录，失败静默。
// - 读 localStorage `growth:pendingInvite`（由 LoginPage 从 ?invite= 写入）；
// - 调用 settleInvite，结果不影响登录结果（granted 静默，其他分支也静默不打扰）；
// - 无论结果如何都清除 pendingInvite 与 URL 上的 invite 参数，避免下次登录重复结算。
function settlePendingInvite(): void {
  try {
    const token = safeStorage.get('growth:pendingInvite');
    if (!token) return;
    safeStorage.remove('growth:pendingInvite');
    try {
      settleInvite(token);
    } catch {
      /* 结算异常不阻塞登录 */
    }
    try {
      if (typeof window !== 'undefined' && window.location?.search) {
        const url = new URL(window.location.href);
        if (url.searchParams.has('invite')) {
          url.searchParams.delete('invite');
          window.history.replaceState(null, '', url.toString());
        }
      }
    } catch {
      /* URL 清理失败不影响登录 */
    }
  } catch {
    /* 整体静默 */
  }
}

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  unavailable: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, nickname: string) => Promise<boolean>;
  sendOtp: (email: string, locale: string) => Promise<boolean>;
  loginWithOtp: (email: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let active = true;
    const token = safeStorage.get(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe(token)
      .then((u) => {
        if (!active) return;
        if (u) setUser(u);
        else safeStorage.remove(TOKEN_KEY);
      })
      .catch(() => {
        if (active) setUnavailable(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    const r = await loginAccount(email.trim(), password);
    if (r.token && r.user) {
      safeStorage.set(TOKEN_KEY, r.token);
      setUser(r.user);
      return true;
    }
    if (r.error === 'auth_unavailable') setUnavailable(true);
    setError(r.error ?? 'login_failed');
    return false;
  }, []);

  const register = useCallback(async (email: string, password: string, nickname: string) => {
    setError(null);
    const r = await registerAccount(email.trim(), password, nickname.trim());
    if (r.token && r.user) {
      safeStorage.set(TOKEN_KEY, r.token);
      setUser(r.user);
      settlePendingInvite(); // S-6b B2：邀请结算（不阻塞）
      // T4 漏斗：注册成功
      trackSignup({ method: 'email' });
      return true;
    }
    if (r.error === 'auth_unavailable') setUnavailable(true);
    setError(r.error ?? 'register_failed');
    return false;
  }, []);

  const sendOtp = useCallback(async (email: string, locale: string) => {
    setError(null);
    const r = await requestOtp(email.trim(), locale);
    if (r.error === 'auth_unavailable') setUnavailable(true);
    // 端点防枚举恒 200：即使邮箱未注册也视为已受理（与密码登录口径一致）
    return !r.error;
  }, []);

  const loginWithOtp = useCallback(async (email: string, code: string) => {
    setError(null);
    const r = await verifyOtp(email.trim(), code.trim());
    if (r.token && r.user) {
      safeStorage.set(TOKEN_KEY, r.token);
      setUser(r.user);
      settlePendingInvite(); // S-6b B2：邀请结算（不阻塞）
      trackSignup({ method: 'email' });
      return true;
    }
    if (r.error === 'auth_unavailable') setUnavailable(true);
    setError(r.error ?? 'login_failed');
    return false;
  }, []);

  const logout = useCallback(async () => {
    const token = safeStorage.get(TOKEN_KEY);
    if (token) await logoutAccount(token).catch(() => {});
    safeStorage.remove(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, unavailable, login, register, sendOtp, loginWithOtp, logout }),
    [user, loading, error, unavailable, login, register, sendOtp, loginWithOtp, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
