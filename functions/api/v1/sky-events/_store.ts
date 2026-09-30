/**
 * 星空纪念事件数据层（KV-based，复用 AUTH_KV）
 *
 * 不引入新数据库/绑定，沿用 report/store 的「逆向索引 + 级联删除」模式。
 * 分享 token 为 128-bit 随机 base64url，不可枚举；无任何「列出全部事件」端点，
 * 越权读取一律按 404 处理，从根上杜绝遍历。
 *
 * KV key 布局（见 docs/sky-events/README.md 迁移说明）：
 *   skyevt:data:<id>        → JSON(SkyEvent)        （数据主体）
 *   skyevt:share:<token>    → <id>                  （token → 事件，公开只读映射）
 *   skyevt_index:<userId>   → string[]（eventId）   （用户逆向索引，列表/级联用）
 */

export interface SkyEventInput {
  title: string;
  note: string;
  eventTime: string; // ISO8601
  lat: number;
  lng: number;
  locationName: string;
  skySnapshot?: Record<string, unknown>;
}

export interface SkyEvent extends SkyEventInput {
  id: string;
  userId: string; // identity.sub（邮箱）
  shareToken: string; // 128-bit base64url
  createdAt: string;
  updatedAt: string;
}

/** 公开投影：剔除 userId 等私有字段，供分享页只读返回 */
export type PublicSkyEvent = Omit<SkyEvent, 'userId'>;

export interface SkyEventEnv {
  AUTH_KV: KVNamespace;
}

const EVENT_TTL = 86400 * 365 * 5; // 5 年保留（纪念属性，长期留存）

function dataKey(id: string): string {
  return `skyevt:data:${id}`;
}
function shareKey(token: string): string {
  return `skyevt:share:${token}`;
}
function indexKey(userId: string): string {
  return `skyevt_index:${userId}`;
}

/** 生成 URL-safe 随机 token（默认 16 字节 = 128-bit）。 */
export function generateToken(byteLength = 16): string {
  const buf = crypto.getRandomValues(new Uint8Array(byteLength));
  let binary = '';
  for (const b of buf) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** 事件 id（96-bit，内部主键，非公开）。 */
export function generateEventId(): string {
  return `evt_${generateToken(12)}`;
}

function toPublic(evt: SkyEvent): PublicSkyEvent {
  const { userId: _userId, ...rest } = evt;
  return rest;
}

async function pushUserAsset(env: SkyEventEnv, userId: string, key: string): Promise<void> {
  // 注册到 user_assets，使账号级联删除（me/data.ts）一并清理纪念事件，符合隐私合规。
  const raw = await env.AUTH_KV.get(`user_assets:${userId}`);
  const assets: string[] = raw ? JSON.parse(raw) : [];
  if (!assets.includes(key)) {
    assets.push(key);
    await env.AUTH_KV.put(`user_assets:${userId}`, JSON.stringify(assets), {
      expirationTtl: EVENT_TTL,
    });
  }
}

export async function createSkyEvent(
  env: SkyEventEnv,
  userId: string,
  input: SkyEventInput,
): Promise<SkyEvent> {
  const id = generateEventId();
  const shareToken = generateToken(16);
  const now = new Date().toISOString();
  const evt: SkyEvent = {
    id,
    userId,
    title: input.title,
    note: input.note,
    eventTime: input.eventTime,
    lat: input.lat,
    lng: input.lng,
    locationName: input.locationName,
    skySnapshot: input.skySnapshot ?? {},
    shareToken,
    createdAt: now,
    updatedAt: now,
  };

  await env.AUTH_KV.put(dataKey(id), JSON.stringify(evt), { expirationTtl: EVENT_TTL });
  await env.AUTH_KV.put(shareKey(shareToken), id, { expirationTtl: EVENT_TTL });

  const idxRaw = await env.AUTH_KV.get(indexKey(userId));
  const idx: string[] = idxRaw ? JSON.parse(idxRaw) : [];
  if (!idx.includes(id)) idx.push(id);
  await env.AUTH_KV.put(indexKey(userId), JSON.stringify(idx), { expirationTtl: EVENT_TTL });

  await pushUserAsset(env, userId, dataKey(id));
  await pushUserAsset(env, userId, shareKey(shareToken));
  await pushUserAsset(env, userId, indexKey(userId));

  return evt;
}

export async function getRawSkyEvent(env: SkyEventEnv, id: string): Promise<SkyEvent | null> {
  const raw = await env.AUTH_KV.get(dataKey(id));
  return raw ? (JSON.parse(raw) as SkyEvent) : null;
}

/** 本人读取：非本人或不存在一律返回 null（调用方按 404 处理，避免泄露存在性）。 */
export async function getOwnSkyEvent(
  env: SkyEventEnv,
  userId: string,
  id: string,
): Promise<SkyEvent | null> {
  const evt = await getRawSkyEvent(env, id);
  if (!evt || evt.userId !== userId) return null;
  return evt;
}

export async function listOwnSkyEvents(
  env: SkyEventEnv,
  userId: string,
): Promise<SkyEvent[]> {
  const idxRaw = await env.AUTH_KV.get(indexKey(userId));
  const idx: string[] = idxRaw ? JSON.parse(idxRaw) : [];
  const events: SkyEvent[] = [];
  for (const id of idx) {
    const evt = await getRawSkyEvent(env, id);
    if (evt && evt.userId === userId) events.push(evt);
  }
  events.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return events;
}

/** 本人更新（部分字段）。返回更新后事件；非本人/不存在返回 null。 */
export async function updateOwnSkyEvent(
  env: SkyEventEnv,
  userId: string,
  id: string,
  patch: Partial<SkyEventInput>,
): Promise<SkyEvent | null> {
  const evt = await getOwnSkyEvent(env, userId, id);
  if (!evt) return null;
  const next: SkyEvent = {
    ...evt,
    ...patch,
    skySnapshot: patch.skySnapshot ?? evt.skySnapshot,
    updatedAt: new Date().toISOString(),
  };
  await env.AUTH_KV.put(dataKey(id), JSON.stringify(next), { expirationTtl: EVENT_TTL });
  return next;
}

/** 本人删除（数据 + 分享映射 + 逆向索引 + user_assets 级联）。返回是否真删除了。 */
export async function deleteOwnSkyEvent(
  env: SkyEventEnv,
  userId: string,
  id: string,
): Promise<boolean> {
  const evt = await getOwnSkyEvent(env, userId, id);
  if (!evt) return false;

  await env.AUTH_KV.delete(dataKey(id));
  await env.AUTH_KV.delete(shareKey(evt.shareToken));

  const idxRaw = await env.AUTH_KV.get(indexKey(userId));
  const idx: string[] = idxRaw ? JSON.parse(idxRaw) : [];
  const nextIdx = idx.filter((x) => x !== id);
  if (nextIdx.length) {
    await env.AUTH_KV.put(indexKey(userId), JSON.stringify(nextIdx), { expirationTtl: EVENT_TTL });
  } else {
    await env.AUTH_KV.delete(indexKey(userId));
  }

  // 从 user_assets 移除本事件相关键
  const uaRaw = await env.AUTH_KV.get(`user_assets:${userId}`);
  if (uaRaw) {
    const assets: string[] = JSON.parse(uaRaw);
    const filtered = assets.filter(
      (k) => k !== dataKey(id) && k !== shareKey(evt.shareToken) && k !== indexKey(userId),
    );
    if (filtered.length) {
      await env.AUTH_KV.put(`user_assets:${userId}`, JSON.stringify(filtered), {
        expirationTtl: EVENT_TTL,
      });
    } else {
      await env.AUTH_KV.delete(`user_assets:${userId}`);
    }
  }
  return true;
}

/** 按分享 token 公开读取（只读，剔除私有字段）。不存在返回 null。 */
export async function getPublicSkyEvent(
  env: SkyEventEnv,
  token: string,
): Promise<PublicSkyEvent | null> {
  const id = await env.AUTH_KV.get(shareKey(token));
  if (!id) return null;
  const evt = await getRawSkyEvent(env, id);
  if (!evt) return null;
  return toPublic(evt);
}

/** 账号级联删除：清理某用户全部纪念事件（供隐私合规调用，可选）。 */
export async function purgeUserSkyEvents(
  env: SkyEventEnv,
  userId: string,
): Promise<number> {
  const events = await listOwnSkyEvents(env, userId);
  for (const evt of events) {
    await env.AUTH_KV.delete(dataKey(evt.id));
    await env.AUTH_KV.delete(shareKey(evt.shareToken));
  }
  await env.AUTH_KV.delete(indexKey(userId));
  return events.length;
}
