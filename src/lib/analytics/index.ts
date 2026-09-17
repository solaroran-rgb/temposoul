export type AnalyticsProvider = 'plausible' | 'umami' | 'ga' | 'cf' | 'none';

export type AnalyticsConfig = {
  provider: AnalyticsProvider;
  url?: string;
  siteId?: string;
};

type RuntimeAnalytics = {
  analyticsProvider?: string;
  analyticsUrl?: string;
  analyticsSiteId?: string;
};

let current: AnalyticsConfig = { provider: 'none' };
let initialized = false;

function castWindow(): { __TEMPOSOUL_RUNTIME_CONFIG__?: RuntimeAnalytics } {
  return window as unknown as { __TEMPOSOUL_RUNTIME_CONFIG__?: RuntimeAnalytics };
}

export function initAnalyticsFromRuntime(): void {
  if (initialized) return;
  initialized = true;
  const rt = castWindow().__TEMPOSOUL_RUNTIME_CONFIG__;
  if (rt?.analyticsProvider && rt.analyticsProvider !== 'none') {
    const provider = rt.analyticsProvider as AnalyticsProvider;
    const cfg: AnalyticsConfig = { provider, url: rt.analyticsUrl, siteId: rt.analyticsSiteId };
    current = cfg;
    injectScript(cfg);
  }
}

function injectScript(cfg: AnalyticsConfig): void {
  if (cfg.provider === 'none' || !cfg.url || !cfg.siteId) return;
  if (document.getElementById(`analytics-${cfg.provider}`)) return;

  const s = document.createElement('script');
  s.id = `analytics-${cfg.provider}`;
  s.async = true;
  s.defer = true;

  if (cfg.provider === 'plausible') {
    s.src = cfg.url;
    s.setAttribute('data-domain', cfg.siteId);
  } else if (cfg.provider === 'umami') {
    s.src = cfg.url;
    s.setAttribute('data-website-id', cfg.siteId);
  } else if (cfg.provider === 'ga') {
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cfg.siteId)}`;
  } else if (cfg.provider === 'cf') {
    // Cloudflare Web Analytics（免费）：beacon.min.js + data-cf-beacon
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: cfg.siteId, spa: true }));
  }
  document.head.appendChild(s);
}

export function trackPageView(path: string): void {
  if (current.provider === 'none' || current.provider === 'cf') return;
  const w = window as unknown as {
    plausible?: (e: string, o?: unknown) => void;
    umami?: (e: string, o?: unknown) => void;
  };
  if (current.provider === 'plausible' && w.plausible) {
    w.plausible('pageview', { u: path });
  } else if (current.provider === 'umami' && w.umami) {
    w.umami('pageview', { url: path });
  }
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  if (current.provider === 'none') return;
  const w = window as unknown as {
    plausible?: (e: string, o?: unknown) => void;
    umami?: (e: string, o?: unknown) => void;
    // Cloudflare Web Analytics 自定义事件队列：beacon.min.js 加载后由 CF 接管消费
    _cf?: Array<unknown[]>;
  };
  if (current.provider === 'cf') {
    // CF Web Analytics 自定义事件：window._cf.push(['event', { name, ...props }])
    if (!Array.isArray(w._cf)) w._cf = [];
    w._cf.push(['event', { name, ...(props ?? {}) }]);
    return;
  }
  if (current.provider === 'plausible' && w.plausible) {
    w.plausible(name, props);
  } else if (current.provider === 'umami' && w.umami) {
    w.umami('event', { name, props });
  }
}

/**
 * 商业化漏斗事件（T0-T5）
 * 定义与属性见 docs/commerce/2026-09-11-funnel-events.md
 * 命名与 Cloudflare Web Analytics 自定义事件对齐（snake_case）。
 */
export const FUNNEL_EVENTS = {
  /** T0 排盘提交 */
  chartSubmit: 'chart_submit',
  /** T1 结果生成 */
  chartResult: 'chart_result',
  /** T2 AI 解读 */
  aiInterpret: 'ai_interpret',
  /** T3 订阅墙触发 */
  paywallView: 'paywall_view',
  /** T4 注册 */
  signup: 'signup',
  /** T5 订阅 */
  subscribe: 'subscribe',
} as const;

export type FunnelEventName = (typeof FUNNEL_EVENTS)[keyof typeof FUNNEL_EVENTS];

/** T0 排盘提交：用户在输入页通过校验并跳转到结果页时 */
export function trackChartSubmit(props: { mode: string; trueSolarTime: boolean }): void {
  trackEvent(FUNNEL_EVENTS.chartSubmit, props);
}

/** T1 结果生成：结果页加载、排盘结果渲染完成时 */
export function trackChartResult(props: { mode: string; promptSource?: string }): void {
  trackEvent(FUNNEL_EVENTS.chartResult, props);
}

/** T2 AI 解读：触发一次 AI 解读（初次 analyze / 追问 ask） */
export function trackAiInterpret(props: { source: 'initial' | 'followup' }): void {
  trackEvent(FUNNEL_EVENTS.aiInterpret, props);
}

/** T3 订阅墙触发：免费用户今日额度耗尽、看到升级卡片时 */
export function trackPaywallView(props: { remaining: number; quota: number }): void {
  trackEvent(FUNNEL_EVENTS.paywallView, props);
}

/** T4 注册：账号注册成功时 */
export function trackSignup(props: { method: string }): void {
  trackEvent(FUNNEL_EVENTS.signup, props);
}

/** T5 订阅：观测到 premium 档位（支付完成回调 / premium 用户回访）时 */
export function trackSubscribe(props: { tier: string }): void {
  trackEvent(FUNNEL_EVENTS.subscribe, props);
}

// 终版修正：IT-1.8 依据，新增埋点函数实现，与现有 trackEvent 分发模式严格对齐

// 假设现有 trackEvent 签名如下（若本地已有，则以此为类型参考）
// declare function trackEvent(eventName: string, props?: Record<string, any>): void;

export function trackSearch(props: { query: string }): void {
  trackEvent('search', props);
}

export function trackPricingView(props?: { tier?: 'free' | 'single' | 'pro' }): void {
  trackEvent('pricing_view', props || {});
}

export function trackNameTestSubmit(props: { nameLength: number }): void {
  trackEvent('name_test_submit', props);
}

export function trackNameGenerate(props: { surnameLength: number }): void {
  trackEvent('name_generate', props);
}
