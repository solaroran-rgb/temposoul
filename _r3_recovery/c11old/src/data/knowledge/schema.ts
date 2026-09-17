
/**

* C9-终版：知识库文章 schema（IT-5.16 + A.5 ready 标记）
  */
  export type Confidence = 'verified' | 'probable' | 'legendary';
  export type CitationStrategy = 'engine' | 'public-domain' | 'paraphrase';
  export type KnowledgeCategory =
  | 'wuxing' | 'ganzhi' | 'shishen' | 'paipan' | 'shensha' | 'dayun' | 'boundary';

export interface ContentBlock {
  kind: 'paragraph' | 'list' | 'table' | 'quote' | 'callout' | 'engineRef';
  text?: string;
  items?: string[];
  header?: string[];
  rows?: string[][];
  citationId?: string;
  tone?: 'folk' | 'boundary';
  enginePath?: string;
}

export interface ArticleSource {
  text: string;
  citationId?: string;
  confidence: Confidence;
}

export interface KnowledgeArticle {
  slug: string;
  title: string;
  metaDescription: string;      // ≤120
  h1: string;
  category: KnowledgeCategory;
  tags: string[];
  sections: { heading: string; level: 2 | 3; blocks: ContentBlock[] }[];
  sources: ArticleSource[];
  citationStrategy: CitationStrategy;
  reviewedBy: string;
  /** ★ A.5 要求：内容就绪标记；false 时列表标注"内容整理中" */
  ready: boolean;
  engineModule?: { module: string; exports: string[]; note: string };
  relatedFeatures?: { label: string; url: string }[];
  relatedSlugs: string[];
  confidence: Confidence;
  disclaimer: string;
  pinned?: boolean;
  updatedAt: string;
  readingMinutes: number;
}

/** 列表页轻量元数据（manifest，不加载正文） */
export interface ArticleMeta {
  slug: string;
  title: string;
  metaDescription: string;
  category: KnowledgeCategory;
  tags: string[];
  confidence: Confidence;
  ready: boolean;
  updatedAt: string;
  readingMinutes: number;
}

