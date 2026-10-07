/**
 * A9 增长埋点 10 事件（最小集）
 *
 * 命名规范与既有 funnel（T0-T5: chart_submit / chart_result / ai_interpret /
 * paywall_view / signup / subscribe）及 A5 每日星图埋点字典
 * （card_view / share_success / deep_link_click / liuyao_question_submit …）
 * 保持一致：snake_case、动词_名词，只带结构化维度，不传手机号/姓名/出生时间等个人数据。
 *
 * 统一入口：复用 trackEvent(name, props)（src/lib/analytics/index.ts），
 * 不新建并行分析通道。GA4 双写留接口说明（见本文件末尾），P0 不实现。
 *
 * 服务端落库：见 src/lib/server/event-log.ts（对账源，写 KV）。
 */
import { trackEvent } from './index';

/** A9 十事件名（冻结） */
export const GROWTH_EVENTS = {
  /** 排盘结果生成（结果页渲染完成） */
  chartGenerated: 'chart_generated',
  /** 报告预览（前2页水印预览可见） */
  reportPreviewView: 'report_preview_view',
  /** 付费墙触发（复用既有 T3 paywall_view，不重复定义） */
  paywallView: 'paywall_view',
  /** 购买成功（单次/礼包） */
  purchaseSuccess: 'purchase_success',
  /** 订阅开始（trial→active / 首扣成功） */
  subStart: 'sub_start',
  /** 订阅续费成功 */
  subRenewSuccess: 'sub_renew_success',
  /** 用户取消订阅（期末生效） */
  subCancel: 'sub_cancel',
  /** StarMark 分享（分享者行为） */
  starmarkShare: 'starmark_share',
  /** 裂变落地（回流者，带 ref_code，30 天归因窗） */
  viralLanding: 'viral_landing',
  /** 退款申请 */
  refundRequest: 'refund_request',
} as const;

export type GrowthEventName = (typeof GROWTH_EVENTS)[keyof typeof GROWTH_EVENTS];

/** 各事件关键字段 schema（结构化维度，禁个人敏感信息） */
export const GROWTH_EVENT_SCHEMAS: Record<GrowthEventName, Record<string, string>> = {
  chart_generated: { mode: 'single|compatibility', system: 'bazi|ziwei|astrolabe|…' },
  report_preview_view: { reportType: 'liunian|hehun|qiming', watermarked: 'boolean' },
  paywall_view: { remaining: 'number', quota: 'number' },
  purchase_success: { productId: 'string', amount: 'number', currency: 'string', orderType: 'one_time|subscription' },
  sub_start: { planId: 'monthly|yearly', source: 'single|gift|…', trial: 'boolean' },
  sub_renew_success: { planId: 'monthly|yearly', retry: 'boolean' },
  sub_cancel: { planId: 'monthly|yearly', reason: 'string?', atPeriodEnd: 'boolean' },
  starmark_share: { layer: 'l2|l3', channel: 'wechat|link|…' },
  viral_landing: { ref_code: 'string', withinWindow: 'boolean' },
  refund_request: { orderId: 'string', amount: 'number', reason: 'string?' },
};

/** 校验 props 是否包含该事件必填键（纯函数，单测用；宽松校验，不强制类型值） */
export function validateGrowthEventProps(
  name: GrowthEventName,
  props: Record<string, unknown>,
): { ok: boolean; missing: string[] } {
  const schema = GROWTH_EVENT_SCHEMAS[name] ?? {};
  const required = Object.keys(schema).filter((k) => !k.endsWith('?'));
  const missing = required.filter((k) => props[k] === undefined);
  return { ok: missing.length === 0, missing };
}

/* ---------------- 前端 track 包装（复用统一 trackEvent 入口） ---------------- */

export function trackChartGenerated(props: { mode: string; system: string }): void {
  trackEvent(GROWTH_EVENTS.chartGenerated, props);
}
export function trackReportPreviewView(props: { reportType: string; watermarked: boolean }): void {
  trackEvent(GROWTH_EVENTS.reportPreviewView, props);
}
export function trackPurchaseSuccess(props: {
  productId: string;
  amount: number;
  currency: string;
  orderType: string;
}): void {
  trackEvent(GROWTH_EVENTS.purchaseSuccess, props);
}
export function trackSubStart(props: { planId: string; source: string; trial: boolean }): void {
  trackEvent(GROWTH_EVENTS.subStart, props);
}
export function trackSubRenewSuccess(props: { planId: string; retry: boolean }): void {
  trackEvent(GROWTH_EVENTS.subRenewSuccess, props);
}
export function trackSubCancel(props: {
  planId: string;
  reason?: string;
  atPeriodEnd: boolean;
}): void {
  trackEvent(GROWTH_EVENTS.subCancel, props);
}
export function trackStarmarkShare(props: { layer: string; channel: string }): void {
  trackEvent(GROWTH_EVENTS.starmarkShare, props);
}
export function trackViralLanding(props: { ref_code: string; withinWindow: boolean }): void {
  trackEvent(GROWTH_EVENTS.viralLanding, props);
}
export function trackRefundRequest(props: { orderId: string; amount: number; reason?: string }): void {
  trackEvent(GROWTH_EVENTS.refundRequest, props);
}

/**
 * GA4 双写（留接口，P0 不实现）：
 *  需求：GA4 看渠道概览，自研算毛利/LTV；GDPR 未同意即不发送。
 *  预留点：在 trackEvent 之后追加一个 if (consentGiven && typeof gtag==='function')
 *  的 gtag('event', name, props)。本卡不接 gtag（不引入 GA4 脚本与 consent banner）。
 */
