import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useI18n } from '@/i18n';
import { safeStorage } from '@/lib/safe-storage';
import { AUTH_TOKEN_KEY } from '@/lib/auth/token';
import { trackPaywallView, trackSubscribe } from '@/lib/analytics';
import { freeTierGateState } from '@/lib/entitlement/freeTierGate';
import { PaymentConsent } from './commerce/PaymentConsent';

// token 键名统一走 lib/auth/token（ND-1 修复）
const TOKEN_KEY = AUTH_TOKEN_KEY;

type Tier = 'free' | 'premium' | 'unknown';
type GateState = 'checking' | 'unlocked' | 'locked';

/**
 * 订阅墙（P3 商业化 · 订阅墙）
 * 用法：<PremiumGate>受保护内容</PremiumGate>
 *   （旧版 quota prop 仅保留在类型上以向后兼容，不再授予任何免费 LLM 额度。）
 *
 * 口径（冻结，修复批次2 P0-2）：
 *   - 免费层 = 规则骨架版，0 次 AI 深度解读（FREE_LAYER_DEEP_LLM_CALLS=0）。
 *   - AI 深度解读（report.deep）为订阅/单次权益，服务端由 consumeEntitlement 闸口判定，
 *     不再有客户端 localStorage「每日 N 次放行 LLM」逻辑（原 quota=5 已移除）。
 *   - tier=premium（/api/v1/subscription 判定）→ 放行 children；
 *   - 未登录 / free → 一律展示升级引导（规则骨架版），不产生任何 LLM 配额计数。
 */
export function PremiumGate({ children }: { children: ReactNode; quota?: number }) {
  const { t } = useI18n();
  const [tier, setTier] = useState<Tier>('unknown');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
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

  // 纯函数门态：free/匿名 → locked（规则骨架版引导），不再读写 localStorage LLM 配额。
  const state: GateState = useMemo<GateState>(() => freeTierGateState(tier), [tier]);

  // T3 漏斗：订阅墙触发（免费层升级卡片可见；每次挂载只报一次）。免费层 LLM 配额恒为 0。
  useEffect(() => {
    if (state !== 'locked' || paywallReportedRef.current) return;
    paywallReportedRef.current = true;
    trackPaywallView({ remaining: 0, quota: 0 });
  }, [state]);

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
      <div style={{ fontSize: 14, color: '#c6cbd8', marginBottom: 6 }}>{t('premium.desc')}</div>
      <div style={{ fontSize: 12, color: '#8b93a7', marginBottom: 14 }}>{t('premium.quotaHint')}</div>
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
      {/* P0-3：升级订阅走 PaymentConsent 双同意门控后才发 /api/v1/checkout。
          startCheckout 自身已带 checkoutLoading 重入保护，重复点击为空操作。 */}
      <PaymentConsent
        submitLabel={checkoutLoading ? t('common.loading') : t('premium.checkoutCta')}
        onSubmit={startCheckout}
      />
      <div style={{ fontSize: 11, color: '#8b93a7', marginTop: 12 }}>{t('premium.loginHint')}</div>
    </div>
  );
}
