// src/data/content/types.ts
// 本稿本地最小类型。R4 前与 C 底座 @/data/content/types 对齐。
// IT-8-6：ContentBlock 六变体。

export type Confidence = 'verified' | 'probable' | 'legendary';
export type Completeness = 'full' | 'partial' | 'stub';
export type ContentEntryStatus = 'published' | 'draft' | 'degraded';

export type ContentBlockKind =
  | 'paragraph'
  | 'list'
  | 'table'
  | 'quote'
  | 'callout'
  | 'engineRef';

export interface ContentBlockParagraph { kind: 'paragraph'; text: string; }
export interface ContentBlockList { kind: 'list'; items: string[]; ordered?: boolean; }
export interface ContentBlockTable { kind: 'table'; headers: string[]; rows: string[][]; }
export interface ContentBlockQuote { kind: 'quote'; text: string; cite?: string; }
export interface ContentBlockCallout { kind: 'callout'; tone: 'info' | 'warn'; text: string; }
export interface ContentBlockEngineRef { kind: 'engineRef'; engine: string; ref: string; }

export type LocalContentBlock =
  | ContentBlockParagraph
  | ContentBlockList
  | ContentBlockTable
  | ContentBlockQuote
  | ContentBlockCallout
  | ContentBlockEngineRef;

export interface ContentEntryBase {
  key: string;
  title: string;
  summary: string;
  blocks: LocalContentBlock[];
  citations: string[];
  confidence: Confidence;
  completeness: Completeness;
  ready: boolean;
  status: ContentEntryStatus;
  updatedAt: string;
}

export interface ContentPack<T extends ContentEntryBase> {
  version: string;
  ready: boolean;
  entries: T[];
}

export function shouldIndex(e: ContentEntryBase): boolean {
  return e.ready && e.completeness === 'full' && e.status === 'published';
}
