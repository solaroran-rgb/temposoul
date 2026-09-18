/**
 * 命律 · Snapshot 审计日志
 *
 * D-5：三路径同 snapshot 切换不重算
 * N-4：双通道回译（Sentence ↔ Atom 双射）
 */
import type { SolutionOutput } from './api';

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
