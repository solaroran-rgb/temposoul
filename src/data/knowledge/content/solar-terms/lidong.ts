/**
 * B16-补交 · 知识库文章：立冬
 * 文件路径：src/data/knowledge/content/solar-terms/lidong.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'lidong',
  title: '立冬：冬之始也 万物收藏',
  metaDescription: '立冬是二十四节气中的第十九个节气，太阳到达黄经225°。本文介绍立冬的天文含义、物候特征与民俗传统。',
  h1: '立冬：冬之始也 万物收藏',
  category: 'solar-terms',
  tags: ['节气', '立冬'],
  sections: [
    {
      heading: '立冬是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '立冬是二十四节气中的第十九个节气，约在每年公历11月7—8日交节，太阳到达黄经225°。“立”为始，冬季自此开始，万物开始收藏。' },
        { kind: 'paragraph', text: '立冬后北半球日照继续缩短，正午太阳高度继续降低。传统上把立冬作为冬季之始，养生讲究“养藏”，早睡晚起、温补为宜。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候水始冰：水面开始结冰。',
          '二候地始冻：土地开始封冻。',
          '三候雉入大水为蜃：古人见蛤蜊外壳似雉，附会为雉入海所化。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '立冬有“补冬”习俗，北方吃饺子、南方吃鸡鸭鱼肉进补，民间也有祭祖、饮宴的岁节活动。' },
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
