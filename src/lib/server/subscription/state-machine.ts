/**
 * 订阅状态机（A9 P0③）
 *
 * 在国内外双通道（LemonSqueezy / PayPal / 未来微信支付宝）之上抽象一层 SubscriptionService，
 * 业务侧只认这层状态，不感知具体支付通道。
 *
 * 状态：trial / active / past_due / canceled / expired
 * 规则（任务卡冻结）：
 *  - 到期前 3 天与 1 天双提醒（复用 mailer.sendMail，未配邮件通道则 no-op + 注释）
 *  - 扣款失败 D+1 / D+3 / D+7 三次重试
 *  - 三次失败转「待续费」(canceled) 而非直接停权
 *  - 宽限期 GRACE_DAYS（默认 5，区间 3-7）内保留权益
 *  - 取消期末生效（cancel-at-period-end），不即时断供；取消路径 ≤2 次点击（前端组件保证）
 *
 * 本文件分两层：
 *  - 纯函数 transition / evaluate / access：零依赖、全态可测
 *  - SubscriptionService：KV 读写 + 邮件提醒编排（可注入 mailer 便于测试）
 */

export type SubState = 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';

export type SubEvent =
  | 'trial_convert' // 试用转付费成功
  | 'payment_success' // 续费/首扣成功
  | 'payment_failed' // 扣款失败
  | 'retry_success' // 重试扣款成功
  | 'retries_exhausted' // 三次重试均失败 → 待续费
  | 'user_cancel' // 用户主动取消（期末生效）
  | 'period_end' // 周期结束
  | 'resubscribe'; // 取消/过期后重新订阅

export interface SubscriptionRecord {
  tier: 'free' | 'premium';
  state: SubState;
  planId?: 'monthly' | 'yearly' | string;
  startedAt: string;
  expiresAt?: string;
  /** 用户已申请取消，期末生效 */
  cancelRequested?: boolean;
  /** 取消生效时间（通常=expiresAt） */
  cancelAt?: string;
  /** 已连续失败次数（0..3） */
  retryAttempts?: number;
  /** 下次重试时间 ISO */
  nextRetryAt?: string;
  /** 宽限期截止 ISO（past_due 期间保留权益到此时刻） */
  graceEndsAt?: string;
  lastPaymentAt?: string;
  source?: string;
  subscriptionId?: string;
  reminder3dSent?: boolean;
  reminder1dSent?: boolean;
  updatedAt?: string;
}

/** 宽限期天数（区间 3-7，取中值 5 作为默认；可用 env/配置覆盖） */
export const GRACE_DAYS = 5;
/** 重试次数上限 */
export const MAX_RETRIES = 3;
/** 重试计划：相对失败时刻的天数偏移（D+1 / D+3 / D+7） */
export const RETRY_SCHEDULE_DAYS = [1, 3, 7] as const;
/** 提醒节点：到期前 N 天 */
export const REMINDER_DAYS = [3, 1] as const;

const DAY_MS = 86_400_000;

/**
 * 状态迁移矩阵（纯函数）。非法迁移返回当前态（不炸）。
 */
export function nextStateOnEvent(state: SubState, event: SubEvent): SubState {
  switch (state) {
    case 'trial':
      if (event === 'trial_convert' || event === 'payment_success') return 'active';
      if (event === 'period_end') return 'expired';
      return state;
    case 'active':
      if (event === 'payment_failed') return 'past_due';
      if (event === 'user_cancel') return 'canceled'; // 期末生效，访问权保留到 period end
      if (event === 'period_end') return 'expired';
      return state;
    case 'past_due':
      if (event === 'retry_success' || event === 'payment_success') return 'active';
      if (event === 'retries_exhausted') return 'canceled'; // 待续费，不直接停权
      if (event === 'period_end') return 'expired';
      return state;
    case 'canceled':
      if (event === 'resubscribe' || event === 'payment_success') return 'active';
      if (event === 'period_end') return 'expired';
      return state;
    case 'expired':
      if (event === 'resubscribe' || event === 'payment_success' || event === 'trial_convert') {
        return 'active';
      }
      return state;
    default:
      return state;
  }
}

/**
 * 按当前时间推导「有效状态」（把时间维度折叠进状态机）：
 *  - active 但已过 expiresAt → 视是否 cancelRequested/grace 决定 expired / past_due
 *  - canceled 但 now < cancelAt → 仍按 active 对待（期末生效期间保留权益）
 *  - past_due 且已过 graceEndsAt → expired
 */
export function evaluateEffectiveState(rec: SubscriptionRecord, now: number): SubState {
  const expMs = rec.expiresAt ? new Date(rec.expiresAt).getTime() : Number.POSITIVE_INFINITY;
  const isPastPeriod = now >= expMs;

  // canceled 期末生效：
  //  - 仍在缓冲期（now < cancelAt）→ 按 active 对待，保留权益
  //  - 缓冲期已过（now >= cancelAt，或无 cancelAt 但周期已结束）→ expired（停权）
  if (rec.state === 'canceled') {
    const cancelMs = rec.cancelAt ? new Date(rec.cancelAt).getTime() : Number.POSITIVE_INFINITY;
    if (now < cancelMs) return 'active';
    return 'expired';
  }

  if (rec.state === 'past_due') {
    const graceMs = rec.graceEndsAt ? new Date(rec.graceEndsAt).getTime() : Number.POSITIVE_INFINITY;
    if (now >= graceMs) return 'expired'; // 宽限期耗尽 → 停权
    return 'past_due';
  }

  if (rec.state === 'active' && isPastPeriod) {
    return 'expired';
  }

  return rec.state;
}

/**
 * 是否保留访问权益（权益闸门用）。
 * active / past_due(宽限期内) / canceled(期末生效缓冲期内) 均保留。
 */
export function hasActiveAccess(rec: SubscriptionRecord, now: number): boolean {
  const eff = evaluateEffectiveState(rec, now);
  return eff === 'active' || eff === 'past_due' || eff === 'canceled';
}

/** 计算第 n 次（1-based）重试时刻 */
export function retryAt(failedAt: Date | string | number, failIndex: number): number {
  const base = typeof failedAt === 'number' ? failedAt : new Date(failedAt).getTime();
  const idx = Math.min(Math.max(failIndex, 1), MAX_RETRIES) - 1;
  const offset = RETRY_SCHEDULE_DAYS[Math.min(idx, RETRY_SCHEDULE_DAYS.length - 1)];
  return base + offset * DAY_MS;
}

/** 宽限期截止时刻 */
export function graceEndsFrom(failedAt: Date | string | number, graceDays: number = GRACE_DAYS): number {
  const base = typeof failedAt === 'number' ? failedAt : new Date(failedAt).getTime();
  return base + graceDays * DAY_MS;
}

/** 距离到期的天数（负=已过期） */
export function daysToExpiry(rec: SubscriptionRecord, now: number): number | null {
  if (!rec.expiresAt) return null;
  return (new Date(rec.expiresAt).getTime() - now) / DAY_MS;
}
