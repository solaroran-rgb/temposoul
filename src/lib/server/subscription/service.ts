/**
 * SubscriptionService（KV 编排层）
 *
 * 职责：把纯状态机落到 AUTH_KV 的 sub:<userId> 记录上，并在适当时机
 * 通过注入的 mailer 发送「到期前 3 天 / 1 天」双提醒。
 *
 * 邮件通道未配置时：sendMail 返回 { ok:false, error:'mail_not_configured' }，
 * 服务层吞掉该结果（no-op），绝不阻塞订阅主流程——与 mailer.ts 降级契约一致。
 */
import {
  type SubscriptionRecord,
  type SubState,
  type SubEvent,
  GRACE_DAYS,
  MAX_RETRIES,
  nextStateOnEvent,
  evaluateEffectiveState,
  hasActiveAccess,
  retryAt,
  graceEndsFrom,
  daysToExpiry,
  REMINDER_DAYS,
} from './state-machine';

export interface SubKv {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

export type MailSendResult = { ok: boolean; error?: string };
export interface MailerLike {
  sendMail(to: string, subject: string, html: string): Promise<MailSendResult>;
}

/** 无邮件通道时的 no-op mailer（显式占位，注释：未配 RESEND_API_KEY/MAIL_FROM） */
export const noopMailer: MailerLike = {
  async sendMail(): Promise<MailSendResult> {
    // mail_not_configured：未配置邮件通道，提醒 no-op（不抛错）
    return { ok: false, error: 'mail_not_configured' };
  },
};

function subKey(userId: string): string {
  return `sub:${userId}`;
}

export async function readSubscription(
  kv: SubKv,
  userId: string,
): Promise<SubscriptionRecord | null> {
  const raw = await kv.get(subKey(userId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SubscriptionRecord;
  } catch {
    return null;
  }
}

async function writeSubscription(kv: SubKv, userId: string, rec: SubscriptionRecord): Promise<void> {
  rec.updatedAt = new Date().toISOString();
  await kv.put(subKey(userId), JSON.stringify(rec));
}

/** 应用一次状态事件并持久化（返回迁移后状态） */
export async function applyEvent(
  kv: SubKv,
  userId: string,
  event: SubEvent,
  patch?: Partial<SubscriptionRecord>,
): Promise<{ state: SubState; record: SubscriptionRecord }> {
  const existing = await readSubscription(kv, userId);
  const nowIso = new Date().toISOString();
  const rec: SubscriptionRecord = existing ?? {
    tier: 'premium',
    state: 'trial',
    startedAt: nowIso,
  };

  // 失败事件：登记重试/宽限期
  if (event === 'payment_failed') {
    rec.retryAttempts = (rec.retryAttempts ?? 0) + 1;
    const now = Date.now();
    rec.nextRetryAt = new Date(retryAt(now, rec.retryAttempts)).toISOString();
    rec.graceEndsAt = new Date(graceEndsFrom(now, GRACE_DAYS)).toISOString();
  }
  if (event === 'retry_success' || event === 'payment_success' || event === 'trial_convert') {
    rec.retryAttempts = 0;
    rec.nextRetryAt = undefined;
    rec.graceEndsAt = undefined;
    rec.lastPaymentAt = nowIso;
  }
  if (event === 'user_cancel') {
    rec.cancelRequested = true;
    rec.cancelAt = rec.expiresAt ?? nowIso; // 期末生效
  }
  if (event === 'resubscribe' || event === 'trial_convert') {
    rec.cancelRequested = false;
    rec.cancelAt = undefined;
    rec.reminder3dSent = false;
    rec.reminder1dSent = false;
  }

  rec.state = nextStateOnEvent(rec.state, event);
  Object.assign(rec, patch ?? {});

  await writeSubscription(kv, userId, rec);
  return { state: rec.state, record: rec };
}

/**
 * 兜底轮询：扫描到期/宽限/提醒节点（由定时任务在波 2 接入调度后调用）。
 * P0 仅提供纯函数能力与单测，不挂定时触发器（避免改 wrangler.toml/cron）。
 */
export interface ReminderDecision {
  shouldSend3d: boolean;
  shouldSend1d: boolean;
  effectiveState: SubState;
}

export function planReminders(rec: SubscriptionRecord, now: number): ReminderDecision {
  const days = daysToExpiry(rec, now);
  const eff = evaluateEffectiveState(rec, now);
  const within = (n: number) => days !== null && days <= n && days > n - 1.5; // 落在第 n 天窗口
  return {
    shouldSend3d:
      eff === 'active' && !rec.reminder3dSent && within(REMINDER_DAYS[0]),
    shouldSend1d:
      eff === 'active' && !rec.reminder1dSent && within(REMINDER_DAYS[1]),
    effectiveState: eff,
  };
}

/** 发送双提醒（未配置邮件通道则 no-op）。返回是否实际发出。 */
export async function maybeSendReminders(
  kv: SubKv,
  userId: string,
  email: string | undefined,
  rec: SubscriptionRecord,
  mailer: MailerLike = noopMailer,
  now: number = Date.now(),
): Promise<{ sent3d: boolean; sent1d: boolean }> {
  const plan = planReminders(rec, now);
  let sent3d = false;
  let sent1d = false;

  if (plan.shouldSend3d && email) {
    const r = await mailer.sendMail(
      email,
      '你的命律订阅 3 天后到期',
      '<p>你的订阅将于 3 天后到期，到期前续费可保持权益不中断。</p>',
    );
    sent3d = r.ok; // 未配置通道时 ok=false → 视为 no-op
    rec.reminder3dSent = true; // 无论是否发出都打标，避免重复尝试（降级期不轰炸）
  }
  if (plan.shouldSend1d && email) {
    const r = await mailer.sendMail(
      email,
      '你的命律订阅 1 天后到期',
      '<p>你的订阅将于 1 天后到期。点击一键续费/复购锁价，避免权益中断。</p>',
    );
    sent1d = r.ok;
    rec.reminder1dSent = true;
  }

  if (plan.shouldSend3d || plan.shouldSend1d) {
    await writeSubscription(kv, userId, rec);
  }
  return { sent3d, sent1d };
}

export { hasActiveAccess, evaluateEffectiveState, MAX_RETRIES };
