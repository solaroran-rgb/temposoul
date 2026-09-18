/**
 * B 域注册表：O(1) 路由/ID 索引 + Merkle 叶输入
 * 来源：专家 B R3 回收稿 §B-3 b.registry.ts
 *
 * bMerkleRoot 算法（与 R3 一致，node 侧复算）：
 *   leaf_i = sha256(`${id}:${JSON.stringify(record.data)}`)
 *   root   = sha256( leaves.sort().join('') )
 * 前端 bundle 不含 node:crypto，故根值由 tsx 预计算后硬编码于此；
 * bMerkleLeafInputs 供 scripts/verify-merkle.mjs 独立复算核对。
 */
import type { BDomainRecord } from './types';
import { crystalGems } from './crystal-gems.data';
import { palmistryLines } from './palmistry.data';
import { astrologyTerms } from './astrology-terms.data';
import { podcastEpisodes } from './podcast.data';
import { fortuneArticles } from './fortune-articles.data';
import { expertProfiles } from './experts.data';
import { validateSerialize, leafInput } from './_runtime';

const allRawRecords: BDomainRecord[] = [
  ...crystalGems,
  ...palmistryLines,
  ...astrologyTerms,
  ...podcastEpisodes,
  ...fortuneArticles,
  ...expertProfiles,
];

/** 合规过滤后的 B 域全量记录 */
export const bRecords: readonly BDomainRecord[] = validateSerialize(allRawRecords);

/** O(1) id → 记录 */
export const bDomainRegistry = new Map<string, BDomainRecord>(bRecords.map((r) => [r.id, r]));

/** Merkle 叶输入串（node 侧复算 sha256 用） */
export const bMerkleLeafInputs: readonly string[] = bRecords.map(leafInput);

/** B 域记录总数 */
export const B_DOMAIN_COUNT = bRecords.length;

/**
 * B 域 Merkle Root（sha256）
 * 由 tsx 预计算：sha256( bMerkleLeafInputs.map(sha256).sort().join('') )
 * 计算时间：2026-09-18（与 scripts/verify-merkle.mjs 三方一致核对）
 */
export const bMerkleRoot = 'e1d7a52b2e45b9ed307bd7c7c5fda439d8d1ed1a997537a065a957c16e39850f';

export function getBRecord(id: string): BDomainRecord | undefined {
  return bDomainRegistry.get(id);
}

/** 按 module 过滤 */
export function listBByModule(module: BDomainRecord['module']): BDomainRecord[] {
  return bRecords.filter((r) => r.module === module);
}
