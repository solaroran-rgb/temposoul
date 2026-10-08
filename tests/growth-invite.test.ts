// tests/growth-invite.test.ts
// S-6b B2 邀请制冷启动片单测。
// 跑法：pnpm exec tsx --tsconfig tsconfig.app.json --test tests/growth-invite.test.ts
// 覆盖：
//   - token 格式（inv- 前缀 + base64url 可解码 + InviteInfo 结构）
//   - decodeInviteToken：合法 / 非法 / 过期（exp 过去 → null）
//   - settleInvite granted：双方各 +1 AI 额度（本地 MVP 合并记账 = +2）
//   - 日上限 3：第 4 个全新 token → daily_cap
//   - 幂等：同 token 二次结算 → already
//   - 防转发：同 token 换指纹消费 → already（直接改写已消费记录的 fp 模拟）
//   - invalid / expired 分支
//   - ai-credits 基础记账（get/grant/consume/reset）
import test from 'node:test';
import assert from 'node:assert/strict';

// —— 内存 localStorage 桩（同 tests/daily-sky.test.ts 模式） ——
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
  createInviteToken,
  decodeInviteToken,
  settleInvite,
  getDailyInviteRewardCount,
  DAILY_REWARD_LIMIT,
} from '../src/lib/growth/invite';
import {
  getAiCredits,
  grantAiCredits,
  consumeAiCredit,
  resetAiCredits,
} from '../src/lib/growth/ai-credits';

// 测试用 base64url（与 invite.ts 内部实现一致，用于构造过期 token）
function b64urlJson(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj), 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function resetAll(): void {
  (globalThis as unknown as { localStorage: Storage }).localStorage = memoryStorage();
  resetAiCredits();
}

test('ai-credits：空→0，grant +n，consume 扣 1，归零后 consume 返 false，reset 回 0', () => {
  resetAll();
  assert.equal(getAiCredits(), 0);
  assert.equal(grantAiCredits(3), 3);
  assert.equal(getAiCredits(), 3);
  assert.equal(consumeAiCredit(), true);
  assert.equal(getAiCredits(), 2);
  assert.equal(consumeAiCredit(), true);
  assert.equal(consumeAiCredit(), true);
  assert.equal(getAiCredits(), 0);
  assert.equal(consumeAiCredit(), false);
  // 损坏兜底
  ;(globalThis as unknown as { localStorage: Storage }).localStorage.setItem('growth:aiCredits', 'NaN');
  assert.equal(getAiCredits(), 0);
  resetAiCredits();
  assert.equal(getAiCredits(), 0);
});

test('createInviteToken：inv- 前缀 + base64url 可解码 + InviteInfo 结构完整', () => {
  resetAll();
  const token = createInviteToken();
  assert.ok(token.startsWith('inv-'), `token 应有 inv- 前缀: ${token}`);
  const info = decodeInviteToken(token);
  assert.ok(info, '合法 token 应可解码');
  assert.equal(typeof info!.inviterId, 'string');
  assert.ok(info!.inviterId.length > 0, 'inviterId 非空');
  assert.ok(info!.exp > Date.now(), 'exp 应在未来');
  assert.match(info!.nonce, /^[a-z0-9]{4}$/, 'nonce 应为 4 位');
});

test('decodeInviteToken：乱码 / 篡改 / 错误前缀 → null', () => {
  resetAll();
  assert.equal(decodeInviteToken(''), null);
  assert.equal(decodeInviteToken('daily-xxxx'), null);
  assert.equal(decodeInviteToken('inv-!!!not_base64!!!'), null);
  // 合法结构但字段缺失
  const badShape = 'inv-' + b64urlJson({ inviterId: 'x' });
  assert.equal(decodeInviteToken(badShape), null);
});

test('decodeInviteToken：exp 过去 → null（过期）', () => {
  resetAll();
  const expired = 'inv-' + b64urlJson({
    inviterId: 'deadbeef',
    exp: Date.now() - 1000,
    nonce: 'abcd',
  });
  assert.equal(decodeInviteToken(expired), null);
});

test('settleInvite granted：双方各 +1（本地 MVP = 余额 +2），日计数 +1', () => {
  resetAll();
  assert.equal(getAiCredits(), 0);
  const token = createInviteToken();
  const r = settleInvite(token);
  assert.equal(r, 'granted');
  // MVP：双方额度合并记账在当前设备（跨设备发放待后端）
  assert.equal(getAiCredits(), 2, 'granted 后双方各 +1 应体现在余额 +2');
  assert.equal(getDailyInviteRewardCount(), 1);
});

test('settleInvite 幂等：同 token 二次结算 → already', () => {
  resetAll();
  const token = createInviteToken();
  assert.equal(settleInvite(token), 'granted');
  assert.equal(settleInvite(token), 'already');
  // 幂等不再发额度
  assert.equal(getAiCredits(), 2);
  assert.equal(getDailyInviteRewardCount(), 1);
});

test('settleInvite 防转发：同 token 已被「别的指纹」消费 → already', () => {
  resetAll();
  const token = createInviteToken();
  // 第一次结算（当前设备指纹）
  assert.equal(settleInvite(token), 'granted');
  // 模拟：手动改写已消费记录的 fp 为「另一台设备」
  const ls = (globalThis as unknown as { localStorage: Storage }).localStorage;
  // 直接扫描 localStorage 找到 growth:inviteConsumed: 开头的 key
  let consumedKey = '';
  for (let i = 0; i < ls.length; i += 1) {
    const k = ls.key(i)!;
    if (k.startsWith('growth:inviteConsumed:')) {
      consumedKey = k;
      break;
    }
  }
  assert.ok(consumedKey, '应存在消费记录');
  ls.setItem(consumedKey, JSON.stringify({ fp: 'another-device-fp', at: Date.now() }));
  // 当前设备再次结算（fp !== 记录 fp）→ already（防转发）
  assert.equal(settleInvite(token), 'already');
  assert.equal(getAiCredits(), 2, '防转发不应重复发额度');
});

test('settleInvite 日上限 3：第 4 个全新 token → daily_cap', () => {
  resetAll();
  assert.equal(DAILY_REWARD_LIMIT, 3);
  const t1 = createInviteToken();
  const t2 = createInviteToken();
  const t3 = createInviteToken();
  const t4 = createInviteToken();
  assert.equal(settleInvite(t1), 'granted');
  assert.equal(settleInvite(t2), 'granted');
  assert.equal(settleInvite(t3), 'granted');
  assert.equal(getDailyInviteRewardCount(), 3);
  assert.equal(settleInvite(t4), 'daily_cap');
  // daily_cap 不发额度
  assert.equal(getAiCredits(), 6); // 3 次 granted × 2
  assert.equal(getDailyInviteRewardCount(), 3);
});

test('settleInvite invalid：乱码 token → invalid', () => {
  resetAll();
  assert.equal(settleInvite(''), 'invalid');
  assert.equal(settleInvite('daily-foo'), 'invalid');
  assert.equal(settleInvite('inv-!!!'), 'invalid');
  // 不应写消费记录 / 不应发额度
  assert.equal(getAiCredits(), 0);
  assert.equal(getDailyInviteRewardCount(), 0);
});

test('settleInvite expired：exp 过去 → expired', () => {
  resetAll();
  const expired = 'inv-' + b64urlJson({
    inviterId: 'deadbeef',
    exp: Date.now() - 5000,
    nonce: 'abcd',
  });
  assert.equal(settleInvite(expired), 'expired');
  assert.equal(getAiCredits(), 0);
  assert.equal(getDailyInviteRewardCount(), 0);
});
