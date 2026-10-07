/**
 * Entitlement KV 存取层（对齐 AUTH_KV 主事实源）
 *
 * 注意：KV 非事务，count 扣减为 read-modify-write。P0 阶段该闸门在「放行 LLM 前」
 * 串行执行，并发极端下的超扣风险记录在汇总【待实测】项；P1 可升级 D1 行级事务。
 */
import type {
  EntitlementBag,
  EntitlementGrant,
  EntitlementKey,
} from './types';
import { ENT_KV_PREFIX } from './types';

export interface EntitlementKv {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete?(key: string): Promise<void>;
}

function kvKey(userId: string): string {
  return `${ENT_KV_PREFIX}${userId}`;
}

export async function readBag(kv: EntitlementKv, userId: string): Promise<EntitlementBag> {
  const raw = await kv.get(kvKey(userId));
  const empty: EntitlementBag = { version: 1, items: {}, updatedAt: new Date().toISOString() };
  if (!raw) return empty;
  try {
    const parsed = JSON.parse(raw) as Partial<EntitlementBag>;
    if (parsed && typeof parsed === 'object' && parsed.items) {
      return { version: 1, items: parsed.items, updatedAt: parsed.updatedAt ?? new Date().toISOString() };
    }
  } catch {
    // 损坏记录按空处理（不抛错，避免阻断业务）
  }
  return empty;
}

export async function writeBag(
  kv: EntitlementKv,
  userId: string,
  bag: EntitlementBag,
): Promise<void> {
  bag.updatedAt = new Date().toISOString();
  await kv.put(kvKey(userId), JSON.stringify(bag));
}

/** 把一条 grant 追加到用户权益（幂等：同 ref+key 不重复写入） */
export async function grantEntitlement(
  kv: EntitlementKv,
  userId: string,
  grant: EntitlementGrant,
): Promise<EntitlementBag> {
  const bag = await readBag(kv, userId);
  const list = bag.items[grant.key] ? [...(bag.items[grant.key] as EntitlementGrant[])] : [];

  // 幂等：同一 ref+key 已存在则跳过
  const dup = list.some((g) => g.ref && g.ref === grant.ref && g.key === grant.key);
  if (!dup) {
    list.push(grant);
  }
  bag.items[grant.key] = list;
  await writeBag(kv, userId, bag);
  return bag;
}

/** 取出某 key 的全部 grant（导出供闸门逻辑使用，不落库） */
export function grantsFor(bag: EntitlementBag, key: EntitlementKey): EntitlementGrant[] {
  return bag.items[key] ?? [];
}
