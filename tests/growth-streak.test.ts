// tests/growth-streak.test.ts
// 连续登录成长数据层单测（node:test，跑法：pnpm exec tsx --tsconfig tsconfig.app.json --test tests/growth-streak.test.ts）
// 覆盖：markVisit 断签边界（首次/昨日+1/同日不叠加/隔2天重置）、bestStreak 只增不减、
//       7/30/100 里程碑精确解锁边界、每日免费解读（当日 false→mark→true / 同日幂等 / 跨天重置）。
import test from 'node:test';
import assert from 'node:assert/strict';

// —— 内存 localStorage 桩：streak/freeRead 均在函数体内惰性读 localStorage，
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

import { getDailyKey } from '../src/lib/daily-sky/dailyKey';
import {
  getStreakState,
  markVisit,
  unlockedMilestones,
  STREAK_MILESTONES,
  getFreeReadUsedToday,
  markFreeReadUsedToday,
  type StreakState,
} from '../src/lib/growth/streak';
import { hasBannedWord } from '../src/lib/client-compliance';

function freshStorage(): Storage {
  const s = memoryStorage();
  (globalThis as unknown as { localStorage: Storage }).localStorage = s;
  return s;
}

/** 本地日历 n 天前的日期键（与 getDailyKey 同一套 IANA 格式化）。 */
function keyNDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const raw = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
  const m = /(\d{4})[/-](\d{2})[/-](\d{2})/.exec(raw);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : raw;
}

function setStoredStreak(patch: Partial<StreakState> & { lastVisitKey: string | null }) {
  const full: StreakState = {
    current: 0,
    bestStreak: 0,
    updatedAt: '',
    ...patch,
  };
  (globalThis as unknown as { localStorage: Storage }).localStorage.setItem(
    'growth:streak',
    JSON.stringify(full),
  );
}

const BASE_STATE: StreakState = {
  current: 0,
  lastVisitKey: null,
  bestStreak: 0,
  updatedAt: '',
};

test('markVisit：空记录首次访问 → current=1，lastVisitKey=今天，bestStreak=1', () => {
  freshStorage();
  assert.deepEqual(getStreakState(), BASE_STATE);
  const s = markVisit();
  assert.equal(s.current, 1);
  assert.equal(s.lastVisitKey, getDailyKey());
  assert.equal(s.bestStreak, 1);
});

test('markVisit：昨日来过 → current+1，bestStreak 同步抬升', () => {
  freshStorage();
  setStoredStreak({ current: 5, lastVisitKey: keyNDaysAgo(1), bestStreak: 5 });
  const s = markVisit();
  assert.equal(s.current, 6);
  assert.equal(s.lastVisitKey, getDailyKey());
  assert.equal(s.bestStreak, 6);
});

test('markVisit：同日重复调用 → current 不变（不叠加）', () => {
  freshStorage();
  setStoredStreak({ current: 5, lastVisitKey: getDailyKey(), bestStreak: 5 });
  const s = markVisit();
  assert.equal(s.current, 5);
  assert.equal(s.lastVisitKey, getDailyKey());
  assert.equal(s.bestStreak, 5);
});

test('markVisit：断签（隔 ≥2 天）→ current 重置为 1，bestStreak 只增不减保留历史最佳', () => {
  freshStorage();
  setStoredStreak({ current: 10, lastVisitKey: keyNDaysAgo(2), bestStreak: 10 });
  const s = markVisit();
  assert.equal(s.current, 1);
  assert.equal(s.lastVisitKey, getDailyKey());
  assert.equal(s.bestStreak, 10);
});

test('unlockedMilestones：7/30/100 天精确解锁边界，99/100 天级联', () => {
  assert.deepEqual(unlockedMilestones({ ...BASE_STATE, current: 0 }), []);
  assert.deepEqual(unlockedMilestones({ ...BASE_STATE, current: 6 }), []);
  assert.deepEqual(unlockedMilestones({ ...BASE_STATE, current: 7 }), ['d7']);
  assert.deepEqual(unlockedMilestones({ ...BASE_STATE, current: 29 }), ['d7']);
  assert.deepEqual(unlockedMilestones({ ...BASE_STATE, current: 30 }), ['d7', 'd30']);
  assert.deepEqual(unlockedMilestones({ ...BASE_STATE, current: 99 }), ['d7', 'd30']);
  assert.deepEqual(unlockedMilestones({ ...BASE_STATE, current: 100 }), [
    'd7',
    'd30',
    'd100',
  ]);
});

test('STREAK_MILESTONES 三档结构冻结，标题/描述无禁词', () => {
  assert.equal(STREAK_MILESTONES.length, 3);
  assert.deepEqual(
    STREAK_MILESTONES.map((m) => m.key),
    ['d7', 'd30', 'd100'],
  );
  assert.deepEqual(
    STREAK_MILESTONES.map((m) => m.days),
    [7, 30, 100],
  );
  for (const m of STREAK_MILESTONES) {
    assert.equal(hasBannedWord(m.title), false, `标题命中禁词: ${m.title}`);
    assert.equal(hasBannedWord(m.description), false, `描述命中禁词: ${m.description}`);
  }
});

test('每日免费解读：当日首次 false → mark → true；同日重复 mark 幂等不叠加', () => {
  freshStorage();
  assert.equal(getFreeReadUsedToday(), false);
  markFreeReadUsedToday();
  assert.equal(getFreeReadUsedToday(), true);
  markFreeReadUsedToday();
  assert.equal(getFreeReadUsedToday(), true);
});

test('每日免费解读：不同 dateKey 独立记账（跨天重置，不叠加到昨日额度）', () => {
  freshStorage();
  markFreeReadUsedToday('2099-01-01');
  assert.equal(getFreeReadUsedToday('2099-01-01'), true);
  // 另一个日期键未使用
  assert.equal(getFreeReadUsedToday('2099-01-02'), false);
  markFreeReadUsedToday('2099-01-02');
  assert.equal(getFreeReadUsedToday('2099-01-02'), true);
  // 互不污染
  assert.equal(getFreeReadUsedToday('2099-01-01'), true);
});
