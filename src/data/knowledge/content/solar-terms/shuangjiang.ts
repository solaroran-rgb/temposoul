/**
 * B16-补交 · 知识库文章：霜降
 * 文件路径：src/data/knowledge/content/solar-terms/shuangjiang.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'shuangjiang',
  title: '霜降：气肃霜降 万物毕成',
  metaDescription: '霜降是二十四节气中的第十八个节气，太阳到达黄经210°。本文介绍霜降的天文含义、物候特征与民俗传统。',
  h1: '霜降：气肃霜降 万物毕成',
  category: 'solar-terms',
  tags: ['节气', '霜降'],
  sections: [
    {
      heading: '霜降是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '霜降是二十四节气中的第十八个节气，约在每年公历10月23—24日交节，太阳到达黄经210°。“气肃而凝，露结为霜”，黄河流域开始出现初霜。' },
        { kind: 'paragraph', text: '霜降是秋季最后一个节气，意味着冬天即将开始。此时节天气渐寒，柿子、板栗、萝卜等应季作物成熟，民间有进补习俗。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候豺乃祭兽：豺狼捕猎后陈列如祭。',
          '二候草木黄落：树叶枯黄飘落。',
          '三候蛰虫咸俯：蛰虫全藏洞中不食不动。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '霜降有吃柿子、登高、进补（“补冬不如补霜降”）等习俗，民间认为此时进补最能御寒。' },
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
