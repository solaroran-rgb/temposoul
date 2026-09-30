/**
 * T14 商店测试公共设施（非测试文件，命名不匹配 tests/*.test.ts）
 *
 * - memoryKV：实现 get/put/delete/list(prefix)，模拟 Workers KV；
 *   共用一个 Map 即可模拟「进程重启 / 新 isolate」——数据仍在，内存态不在。
 * - memoryD1：记录 SQL 调用，用于断言 T04 orders 表写入（金额单位 / 状态流转）。
 */
import type { ShopEnv } from '../src/lib/commerce/shop/index.ts';

export interface MemoryKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{
    keys: Array<{ name: string }>;
    list_complete: boolean;
    cursor?: string;
  }>;
}

export function createMemoryKV(store: Map<string, string> = new Map()): MemoryKV {
  return {
    async get(key) {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    async put(key, value) {
      store.set(key, value);
    },
    async delete(key) {
      store.delete(key);
    },
    async list(options = {}) {
      const prefix = options.prefix ?? '';
      const limit = options.limit ?? 1000;
      const all = [...store.keys()].filter((k) => k.startsWith(prefix)).sort();
      const offset = options.cursor ? Number(options.cursor) : 0;
      const slice = all.slice(offset, offset + limit);
      const nextOffset = offset + slice.length;
      return {
        keys: slice.map((name) => ({ name })),
        list_complete: nextOffset >= all.length,
        cursor: String(nextOffset),
      };
    },
  };
}

export interface D1Call {
  sql: string;
  values: unknown[];
}

export interface MemoryD1 {
  calls: D1Call[];
  prepare(sql: string): {
    bind(...values: unknown[]): {
      run(): Promise<{ results: unknown[]; success: boolean; meta: unknown }>;
      first(): Promise<null>;
      all(): Promise<{ results: unknown[]; success: boolean; meta: unknown }>;
    };
  };
  exec(): Promise<{ count: number; duration: number }>;
  batch(): Promise<unknown[]>;
  dump(): Promise<ArrayBuffer>;
}

export function createMemoryD1(): MemoryD1 {
  const calls: D1Call[] = [];
  return {
    calls,
    prepare(sql: string) {
      const push = (values: unknown[]) => calls.push({ sql, values });
      return {
        bind(...values: unknown[]) {
          return {
            async run() {
              push(values);
              return { results: [], success: true, meta: {} };
            },
            async first() {
              push(values);
              return null;
            },
            async all() {
              push(values);
              return { results: [], success: true, meta: {} };
            },
          };
        },
      };
    },
    async exec() {
      return { count: 0, duration: 0 };
    },
    async batch() {
      return [];
    },
    async dump() {
      return new ArrayBuffer(0);
    },
  };
}

export interface TestEnv {
  env: ShopEnv;
  store: Map<string, string>;
  d1: MemoryD1;
}

/** 新建一套「运行时」（KV 数据可选复用 → 模拟重启后数据仍在）。 */
export function makeEnv(opts: { store?: Map<string, string>; d1?: boolean } = {}): TestEnv {
  const store = opts.store ?? new Map<string, string>();
  const d1 = createMemoryD1();
  const env = {
    AUTH_KV: createMemoryKV(store) as unknown as KVNamespace,
    ...(opts.d1 === false ? {} : { D1: d1 as unknown as D1Database }),
  } as ShopEnv;
  return { env, store, d1 };
}
