/**
 * C12-知识库文章：地支三合局
 * 文件路径：src/data/knowledge/content/ganzhi-sanhe.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'ganzhi-sanhe',
  title: '地支三合局',
  metaDescription: '申子辰合水、亥卯未合木等三合局的构成与传统解读。',
  h1: '地支三合局',
  category: 'ganzhi',
  tags: ['地支', '三合'],
  sections: [
    {
      heading: '什么是三合局',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '地支三合局，是指三个地支按特定组合凑在一起，被传统命理视为同一五行的"会聚"。一共四组：申子辰合水局、亥卯未合木局、寅午戌合火局、巳酉丑合金局。它把十二地支分成四组，每组三支，分别对应水、木、火、金。',
        },
        {
          kind: 'paragraph',
          text: '土没有独立成局，而是寄旺于四季月（辰戌丑未），这是传统处理方式。三合局被认为是地支关系里力量较强的一种"合"。',
        },
      ],
    },
    {
      heading: '四组三合局',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '地支三合局对照',
          header: ['三合局', '三支', '合化五行', '长生—帝旺—墓库'],
          rows: [
            ['水局', '申、子、辰', '水', '申长生—子帝旺—辰墓库'],
            ['木局', '亥、卯、未', '木', '亥长生—卯帝旺—未墓库'],
            ['火局', '寅、午、戌', '火', '寅长生—午帝旺—戌墓库'],
            ['金局', '巳、酉、丑', '金', '巳长生—酉帝旺—丑墓库'],
          ],
        },
        {
          kind: 'paragraph',
          text: '每组三合都包含一个长生位、一个帝旺位、一个墓库位，传统上理解为"生—旺—藏"的完整过程，所以成局之力比普通六合更被看重。',
        },
      ],
    },
    {
      heading: '怎么用：三合在命局里的含义',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '八字或大运流年里，若同时出现某一局的三支，传统认为该五行的力量被汇聚。例如申子辰全见，传统上会认为水气会聚，影响日主与该五行的强弱判断。但"合化"是否真的化出该行，还要看天干是否透出、是否被冲克破局，不能见三支就直接下结论。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '三合会聚是一种传统结构关系，不是"贵人相助""事业大成"的预言。它只说明这一组地支在传统框架里被视作同气，不直接对应现实事件。',
        },
      ],
    },
    {
      heading: '常见误解',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '误解一：见两支就算合局。严格成局需三支全，两支常称"半合"，力量与全局不同。',
            '误解二：合就一定好。合也可能把忌神合旺，需看整体喜忌。',
            '误解三：逢合就不会被冲。合冲并见时，传统有"合处逢冲"等说法，需具体分析。',
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为地支关系科普。三合属传统符号关系，不构成人际、事业或任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》地支三合章节整理', confidence: 'legendary' },
    { text: '三合长生帝旺墓库结构据传统命理通说', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['ganzhi-sixhe', 'ganzhi-clash', 'ganzhi-overview', 'ganzhi-canggan'],
  confidence: 'legendary',
  disclaimer: '本文为传统地支关系科普，属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
