/**
 * B16-补交 · 知识库文章：小暑
 * 文件路径：src/data/knowledge/content/solar-terms/xiaoshu.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'xiaoshu',
  title: '小暑：暑气渐盛 温风至矣',
  metaDescription: '小暑是二十四节气中的第十一个节气，太阳到达黄经105°。本文介绍小暑的天文含义、物候特征与民俗传统。',
  h1: '小暑：暑气渐盛 温风至矣',
  category: 'solar-terms',
  tags: ['节气', '小暑'],
  sections: [
    {
      heading: '小暑是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '小暑是二十四节气中的第十一个节气，约在每年公历7月6—8日交节，太阳到达黄经105°。“暑”为热，小暑即小热，指天气开始炎热但尚未到极热。' },
        { kind: 'paragraph', text: '小暑后不久入伏，全国大部进入高温季节。此时雷阵雨频繁，台风开始影响沿海地区。养生宜防暑降温、饮食清淡。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候温风至：风中带热，不再凉爽。',
          '二候蟋蟀居壁：蟋蟀离开田野，躲到庭院墙角。',
          '三候鹰始鸷：雏鹰开始学习飞翔与搏击。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '小暑有食新（尝新米）、晒伏（晒衣物书籍）、吃藕等习俗，民间也开始筹备消暑之物。' },
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
