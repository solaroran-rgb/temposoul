/**
 * A10 规则补全 · X1-D-31 梅花两数起卦（MH-01）与索引签名收口（MH-02）样例集。
 * 口径：《梅花易数》传统报数变通式——报两正整数，第一数取上卦、第二数取下卦、两数之和取动爻，
 * 不再叠加时支；八卦用先天卦数（乾1兑2离3震4巽5坎6艮7坤8），8卦6爻循环归一。
 */
import { test } from 'node:test';
import { strict as assert } from 'node:assert';

import { generateMeihua } from '../packages/core/src/divination/algorithms/meihua/index.ts';
import {
  resolveNumberMethod,
  resolveTwoNumberMethod,
} from '../packages/core/src/divination/algorithms/meihua/helpers/methods.ts';

const SAMPLE_DATE = new Date('2025-01-01T08:00:00+08:00');

test('A10 MH-01：两数起卦 8/5 → 上坤下巽 地风升，初爻动', () => {
  const data = generateMeihua(SAMPLE_DATE, { method: 'number', number: 8, number2: 5 });
  // 8%8 归一为 8 = 坤；5 = 巽；(8+5)%6=1 → 初爻动。
  assert.equal(data.mainHexagram.upper, '坤');
  assert.equal(data.mainHexagram.lower, '巽');
  assert.equal(data.originalName, '地风升');
  assert.equal(data.movingYao.position, 1);
  assert.equal(data.calculation.number, 8);
  assert.equal(data.calculation.number2, 5);
  assert.equal(data.calculation.upperTrigramIndex, 8);
  assert.equal(data.calculation.lowerTrigramIndex, 5);
  assert.equal(data.calculation.movingYaoIndex, 1);
  // 两数法不叠加时支，calculation 里不应出现单个数法的 totalWithTime。
  assert.equal(data.calculation.totalWithTime, undefined);
});

test('A10 MH-01：两数起卦与起卦时辰无关（换时间结果不变）', () => {
  const a = generateMeihua(new Date('2025-03-05T08:00:00+08:00'), {
    method: 'number',
    number: 27,
    number2: 14,
  });
  const b = generateMeihua(new Date('2025-09-09T23:00:00+08:00'), {
    method: 'number',
    number: 27,
    number2: 14,
  });
  // 27%8=3 离；14%8=6 坎；(27+14)%6=41%6=5。
  assert.equal(a.mainHexagram.upper, b.mainHexagram.upper);
  assert.equal(a.mainHexagram.lower, b.mainHexagram.lower);
  assert.equal(a.movingYao.position, b.movingYao.position);
  assert.equal(a.originalName, b.originalName);
  assert.equal(a.calculation.upperTrigramIndex, 3);
  assert.equal(a.calculation.lowerTrigramIndex, 6);
  assert.equal(a.calculation.movingYaoIndex, 5);
});

test('A10 MH-01：两数起卦整除归一（8 归坤、6 爻归一）', () => {
  const r = resolveTwoNumberMethod(8, 6);
  assert.equal(r.upperTrigramIndex, 8); // 8%8=0 归一为 8
  assert.equal(r.lowerTrigramIndex, 6);
  assert.equal(r.movingYaoIndex, (8 + 6) % 6 || 6); // 14%6=2
  assert.equal(r.calculation.movingYaoIndex, 2);
});

test('A10 MH-01：两数起卦拒绝非正整数', () => {
  assert.throws(() => resolveTwoNumberMethod(0, 5), /第一数/);
  assert.throws(() => resolveTwoNumberMethod(5, -1), /第二数/);
  assert.throws(() => resolveTwoNumberMethod(1.5, 5), /第一数/);
});

test('A10 MH-01：未传 number2 时仍走单个数起卦（向后兼容）', () => {
  const data = generateMeihua(SAMPLE_DATE, { method: 'number', number: 123 });
  // 与既有黄金样例一致：火地晋、二爻动。
  assert.equal(data.originalName, '火地晋');
  assert.equal(data.movingYao.position, 2);
  assert.equal(data.calculation.number, 123);
  assert.equal(data.calculation.number2, undefined);
  assert.equal(data.calculation.totalWithTime, 128);
});

test('A10 MH-02：单个数起卦 calculation 仍带白名单字段（索引签名已收口）', () => {
  const r = resolveNumberMethod(123, '辰');
  // 白名单内字段可读取，不依赖任意索引签名。
  assert.equal(r.calculation.methodKey, 'number');
  assert.equal(r.calculation.number, 123);
  assert.equal(r.calculation.timeZhi, '辰');
  assert.equal(r.calculation.totalWithTime, 128);
});
