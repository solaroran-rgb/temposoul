/**
 * B16-补交 · 知识库文章：清明
 * 文件路径：src/data/knowledge/content/solar-terms/qingming.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'qingming',
  title: '清明：气清景明 踏青祭祖',
  metaDescription: '清明是二十四节气中的第五个节气，太阳到达黄经15°。本文介绍清明的天文含义、物候特征、扫墓踏青民俗与节气文化。',
  h1: '清明：气清景明 踏青祭祖',
  category: 'solar-terms',
  tags: ['节气', '清明'],
  sections: [
    {
      heading: '清明是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '清明是二十四节气中的第五个节气，约在每年公历4月4—6日交节，太阳到达黄经15°。此时天气清澈明朗、草木繁茂，故名“清明”。' },
        { kind: 'paragraph', text: '清明既是节气又是传统节日。这天人们扫墓祭祖、慎终追远，也踏青游春、插柳放风筝。节气与节日合一，体现中国人对自然与先人的双重敬意。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候桐始华：白桐花开。',
          '二候田鼠化为鴽：田鼠渐藏而鹌鹑类小鸟增多，古人以此类比。',
          '三候虹始见：雨后空气澄澈，彩虹开始出现。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '清明祭扫与踏青并重，饮食上多青团、馓子等应节食物。祭扫属慎终追远的文化仪式，应文明祭扫。' },
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
