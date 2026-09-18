/**
 * 批 3b-B（开运民俗与媒体资讯内容）域类型定义
 * 来源：专家 B R3 编码轮回收稿（专家论证稿_20260918_143217.md §B types.ts）
 * 裁决 V-1：锁定 R3 基线（工厂模式 + BDomainRecord 判别联合 + bMerkleRoot）
 *
 * 与仓库既有 ContentRecord<E>（bazi-ziwei/types）的关系：
 * - 本域为自洽信封，不复用 AnyExtra（该联合为 A/C/D 四域封闭，不在本域改动范围）。
 * - 前端 bundle 不引入 node:crypto；Merkle 叶输入见 _runtime.ts，根值由 node 侧预计算。
 */

// B 域 Branded Types（防止 ID 跨模块混用）
export type GemId = string & { readonly __brand: 'GemId' };
export type TermId = string & { readonly __brand: 'TermId' };
export type ArticleId = string & { readonly __brand: 'ArticleId' };
export type ExpertId = string & { readonly __brand: 'ExpertId' };
export type PodcastId = string & { readonly __brand: 'PodcastId' };
export type PalmId = string & { readonly __brand: 'PalmId' };

/** B 域判别键（页面注册表 kind 前缀 b_* 由 registry 维护） */
export type BModule = 'crystal' | 'palmistry' | 'astrology_term' | 'podcast' | 'fortune' | 'expert';

/** 统一信封基类：列表/详情通用渲染所需元数据 */
export interface BRecBase {
  /** 列表页路径（如 /gems） */
  listPath: string;
  /** 详情页规范路径（如 /gems/amethyst） */
  detailPath: string;
  title: string;
  summary: string;
  tags: readonly string[];
}

// ===== 六类载荷（与 R3 稿逐字一致）=====

export interface CrystalGemstone {
  name_zh: string;
  hex_color: string;
  mohs_hardness: number;
  source_reference: string;
  cultural_meaning: string;
  aesthetic_scenario: string;
  care_guide: string;
}

export interface PalmistryLine {
  line_id: 'life' | 'head' | 'heart';
  name_zh: string;
  palm_roi: { start: readonly [number, number]; end: readonly [number, number] };
  shape_templates: { shape: string; interpretation: string }[];
}

export interface AstrologyTerm {
  category: 'planet' | 'aspect' | 'house';
  name_zh: string;
  psychological_function: string;
  plain_interpretation: string;
  shadow_trait: string;
  defense_mechanism: string;
  related_zodiacs: string[];
}

export interface PodcastEpisode {
  channel_id: string;
  title: string;
  description_html: string;
  audio_url: string;
  duration_sec: number;
  pub_date: string;
  guid: string;
  explicit: boolean;
  sourceRef: string;
  script_sop_blocks: { timecode: string; segment: string; content: string }[];
}

export interface FortuneArticle {
  article_id: string;
  title: string;
  vibe_index: 'smooth' | 'moderate' | 'cautious';
  publish_date: string;
  sourceRef: string;
  content_blocks: ({ type: 'text'; content: string } | { type: 'list'; items: string[] })[];
  action_list: { do: string[]; dont: string[] };
}

export type CertType = 'PMP' | 'GCDF' | 'CPS' | 'ACSS' | 'NMPA';

export interface ExpertProfile {
  expert_id: string;
  identity: 'scholar' | 'strategist' | 'listener';
  name_zh: string;
  certifications: { type: CertType; id: string; issuer: string }[];
  audit_status: 'pending' | 'verified' | 'rejected' | 'removed';
  strike_count: number;
}

/** B 域 Content Record 判别联合（严格按 module 收窄） */
export type BDomainRecord =
  | (BRecBase & { readonly module: 'crystal'; readonly id: GemId; readonly data: CrystalGemstone })
  | (BRecBase & { readonly module: 'palmistry'; readonly id: PalmId; readonly data: PalmistryLine })
  | (BRecBase & {
      readonly module: 'astrology_term';
      readonly id: TermId;
      readonly data: AstrologyTerm;
    })
  | (BRecBase & {
      readonly module: 'podcast';
      readonly id: PodcastId;
      readonly data: PodcastEpisode;
    })
  | (BRecBase & {
      readonly module: 'fortune';
      readonly id: ArticleId;
      readonly data: FortuneArticle;
    })
  | (BRecBase & { readonly module: 'expert'; readonly id: ExpertId; readonly data: ExpertProfile });
