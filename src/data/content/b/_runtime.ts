/**
 * B 域运行时：工厂函数（Branded Type 安全收窄）+ 合规红线扫描 + Merkle 叶输入
 * 来源：专家 B R3 回收稿 §B-2 _runtime.ts
 *
 * 设计调整（R5 审计 E-9 / 边缘运行建议）：
 * - 前端 bundle 不引入 node:crypto；叶值不在前端计算。
 * - 本文件仅导出「叶输入串」 leafInput(record)，由 node 侧 verify-merkle.mjs
 *   独立复算 sha256 → 排序 → 拼根；前端只消费预计算常量 bMerkleRoot。
 */
import type {
  BDomainRecord,
  BRecBase,
  CrystalGemstone,
  PalmistryLine,
  AstrologyTerm,
  PodcastEpisode,
  FortuneArticle,
  ExpertProfile,
  GemId,
  PalmId,
  TermId,
  PodcastId,
  ArticleId,
  ExpertId,
} from './types';

/** 1180 词库红线正则（B 域特化版）——命中即拒签 */
const FORBIDDEN_REGEX =
  /大凶|大吉|血光|破财|必死|注定|克夫|克妻|改运|转运|做法事|买符|千万不要|赶紧|否则|后果不堪设想/i;

export function createGemRecord(id: string, base: BRecBase, data: CrystalGemstone): BDomainRecord {
  return { ...base, module: 'crystal', id: id as GemId, data };
}
export function createPalmRecord(id: string, base: BRecBase, data: PalmistryLine): BDomainRecord {
  return { ...base, module: 'palmistry', id: id as PalmId, data };
}
export function createTermRecord(id: string, base: BRecBase, data: AstrologyTerm): BDomainRecord {
  return { ...base, module: 'astrology_term', id: id as TermId, data };
}
export function createPodcastRecord(
  id: string,
  base: BRecBase,
  data: PodcastEpisode,
): BDomainRecord {
  return { ...base, module: 'podcast', id: id as PodcastId, data };
}
export function createArticleRecord(
  id: string,
  base: BRecBase,
  data: FortuneArticle,
): BDomainRecord {
  return { ...base, module: 'fortune', id: id as ArticleId, data };
}
export function createExpertRecord(id: string, base: BRecBase, data: ExpertProfile): BDomainRecord {
  return { ...base, module: 'expert', id: id as ExpertId, data };
}

/** 合规扫描：返回是否干净（红线命中即脏） */
export function isClean(record: BDomainRecord): boolean {
  return !FORBIDDEN_REGEX.test(JSON.stringify(record.data));
}

/**
 * Merkle 叶输入串（前端不哈希，仅供 node 侧复算）。
 * 与 R3 稿一致：`${id}:${JSON.stringify(data)}`。
 */
export function leafInput(record: BDomainRecord): string {
  return `${record.id}:${JSON.stringify(record.data)}`;
}

/** 过滤：红线命中剔除；cautious 文章必须带 dont 清单 */
export function validateSerialize(records: BDomainRecord[]): BDomainRecord[] {
  return records.filter((r) => {
    if (!isClean(r)) {
      // eslint-disable-next-line no-console
      console.error(`[CI/CD Block] B 域命中红线词库: ${r.id}`);
      return false;
    }
    if (r.module === 'fortune' && r.data.vibe_index === 'cautious') {
      if (!r.data.action_list?.dont?.length) return false;
    }
    return true;
  });
}
