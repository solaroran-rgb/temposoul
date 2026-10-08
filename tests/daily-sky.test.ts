// tests/daily-sky.test.ts
// 每日星象数据层单测（node:test，跑法：pnpm exec tsx --tsconfig tsconfig.app.json --test tests/daily-sky.test.ts）
// 覆盖：getDailyKey 格式 / refreshIfNewDay 跨天判定 / 档案渐进披露 D1-D2-D3 /
//       buildDailySky 禁词兜底 / 同 dailyKey 引文唯一。
import test from 'node:test';
import assert from 'node:assert/strict';

// —— 内存 localStorage 桩：dailyKey/profile 均在函数体内惰性读 localStorage，
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

import { getDailyKey, refreshIfNewDay } from '../src/lib/daily-sky/dailyKey';
import {
  PROFILE_STEPS,
  clearProfile,
  getProfile,
  nextStep,
  saveProfile,
} from '../src/lib/daily-sky/profile';
import { CORPUS, pickDailyQuote } from '../src/lib/daily-sky/corpus';
import { buildDailySky, sanitizeField } from '../src/lib/daily-sky/daily';
import { hasBannedWord } from '../src/lib/client-compliance';

test('getDailyKey 返回本地时区 YYYY-MM-DD 格式', () => {
  assert.match(getDailyKey(), /^\d{4}-\d{2}-\d{2}$/);
});

test('refreshIfNewDay：空记录→true，同日重复→false，置昨日 key→true', () => {
  (globalThis as unknown as { localStorage: Storage }).localStorage = memoryStorage();
  assert.equal(refreshIfNewDay(), true); // 首见今日
  assert.equal(refreshIfNewDay(), false); // 同日已记录
  // 伪造昨日记录 → 下一次调用应判为跨天
  ;(globalThis as unknown as { localStorage: Storage }).localStorage.setItem(
    'daily-sky:lastSeen',
    '2000-01-01',
  );
  assert.equal(refreshIfNewDay(), true);
  assert.equal(refreshIfNewDay(), false);
});

test('档案渐进披露：D1→D2→D3→done，save/clear 闭环', () => {
  (globalThis as unknown as { localStorage: Storage }).localStorage = memoryStorage();
  assert.equal(nextStep({}), 'D1');
  assert.equal(nextStep({ nickname: '阿月', timeZone: 'America/Phoenix' }), 'D2');
  assert.equal(
    nextStep({ nickname: '阿月', timeZone: 'America/Phoenix', birthday: '1990-08-15' }),
    'D3',
  );
  assert.equal(
    nextStep({
      nickname: '阿月',
      timeZone: 'America/Phoenix',
      birthday: '1990-08-15',
      birthTime: '12:30',
    }),
    'done',
  );
  assert.equal(PROFILE_STEPS.length, 3);

  saveProfile({ nickname: '阿月', timeZone: 'UTC' });
  assert.equal(getProfile().nickname, '阿月');
  clearProfile();
  assert.deepEqual(getProfile(), {});
});

test('sanitizeField：命中禁词整条替换，兜底文案自身干净', () => {
  const fb = '今夜星象如常，宜静观与整理。';
  assert.equal(hasBannedWord(fb), false);
  assert.equal(sanitizeField('明日必涨稳赚不赔内幕消息', fb), fb);
  const clean = '月相滋养的夜晚，适合回顾与整理。';
  assert.equal(sanitizeField(clean, fb), clean);
});

test('buildDailySky：payload 形状合规、全字段无禁词；有生日才带 zodiacLine', () => {
  const p = buildDailySky();
  assert.equal(p.compliance, '此为传统命理观点');
  assert.match(p.dateKey, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(typeof p.moonPhase, 'string');
  assert.equal(typeof p.skyEventTitle, 'string');
  for (const f of [p.skyEventTitle, p.personalNote, p.quote, p.source, p.moonPhase]) {
    assert.equal(hasBannedWord(f), false, `payload 字段命中禁词: ${f}`);
  }
  // 无生日：省略 zodiacLine
  assert.equal(p.zodiacLine, undefined);

  // 有生日（8/15 = 狮子座）：zodiacLine 出现且干净，personalNote 提到太阳星座
  const p2 = buildDailySky({ nickname: '阿月', timeZone: 'UTC', birthday: '1990-08-15' });
  assert.ok(p2.zodiacLine && p2.zodiacLine.length > 0, '有生日应带 zodiacLine');
  assert.equal(hasBannedWord(p2.zodiacLine as string), false);
  assert.match(p2.personalNote, /狮子座/);
});

test('引文库 ≥24 条；同一 dailyKey 恒定同一条（24h 内不跳动）', () => {
  assert.ok(CORPUS.length >= 24, `corpus 条数不足: ${CORPUS.length}`);
  const a = pickDailyQuote('2026-10-08');
  const b = pickDailyQuote('2026-10-08');
  assert.deepEqual(a, b);
  assert.ok(CORPUS.some((c) => c.quote === a.quote && c.source === a.source));
  const c2 = pickDailyQuote('2026-10-09');
  assert.ok(CORPUS.some((c) => c.quote === c2.quote && c.source === c2.source));
});
