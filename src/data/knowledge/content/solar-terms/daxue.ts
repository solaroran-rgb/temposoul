/**
 * B16-补交 · 知识库文章：大雪
 * 文件路径：src/data/knowledge/content/solar-terms/daxue.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'daxue',
  title: '大雪：雪盛而隆冬至',
  metaDescription: '大雪是二十四节气中的第二十一个节气，太阳到达黄经255°。本文介绍大雪的天文含义、物候特征与民俗传统。',
  h1: '大雪：雪盛而隆冬至',
  category: 'solar-terms',
  tags: ['节气', '大雪'],
  sections: [
    {
      heading: '大雪是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '大雪是二十四节气中的第二十一个节气，约在每年公历12月6—8日交节，太阳到达黄经255°。“大者盛也”，此时降雪量增大，北方常呈现“千里冰封”景象。' },
        { kind: 'paragraph', text: '大雪节气后气温显著下降，黄河流域及以北陆续进入隆冬。“瑞雪兆丰年”，积雪既保暖又杀虫，对越冬作物有利。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候鹖鴠不鸣：寒号鸟因寒冷不再鸣叫。',
          '二候虎始交：古人认为此时阴气极盛，阳气始萌，虎开始求偶。',
          '三候荔挺出：一种叫“荔挺”的马薤草开始抽芽。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '大雪有观赏封河、腌制“咸货”、进补羊肉等习俗。北方的“冰戏”、南方的围炉取暖皆应此时。' },
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
