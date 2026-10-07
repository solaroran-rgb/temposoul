/**
 * A10 规则补全 · 引擎层标注与应期模块样例集。
 * - X1-D-13：六壬占时显式标注「未做真太阳时修正」。
 * - X1-D-29：金口诀定性应期（yingQi）模块。
 * - X1-D-27：玄空显式声明替卦/大卦/形峦未实现。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import { generateLiuren } from '../packages/core/src/divination/algorithms/liuren/index.ts';
import { generateJinkoujue } from '../packages/core/src/divination/algorithms/jinkoujue.ts';
import { generateXuanKong } from '../packages/core/src/xuan_kong/index.ts';

const SAMPLE_DATE = new Date('2025-01-01T08:00:00+08:00');

test('A10 D-13：六壬结果显式标注占时未做真太阳时修正', () => {
  const r = generateLiuren(SAMPLE_DATE);
  assert.equal(r.timePolicy?.basis, '东八区民用时干支');
  assert.equal(r.timePolicy?.trueSolarTimeApplied, false);
  assert.match(r.timePolicy?.note || '', /真太阳时/);
});

test('A10 D-29：金口诀输出定性应期 yingQi', () => {
  const r = generateJinkoujue({ method: 'time' });
  assert.ok(r.yingQi, '金口诀应输出 yingQi 应期模块');
  assert.ok(r.yingQi!.usePosition);
  assert.ok(r.yingQi!.clues.length >= 2);
  // 始终包含「不换算具体日辰」的边界声明。
  assert.ok(r.yingQi!.clues.some((c) => c.includes('不换算具体日辰')));
  assert.match(r.yingQi!.source, /金口诀古本/);
});

test('A10 D-29：金口诀应期在数字起课下同样输出且不抛错', () => {
  const r = generateJinkoujue({ method: 'number', number: 5 });
  assert.ok(r.yingQi && r.yingQi.clues.length >= 2);
});

test('A10 D-27：玄空结果显式声明实现范围（替卦/形峦未实现）', () => {
  const r = generateXuanKong({ year: 2024, sitMountain: '子', facingMountain: '午' });
  assert.deepEqual(r.scope?.implemented, ['下卦三盘']);
  assert.ok(r.scope?.notImplemented.some((s) => s.includes('替卦')));
  assert.ok(r.scope?.notImplemented.some((s) => s.includes('形峦')));
});
