/**
 * B16-补交 · 知识库文章：十二生肖·鼠
 * 文件路径：src/data/knowledge/content/zodiac-culture/rat.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'zodiac-rat',
  title: '十二生肖·鼠',
  metaDescription: '鼠为十二生肖之首，对应地支"子"，五行属水。本文介绍鼠的文化意象、性格象征与相关年份。',
  h1: '十二生肖·鼠',
  category: 'zodiac-culture',
  tags: ['生肖', '鼠'],
  sections: [
    {
      heading: '鼠在生肖中的位置',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '鼠为十二生肖之首，对应地支"子"，传统五行归类属水。在中国传统文化中，鼠象征着机智、灵活和生命力旺盛。' },
        { kind: 'paragraph', text: '鼠年的年份包括：1924、1936、1948、1960、1972、1984、1996、2008、2020、2032等，每12年一个轮回。' },
      ],
    },
    {
      heading: '文化意象',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '在民间故事中，鼠凭借聪明才智在生肖排位赛中夺得第一。鼠也被视为财富和丰收的象征，民间有"仓鼠有余粮"的说法。' },
      ],
    },
    {
      heading: '性格象征',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '传统说法认为属鼠之人通常具有敏锐的观察力、灵活的应变能力和较强的记忆力，善于积累资源，对生活充满热情。这类描述属民俗意象，不构成对个体的断言。' },
        { kind: 'callout', tone: 'boundary', text: '生肖文化属传统民俗，性格描述为文化象征语言，不构成心理或人格诊断。' },
      ],
    },
  ],
  sources: [
    { text: '据《论衡·物势篇》及《诗经》相关记述整理', confidence: 'legendary' },
    { text: '生肖年份按天干地支纪年常识整理', confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['ganzhi-overview', 'ganzhi-jiazi', 'shensha-intro'],
  confidence: 'verified',
  disclaimer: '本文为生肖民俗科普，属传统文化参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
