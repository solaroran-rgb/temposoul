// 终版修正：决策 22 依据，文案精确对齐“每日 3 次免费 AI 深度解读额度”
// 2026-09-17 M1：购买/订阅按钮由 alert 占位桩接线至 /api/v1/checkout（Lemon Squeezy）
// 未配置支付（503 commerce_unavailable）/ 未登录（403）时优雅降级到登录页，不假装支付成功。
import React, { useCallback, useEffect, useState } from 'react';
import { trackPricingView } from '../../lib/analytics';
import { getAuthToken } from '../../lib/auth/token';
import { SeoHead } from '../../components/SeoHead';
import './PricingPage.css';

// 对齐后端 PRODUCT_CATALOG（src/lib/server/payment.ts）的 productId 取值
type ProductId = 'event_9_9' | 'report_39_9' | 'sub_monthly_19_9';

export const PricingPage: React.FC = () => {
  const [loadingId, setLoadingId] = useState<ProductId | null>(null);

  useEffect(() => {
    trackPricingView();
  }, []);

  // 与 PremiumGate 一致：POST /api/v1/checkout 取托管收银台 URL 并跳转。
  const startCheckout = useCallback(
    async (productId: ProductId, _planName: string) => {
      if (loadingId) return;
      setLoadingId(productId);
      try {
        const token = getAuthToken() || '';
        const res = await fetch('/api/v1/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ productId }),
        });
        if (res.ok) {
          const data = (await res.json()) as { url?: string };
          if (data.url) {
            window.location.href = data.url;
            return;
          }
        }
        // 支付未接通（503）/ 需登录（403）→ 引导登录，保持空态
        window.location.href = '/login';
      } catch {
        window.location.href = '/login';
      } finally {
        setLoadingId(null);
      }
    },
    [loadingId],
  );

  return (
    <div className="pricing-page">
      <SeoHead
        title="定价方案 · 命律 TempoSoul"
        description="命律 TempoSoul 会员与单次报告定价，每日 3 次免费 AI 深度解读额度。"
      />
      <header className="pricing-page__header">
        <h1 className="pricing-page__title">选择适合您的命理探索方案</h1>
        <p className="pricing-page__disclaimer">
          ⚠️ 价格为测试值，以最终结算页为准。所有价格均含税 (¥)。
        </p>
      </header>

      <main className="pricing-page__cards">
        <section className="pricing-card pricing-card--single">
          <div className="pricing-card__badge">新客首单</div>
          <h2 className="pricing-card__name">首单体验</h2>
          <div className="pricing-card__price">
            ¥9.9 <span className="pricing-card__unit">/首次</span>
          </div>
          <ul className="pricing-card__features">
            <li>✅ 新用户首单专享价</li>
            <li>✅ 单次事件单购 · 排盘后可解锁</li>
            <li>✅ 限购 1 次，退款后不可复购</li>
          </ul>
          <button
            className="pricing-card__btn pricing-card__btn--primary"
            disabled={loadingId !== null}
            onClick={() => startCheckout('event_9_9', '新客首单 ¥9.9')}
          >
            {loadingId === 'event_9_9' ? '正在跳转…' : '¥9.9 立即体验'}
          </button>
        </section>

        <section className="pricing-card pricing-card--free">
          <h2 className="pricing-card__name">基础版</h2>
          <div className="pricing-card__price">¥0</div>
          <ul className="pricing-card__features">
            <li>✅ 每日 3 次免费 AI 深度解读额度</li>
            <li>✅ 基础八字 / 紫微排盘</li>
            <li>✅ 1180+ 命理词库无限制访问</li>
          </ul>
          <button className="pricing-card__btn pricing-card__btn--current" disabled>
            当前方案
          </button>
        </section>

        <section className="pricing-card pricing-card--single" id="single">
          <h2 className="pricing-card__name">单次深度报告</h2>
          <div className="pricing-card__price">
            ¥39.9 <span className="pricing-card__unit">/份</span>
          </div>
          <ul className="pricing-card__features">
            <li>✅ 专属 AI 深度命盘解读 (无字数限制)</li>
            <li>✅ 大运 / 流年专项触发证据分析</li>
            <li>✅ 高清全息主题命盘分享卡片导出</li>
          </ul>
          <button
            className="pricing-card__btn pricing-card__btn--primary"
            disabled={loadingId !== null}
            onClick={() => startCheckout('report_39_9', '单次深度报告')}
          >
            {loadingId === 'report_39_9' ? '正在跳转…' : '立即购买'}
          </button>
        </section>

        <section className="pricing-card pricing-card--pro" id="pro">
          <div className="pricing-card__badge">推荐</div>
          <h2 className="pricing-card__name">Pro 会员订阅</h2>
          <div className="pricing-card__price">
            ¥19.9 <span className="pricing-card__unit">/月</span>
          </div>
          <ul className="pricing-card__features">
            <li>✅ 无限次 AI 深度解读额度</li>
            <li>✅ 解锁所有高级占卜与双人合盘功能</li>
            <li>✅ 优先客服支持与专属云端命理档案</li>
          </ul>
          <button
            className="pricing-card__btn pricing-card__btn--primary"
            disabled={loadingId !== null}
            onClick={() => startCheckout('sub_monthly_19_9', 'Pro 会员订阅')}
          >
            {loadingId === 'sub_monthly_19_9' ? '正在跳转…' : '开启订阅'}
          </button>
          <p className="pricing-card__auto-renew">订阅将自动续费，您可随时在账户设置中取消。</p>
        </section>
      </main>
    </div>
  );
};

export default PricingPage;
