/**
 * 知识库文章：小运
 * 文件路径：src/data/knowledge/content/dayun-xiaoyun.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'dayun-xiaoyun',
  title: '小运',
  metaDescription: '小运的概念、排法，以及它在传统命理中的位置。',
  h1: '小运',
  category: 'dayun',
  tags: ['小运'],
  sections: [
    {
      heading: '小运是什么：起运之前的年度小柱',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '小运，又称行运、小限，是传统命理中一套比大运更短、比流年更细的年度干支。它主要用来填补"起运之前"那段时间（即从出生到起运岁数之间的童年期）的空白，因为这段时间大运尚未开始，古人便另排一套小运逐年填充。与大运每十年一换不同，小运一年一换。',
        },
        {
          kind: 'paragraph',
          text: '小运的排法以时柱为基准，按男女顺逆逐年推：阳男阴女从时柱顺推，阴男阳女从时柱逆推，一岁一柱。因为它直接从时柱起数，也叫"时上起小运"。这套规则同样是固定的查表式约定，可复算。',
        },
      ],
    },
    {
      heading: '小运在命理中的地位：早已边缘化',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '在主流子平法里，小运的地位很低。清代以来的命理典籍多认为小运"不验""少用"，因为它只对童年期有形式意义，成年后大运、流年已经足够，再叠一套小运反而造成解释混乱。很多现代排盘甚至不再排小运。它更像是传统命理体系中一个历史遗留的补丁，而非核心部件。',
        },
        {
          kind: 'paragraph',
          text: '之所以保留它，是因为古籍偶有提及，且民俗语境里"小限"一词仍偶尔出现。了解它，主要是为了读懂旧命理书时不至于困惑，而不是真要用它来分析人生。',
        },
      ],
    },
    {
      heading: '理性看待：小运是历史补丁，不必在意',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '小运是一套主要用于童年期、且在主流命理中已被边缘化的年度干支，不能用来预测成年后的具体运势，更不能据此判断童年健康或命运。它只是传统命理体系的历史残留，读者了解概念即可，无需对"今年小运如何"过度解读。',
        },
        {
          kind: 'paragraph',
          text: '命律在排盘中默认不单独强调小运，仅在需要追溯传统术语时作说明。把精力放在可复算的命局主结构和你实际的现实生活上，远比纠结小运有意义。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《三命通会》小运（时柱起、阳男阴女顺逆）排法整理', confidence: 'legendary' },
    { text: '小运"不验、少用"的评价见清代以来子平典籍', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['dayun-overview', 'dayun-qiyun', 'dayun-liunian', 'dayun-boundary'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理术语科普，小运仅作历史文化说明，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
