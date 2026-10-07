/**
 * Entitlement 权益层（A9 P0 第一交付·地基）
 *
 * 设计依据：任务卡 A9 B5 定稿「二、Entitlement 权益层」。
 * 五条业务线（单次报告 / 订阅 / StarMark / 合婚送礼 / 咨询）共用一套权限判断，
 * 不在各业务线散落 if/else 权限分支。
 *
 * 配额闸门：每次深度解读（真实 LLM 边际成本）调用前先过「权益校验 + 配额扣减」，
 * 扣减成功才放行 LLM。免费层 AI 解读 0 次（见 freeSkeleton.ts）。
 *
 * 存储：对齐既有 CF KV（AUTH_KV）主事实源；D1 未绑定不影响主流程。
 * KV key 约定：`ent:<userId>` → JSON { items: Record<EntitlementKey, EntitlementGrant[]> }
 */

/** 六键权益清单（任务卡冻结，不可增删键名） */
export type EntitlementKey =
  | 'report.deep' // AI 深度解读（LLM 成本中心）
  | 'report.pdf' // 完整 PDF 导出 / 去水印
  | 'skymap.pro' // 专业星图
  | 'starmark.l2' // StarMark L2
  | 'starmark.l3' // StarMark L3
  | 'consult.session'; // 咨询场次

export const ENTITLEMENT_KEYS: readonly EntitlementKey[] = [
  'report.deep',
  'report.pdf',
  'skymap.pro',
  'starmark.l2',
  'starmark.l3',
  'consult.session',
] as const;

/** 配额类型 */
export type QuotaType =
  | 'count' // 次数：quotaValue=总次数，remaining 随扣减递减
  | 'period' // 时长：quotaValue=有效天数，窗口内可访问（可选周期内次数软上限）
  | 'once'; // 永久：一次授予长期有效，不随单次调用消耗

/** 权益来源（审计/对账口径） */
export type EntitlementSource =
  | 'single' // 单次购买授予
  | 'subscription' // 订阅授予
  | 'gift' // 赠送（裂变双端奖励 / 礼物）
  | 'compensation'; // 补偿（客诉/故障补偿）

export const ENTITLEMENT_SOURCES: readonly EntitlementSource[] = [
  'single',
  'subscription',
  'gift',
  'compensation',
] as const;

/** 周期重置（count 类配额的自然日/周/月重置；none=不重置） */
export type ResetCycle = 'none' | 'day' | 'week' | 'month';

/** 单条权益授予记录（同一 key 可有多条 grant，按来源叠加） */
export interface EntitlementGrant {
  /** 权益键 */
  key: EntitlementKey;
  /** 配额类型 */
  quotaType: QuotaType;
  /**
   * 配额值：
   * - count：总次数
   * - period：有效天数
   * - once：固定 1
   */
  quotaValue: number;
  /** count 类型：剩余次数（period/once 不使用） */
  remaining?: number;
  /** count 重置周期 */
  resetCycle: ResetCycle;
  /** 来源 */
  source: EntitlementSource;
  /** 授予时间 ISO */
  grantedAt: string;
  /** 失效时间 ISO（period 由授予方写入；once 一般不写） */
  expiresAt?: string;
  /** 关联订单 / 交易号（对账溯源） */
  ref?: string;
  /** 最近一次 count 窗口重置锚点 ISO（用于按 resetCycle 重置 remaining） */
  lastResetAt?: string;
}

/** 用户权益容器（落 KV 的 JSON 结构） */
export interface EntitlementBag {
  version: 1;
  items: Partial<Record<EntitlementKey, EntitlementGrant[]>>;
  updatedAt: string;
}

/** 权益查询结果（不含扣减） */
export interface AccessCheck {
  allowed: boolean;
  key: EntitlementKey;
  /** 命中的 grant（allowed 时存在） */
  grant?: EntitlementGrant;
  /** count：当前剩余次数（聚合所有有效 grant）；period/once 不返回 */
  remainingCount?: number;
  /** 拒绝原因 */
  reason?:
    | 'no_entitlement' // 无该权益
    | 'expired' // 权益已过有效期
    | 'quota_exhausted' // 次数用尽
    | 'invalid_user'; // 匿名/未登录
}

/** 扣减结果 */
export type ConsumeResult =
  | { allowed: true; key: EntitlementKey; remainingCount: number; source: EntitlementSource }
  | { allowed: false; key: EntitlementKey; reason: AccessCheck['reason'] };

/** 健康检查常量：免费层默认额度（0 LLM；仅规则骨架）。E2 实验调参。 */
export const FREE_LAYER_DEEP_LLM_CALLS = 0;

/** KV key 前缀 */
export const ENT_KV_PREFIX = 'ent:';
