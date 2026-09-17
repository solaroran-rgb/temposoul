// scripts/rewarm-failed.mjs
// 幂等增量补跑：收集"所有历史结果 CSV 中从未成功"的城市，每城真查一次。
// 背景：geo.ts 对失败坐标写 10 分钟 fail-cooldown 缓存（geo:fail:v5），
//   脚本内 2.5s 的快速重试会被冷却直接拦截、无意义；因此改为单轮制，
//   每隔 >10 分钟重跑本脚本即可绕过冷却、逐轮收敛。可反复运行，天然幂等。
// 用法: node scripts/rewarm-failed.mjs [base] [并发数]
import { readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync } from 'node:fs';

const base = process.argv[2] || 'https://109c3e80.temposoul.pages.dev';
const CONC = Math.min(parseInt(process.argv[3] || '2', 10), 4);
const cities = JSON.parse(readFileSync('public/data/cities.json', 'utf8'));

// 汇总所有历史结果 CSV（首轮 + 历轮补跑 r1/r2...）：某城在任意一份里 ok=1 即视为已成功
const succeeded = new Set();
for (const f of readdirSync('.').filter(x => /^warmup-.*\.csv$/.test(x) && x !== 'warmup-rewarm-result.csv')) {
  if (!existsSync(f)) continue;
  for (const ln of readFileSync(f, 'utf8').trim().split('\n').slice(1)) {
    const c = ln.split(',');
    if (c[3] === '1' && c[2]) succeeded.add(c[2]);
  }
}
const todo = cities.filter(c => !succeeded.has(c.n));
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16);
const out = `warmup-rewarm-result.csv`;
writeFileSync(out, 'ts,idx,name,ok,buildings,water,peaks,round\n');
console.log(`[轮次 ${stamp}] 待补 ${todo.length} 城（历史已成功 ${succeeded.size}），并发 ${CONC}，base=${base}`);

let ok = 0, fail = 0, done = 0;
const started = Date.now();
let cursor = 0;

async function one(c) {
  const idx = cities.indexOf(c);
  let j = null, status = 'error';
  try {
    const r = await fetch(`${base}/api/geo?lat=${c.lat}&lon=${c.lon}`, { signal: AbortSignal.timeout(50000) });
    j = await r.json();
    status = r.headers.get('x-geo-cache') || '';
  } catch (e) { status = 'neterr:' + e.message; }
  const success = j && !j.fallback && (j.buildings?.length || 0) > 0;
  done++;
  if (success) ok++; else fail++;
  appendFileSync(out, `${Date.now()},${idx},${c.n},${success ? 1 : 0},${j?.buildings?.length || 0},${j?.water?.length || 0},${j?.peaks?.length || 0},${stamp}\n`);
  console.log(`  [${done}/${todo.length}] ${c.n}: ${success ? `${j.buildings.length} bld (${status})` : `未成功(${status})`}`);
  await new Promise(res => setTimeout(res, 1800));
}
async function worker() {
  while (cursor < todo.length) await one(todo[cursor++]);
}
await Promise.all(Array.from({ length: CONC }, () => worker()));
const mins = ((Date.now() - started) / 60000).toFixed(1);
console.log(`\n本轮完成: ${ok} 成功, ${fail} 仍失败 / ${todo.length} (${mins} min)；>10 分钟后重跑本脚本继续收敛`);
