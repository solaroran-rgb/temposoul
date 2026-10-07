/**
 * analytics.ts —— StarMark 埋点事件表（B3 六，P0 必须上线否则 M6 无法验证）
 *
 * 纪律：【不新建并行分析通道】。本模块只是事件名常量表 + 对既有
 *       src/lib/analytics 的 trackEvent 薄封装，provider 兼容（plausible/umami/ga/cf）。
 *
 * 事件链：page_land → param_preset_click → generate_start → generate_done
 *        → l1_render_done(ttfv_ms) → preview_interact → share_click(channel)
 *        → share_done → qr_scan → s_land → paywall_view → pay_start → pay_done
 *        → l3_start → l3_done → l3_share
 */
import { trackEvent } from '../analytics';

export const STAR_MARK_EVENTS = {
  pageLand: 'starmark_page_land',
  paramPresetClick: 'starmark_param_preset_click',
  generateStart: 'starmark_generate_start',
  generateDone: 'starmark_generate_done',
  l1RenderDone: 'starmark_l1_render_done',
  previewInteract: 'starmark_preview_interact',
  shareClick: 'starmark_share_click',
  shareDone: 'starmark_share_done',
  qrScan: 'starmark_qr_scan',
  sLand: 'starmark_s_land',
  paywallView: 'starmark_paywall_view',
  payStart: 'starmark_pay_start',
  payDone: 'starmark_pay_done',
  l3Start: 'starmark_l3_start',
  l3Done: 'starmark_l3_done',
  l3Share: 'starmark_l3_share',
} as const;

export type StarMarkEventName = (typeof STAR_MARK_EVENTS)[keyof typeof STAR_MARK_EVENTS];

/** 关键字段（所有事件都应尽量带齐；wechat_in 为必埋字段） */
export interface StarMarkProps {
  sky_id?: string;
  source?: string;
  channel?: string;
  utm?: string;
  is_return?: boolean;
  cohort_date?: string;
  device?: string;
  /** 必埋：是否微信内 H5（分享路径转化率差异大） */
  wechat_in?: boolean;
  preset_type?: string;
  /** l1_render_done 专用：首帧时间 ms */
  ttfv_ms?: number;
}

/** 统一埋点入口（转发到既有 trackEvent，provider 兼容） */
export function trackStarMark(event: StarMarkEventName, props: StarMarkProps = {}): void {
  trackEvent(event, { ...props });
}
