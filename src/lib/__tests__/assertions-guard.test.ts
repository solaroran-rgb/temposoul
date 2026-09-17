import test from 'node:test';
import assert from 'node:assert/strict';
import { guardText, hasAssertion } from '../assertions-guard';

test('强断言词全局过滤', () => {
  assert.ok(!guardText('此名大吉').includes('大吉'));
  assert.ok(!guardText('事业必成').includes('必'));
  assert.ok(!guardText('注定成功').includes('注定'));
});

test('弱断言词仅在边界过滤，正常词不误伤', () => {
  assert.equal(guardText('克服苦难'), '克服苦难');
  assert.equal(guardText('吉利'), '吉利');
  assert.ok(!guardText('此名旺').includes('旺'));
});

test('hasAssertion 与 guardText 一致', () => {
  assert.equal(hasAssertion('大吉大利'), true);
  assert.equal(hasAssertion('音形义俱佳'), false);
});
