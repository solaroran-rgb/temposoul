/**
 * B16-补交 · 知识库文章：雨水
 * 文件路径：src/data/knowledge/content/solar-terms/yushui.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'yushui',
  title: '雨水：东风解冻 降水始增',
  metaDescription: '雨水是二十四节气中的第二个节气，太阳到达黄经330°。本文介绍雨水的天文含义、物候特征与民俗传统。',
  h1: '雨水：东风解冻 降水始增',
  category: 'solar-terms',
  tags: ['节气', '雨水'],
  sections: [
    {
      heading: '雨水是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '雨水是二十四节气中的第二个节气，约在每年公历2月18—20日交节，太阳到达黄经330°。此时气温回升、冰雪融化，降水由降雪渐变为降雨，故名“雨水”。' },
        { kind: 'paragraph', text: '雨水前后，南方多阴雨开始增多，北方则仍寒暖不定。传统养生讲究“春捂”，不宜过早脱去冬衣，注意脾胃保暖。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候獭祭鱼：水獭捕鱼，常将鱼陈列岸边如祭祀。',
          '二候鸿雁来：大雁自南向北等候春而北归。',
          '三候草木萌动：土壤湿润，草木开始抽出新芽。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '雨水时节民间有“接寿”“拉保保”等习俗，也有占雨丰歉的说法。雨水后春耕备耕渐起。' },
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
