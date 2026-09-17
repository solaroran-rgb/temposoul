/**
 * 报告域埋点事件族（AARRR 扩展）
 * 复用 src/lib/analytics/index.ts 的 trackEvent，失败不阻塞主流程。
 * 事件命名 snake_case，与既有 FUNNEL_EVENTS（T0-T5）并存，不覆盖。
 * 高频事件（evidence_toggle / plain_toggle）300ms 节流，防事件洪水。
 */
import { trackEvent } from './index';

export const REPORT_EVENTS = {
  REPORT_VIEW: 'report_view',
  REPORT_DIM_EXPAND: 'report_dim_expand',
  REPORT_EVIDENCE_TOGGLE: 'report_evidence_toggle',
  REPORT_PLAIN_TOGGLE: 'report_plain_toggle',
  REPORT_SHARE_OPEN: 'report_share_open',
  REPORT_SHARE_DOWNLOAD: 'report_share_download',
  REPORT_PAYWALL_VIEW: 'report_paywall_view',
  REPORT_WAITLIST_SUBMIT: 'report_waitlist_submit',
  REPORT_LOAD_ERROR: 'report_load_error',
  REPORT_STATUS_CHANGE: 'report_status_change',
} as const;

export type ReportEventName = (typeof REPORT_EVENTS)[keyof typeof REPORT_EVENTS];

function safeTrack(name: ReportEventName, props?: Record<string, unknown>): void {
  try {
    trackEvent(name, props);
  } catch {
    /* 埋点失败不阻塞主流程 */
  }
}

const THROTTLE_WINDOW_MS = 300;
const lastFiredAt: Record<string, number> = {};

function throttledTrack(key: string, name: ReportEventName, props?: Record<string, unknown>): void {
  const now = Date.now();
  const last = lastFiredAt[key] ?? 0;
  if (now - last < THROTTLE_WINDOW_MS) return;
  lastFiredAt[key] = now;
  safeTrack(name, props);
}

export function trackReportView(props: { reportId: string; tier: 'free' | 'premium' }): void {
  safeTrack(REPORT_EVENTS.REPORT_VIEW, props);
}

export function trackReportDimensionExpand(props: { reportId: string; dimension: string }): void {
  safeTrack(REPORT_EVENTS.REPORT_DIM_EXPAND, props);
}

export function trackReportEvidenceToggle(props: {
  reportId: string;
  dimension: string;
  open: boolean;
}): void {
  throttledTrack(
    `evidence:${props.reportId}:${props.dimension}:${String(props.open)}`,
    REPORT_EVENTS.REPORT_EVIDENCE_TOGGLE,
    props,
  );
}

export function trackReportPlainToggle(props: {
  reportId: string;
  dimension: string;
  on: boolean;
}): void {
  throttledTrack(
    `plain:${props.reportId}:${props.dimension}:${String(props.on)}`,
    REPORT_EVENTS.REPORT_PLAIN_TOGGLE,
    props,
  );
}

export function trackReportShareOpen(props: { reportId: string; page: number }): void {
  safeTrack(REPORT_EVENTS.REPORT_SHARE_OPEN, props);
}

export function trackReportShareDownload(props: { reportId: string; page: number }): void {
  safeTrack(REPORT_EVENTS.REPORT_SHARE_DOWNLOAD, props);
}

export function trackReportPaywallView(props: { reportId: string; reason: string }): void {
  safeTrack(REPORT_EVENTS.REPORT_PAYWALL_VIEW, props);
}

export function trackReportWaitlistSubmit(props: { source: string; domain: string }): void {
  // 只上报邮箱域名，绝不上报邮箱明文
  safeTrack(REPORT_EVENTS.REPORT_WAITLIST_SUBMIT, props);
}

export function trackReportLoadError(props: { reportId: string; reason: string }): void {
  safeTrack(REPORT_EVENTS.REPORT_LOAD_ERROR, props);
}

export function trackReportStatusChange(props: {
  reportId: string;
  from: string;
  to: string;
}): void {
  safeTrack(REPORT_EVENTS.REPORT_STATUS_CHANGE, props);
}
