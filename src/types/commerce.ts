/**
 * D23-1 ｜ 商业化结算契约（平台内部工单号）
 *
 * 红线：
 * - 金额一律以「分」为单位（整数），展示层自行换算为 ¥。
 * - 不接入真实支付网关，不下发支付订单号；人工排期 / 线下收款后由客服回填 actualAmount。
 * - serviceType 目前仅 manual_naming，保留联合类型位便于后续扩展。
 */

/** 工单结算状态机（R2 方案 ② 原文落地） */
export enum BillingStatus {
  /** 待人工复核（前端 Mock 提交后的初始态） */
  PENDING_REVIEW = 'PENDING_REVIEW',
  /** 已确认（客服确认档位与金额） */
  CONFIRMED = 'CONFIRMED',
  /** 已结算（线下收款完成，actualAmount 已回填） */
  SETTLED = 'SETTLED',
  /** 已退款 */
  REFUNDED = 'REFUNDED',
  /** 已取消 */
  CANCELLED = 'CANCELLED',
}

/** 手工起名服务类型（当前仅一种，留作扩展位） */
export type ManualNamingServiceType = 'manual_naming';

/** 服务档位 ID */
export type ManualNamingTierId = 'standard' | 'premium' | 'luxury';

/**
 * 平台内部结算工单号（非支付订单号）。
 * orderId 由平台前端按确定性规则生成，供客服线下流转 / 站内 /consult 通道核对。
 */
export interface CommercialWorkOrder {
  /** 平台生成的唯一工单号 */
  orderId: string;
  /** 服务类型 */
  serviceType: ManualNamingServiceType;
  /** 档位 ID */
  tierId: ManualNamingTierId;
  /** 预期金额（分），财务展示默认货币 ¥ */
  expectedAmount: number;
  /** 实际收款金额（分），线下收款后由客服回填；提交时为 0 */
  actualAmount: number;
  /** 工单状态 */
  status: BillingStatus;
  /** 创建时间戳（ms） */
  createdAt: number;
}

/** 手工起名提交请求体 */
export interface ManualNamingRequest {
  /** 请求 ID（与 orderId 同源派生） */
  requestId: string;
  /** 档位 ID */
  tierId: ManualNamingTierId;
  /** 宝宝信息 */
  babyInfo: {
    gender: 'male' | 'female' | 'unknown';
    /** 公历日期 YYYY-MM-DD，可选 */
    birthDate?: string;
    /** 姓氏（必填） */
    surname: string;
  };
  /** 家长起名诉求（自由文本） */
  parentRequirements: string;
  /** 联系邮箱 */
  contactEmail: string;
  /** 是否已勾选《文化咨询服务条款》（必须为 true 才允许提交） */
  agreedToTerms: boolean;
}

/** 档位静态描述（展示用，金额单位：分） */
export interface ManualNamingTier {
  tierId: ManualNamingTierId;
  /** 档位名（中文展示） */
  name: string;
  /** 预期金额（分） */
  expectedAmount: number;
  /** 预计交付时长（自然日） */
  turnaroundDays: number;
  /** 档位说明 */
  description: string;
}

/** 三档静态配置 */
export const MANUAL_NAMING_TIERS: readonly ManualNamingTier[] = [
  {
    tierId: 'standard',
    name: '标准版',
    expectedAmount: 69900, // ¥699.00
    turnaroundDays: 7,
    description: '3 个候选名 + 简要五行笔画说明，适合追求效率的家庭。',
  },
  {
    tierId: 'premium',
    name: '进阶版',
    expectedAmount: 129900, // ¥1299.00
    turnaroundDays: 10,
    description: '6 个候选名 + 完整姓名学分析报告，含用字寓意与读音建议。',
  },
  {
    tierId: 'luxury',
    name: '尊享版',
    expectedAmount: 269900, // ¥2699.00
    turnaroundDays: 15,
    description: '10 个候选名 + 深度定制报告 + 一轮售后答疑，含重名风险排查。',
  },
] as const;

/**
 * 确定性 ID 生成器（djb2 风格，禁止 Math.random / Date.now 参与哈希）。
 * 同一 seed 永远得到同一结果，便于审计回溯；仅在 seed 内混入时间戳保证每次提交唯一。
 */
function djb2Hex(seed: string): string {
  let hash = 5381;
  for (let i = 0; i < seed.length; i += 1) {
    // hash * 33 + charCode，>>>0 强制 uint32，跨端稳定
    hash = ((hash << 5) + hash + seed.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16).padStart(8, '0');
}

/**
 * 生成确定性「UUID 形态」工单号：xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx。
 * y 段固定为 8/9/a/b，模拟 RFC4122 v4 形状但内容完全由 seed 决定。
 */
export function generateDeterministicOrderId(seed: string): string {
  const a = djb2Hex('ws:' + seed + ':a');
  const b = djb2Hex('ws:' + seed + ':b').slice(0, 4);
  const c = '4' + djb2Hex('ws:' + seed + ':c').slice(1, 4);
  const d = ((parseInt(djb2Hex('ws:' + seed + ':d').slice(0, 1), 16) & 0x3) | 0x8).toString(16);
  const e = djb2Hex('ws:' + seed + ':e');
  return `${a}-${b}-${c}-${d}${djb2Hex('ws:' + seed + ':f').slice(0, 3)}-${e}`;
}

/**
 * 全链路 traceId（确定性）。
 * 业务侧调用 trackEvent 时把 traceId 放入 props，保证一次提交链路可审计。
 */
export function generateTraceId(seed: string): string {
  return 'trace-' + djb2Hex('trace:' + seed);
}
