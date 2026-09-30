/**
 * B16-补交 · 知识库文章：白露
 * 文件路径：src/data/knowledge/content/solar-terms/bailu.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'bailu',
  title: '白露：露凝而白 秋意渐浓',
  metaDescription: '白露是二十四节气中的第十五个节气，太阳到达黄经165°。本文介绍白露的天文含义、物候特征与民俗传统。',
  h1: '白露：露凝而白 秋意渐浓',
  category: 'solar-terms',
  tags: ['节气', '白露'],
  sections: [
    {
      heading: '白露是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '白露是二十四节气中的第十五个节气，约在每年公历9月7—9日交节，太阳到达黄经165°。此时夜间水汽在草木上凝结成白色露珠，故名“白露”。' },
        { kind: 'paragraph', text: '白露是全年昼夜温差最大的节气之一，白天尚暖，清晨夜晚已凉。传统养生讲究“白露身不露”，注意腹部与足部保暖。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候鸿雁来：大雁开始南飞。',
          '二候玄鸟归：燕子自北向南迁徙。',
          '三候群鸟养羞：百鸟开始储食以备过冬。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '白露有收清露、饮白露茶、酿白露米酒、吃龙眼等习俗，各地以白露食补为应节特色。' },
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
