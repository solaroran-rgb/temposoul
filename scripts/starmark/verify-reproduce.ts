/**
 * verify-reproduce.ts —— 同参数复现实测脚本
 * 运行：tsx --tsconfig tsconfig.app.json scripts/starmark/verify-reproduce.ts
 *
 * 多次用同一 SkyParams 调 projectSky()，断言逐星屏幕坐标逐字节一致；
 * 并断言改任一关键参数后 snapshot 必然变化（稀缺性机制）。
 */
import { projectSky, type SkyParams } from '../../src/lib/starmark/astro-view';
import { computeSkyId } from '../../src/lib/starmark/skyId';

const base: SkyParams = {
  unixMs: Date.UTC(2024, 5, 1, 13, 47, 0), // 2024-06-01 21:47 CST = 13:47 UTC
  latDeg: 36.6512, // 济南
  lngDeg: 117.1201,
  dirDeg: 0,
  magLimit: 6.0,
  width: 1080,
  height: 1620,
  fovDeg: 60,
};

const RUNS = 10;
const snaps: string[] = [];
const ids = new Set<string>();
for (let i = 0; i < RUNS; i++) {
  const p = projectSky(base);
  snaps.push(p.snapshot);
  ids.add(computeSkyId(base));
}

const allSame = snaps.every((s) => s === snaps[0]);
const starCount = projectSky(base).stars.length;

// 篡改参数：经度 +0.001 度 → snapshot 必须变
const tampered: SkyParams = { ...base, lngDeg: 117.1211 };
const tamperedSnap = projectSky(tampered).snapshot;

// 称谓不影响 sky_id：同参数不同称谓（称谓本就不进参，这里只证 sky_id 稳定）
const idA = computeSkyId(base);
const idB = computeSkyId({ ...base });

console.log('=== starmark reproduce check ===');
console.log('runs:', RUNS);
console.log('stars rendered:', starCount);
console.log('all snapshots identical:', allSame);
console.log('unique sky_id across runs:', ids.size);
console.log('sky_id:', idA, '| idA===idB:', idA === idB);
console.log('tampered lng -> snapshot changed:', tamperedSnap !== snaps[0]);

if (!allSame || ids.size !== 1 || tamperedSnap === snaps[0] || idA !== idB) {
  console.error('REPRODUCE CHECK FAILED');
  process.exit(1);
}
console.log('REPRODUCE CHECK PASSED');
