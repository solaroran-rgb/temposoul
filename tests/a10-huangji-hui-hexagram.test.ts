/**
 * A10 规则补全 · X1-D-15 皇极经世会值卦（十二辟卦配十二会）样例集。
 * 古籍锚定：邵雍《皇极经世》十二消息卦当十二会值卦，自子会复卦一阳生，
 * 阳长至巳会乾卦，阴生午会姤卦至亥会坤卦。此为历代通行、无版本争议的高置信层。
 * 逐年值卦细法传世多口径，须顾问终审，不在此臆推。
 */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  HUI_SOVEREIGN_HEXAGRAMS,
  calculateHuangjiJingshi,
  resolveHuiHexagram,
} from '@core/huangji-jingshi';

test('A10 D-15：十二辟卦表为复临泰大壮夬乾姤遯否观剥坤次序', () => {
  assert.deepEqual(
    HUI_SOVEREIGN_HEXAGRAMS.map((h) => h.name),
    ['复', '临', '泰', '大壮', '夬', '乾', '姤', '遯', '否', '观', '剥', '坤'],
  );
  // 子至巳阳长、午至亥阴长。
  assert.equal(HUI_SOVEREIGN_HEXAGRAMS[5].phase, '阳长'); // 乾
  assert.equal(HUI_SOVEREIGN_HEXAGRAMS[6].phase, '阴长'); // 姤
});

test('A10 D-15：纪元第一年（子会）值卦为地雷复', () => {
  const r = calculateHuangjiJingshi({ epochYear: 1000, year: 1000 });
  assert.equal(r.position.hui.indexInYuan, 1);
  assert.equal(r.valueHexagram.hui.fullName, '地雷复');
  assert.equal(r.valueHexagram.hui.symbol, '䷗');
  assert.equal(r.valueHexagram.hui.phase, '阳长');
  assert.ok(r.valueHexagram.basis.includes('辟卦'));
});

test('A10 D-15：丑会值卦为地泽临（10800 年处）', () => {
  const r = calculateHuangjiJingshi({ epochYear: 0, elapsedYears: 10800 });
  assert.equal(r.position.hui.indexInYuan, 2);
  assert.equal(r.valueHexagram.hui.name, '临');
  assert.equal(r.valueHexagram.hui.fullName, '地泽临');
});

test('A10 D-15：午会值卦为天风姤（64800 年处，阴长始）', () => {
  const r = calculateHuangjiJingshi({ epochYear: 0, elapsedYears: 64800 });
  assert.equal(r.position.hui.indexInYuan, 7);
  assert.equal(r.valueHexagram.hui.fullName, '天风姤');
  assert.equal(r.valueHexagram.hui.phase, '阴长');
});

test('A10 D-15：亥会值卦为坤为地（118800 年处，纯阴）', () => {
  const r = calculateHuangjiJingshi({ epochYear: 0, elapsedYears: 118800 });
  assert.equal(r.position.hui.indexInYuan, 12);
  assert.equal(r.valueHexagram.hui.fullName, '坤为地');
});

test('A10 D-15：本会内进度在 0-1 之间，prompt 带值卦', () => {
  const r = calculateHuangjiJingshi({ epochYear: 0, elapsedYears: 5400 });
  assert.ok(r.valueHexagram.yearProgressInHui >= 0 && r.valueHexagram.yearProgressInHui < 1);
  assert.match(r.prompt, /本会值卦：/);
});

test('A10 D-15：resolveHuiHexagram 拒绝越界会序', () => {
  assert.throws(() => resolveHuiHexagram(0), /1-12/);
  assert.throws(() => resolveHuiHexagram(13), /1-12/);
  assert.equal(resolveHuiHexagram(3).fullName, '地天泰');
});

test('A10 D-15：局限说明明确逐年值卦待终审', () => {
  const r = calculateHuangjiJingshi({ epochYear: 0, year: 0 });
  assert.ok(
    r.limitations.some((l) => l.includes('逐年值卦') && l.includes('顾问终审')),
  );
});
