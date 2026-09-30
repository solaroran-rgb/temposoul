/**
 * B16-补交 · 知识库文章：小寒
 * 文件路径：src/data/knowledge/content/solar-terms/xiaohan.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'xiaohan',
  title: '小寒：天渐寒 尚未大冷',
  metaDescription: '小寒是二十四节气中的第二十三个节气，太阳到达黄经285°。本文介绍小寒的天文含义、物候特征与民俗传统。',
  h1: '小寒：天渐寒 尚未大冷',
  category: 'solar-terms',
  tags: ['节气', '小寒'],
  sections: [
    {
      heading: '小寒是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '小寒是二十四节气中的第二十三个节气，约在每年公历1月5—7日交节，太阳到达黄经285°。“小寒”即天气已寒但尚未到极点。' },
        { kind: 'paragraph', text: '小寒正处“二九”前后，俗话说“冷在三九”，隆冬最冷时段往往就在小寒到大寒之间。此时节养生重在温阳御寒。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候雁北乡：大雁开始北归。',
          '二候鹊始巢：喜鹊开始筑巢。',
          '三候雉始雊：野鸡开始鸣叫求偶。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '小寒有吃腊八粥、吃糯米饭、补膏方等习俗。腊八节通常紧邻小寒，是冬日最具代表性的食俗。' },
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
