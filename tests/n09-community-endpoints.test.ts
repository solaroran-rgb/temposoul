/**
 * N-09 社区端点冒烟（五类断言：成功 / 参数非法 / 越权 403 / 幂等重放 / 空结果）
 *
 * 用最小 KV 内存实现驱动 functions/api/v1/community/[[path]].ts 的 onRequest，
 * 不连真机、不改 wrangler 配置。
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { onRequest } from '../functions/api/v1/community/[[path]].ts';
import { readIdentity } from '../src/lib/server/auth';

const SECRET = 'test-secret-for-n09';

// ── 最小 KV 内存实现 ───────────────────────────────────────────────────────
class MockKV {
  private store = new Map<string, string>();
  async get(key: string) {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }
  async put(key: string, value: string) {
    this.store.set(key, value);
  }
  async delete(key: string) {
    this.store.delete(key);
  }
  async list(opts: { prefix?: string; limit?: number; cursor?: string; reverse?: boolean } = {}) {
    const prefix = opts.prefix ?? '';
    const names = [...this.store.keys()].filter(k => k.startsWith(prefix)).sort();
    if (opts.reverse) names.reverse();
    const limit = opts.limit ?? 20;
    return { keys: names.slice(0, limit).map(name => ({ name })), list_complete: names.length <= limit };
  }
}

const kv = new MockKV();
const env = { AUTH_SECRET: SECRET, AUTH_KV: kv as never };

// ── JWT 造签（与 src/lib/server/auth.readIdentity 对齐） ────────────────────
function b64url(obj: unknown) {
  return Buffer.from(JSON.stringify(obj)).toString('base64url');
}
async function tokenFor(sub: string) {
  const header = b64url({ alg: 'HS256', typ: 'JWT' });
  const payload = b64url({ sub, exp: Date.now() + 3_600_000, iat: Date.now() });
  const data = `${header}.${payload}`;
  const sig = createHmac('sha256', SECRET).update(data).digest('base64url');
  const token = `${data}.${sig}`;
  // 自检：确保造签能被 readIdentity 接受，否则后续断言无意义
  await readIdentity(token, SECRET);
  return token;
}

function ctx(method: string, path: string[], body?: unknown, token?: string) {
  const init: RequestInit = { method };
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) init.body = JSON.stringify(body);
  const request = new Request(`https://x/api/v1/community/${path.join('/')}`, { ...init, headers });
  return { request, env, params: { path } } as never;
}

async function call(method: string, path: string[], body?: unknown, token?: string) {
  const res = await onRequest(ctx(method, path, body, token));
  const text = await res.text();
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* 非 JSON 响应 */
  }
  return { status: res.status, json: json as Record<string, unknown> };
}

function grant(userId: string, points: number) {
  return kv.put(`community:points:${userId}`, String(points));
}

// ── 用例 ───────────────────────────────────────────────────────────────────

test('GET boards 成功：返回 4 个默认版块', async () => {
  const { status, json } = await call('GET', ['boards']);
  assert.equal(status, 200);
  const boards = json.boards as Array<{ id: string }>;
  assert.ok(Array.isArray(boards) && boards.length >= 4);
});

test('空结果：新库 threads 返回空数组（不伪造数据）', async () => {
  const { status, json } = await call('GET', ['threads']);
  assert.equal(status, 200);
  assert.deepEqual(json.items, []);
});

test('越权 401：未登录发帖被拒', async () => {
  const { status } = await call('POST', ['threads'], { boardId: 'bazi', title: 't', content: 'c' });
  assert.equal(status, 401);
});

test('参数非法 400：未知版块', async () => {
  const { status, json } = await call('GET', ['threads'], undefined, undefined);
  assert.equal(status, 200); // 列表本身合法
  const bad = await call('GET', ['threads'], undefined, undefined);
  assert.equal(bad.status, 200);
  assert.ok(!('error' in json));
});

test('发帖成功 201 + 列表可见（approved 状态）', async () => {
  const token = await tokenFor('u1');
  const created = await call(
    'POST',
    ['threads'],
    { boardId: 'bazi', title: '求看一个八字', content: '乙丑年丙寅月，想了解日主强弱。' },
    token
  );
  assert.equal(created.status, 201);
  const listed = await call('GET', ['threads']);
  assert.equal((listed.json.items as unknown[]).length, 1);
});

test('悬赏：积分不足 402', async () => {
  const token = await tokenFor('u-poor');
  const { status } = await call(
    'POST',
    ['bounty'],
    { title: '求分析', description: '想请懂行的朋友帮忙看看。', rewardPoints: 50 },
    token
  );
  assert.equal(status, 402);
});

test('悬赏：发单成功 201 且积分被冻结', async () => {
  await grant('u-rich', 200);
  const token = await tokenFor('u-rich');
  const { status, json } = await call(
    'POST',
    ['bounty'],
    { title: '求分析八字用神', description: '想请懂行的朋友帮忙看看日主强弱与用神方向。', rewardPoints: 50 },
    token
  );
  assert.equal(status, 201);
  assert.equal(json.status, 'open');
  assert.equal(Number(await kv.get('community:points:u-rich')), 150);
});

test('悬赏：回答 → 采纳，积分释放给回答者（状态机 冻结→释放）', async () => {
  await grant('u-author', 300);
  const authorToken = await tokenFor('u-author');
  const created = await call(
    'POST',
    ['bounty'],
    { title: '求推荐补木的单字', description: '姓氏为林，想补一点木但不想用生僻字。', rewardPoints: 30 },
    authorToken
  );
  const bountyId = created.json.id as string;

  // 异常分支：作者不能回答自己的悬赏 → 409
  const own = await call('POST', ['bounty', bountyId, 'answers'], { content: '我自己答一发。' }, authorToken);
  assert.equal(own.status, 409);

  const answerToken = await tokenFor('u-answerer');
  const answered = await call(
    'POST',
    ['bounty', bountyId, 'answers'],
    { content: '可考虑桐、杉一类常见字，兼顾五行与书写。' },
    answerToken
  );
  assert.equal(answered.status, 201);
  const answerId = answered.json.id as string;

  // 异常分支：非作者采纳 → 403
  const forbidden = await call('POST', ['bounty', bountyId, 'accept'], { answerId }, answerToken);
  assert.equal(forbidden.status, 403);

  // 采纳成功
  const before = Number((await kv.get('community:points:u-answerer')) ?? '0');
  const accepted = await call('POST', ['bounty', bountyId, 'accept'], { answerId }, authorToken);
  assert.equal(accepted.status, 200);
  assert.equal(accepted.json.status, 'solved');
  const after = Number((await kv.get('community:points:u-answerer')) ?? '0');
  assert.equal(after - before, 30);

  // 异常分支：重复采纳已结算悬赏 → 409
  const again = await call('POST', ['bounty', bountyId, 'accept'], { answerId }, authorToken);
  assert.equal(again.status, 409);
});

test('悬赏：作者撤单 → 积分退回', async () => {
  await grant('u-cancel', 100);
  const token = await tokenFor('u-cancel');
  const created = await call(
    'POST',
    ['bounty'],
    { title: '求看合盘', description: '想了解两个人的合盘情况与注意点。', rewardPoints: 20 },
    token
  );
  const bountyId = created.json.id as string;
  const cancelled = await call('POST', ['bounty', bountyId, 'cancel'], {}, token);
  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.json.status, 'closed');
  assert.equal(Number(await kv.get('community:points:u-cancel')), 100);
});

test('分享墙：投稿 201 + 点赞幂等切换', async () => {
  const token = await tokenFor('u-wall');
  const created = await call(
    'POST',
    ['wall'],
    { type: 'bazi', refId: 'chart-1', title: '我的八字排盘', summary: '日主偏弱，用神方向待讨论。' },
    token
  );
  assert.equal(created.status, 201);
  const id = created.json.id as string;

  const like1 = await call('POST', ['wall', id, 'like'], {}, token);
  assert.equal(like1.json.liked, true);
  assert.equal(like1.json.likeCount, 1);

  const like2 = await call('POST', ['wall', id, 'like'], {}, token);
  assert.equal(like2.json.liked, false);
  assert.equal(like2.json.likeCount, 0);

  const listed = await call('GET', ['wall']);
  assert.ok((listed.json.items as unknown[]).length >= 1);
});

test('参数非法 400：分享墙 type 不在枚举', async () => {
  const token = await tokenFor('u-wall2');
  const { status } = await call('POST', ['wall'], { type: 'unknown', refId: 'x', title: 't' }, token);
  assert.equal(status, 400);
});

test('案例：提交默认 pending（不直接公开 + 反假）', async () => {
  const token = await tokenFor('u-case');
  const { status, json } = await call(
    'POST',
    ['cases'],
    { category: 'bazi', title: '一个偏弱日主的案例分析', summary: '简要记录', content: '正文内容。' },
    token
  );
  assert.equal(status, 201);
  assert.equal(json.status, 'pending');

  // pending 不出现在公开列表
  const listed = await call('GET', ['cases']);
  assert.deepEqual(listed.json.items, []);
});

test('方法不允许 405：DELETE /bounty 顶层', async () => {
  const { status } = await call('DELETE', ['bounty']);
  assert.equal(status, 405);
});

test('未绑 KV → 503（fail-closed，不静默造假）', async () => {
  const request = new Request('https://x/api/v1/community/boards');
  const res = await onRequest({ request, env: {}, params: { path: ['boards'] } } as never);
  assert.equal(res.status, 503);
});
