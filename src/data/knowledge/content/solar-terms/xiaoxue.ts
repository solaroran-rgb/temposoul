/**
 * B16-补交 · 知识库文章：小雪
 * 文件路径：src/data/knowledge/content/solar-terms/xiaoxue.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'xiaoxue',
  title: '小雪：气寒而将雪 地始冻',
  metaDescription: '小雪是二十四节气中的第二十个节气，太阳到达黄经240°。本文介绍小雪的天文含义、物候特征与民俗传统。',
  h1: '小雪：气寒而将雪 地始冻',
  category: 'solar-terms',
  tags: ['节气', '小雪'],
  sections: [
    {
      heading: '小雪是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '小雪是二十四节气中的第二十个节气，约在每年公历11月22—23日交节，太阳到达黄经240°。此时气温降至0℃上下，开始降雪，但雪量尚小，故名“小雪”。' },
        { kind: 'paragraph', text: '小雪节气后，北方开始供暖，南方则湿冷加重。民间有“冬腊风腌，蓄以御冬”的说法，开始腌制咸菜、腊肉。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候虹藏不见：空气干燥，彩虹不再出现。',
          '二候天气上升地气下降：天地阴阳不交，万物闭藏。',
          '三候闭塞而成冬：天地闭塞，进入寒冬。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '小雪有腌菜、腌腊肉、吃糍粑、晒鱼干等习俗。土家族的“杀年猪、吃刨汤”也在此时节前后兴起。' },
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
