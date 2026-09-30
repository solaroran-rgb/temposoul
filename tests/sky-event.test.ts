/**
 * 星空纪念事件 · 数据层与安全测试
 * 覆盖：CRUD、本人鉴权语义、越权返回 null、防遍历（无跨用户泄漏 / token 不可枚举）、公开只读投影。
 * 通过内存 KV mock 注入 SkyEventEnv，不依赖 Cloudflare 运行时。
 */
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSkyEvent,
  getOwnSkyEvent,
  getPublicSkyEvent,
  listOwnSkyEvents,
  updateOwnSkyEvent,
  deleteOwnSkyEvent,
  generateToken,
  type SkyEventEnv,
} from '../functions/api/v1/sky-events/_store';

class MemoryKV implements KVNamespace {
  private map = new Map<string, string>();
  async get(key: string): Promise<string | null> {
    return this.map.get(key) ?? null;
  }
  async put(key: string, value: string): Promise<void> {
    this.map.set(key, value);
  }
  async delete(key: string): Promise<void> {
    this.map.delete(key);
  }
  async list(options?: { prefix?: string }): Promise<{
    keys: Array<{ name: string }>;
    list_complete: boolean;
    cursor?: string;
  }> {
    const prefix = options?.prefix ?? '';
    const keys = [...this.map.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name }));
    return { keys, list_complete: true };
  }
}

let env: SkyEventEnv;

/** 每个测试用独立 KV，避免相互污染（store 无命名空间隔离，依赖调用方隔离）。 */
function freshEnv(): SkyEventEnv {
  return { AUTH_KV: new MemoryKV() };
}

beforeEach(() => {
  env = freshEnv();
});

const baseInput = {
  title: '测试纪念',
  note: '今晚的星空',
  eventTime: '2026-09-30T22:00:00',
  lat: 36.65,
  lng: 117.12,
  locationName: '济南',
  skySnapshot: { source: 'test' },
};

test('create 写入数据、逆向索引、分享映射', async () => {
  const evt = await createSkyEvent(env, 'alice@example.com', baseInput);
  assert.equal(evt.userId, 'alice@example.com');
  assert.ok(evt.id.startsWith('evt_'));
  assert.ok(evt.shareToken.length >= 20); // 128-bit base64url ≈ 22 字符

  // 数据本体可读
  const got = await getOwnSkyEvent(env, 'alice@example.com', evt.id);
  assert.ok(got);
  assert.equal(got!.title, '测试纪念');

  // 公开读存在
  const pub = await getPublicSkyEvent(env, evt.shareToken);
  assert.ok(pub);
  assert.equal(pub!.title, '测试纪念');
});

test('公开投影剔除 userId', async () => {
  const evt = await createSkyEvent(env, 'bob@example.com', baseInput);
  const pub = await getPublicSkyEvent(env, evt.shareToken);
  assert.ok(pub);
  assert.equal((pub as Record<string, unknown>).userId, undefined);
});

test('越权读取他人事件返回 null（不泄露存在性）', async () => {
  const evt = await createSkyEvent(env, 'alice@example.com', baseInput);
  // 另一用户按 id 读取
  const other = await getOwnSkyEvent(env, 'mallory@example.com', evt.id);
  assert.equal(other, null);
  // 列表不含他人事件
  const list = await listOwnSkyEvents(env, 'mallory@example.com');
  assert.equal(list.length, 0);
});

test('列表只返回本人事件，无跨用户泄漏', async () => {
  await createSkyEvent(env, 'alice@example.com', { ...baseInput, title: 'A1' });
  await createSkyEvent(env, 'alice@example.com', { ...baseInput, title: 'A2' });
  await createSkyEvent(env, 'bob@example.com', { ...baseInput, title: 'B1' });

  const alice = await listOwnSkyEvents(env, 'alice@example.com');
  assert.equal(alice.length, 2);
  assert.ok(alice.every((e) => e.userId === 'alice@example.com'));
});

test('更新本人事件生效；非本人返回 null', async () => {
  const evt = await createSkyEvent(env, 'alice@example.com', baseInput);
  const updated = await updateOwnSkyEvent(env, 'alice@example.com', evt.id, {
    title: '改名后',
    note: '新文案',
  });
  assert.ok(updated);
  assert.equal(updated!.title, '改名后');
  assert.equal(updated!.note, '新文案');

  const byOther = await updateOwnSkyEvent(env, 'bob@example.com', evt.id, { title: 'X' });
  assert.equal(byOther, null);
});

test('删除级联清理数据 + 分享映射 + 索引', async () => {
  const evt = await createSkyEvent(env, 'alice@example.com', baseInput);
  const ok = await deleteOwnSkyEvent(env, 'alice@example.com', evt.id);
  assert.equal(ok, true);

  assert.equal(await getOwnSkyEvent(env, 'alice@example.com', evt.id), null);
  assert.equal(await getPublicSkyEvent(env, evt.shareToken), null);
  const list = await listOwnSkyEvents(env, 'alice@example.com');
  assert.equal(list.length, 0);
});

test('分享 token 不可枚举：大量生成无碰撞', async () => {
  const tokens = new Set<string>();
  for (let i = 0; i < 5000; i++) {
    const t = generateToken(16);
    assert.equal(tokens.has(t), false, 'token 碰撞');
    tokens.add(t);
    // 格式校验：URL-safe base64url，长度 22（128-bit），无 + / = 
    assert.match(t, /^[A-Za-z0-9_-]{22}$/);
  }
});

test('防遍历：随机 token 取不到他人真实事件', async () => {
  const evt = await createSkyEvent(env, 'alice@example.com', baseInput);
  // 用错误 token 查询
  const miss = await getPublicSkyEvent(env, 'not-a-real-token-' + evt.id);
  assert.equal(miss, null);
  // 用他人的分享 token 反查 id 后，非本人仍无法读（只可公开读，无枚举端点）
  const pub = await getPublicSkyEvent(env, evt.shareToken);
  assert.ok(pub);
  assert.equal((pub as Record<string, unknown>).userId, undefined);
});
