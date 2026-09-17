/**
 * C12-知识库文章：地支六合
 * 文件路径：src/data/knowledge/content/ganzhi-sixhe.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'ganzhi-sixhe',
  title: '地支六合',
  metaDescription: '子丑合、寅亥合等六组六合的配对关系与民俗说法。',
  h1: '地支六合',
  category: 'ganzhi',
  tags: ['地支', '六合'],
  sections: [
    {
      heading: '什么是六合',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '地支六合，是十二地支两两配对的六组关系：子与丑合、寅与亥合、卯与戌合、辰与酉合、巳与申合、午与未合。它是地支之间另一类"相合"关系，与三合局不同：六合是一对一，三合是三对一。',
        },
        {
          kind: 'paragraph',
          text: '六合的说法源自古天文与律历配对，后来被命理借用，表示两地支之间有"亲合、牵绊"的关系。传统上还为每组安了一个"化出五行"的说法。',
        },
      ],
    },
    {
      heading: '六合对照表',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '地支六合对照',
          header: ['相合', '传统所化', '民俗取象'],
          rows: [
            ['子丑合', '土', '水土相合'],
            ['寅亥合', '木', '木水生合'],
            ['卯戌合', '火', '木火相合'],
            ['辰酉合', '金', '土金相合'],
            ['巳申合', '水', '火金相刑中带合'],
            ['午未合', '太阳/太阴', '火土相合'],
          ],
        },
        {
          kind: 'paragraph',
          text: '注意：巳申既在六合中，又在三合水局与六冲关系附近，关系较复杂，传统上常说"合中带刑"。这说明地支关系不是非黑即白，要整体看。',
        },
      ],
    },
    {
      heading: '六合在命局里怎么读',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '传统上，六合被看作两地支相互牵绊：合可以把力量拉向一起，也可以把某字"合住"使其暂时不发挥作用。例如某支为忌神被合住，传统认为压力被缓冲；若喜用被合住，又可能视为助力被绊。具体吉凶仍须看整体。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '"合"不等于"好""贵人"，也不等于"恋情美满"。它只是一种传统符号关系，常被民俗附会成人际、姻缘吉凶，命律不据此下任何事件结论。',
        },
      ],
    },
    {
      heading: '命律怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律排盘会标出四柱地支之间存在的六合、三合、六冲等关系，仅作为结构信息展示，并附传统释义。我们不把它包装成"你今年遇贵人"之类的断语。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为地支关系科普。六合属传统符号关系，不构成人际、婚恋或任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》地支六合章节整理', confidence: 'legendary' },
    { text: '六合化气与取象据传统命理通行说法', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['ganzhi-sanhe', 'ganzhi-clash', 'ganzhi-overview', 'shensha-taohua'],
  confidence: 'legendary',
  disclaimer: '本文为传统地支关系科普，属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
