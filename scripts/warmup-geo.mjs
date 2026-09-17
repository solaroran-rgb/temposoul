// scripts/warmup-geo.mjs
// 遍历 cities.json，每城调线上 /api/geo，预热 GEO_CACHE KV
// 用法: node scripts/warmup-geo.mjs https://<deployment>.temposoul.pages.dev [并发数]
// v2 (2026-09-13): 并发 3（Overpass api.de 同 IP 限 2 并发，保守取 3）+ 进度统计 + 结果 CSV 落盘
import { readFileSync, appendFileSync } from 'node:fs';

const base = process.argv[2] || 'https://www.temposoul.com';
const CONCURRENCY = Math.min(parseInt(process.argv[3] || '3', 10), 5);
const cities = JSON.parse(readFileSync('public/data/cities.json', 'utf8'));
const csv = 'warmup-geo-result.csv';
appendFileSync(csv, `ts,idx,name,ok,buildings,water,peaks\n`);

console.log(`预热 ${cities.length} 城 (并发 ${CONCURRENCY}, base=${base})...`);

let ok = 0, fail = 0, fallback = 0, done = 0;
const started = Date.now();

async function worker() {
  while (true) {
    const i = cities.findIndex((_, idx) => !globalThis.__doneSet?.has(idx));
    if (i < 0) return;
    (globalThis.__doneSet ??= new Set()).add(i);
    const c = cities[i];
    const t0 = Date.now();
    try {
      const r = await fetch(`${base}/api/geo?lat=${c.lat}&lon=${c.lon}`, { signal: AbortSignal.timeout(45000) });
      const j = await r.json();
      done++;
      if (j.fallback) { fallback++; appendFileSync(csv, `${Date.now()},${i},${c.n},0,,,\n`); console.log(`  [${done}/${cities.length}] ${c.n}: fallback (${Date.now()-t0}ms)`); }
      else { ok++; appendFileSync(csv, `${Date.now()},${i},${c.n},1,${j.buildings?.length||0},${j.water?.length||0},${j.peaks?.length||0}\n`); console.log(`  [${done}/${cities.length}] ${c.n}: ${j.buildings?.length||0} bld (${Date.now()-t0}ms)`); }
    } catch (e) {
      done++; fail++;
      appendFileSync(csv, `${Date.now()},${i},${c.n},0,,,\n`);
      console.log(`  [${done}/${cities.length}] ${c.n}: error ${e.message}`);
    }
    await new Promise(res => setTimeout(res, 1500));   // 间隔防限流
  }
}

const workers = Array.from({ length: CONCURRENCY }, () => worker());
await Promise.all(workers);

const mins = ((Date.now() - started) / 60000).toFixed(1);
console.log(`\n完成: ${ok} ok, ${fallback} fallback, ${fail} error / ${cities.length} (${mins} min)`);
