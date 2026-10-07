// 口径统一（修复批次2 P0-2）：免费层 = 3 次免费排盘 + 规则骨架解读，AI 深度解读为订阅/单次权益（FREE_LAYER_DEEP_LLM_CALLS=0）
// 2026-09-17 M1：购买/订阅按钮由 alert 占位桩接线至 /api/v1/checkout（Lemon Squeezy）
// 未配置支付（503 commerce_unavailable）/ 未登录（403）时优雅降级到登录页，不假装支付成功。
import React, { useCallback, useEffect, useState } from 'react';
import { trackPricingView } from '../../lib/analytics';
import { getAuthToken } from '../../lib/auth/token';
import { SeoHead } from '../../components/SeoHead';
import { PaymentConsent } from '../../components/commerce/PaymentConsent';
import './PricingPage.css';

// 对齐后端 PRODUCT_CATALOG（src/lib/server/payment.ts）的 productId 取值
type ProductId = 'event_9_9' | 'report_39_9' | 'sub_monthly_19_9';

export const PricingPage: React.FC = () => {
  const [loadingId, setLoadingId] = useState<ProductId | null>(null);
  // P0-3：付费下单必须先过 PaymentConsent 双同意门控。
  // 点击付费 CTA 不再直接发 checkout，而是挂起待提交商品 → 弹出同意面板；
  // 面板勾选完成后才由 PaymentConsent 的提交按钮回调触发真正的 startCheckout。
  const [pendingProduct, setPendingProduct] = useState<{ id: ProductId; name: string } | null>(null);

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
        description="命律 TempoSoul 会员与单次报告定价：免费层含每日 3 次免费排盘与规则骨架解读，AI 深度解读为订阅权益。"
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
            onClick={() => setPendingProduct({ id: 'event_9_9', name: '新客首单 ¥9.9' })}
          >
            {loadingId === 'event_9_9' ? '正在跳转…' : '¥9.9 立即体验'}
          </button>
        </section>

        <section className="pricing-card pricing-card--free">
          <h2 className="pricing-card__name">基础版</h2>
          <div className="pricing-card__price">¥0</div>
          <ul className="pricing-card__features">
            <li>✅ 每日 3 次免费排盘 + 规则骨架解读（AI 深度解读为订阅权益）</li>
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
            onClick={() => setPendingProduct({ id: 'report_39_9', name: '单次深度报告' })}
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
            onClick={() => setPendingProduct({ id: 'sub_monthly_19_9', name: 'Pro 会员订阅' })}
          >
            {loadingId === 'sub_monthly_19_9' ? '正在跳转…' : '开启订阅'}
          </button>
          <p className="pricing-card__auto-renew">订阅将自动续费，您可随时在账户设置中取消。</p>
        </section>
      </main>

      {/* P0-3 付费双同意门控：仅在用户选定付费档位后出现；
          免费档（¥0「当前方案」disabled）不进入此流程，无任何强制勾选。 */}
      {pendingProduct && (
        <div
          className="pricing-page__consent"
          style={{ maxWidth: 480, margin: '0 auto', padding: '8px 22px 40px' }}
        >
          <PaymentConsent
            submitLabel={`确认并支付 · ${pendingProduct.name}`}
            onSubmit={() => startCheckout(pendingProduct.id, pendingProduct.name)}
          />
        </div>
      )}
    </div>
  );
};

export default PricingPage;
