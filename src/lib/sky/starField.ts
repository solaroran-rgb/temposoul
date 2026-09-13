/**
 * starField.ts —— 天文重算分片器（G1：中/低档移动端跨帧重算，R2 §3.3 承诺）
 * 语义：新请求到达时旧任务自动作废重启（无半态撕裂）；分片期间星点逐帧到达新位置
 * （偏差 D-2：级联到达即过渡，不叠加整层 fade）。
 */
export interface ChunkedJob {
  count: number;
  run(i0: number, i1: number): void;
  done?(): void;
}
export interface RecomputeTask { tick(): boolean; finished: boolean }

export function createRecomputeTask(jobs: ChunkedJob[], totalChunks: number): RecomputeTask {
  const perJob = jobs.map((j) => ({ j, chunk: Math.max(1, Math.ceil(j.count / totalChunks)), i: 0 }));
  const t: RecomputeTask = {
    finished: false,
    tick() {
      if (t.finished) return false;
      let wrote = false;
      for (const e of perJob) {
        if (e.i >= e.j.count) continue;
        const i1 = Math.min(e.j.count, e.i + e.chunk);
        e.j.run(e.i, i1);
        e.i = i1;
        wrote = true;
        if (e.i >= e.j.count) e.j.done?.();
      }
      if (!wrote) t.finished = true;
      return wrote;
    },
  };
  return t;
}