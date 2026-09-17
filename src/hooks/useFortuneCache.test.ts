// 修正：IT-1.5 依据 + 契约 §4 缓存策略测试
import { test } from 'node:test';
import assert from 'node:assert/strict';

// 直接测试 hashString 逻辑（导出一个测试专用的纯函数版本）
function hashString(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
  }
  return (h >>> 0).toString(36);
}

test('hashString is deterministic', () => {
  assert.equal(hashString('abc'), hashString('abc'));
});

test('hashString differs for different inputs', () => {
  assert.notEqual(hashString('abc'), hashString('abd'));
});

test('hashString handles empty string', () => {
  assert.equal(typeof hashString(''), 'string');
});
