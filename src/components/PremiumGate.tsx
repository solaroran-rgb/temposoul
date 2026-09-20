import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '@/i18n';
import { safeStorage } from '@/lib/safe-storage';
import { AUTH_TOKEN_KEY } from '@/lib/auth/token';
import { trackPaywallView, trackSubscribe } from '@/lib/analytics';

// token 键名统一走 lib/auth/token（ND-1 修复）
const TOKEN_KEY = AUTH_TOKEN_KEY;
const QUOTA_KEY_PREFIX = 'ts_ai_quota_';

type Tier = 'free' | 'premium' | 'unknown';
type GateState = 'checking' | 'unlocked' | 'locked';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readRemaining(quota: number): number {
  const key = `${QUOTA_KEY_PREFIX}${todayKey()}`;
  const raw = safeStorage.get(key);
  const n = Number(raw);
  if (Number.isInteger(n) && n >= 0 && n <= quota) return n;
  return quota;
}

function persistRemaining(_quota: number, remaining: number): void {
  safeStorage.set(`${QUOTA_KEY_PREFIX}${todayKey()}`, String(remaining));
}

/**
 * 订阅墙（P3 商业化 · 订阅墙首刀）
 * 用法：<PremiumGate quota={5}>受保护内容</PremiumGate>
 * 机制：
 *   - tier=premium（/api/v1/subscription 判定）→ 无限放行，不扣配额
 *   - 未登录 / free → 每日免费 quota 次（打开即扣 1，localStorage 计数，MVP 客户端配额）
 *   - 今日剩余 0 → 升级卡片（CTA 登录/注册；接支付后替换为支付链接）
 */
export function PremiumGate({ children, quota = 5 }: { children: ReactNode; quota?: number }) {
  const { t } = useI18n();
  const [tier, setTier] = useState<Tier>('unknown');
  const [remaining, setRemaining] = useState(() => readRemaining(quota));
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const consumedRef = useRef(false);
  const subscribeReportedRef = useRef(false);
  const paywallReportedRef = useRef(false);

  useEffect(() => {
    let active = true;
    const token = safeStorage.get(TOKEN_KEY);
    fetch('/api/v1/subscription', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => (res.ok ? res.json() : { tier: 'free' }))
      .then((data: { tier?: Tier }) => {
        if (!active) return;
        const next = data.tier === 'premium' ? 'premium' : 'free';
        setTier(next);
        // T5 漏斗：订阅（观测到 premium 档位；每次挂载只报一次）
        if (next === 'premium' && !subscribeReportedRef.current) {
          subscribeReportedRef.current = true;
          trackSubscribe({ tier: 'premium' });
        }
      })
      .catch(() => {
        if (active) setTier('free');
      });
    return () => {
      active = false;
    };
  }, []);

  // 打开即扣：free 用户渲染 children 时消费 1 次配额（每打开一次面板计一次）
  useEffect(() => {
    if (tier === 'premium' || consumedRef.current || remaining <= 0) return;
    consumedRef.current = true;
    const next = remaining - 1;
    setRemaining(next);
    persistRemaining(quota, next);
  }, [tier, remaining, quota]);

  const state: GateState = useMemo<GateState>(() => {
    if (tier === 'unknown') return 'checking';
    if (tier === 'premium') return 'unlocked';
    if (remaining > 0) return 'unlocked';
    return 'locked';
  }, [tier, remaining]);

  // T3 漏斗：订阅墙触发（免费额度耗尽、升级卡片可见；每次挂载只报一次）
  useEffect(() => {
    if (state !== 'locked' || paywallReportedRef.current) return;
    paywallReportedRef.current = true;
    trackPaywallView({ remaining, quota });
  }, [state, remaining, quota]);

  // Checkout：向 /api/v1/checkout 取托管收银台 URL（Lemon Squeezy，PayPal 备选）并跳转。
  // 未配置支付（503）或网络失败 → 优雅降级到登录/注册页（与仓库现有降级风格一致）。
  const startCheckout = useCallback(async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const token = safeStorage.get(TOKEN_KEY);
      const res = await fetch('/api/v1/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: '{}',
      });
      if (res.ok) {
        const data = (await res.json()) as { url?: string };
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  }, [checkoutLoading]);

  if (state === 'checking') {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0', color: '#8b93a7', fontSize: 13 }}>
        {t('common.loading')}
      </div>
    );
  }

  if (state === 'unlocked') {
    return <>{children}</>;
  }

  return (
    <div
      className="premium-gate"
      role="region"
      aria-label={t('premium.title')}
      style={{
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: 480,
        margin: '0 auto',
        padding: '20px 22px',
        borderRadius: 16,
        background: 'linear-gradient(135deg, rgba(255, 209, 102, 0.08), rgba(180, 140, 255, 0.14))',
        border: '1px solid rgba(255, 209, 102, 0.35)',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, color: '#ffd166', marginBottom: 6 }}>
        {t('premium.title')}
      </div>
      <div style={{ fontSize: 14, color: '#c6cbd8', marginBottom: 14 }}>{t('premium.desc')}</div>
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 14px', textAlign: 'left' }}>
        {(t('premium.perks') as unknown as string[]).map((perk) => (
          <li
            key={perk}
            style={{
              fontSize: 13,
              color: '#e8eaf0',
              padding: '5px 0 5px 22px',
              position: 'relative',
            }}
          >
            <span style={{ position: 'absolute', left: 0, color: '#7ecb9b' }}>✓</span>
            {perk}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={startCheckout}
        disabled={checkoutLoading}
        style={{
          display: 'inline-block',
          padding: '10px 28px',
          borderRadius: 10,
          background: 'linear-gradient(135deg, #ffd166, #b48cff)',
          color: '#1a1230',
          fontWeight: 700,
          fontSize: 14,
          border: 'none',
          cursor: checkoutLoading ? 'wait' : 'pointer',
          opacity: checkoutLoading ? 0.7 : 1,
        }}
      >
        {checkoutLoading ? t('common.loading') : t('premium.checkoutCta')}
      </button>
      <div style={{ fontSize: 11, color: '#8b93a7', marginTop: 12 }}>{t('premium.loginHint')}</div>
    </div>
  );
}
