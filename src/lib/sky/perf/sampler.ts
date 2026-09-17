/**
 * perf/sampler.ts —— 分态采样器（D5）· 终版（B6：mark 由 sceneCore 驱动；新增 note）
 * 挂载：?perf=1 → window.__skyPerf = { mark, note, report, markdown, tier }
 * 判据：full 态 P95 ≤ 16.9/33/50ms（PERF_BUDGET）；ambient 态 >100ms 尖峰 = 0
 */
import { detectTier, PERF_BUDGET, type QualityTier } from '../renderTokens';

export function mountPerfSampler() {
  if (!new URLSearchParams(location.search).get('perf')) return null;
  const tier: QualityTier = detectTier();
  const rec: { dt: number; st: string }[] = [];
  const notes: string[] = [];
  let st = 'full';
  let last = performance.now();
  (function tick(t: number) {
    rec.push({ dt: t - last, st });
    last = t;
    requestAnimationFrame(tick);
  })(last);

  const q = (s: number[], p: number) => s[Math.min(s.length - 1, Math.floor(s.length * p))] | 0;
  function one(a: number[]) {
    if (!a.length) return { frames: 0, p50: 0, p95: 0, p99: 0, spikes100: 0, long50: 0 };
    const s = [...a].sort((x, y) => x - y);
    return {
      frames: s.length,
      p50: q(s, 0.5),
      p95: q(s, 0.95),
      p99: q(s, 0.99),
      spikes100: s.filter((x) => x > PERF_BUDGET.ambientSpikeMs).length,
      long50: s.filter((x) => x > 50).length,
    };
  }
  function report() {
    const by: Record<string, number[]> = {};
    for (const r of rec) (by[r.st] ??= []).push(r.dt);
    const out: Record<string, ReturnType<typeof one>> = {};
    for (const k in by) out[k] = one(by[k]);
    return out;
  }
  function markdown(version: string, url: string): string {
    const r = report();
    const budget = PERF_BUDGET.fullP95[tier];
    const L = [
      '# perf-baseline-' + version,
      '- url: ' + url,
      '- tier: ' + tier,
      '- 判据（D5）：full P95 ≤ ' +
        budget +
        'ms；ambient >' +
        PERF_BUDGET.ambientSpikeMs +
        'ms 尖峰 = 0',
      '',
      '| state | frames | P50 | P95 | P99 | >50ms | >100ms | 判定 |',
      '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ];
    for (const k in r) {
      const s = r[k];
      const pass = k === 'ambient' ? s.spikes100 === 0 : s.p95 <= budget;
      L.push(
        '| ' +
          k +
          ' | ' +
          s.frames +
          ' | ' +
          s.p50 +
          ' | ' +
          s.p95 +
          ' | ' +
          s.p99 +
          ' | ' +
          s.long50 +
          ' | ' +
          s.spikes100 +
          ' | ' +
          (pass ? 'PASS' : 'FAIL') +
          ' |',
      );
    }
    if (notes.length) L.push('', '## notes', ...notes.map((n) => '- ' + n));
    return L.join('\n');
  }
  const handle = {
    mark: (s: string) => {
      st = s;
    },
    note: (s: string) => notes.push(s),
    report,
    markdown,
    tier,
  };
  (window as unknown as Record<string, unknown>).__skyPerf = handle;
  return handle;
}
