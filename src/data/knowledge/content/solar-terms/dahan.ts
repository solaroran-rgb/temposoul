/**
 * B16-补交 · 知识库文章：大寒
 * 文件路径：src/data/knowledge/content/solar-terms/dahan.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'dahan',
  title: '大寒：寒气之极 岁末将春',
  metaDescription: '大寒是二十四节气中的最后一个节气，太阳到达黄经300°。本文介绍大寒的天文含义、物候特征与民俗传统。',
  h1: '大寒：寒气之极 岁末将春',
  category: 'solar-terms',
  tags: ['节气', '大寒'],
  sections: [
    {
      heading: '大寒是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '大寒是二十四节气中的最后一个节气，约在每年公历1月20—21日交节，太阳到达黄经300°。大寒意为寒冷达到极点，过后便又迎来立春。' },
        { kind: 'paragraph', text: '大寒正值岁末，“小寒大寒，又是一年”。此时节虽寒极，但已隐隐可见春意，家家户户忙着辞旧迎新，准备年货。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候鸡始乳：母鸡开始孵蛋。',
          '二候征鸟厉疾：鹰隼等猛禽盘旋搏击，觅食更勤。',
          '三候水泽腹坚：冰冻厚至水底。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '大寒有除旧布新、腌制年肴、尾牙祭、迎灶神等习俗，各地忙碌于准备春节，年味渐浓。' },
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
