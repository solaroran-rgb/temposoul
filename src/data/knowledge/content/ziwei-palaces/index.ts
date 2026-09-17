// src/data/knowledge/content/ziwei-palaces/index.ts
import type { DomainArticle, DomainArticleMeta } from '@/pages/knowledge/lib/useDomainArticles';

const SOURCES = ['原创概述：通行紫微斗数宫位概念整理（非古籍原文）'] as const;

export const ZIWEI_PALACE_METAS: readonly DomainArticleMeta[] = [
  { slug: 'ming', title: '命宫', category: 'ziwei-palace', summary: '十二宫之首，象征自我主轴。' },
  { slug: 'xiongdi', title: '兄弟宫', category: 'ziwei-palace', summary: '象征同辈与伙伴互动。' },
  { slug: 'fuqi', title: '夫妻宫', category: 'ziwei-palace', summary: '象征伴侣关系意象。' },
  { slug: 'zinv', title: '子女宫', category: 'ziwei-palace', summary: '象征子嗣与创造。' },
  { slug: 'caibo', title: '财帛宫', category: 'ziwei-palace', summary: '象征资源获取方式。' },
  { slug: 'jibing', title: '疾厄宫', category: 'ziwei-palace', summary: '象征身心调养议题（非医疗）。' },
  { slug: 'qianyi', title: '迁移宫', category: 'ziwei-palace', summary: '象征外出与环境变动。' },
  { slug: 'jiaoyou', title: '交友宫', category: 'ziwei-palace', summary: '象征人际网络。' },
  { slug: 'guanlu', title: '官禄宫', category: 'ziwei-palace', summary: '象征事业与职责。' },
  { slug: 'tianzhai', title: '田宅宫', category: 'ziwei-palace', summary: '象征居所与根基。' },
  { slug: 'fude', title: '福德宫', category: 'ziwei-palace', summary: '象征精神享受与心态。' },
  { slug: 'fumu', title: '父母宫', category: 'ziwei-palace', summary: '象征长辈与教养。' },
];

export const ZIWEI_PALACE_RECORDS: Readonly<Record<string, DomainArticle>> = {
  ming: { slug: 'ming', title: '命宫', category: 'ziwei-palace', blocks: [{ kind: 'paragraph', text: '命宫为十二宫之首，传统用以概括一个人的主轴气质与行事基调。' }, { kind: 'paragraph', text: '宫位属象征框架，宜作自我反思的参照，不作命运定论。' }], confidence: 'probable', completeness: 'partial', ready: false, sources: SOURCES },
  caibo: { slug: 'caibo', title: '财帛宫', category: 'ziwei-palace', blocks: [{ kind: 'paragraph', text: '财帛宫传统象征资源获取与理财态度，属文化意象。' }, { kind: 'paragraph', text: '本页不构成任何投资或收益建议。' }], confidence: 'probable', completeness: 'partial', ready: false, sources: SOURCES },
  guanlu: { slug: 'guanlu', title: '官禄宫', category: 'ziwei-palace', blocks: [{ kind: 'paragraph', text: '官禄宫传统象征事业职责与工作风格。' }, { kind: 'paragraph', text: '宜理解为职业倾向的文化比喻。' }], confidence: 'probable', completeness: 'partial', ready: false, sources: SOURCES },
  fude: { slug: 'fude', title: '福德宫', category: 'ziwei-palace', blocks: [{ kind: 'paragraph', text: '福德宫传统象征精神享受与心态调适。' }, { kind: 'paragraph', text: '属象征语言，不作心理或医疗判断。' }], confidence: 'probable', completeness: 'partial', ready: false, sources: SOURCES },
};
