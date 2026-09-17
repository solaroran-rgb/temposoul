/**
 * B16-补交 · 知识库文章：十二生肖·兔
 * 文件路径：src/data/knowledge/content/zodiac-culture/rabbit.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'zodiac-rabbit',
  title: '十二生肖·兔',
  metaDescription: '兔为十二生肖第四位，对应地支"卯"，五行属木。本文介绍兔的文化意象、性格象征与月亮文化的关联。',
  h1: '十二生肖·兔',
  category: 'zodiac-culture',
  tags: ['生肖', '兔'],
  sections: [
    {
      heading: '兔在生肖中的位置',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '兔为十二生肖第四位，对应地支"卯"，传统五行归类属木。兔在中国文化中象征着温和、纯洁和长寿，与月亮有着深厚的文化关联。' },
        { kind: 'paragraph', text: '兔年在传统文化中被视为和平与繁荣的象征。玉兔捣药的传说使兔成为中秋节的重要文化符号。' },
      ],
    },
    {
      heading: '文化意象',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '兔是祥瑞的象征，古代有"赤兔上殿"的吉兆记载。"狡兔三窟"则体现了兔的机警与智慧。' },
      ],
    },
    {
      heading: '性格象征',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '传统说法认为属兔之人通常具有温文尔雅的气质、细腻敏感的心思和良好的审美品味，待人友善、善于协调人际关系。这类描述属民俗意象，不构成对个体的断言。' },
        { kind: 'callout', tone: 'boundary', text: '生肖文化属传统民俗，性格描述为文化象征语言，不构成心理或人格诊断。' },
      ],
    },
  ],
  sources: [
    { text: '据《瑞应图》及《淮南子》相关记述整理', confidence: 'legendary' },
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
