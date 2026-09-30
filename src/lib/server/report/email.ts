import { sendMail, isMailConfigured } from '../mailer';
import type { ReportTask } from './state-machine';
import { renderReportDeliveryMail } from '../mail/flows';
import { drainDue, enqueueMail } from '../mail/scheduler';

/**
 * 报告完成投递。
 * 主路径：入队 → 立即 drain 一次（拿到重试 / 退订 / 频控 / 成本闸门的保护）。
 * 兼容路径：队列不可用（无任何 KV 绑定）时退回原有直发，绝不因为调度层故障丢信。
 */
export async function deliverReportEmail(
  env: Env,
  task: ReportTask,
  reportUrl: string,
): Promise<void> {
  // Read user email from sub record or fallback
  const subRaw = await env.AUTH_KV.get(`sub:${task.userId}`);
  const subData = subRaw ? JSON.parse(subRaw) : {};
  const email = subData.email;

  if (!email) {
    console.warn(`[Email] No email found for user ${task.userId}, skipping.`);
    return;
  }

  const enqueued = await enqueueMail(env, {
    flow: 'report_delivery',
    to: String(email),
    payload: { reportUrl, productId: (task as { productId?: string }).productId },
    // 同一任务只发一次：重试走队列自身，不因重复触发而重发
    dedupeKey: `report_delivery:${task.id}`,
    dedupeTtlSec: 7 * 24 * 60 * 60,
  }).catch((e: unknown) => {
    console.error(
      `[Email] enqueue failed for task ${task.id}:`,
      e instanceof Error ? e.message : String(e),
    );
    return null;
  });

  if (enqueued?.ok) {
    // 尽力立即投递；失败由队列按指数退避重试，不阻塞状态机
    await drainDue(env, { maxTasks: 10 }).catch((e: unknown) => {
      console.error(
        `[Email] drain failed for task ${task.id}:`,
        e instanceof Error ? e.message : String(e),
      );
    });
    return;
  }

  // —— 兼容路径：队列不可用 → 原直发逻辑（含未配置时不发信的既有降级）——
  if (enqueued && !enqueued.ok && enqueued.reason !== 'queue_unavailable') {
    // 入队被拒（如非法收件人）：不绕过闸门硬发
    console.warn(`[Email] enqueue rejected for task ${task.id}: ${enqueued.reason}`);
    return;
  }

  if (!isMailConfigured(env)) {
    console.warn('[Email] Mailer not configured, skipping delivery.');
    return;
  }

  try {
    await sendMail(env, { to: String(email), ...renderReportDeliveryMail(reportUrl) });
  } catch (e) {
    // Failure must not block state machine
    console.error(
      `[Email] Failed to deliver report email for task ${task.id}:`,
      e instanceof Error ? e.message : String(e),
    );
  }
}
