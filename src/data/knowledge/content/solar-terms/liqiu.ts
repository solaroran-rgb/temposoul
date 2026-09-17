/**
 * B16-补交 · 知识库文章：立秋
 * 文件路径：src/data/knowledge/content/solar-terms/liqiu.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'liqiu',
  title: '立秋：暑气未尽秋已至',
  metaDescription: '立秋是秋季第一个节气，太阳到达黄经135°。本文介绍立秋的天文含义、物候特征与民俗传统。',
  h1: '立秋：暑气未尽秋已至',
  category: 'solar-terms',
  tags: ['节气', '立秋'],
  sections: [
    {
      heading: '立秋是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '立秋是秋季的第一个节气，太阳到达黄经135°。"立"是开始，"秋"指庄稼成熟。立秋标志着孟秋时节的正式开始。' },
        { kind: 'paragraph', text: '立秋虽然意味着秋天的到来，但暑气并未完全消散，民间有"秋老虎"之说。此时气温逐渐下降，昼夜温差加大。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候凉风至：刮风时人们会感觉到凉爽。',
          '二候白露降：大地上早晨会有雾气产生。',
          '三候寒蝉鸣：秋天感阴而鸣的寒蝉也开始鸣叫。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '立秋有"贴秋膘"的习俗，人们在立秋这天吃肉以补偿夏天的身体消耗。部分地区还有"啃秋"（吃西瓜）的传统。' },
        { kind: 'callout', tone: 'boundary', text: '立秋日期与物候描述可核验；饮食习俗为传统民俗，不构成任何健康或饮食指导。' },
      ],
    },
  ],
  sources: [
    { text: '据《月令七十二候集解》通行本及《岁时广记》相关记述整理', confidence: 'verified' },
    { text: '立秋民俗据民间岁时文化资料整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['almanac-intro', 'paipan-jieqi', 'ganzhi-overview'],
  confidence: 'verified',
  disclaimer: '本文为节气与民俗科普，属传统文化参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
