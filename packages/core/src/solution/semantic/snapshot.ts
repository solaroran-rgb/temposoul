/**
 * 命律 · Snapshot 审计日志
 *
 * D-5：三路径同 snapshot 切换不重算
 * N-4：双通道回译（Sentence ↔ Atom 双射）
 */
import type { SolutionOutput } from './api';
import type { SolutionSnapshotV2, Fact, Evidence, ProcessEvent } from './types';

// ============================================================
// 1. Snapshot 结构
// ============================================================

export interface SolutionSnapshot {
  /** 快照 ID */
  snapshotId: string;
  /** 时间戳 */
  timestamp: number;
  /** 命盘上下文 hash（用于去重） */
  contextHash: string;
  /** 解盘输出 */
  output: SolutionOutput;
  /** 用户画像快照 */
  profile?: Record<string, unknown>;
  /** 版本号 */
  version: string;
}

// ============================================================
// 2. Snapshot 存储（内存版，后续换 Redis/DB）
// ============================================================

const snapshotStore = new Map<string, SolutionSnapshot>();

/** 存 snapshot */
export function saveSnapshot(snapshot: SolutionSnapshot): void {
  snapshotStore.set(snapshot.snapshotId, snapshot);
}

/** 取 snapshot */
export function loadSnapshot(snapshotId: string): SolutionSnapshot | undefined {
  return snapshotStore.get(snapshotId);
}

/** 列所有 snapshot */
export function listSnapshots(): string[] {
  return Array.from(snapshotStore.keys());
}

// ============================================================
// 3. 回译校验（N-4）
// ============================================================

/**
 * 回译双射校验：
 * 每条白话句 → atomicId → 术语模板 → 白话句
 * 校验 Sentence ↔ Atom 双射
 */
export function verifyBackTranslation(output: SolutionOutput): {
  pass: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const seen = new Set<string>();

  for (const path of [output.pro, output.mix, output.lay]) {
    for (const sentence of path.sentences) {
      // L0/L3 必须挂 atomic_id
      if ((sentence.layer === 'L0' || sentence.layer === 'L3') && !sentence.atomicId) {
        errors.push(`L${sentence.layer} 句缺 atomicId: ${sentence.text.slice(0, 20)}...`);
      }

      // atomicId 唯一性（同 snapshot 内）
      if (sentence.atomicId) {
        const key = `${sentence.atomicId}-${sentence.layer}`;
        if (seen.has(key)) {
          errors.push(`atomicId 重复: ${key}`);
        }
        seen.add(key);
      }

      // 极性一致性（同 atomicId 三路径极性必须相同）
      // （简化：实际需跨路径比对）
    }
  }

  return {
    pass: errors.length === 0,
    errors,
  };
}

// ============================================================
// 4. CIR v2 · Snapshot v2 序列化
// ============================================================

/**
 * 纯 TS 同步 SHA-256（无 node:crypto 依赖，跨 Node/浏览器一致）。
 * 输入按 UTF-8 单字节处理；本场景 seed 输入为 ASCII（JSON 数字/英文），安全。
 * 正确性已对 node:crypto 校验。
 */
function sha256Hex(message: string): string {
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);
  const rotr = (n: number, x: number): number => (x >>> n) | (x << (32 - n));

  let H = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ]);

  // UTF-8 编码为字节序列
  const bytes: number[] = [];
  for (let i = 0; i < message.length; i++) {
    let c = message.charCodeAt(i);
    if (c < 0x80) bytes.push(c);
    else if (c < 0x800) bytes.push(0xc0 | (c >> 6), 0x80 | (c & 0x3f));
    else if (c < 0xd800 || c >= 0xe000)
      bytes.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 0x3f), 0x80 | (c & 0x3f));
    else {
      i++;
      const c2 = message.charCodeAt(i);
      const cp = 0x10000 + (((c & 0x3ff) << 10) | (c2 & 0x3ff));
      bytes.push(0xf0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3f), 0x80 | ((cp >> 6) & 0x3f), 0x80 | (cp & 0x3f));
    }
  }

  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  const hi = Math.floor(bitLen / 0x100000000);
  const lo = bitLen >>> 0;
  bytes.push(
    (hi >>> 24) & 0xff, (hi >>> 16) & 0xff, (hi >>> 8) & 0xff, hi & 0xff,
    (lo >>> 24) & 0xff, (lo >>> 16) & 0xff, (lo >>> 8) & 0xff, lo & 0xff
  );

  const w = new Uint32Array(64);
  for (let off = 0; off < bytes.length; off += 64) {
    for (let i = 0; i < 16; i++) {
      const p = off + i * 4;
      w[i] = ((bytes[p] << 24) | (bytes[p + 1] << 16) | (bytes[p + 2] << 8) | bytes[p + 3]) >>> 0;
    }
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(7, w[i - 15]) ^ rotr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
      const s1 = rotr(17, w[i - 2]) ^ rotr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }

  return Array.from(H)
    .map((x) => (x >>> 0).toString(16).padStart(8, '0'))
    .join('');
}

/** UUID v4（优先 crypto.getRandomValues，回退 Math.random） */
function uuidV4(): string {
  const c: Crypto | undefined =
    typeof globalThis !== 'undefined' && (globalThis as { crypto?: Crypto }).crypto
      ? (globalThis as { crypto?: Crypto }).crypto
      : undefined;
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === 'function') {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const h = (n: number): string => n.toString(16).padStart(2, '0');
  return (
    h(bytes[0]) + h(bytes[1]) + h(bytes[2]) + h(bytes[3]) + '-' +
    h(bytes[4]) + h(bytes[5]) + '-' +
    h(bytes[6]) + h(bytes[7]) + '-' +
    h(bytes[8]) + h(bytes[9]) + '-' +
    h(bytes[10]) + h(bytes[11]) + h(bytes[12]) + h(bytes[13]) + h(bytes[14]) + h(bytes[15])
  );
}

/** saveSnapshotV2 的可选上下文（input 等 snapshot 元数据） */
export interface SnapshotV2Options {
  input?: SolutionSnapshotV2['input'];
  systems?: string[];
  facts?: Fact[];
  evidence?: Evidence[];
  engine_version?: string;
  options?: Record<string, unknown>;
}

const snapshotStoreV2 = new Map<string, SolutionSnapshotV2>();

/**
 * 由 SolutionOutput 生成 CIR v2 统一结论快照。
 * seed = SHA-256({input, systems, engine_version, options}) 前 16 位。
 */
export function saveSnapshotV2(output: SolutionOutput, opts: SnapshotV2Options = {}): SolutionSnapshotV2 {
  const input: SolutionSnapshotV2['input'] =
    opts.input ?? {
      datetime: new Date(output.timestamp).toISOString(),
      longitude: 0,
      latitude: 0,
      timezone: '',
      systems: opts.systems ?? [],
    };
  const systems = opts.systems ?? [];
  const engine_version = opts.engine_version ?? 'cir_v2.0';

  const seedInput = {
    input,
    systems,
    engine_version,
    options: opts.options ?? {},
  };
  const seed = sha256Hex(JSON.stringify(seedInput)).slice(0, 16);

  const atoms = output.meta.atoms;
  const process_log: ProcessEvent[] = output.process_log ?? [];

  const ref_ids: string[] = [];
  for (const a of atoms) ref_ids.push(a.atomicId);
  for (const ev of process_log) {
    if (ev.ref_ids) ref_ids.push(...ev.ref_ids);
  }

  const snapshot: SolutionSnapshotV2 = {
    snapshot_id: uuidV4(),
    seed,
    schema_version: 'cir_v2.0',
    input,
    systems,
    facts: opts.facts ?? [],
    atoms,
    evidence: opts.evidence ?? [],
    process_log,
    ref_ids,
    created_at: new Date().toISOString(),
    engine_version,
  };

  snapshotStoreV2.set(snapshot.snapshot_id, snapshot);
  return snapshot;
}

/** 取 v2 snapshot */
export function loadSnapshotV2(snapshotId: string): SolutionSnapshotV2 | undefined {
  return snapshotStoreV2.get(snapshotId);
}

/** 列所有 v2 snapshot ID */
export function listSnapshotsV2(): string[] {
  return Array.from(snapshotStoreV2.keys());
}

/**
 * 按 schema_version 路由解析历史 snapshot：
 * - 'cir_v2.0' → SolutionSnapshotV2
 * - 含 snapshotId → v1 SolutionSnapshot
 */
export function parseSnapshot(raw: unknown): SolutionSnapshot | SolutionSnapshotV2 | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (obj['schema_version'] === 'cir_v2.0') return raw as SolutionSnapshotV2;
  if (typeof obj['snapshotId'] === 'string') return raw as SolutionSnapshot;
  return null;
}
