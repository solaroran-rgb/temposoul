import { generateTenDimReport } from './generator';
import { checkCostGate } from './cost-gate';
import { saveReportResult, updateTaskStatus } from './store';
import { deliverReportEmail } from './email';
import { checkReportText } from '../compliance';

export type TaskStatus =
  | 'pending'
  | 'generating'
  | 'compliance_check'
  | 'delivering'
  | 'fulfilled'
  | 'fulfilled_with_template'
  | 'refunded'
  | 'failed';

export interface ReportTask {
  id: string;
  userId: string;
  chartId: string;
  productId: string;
  status: TaskStatus;
  resultKey?: string;
  errorMsg?: string;
  createdAt: string;
  updatedAt: string;
}

const TASK_TTL = 86400 * 7;

export async function createReportTask(
  env: Env,
  userId: string,
  chartId: string,
  productId: string,
): Promise<ReportTask> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const task: ReportTask = {
    id,
    userId,
    chartId,
    productId,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  };

  await env.AUTH_KV.put(`report:task:${userId}:${id}`, JSON.stringify(task), {
    expirationTtl: TASK_TTL,
  });
  return task;
}

export async function getReportTask(
  env: Env,
  userId: string,
  taskId: string,
): Promise<ReportTask | null> {
  const raw = await env.AUTH_KV.get(`report:task:${userId}:${taskId}`);
  if (!raw) return null;
  return JSON.parse(raw) as ReportTask;
}

export async function processReportInBackground(env: Env, task: ReportTask): Promise<void> {
  try {
    // 1. Cost Gate Check
    await updateTaskStatus(env, task, 'generating');
    const costCheck = await checkCostGate(env, task.productId);
    if (!costCheck.ok) {
      await updateTaskStatus(env, task, 'fulfilled_with_template', undefined, costCheck.reason);
      return;
    }

    // 2. AI Generation
    const reportContent = await generateTenDimReport(env, task.chartId, task.productId);

    // 3. Compliance Check (Expert D integration)
    await updateTaskStatus(env, task, 'compliance_check');
    const compliance = await checkReportText(reportContent.fullText);
    if (!compliance.ok) {
      await updateTaskStatus(
        env,
        task,
        'fulfilled_with_template',
        undefined,
        'compliance_violation',
      );
      return;
    }

    // 4. Store Result & Update Index
    await updateTaskStatus(env, task, 'delivering');
    const resultKey = `report:result:${task.userId}:${task.id}`;
    await saveReportResult(env, task, reportContent);

    // 5. Fulfill
    const fulfilledTask = await updateTaskStatus(env, task, 'fulfilled', resultKey);

    // 6. Email Delivery (Fire and forget, wrapped in try/catch internally)
    const siteUrl = env.PUBLIC_SITE_URL || 'https://www.temposoul.com';
    await deliverReportEmail(env, fulfilledTask, `${siteUrl}/reports/ten-dim?id=${task.id}`);
  } catch (e) {
    console.error(`[Background] Task ${task.id} failed:`, e);
    await updateTaskStatus(
      env,
      task,
      'failed',
      undefined,
      e instanceof Error ? e.message : 'unknown_error',
    );
  }
}
