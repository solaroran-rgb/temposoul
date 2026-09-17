/**
 * B16-补交 · 知识库文章：十二生肖·虎
 * 文件路径：src/data/knowledge/content/zodiac-culture/tiger.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'zodiac-tiger',
  title: '十二生肖·虎',
  metaDescription: '虎为十二生肖第三位，对应地支"寅"，五行属木。本文介绍虎的文化意象、性格象征与民俗中的位置。',
  h1: '十二生肖·虎',
  category: 'zodiac-culture',
  tags: ['生肖', '虎'],
  sections: [
    {
      heading: '虎在生肖中的位置',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '虎为十二生肖第三位，对应地支"寅"，传统五行归类属木。虎在中国文化中象征着勇猛、威严和力量，被誉为"百兽之王"。' },
        { kind: 'paragraph', text: '虎年在传统文化中被视为充满活力与变革的年份。虎的形象常用于驱邪避灾，如虎头鞋、虎头帽等儿童服饰。' },
      ],
    },
    {
      heading: '文化意象',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '虎是正义与勇气的象征，古代武将常被称为"虎将"。民间有"虎毒不食子"的说法，体现了虎作为保护者的形象。' },
      ],
    },
    {
      heading: '性格象征',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '传统说法认为属虎之人通常具有领导才能、果断勇敢的性格和强烈的正义感，热情大方、敢于面对挑战。这类描述属民俗意象，不构成对个体的断言。' },
        { kind: 'callout', tone: 'boundary', text: '生肖文化属传统民俗，性格描述为文化象征语言，不构成心理或人格诊断。' },
      ],
    },
  ],
  sources: [
    { text: '据《风俗通义》及《山海经》相关记述整理', confidence: 'legendary' },
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
