import type { ContentBlock } from '@/data/knowledge/schema';

export type Confidence = 'verified' | 'probable' | 'legendary';

export type ContentCompleteness = 'full' | 'partial' | 'stub';

/** 引擎引用指纹：引擎内容变更则 fingerprint 变更 */
export interface EngineRef {
  source: string;
  fingerprint: string;
}

/** codegen 产物骨架：只承载「有哪些条目 + 引擎事实」，不承载手写释义 */
export interface ContentSkeleton {
  id: string;
  slug: string;
  title: string;
  category: string;
  order: number;
  engineRef: EngineRef;
  domainFields?: Record<string, unknown>;
}

/** 人工撰写补丁：以 id 关联骨架 */
export interface ContentPatch {
  id: string;
  summary?: string;
  blocks?: ContentBlock[];
  confidence?: Confidence;
  sourceRef?: string[];
  /** 绑定骨架 fingerprint；引擎变更后用于漂移检测 */
  bindsToFingerprint?: string;
  domainFields?: Record<string, unknown>;
}

/** 统一内容记录：六域共享 */
export interface BaseContentRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary?: string;
  blocks: ContentBlock[];
  confidence: Confidence;
  /** 派生字段，禁止手写：ready === (completeness !== 'stub') */
  readonly ready: boolean;
  completeness: ContentCompleteness;
  contentVersion: number;
  sourceRef: string[];
  updatedAt: string;
  order: number;
  engineRef: EngineRef;
  /** 引擎已变更、patch 未重绑 */
  drift: boolean;
  domainFields: Record<string, unknown>;
}

export interface ContentMeta {
  id: string;
  slug: string;
  title: string;
  category: string;
  confidence: Confidence;
  ready: boolean;
  completeness: ContentCompleteness;
  updatedAt: string;
  order: number;
}

export interface ContentQuery {
  keyword?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface MergeMeta {
  contentVersion: number;
  updatedAt: string;
  defaultSourceRef: string[];
}
