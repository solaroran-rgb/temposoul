import type { ReportTask, TaskStatus } from './state-machine';
import type { TenDimReport } from './generator';

const RESULT_TTL = 86400 * 30; // 30 days retention for results
const TASK_TTL = 86400 * 7; // 7 days retention for task metadata

export async function saveReportResult(env: Env, task: ReportTask, content: TenDimReport) {
  const resultKey = `report:result:${task.userId}:${task.id}`;
  await env.AUTH_KV.put(resultKey, JSON.stringify(content), { expirationTtl: RESULT_TTL });

  // Maintain reverse index for fast lookup and cascade deletion
  const indexKey = `user_assets:${task.userId}`;
  const indexRaw = await env.AUTH_KV.get(indexKey);
  const assets: string[] = indexRaw ? JSON.parse(indexRaw) : [];

  if (!assets.includes(task.id)) {
    assets.push(task.id);
    // Keep index alive as long as the longest TTL asset (30 days)
    await env.AUTH_KV.put(indexKey, JSON.stringify(assets), { expirationTtl: RESULT_TTL });
  }
}

export async function getReportResult(env: Env, key: string): Promise<TenDimReport | null> {
  const raw = await env.AUTH_KV.get(key);
  return raw ? JSON.parse(raw) : null;
}

export async function updateTaskStatus(
  env: Env,
  task: ReportTask,
  status: TaskStatus,
  resultKey?: string,
  errorMsg?: string,
): Promise<ReportTask> {
  const updated: ReportTask = {
    ...task,
    status,
    resultKey: resultKey ?? task.resultKey,
    errorMsg: errorMsg ?? task.errorMsg,
    updatedAt: new Date().toISOString(),
  };

  await env.AUTH_KV.put(`report:task:${task.userId}:${task.id}`, JSON.stringify(updated), {
    expirationTtl: TASK_TTL,
  });

  return updated;
}

/**
 * Fetches user's report tasks using KV list prefix with cursor pagination.
 */
export async function listUserTasks(
  env: Env,
  userId: string,
  limit = 20,
  cursor?: string,
): Promise<{ tasks: ReportTask[]; cursor?: string }> {
  const prefix = `report:task:${userId}:`;
  const listResult = await env.AUTH_KV.list({ prefix, limit, cursor });

  const tasks: ReportTask[] = [];
  for (const key of listResult.keys) {
    // CF KV list does not return values by default, must fetch explicitly
    const raw = await env.AUTH_KV.get(key.name);
    if (raw) {
      tasks.push(JSON.parse(raw));
    }
  }

  // Sort by createdAt descending
  tasks.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    tasks,
    cursor: listResult.list_complete ? undefined : listResult.cursor,
  };
}

/**
 * Physical deletion for privacy compliance (GDPR/CCPA).
 * Consumes user_assets index for precise cascade deletion.
 */
export async function deleteUserData(
  env: Env,
  userId: string,
): Promise<{ deletedTasks: number; deletedResults: number }> {
  let deletedTasks = 0;
  let deletedResults = 0;

  // 1. Consume reverse index
  const indexKey = `user_assets:${userId}`;
  const indexRaw = await env.AUTH_KV.get(indexKey);
  const assets: string[] = indexRaw ? JSON.parse(indexRaw) : [];

  for (const taskId of assets) {
    const taskKey = `report:task:${userId}:${taskId}`;
    const resultKey = `report:result:${userId}:${taskId}`;

    await env.AUTH_KV.delete(taskKey);
    deletedTasks++;

    await env.AUTH_KV.delete(resultKey);
    deletedResults++;
  }

  // 2. Delete the index itself
  await env.AUTH_KV.delete(indexKey);

  // 3. Delete subscription record
  await env.AUTH_KV.delete(`sub:${userId}`);

  // 4. Fallback: Sweep any orphaned tasks not in index (safety net)
  const prefix = `report:task:${userId}:`;
  let cursor: string | undefined = undefined;
  do {
    const listResult = await env.AUTH_KV.list({ prefix, limit: 1000, cursor });
    for (const key of listResult.keys) {
      if (!assets.includes(key.name.split(':').pop()!)) {
        await env.AUTH_KV.delete(key.name);
        deletedTasks++;
      }
    }
    cursor = listResult.list_complete ? undefined : listResult.cursor;
  } while (cursor);

  return { deletedTasks, deletedResults };
}
