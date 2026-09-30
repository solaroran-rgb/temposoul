/**
 * B16-补交 · 知识库文章：寒露
 * 文件路径：src/data/knowledge/content/solar-terms/hanlu.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'hanlu',
  title: '寒露：露气寒冷 将凝为霜',
  metaDescription: '寒露是二十四节气中的第十七个节气，太阳到达黄经195°。本文介绍寒露的天文含义、物候特征与民俗传统。',
  h1: '寒露：露气寒冷  将凝为霜',
  category: 'solar-terms',
  tags: ['节气', '寒露'],
  sections: [
    {
      heading: '寒露是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '寒露是二十四节气中的第十七个节气，约在每年公历10月7—9日交节，太阳到达黄经195°。此时气温更低，露水寒意更重，即将凝结为霜，故名“寒露”。' },
        { kind: 'paragraph', text: '寒露时节北方已呈深秋景象，白云红叶；南方也秋意渐浓，蝉噤荷残。传统养生注重滋阴润燥、健脾养胃。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候鸿雁来宾：大雁大举南迁。',
          '二候雀入大水为蛤：古人见蛤蜊纹如花雀，附会为雀入海所化。',
          '三候菊有黄华：菊花普遍开放。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '寒露有登高赏菊、饮菊花酒、吃芝麻、螃蟹等习俗。登高秋游正是此时节的应景活动。' },
        { kind: 'callout', tone: 'boundary', text: '节气知识属于传统历法与民俗文化范畴，节气日期与物候描述可核验，民俗意象仅供文化参考，不构成对农事或生活决策的保证。' },
      ],
    },
  ],
  sources: [
    { text: '据《月令七十二候集解》通行本及紫金山天文台节气历表整理', confidence: 'verified' },
    { text: '本节气民俗据民间岁时文化资料整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['almanac-intro', 'paipan-jieqi', 'ganzhi-overview'],
  confidence: 'verified',
  disclaimer: '本文为节气与民俗科普，属传统文化参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-20',
  readingMinutes: 4,
};

export default article;
