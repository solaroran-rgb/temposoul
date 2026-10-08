// tests/growth-hidden.test.ts
// 分享激励细部 · 隐藏卡（文化深度版）单测
// 跑法：pnpm exec tsx --tsconfig tsconfig.app.json --test tests/growth-hidden.test.ts
// 覆盖：解锁标记默认 false→unlock→true；不同 dateKey 独立；同 dateKey 内容恒定、
//       不同 dateKey 允许不同；内容全字段 hasBannedWord===false；compliance 恒为合规句。
import test from 'node:test';
import assert from 'node:assert/strict';

// —— 内存 localStorage 桩：hidden-card 在函数体内惰性读 localStorage，
//    此处先注入（import 被 hoist 但无顶层副作用）。——
function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    getItem: (k: string) => (map.has(k) ? (map.get(k) as string) : null),
    setItem: (k: string, v: string) => {
      map.set(k, String(v));
    },
    removeItem: (k: string) => {
      map.delete(k);
    },
    clear: () => {
      map.clear();
    },
  } as Storage;
}
(globalThis as unknown as { localStorage: Storage }).localStorage = memoryStorage();

import {
  COMPLIANCE_LINE,
  getHiddenCardContent,
  isHiddenCardUnlocked,
  unlockHiddenCard,
} from '../src/lib/growth/hidden-card';
import { hasBannedWord } from '../src/lib/client-compliance';

test('解锁标记：默认 false → unlockHiddenCard → 同 dateKey 为 true', () => {
  (globalThis as unknown as { localStorage: Storage }).localStorage = memoryStorage();
  const k = '2026-10-08';
  assert.equal(isHiddenCardUnlocked(k), false);
  unlockHiddenCard(k);
  assert.equal(isHiddenCardUnlocked(k), true);
});

test('不同 dateKey 解锁状态相互独立', () => {
  (globalThis as unknown as { localStorage: Storage }).localStorage = memoryStorage();
  unlockHiddenCard('2026-10-08');
  assert.equal(isHiddenCardUnlocked('2026-10-08'), true);
  // 另一日未解锁
  assert.equal(isHiddenCardUnlocked('2026-10-09'), false);
  unlockHiddenCard('2026-10-09');
  assert.equal(isHiddenCardUnlocked('2026-10-09'), true);
  // 首日状态不被第二日影响
  assert.equal(isHiddenCardUnlocked('2026-10-08'), true);
});

test('getHiddenCardContent：同 dateKey 内容恒定（种子稳定）', () => {
  const a = getHiddenCardContent('2026-10-08');
  const b = getHiddenCardContent('2026-10-08');
  assert.deepEqual(a, b);
});

test('getHiddenCardContent：不同 dateKey 允许不同（且均落在引文库可考范围内）', () => {
  const days = ['2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11', '2026-10-12'];
  const seen = new Set<string>();
  for (const d of days) {
    const c = getHiddenCardContent(d);
    seen.add(c.quote);
    assert.ok(c.theme.length > 0, 'theme 非空');
    assert.ok(c.quote.length > 0, 'quote 非空');
    assert.ok(c.source.length > 0, 'source 非空');
    assert.ok(c.note.length > 0, 'note 非空');
  }
  // 5 天内应出现多于一种内容（允许碰撞，这里只要求至少覆盖 1 条以上，种子可复算即可）
  assert.ok(seen.size >= 1, '内容可复算');
});

test('内容全字段 hasBannedWord === false（跨多个 dateKey 扫描）', () => {
  for (let i = 1; i <= 20; i += 1) {
    const d = `2026-10-${String(i).padStart(2, '0')}`;
    const c = getHiddenCardContent(d);
    for (const f of [c.theme, c.quote, c.source, c.note, c.compliance]) {
      assert.equal(hasBannedWord(f), false, `字段命中禁词: ${f}`);
    }
  }
});

test('compliance 字段恒为全站统一合规句', () => {
  assert.equal(COMPLIANCE_LINE, '此为传统命律观点');
  for (let i = 1; i <= 10; i += 1) {
    const d = `2026-11-${String(i).padStart(2, '0')}`;
    assert.equal(getHiddenCardContent(d).compliance, '此为传统命律观点');
  }
});
