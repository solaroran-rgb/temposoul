/**
 * 定价三锚常量表（A9 P7 冻结）
 *
 * 纪律：本文件【仅常量，不激活上线】——不放量开关、不接真实密钥、不改 PRODUCT_CATALOG。
 * 正式定价放量属【搁置·验收统一配置】，由老板预算到位后在收口处统一切。
 *
 * 数据纪律：
 *  - 国内三锚 ¥19.9 / ¥39 / ¥299 为任务卡 P7 冻结基线。
 *  - 海外 $4.99-14.99 【待核实V】（专家4 竞品定价 Co-Star $4.99 等未标待核实，按纪律弃用转【待核实V】）。
 *  - 分型溢价区间为 P7 冻结区间值，非实测转化数据。
 */

export type Currency = 'CNY' | 'USD';

export interface PriceAnchor {
  /** 锚点键 */
  key: string;
  /** 展示名 */
  label: string;
  /** 金额（元/美元） */
  amount: number;
  currency: Currency;
  /** 类型：单次 / 月卡 / 年卡 / 分型溢价 / StarMark 层级 / 海外参考 */
  kind: 'single' | 'monthly' | 'yearly' | 'report_premium' | 'starmark' | 'overseas';
  /** 备注 / 待核实标记 */
  note?: string;
}

/** 定价三锚（P7 基线） */
export const PRICING_ANCHORS: readonly PriceAnchor[] = [
  // —— 三锚主锚 ——
  { key: 'single_default', label: '单次报告', amount: 19.9, currency: 'CNY', kind: 'single', note: 'P7 基线单次锚' },
  { key: 'sub_monthly', label: '月卡', amount: 39, currency: 'CNY', kind: 'monthly', note: 'P7 基线月卡锚' },
  { key: 'sub_yearly', label: '年卡', amount: 299, currency: 'CNY', kind: 'yearly', note: 'P7 基线年卡锚' },

  // —— 报告分型溢价区间（区间锚，E1 实验定档） ——
  { key: 'report_liunian', label: '流年报告', amount: 29, currency: 'CNY', kind: 'report_premium', note: '溢价区间 ¥29-49' },
  { key: 'report_liunian_max', label: '流年报告上限', amount: 49, currency: 'CNY', kind: 'report_premium', note: '溢价区间 ¥29-49' },
  { key: 'report_hehun', label: '合婚报告', amount: 39, currency: 'CNY', kind: 'report_premium', note: '溢价区间 ¥39-59' },
  { key: 'report_hehun_max', label: '合婚报告上限', amount: 59, currency: 'CNY', kind: 'report_premium', note: '溢价区间 ¥39-59' },
  { key: 'report_qiming', label: '起名报告', amount: 19, currency: 'CNY', kind: 'report_premium', note: '溢价区间 ¥19-39' },
  { key: 'report_qiming_max', label: '起名报告上限', amount: 39, currency: 'CNY', kind: 'report_premium', note: '溢价区间 ¥19-39' },

  // —— StarMark 层级 ——
  { key: 'starmark_l2', label: 'StarMark L2', amount: 9.9, currency: 'CNY', kind: 'starmark', note: 'L2 锚' },
  { key: 'starmark_l3', label: 'StarMark L3', amount: 19.9, currency: 'CNY', kind: 'starmark', note: '溢价区间 ¥19.9-29.9' },
  { key: 'starmark_l3_max', label: 'StarMark L3 上限', amount: 29.9, currency: 'CNY', kind: 'starmark', note: '溢价区间 ¥19.9-29.9' },

  // —— 海外参考（未核实） ——
  { key: 'overseas_single', label: '海外单次参考', amount: 4.99, currency: 'USD', kind: 'overseas', note: '【待核实V】区间 $4.99-14.99，专家4 竞品价未标待核实，弃用转待核实' },
  { key: 'overseas_max', label: '海外上限参考', amount: 14.99, currency: 'USD', kind: 'overseas', note: '【待核实V】区间 $4.99-14.99' },
] as const;

/** 按量检索 */
export function findAnchor(key: string): PriceAnchor | undefined {
  return PRICING_ANCHORS.find((a) => a.key === key);
}

/** 放量开关常量（恒为 false，代码只声明不激活） */
export const PRICING_LIVE_ROLLOUT_ENABLED = false;
