/**
 * C12-知识库文章：地支六冲与相刑相害
 * 文件路径：src/data/knowledge/content/ganzhi-clash.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'ganzhi-clash',
  title: '地支六冲与相刑相害',
  metaDescription: '六冲、三刑、六害的对照表，以及"冲不等于凶"的边界说明。',
  h1: '地支六冲与相刑相害',
  category: 'ganzhi',
  tags: ['地支', '冲刑'],
  sections: [
    {
      heading: '地支关系不只有合',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '前面讲过地支的合（六合、三合），地支之间还有另一类关系：冲、刑、害。它们在传统命理里被用来描述地支之间的对立、摩擦、不和。初学者最容易把它们当成"凶兆"，其实它们只是描述力量方向相对的符号关系。',
        },
        {
          kind: 'paragraph',
          text: '理解冲刑害的关键，是把它们当作"关系标签"，而不是"事件预告"。下面分别说明。',
        },
      ],
    },
    {
      heading: '六冲：方位对冲',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '六冲指地支在圆周上正对相冲的六组：子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲。因为它们在方位上相对（如子北午南），力量方向相反，故称为冲。',
        },
        {
          kind: 'table',
          text: '地支六冲对照',
          header: ['相冲', '方位', '传统取象'],
          rows: [
            ['子午冲', '北—南', '水火相冲'],
            ['丑未冲', '东北—西南', '土土相冲'],
            ['寅申冲', '东北—西南', '木金相冲'],
            ['卯酉冲', '东—西', '木金相冲'],
            ['辰戌冲', '东南—西北', '土土相冲'],
            ['巳亥冲', '东南—西北', '水火相冲'],
          ],
        },
      ],
    },
    {
      heading: '三刑与六害',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '三刑六害对照',
          header: ['类别', '组合', '传统名称'],
          rows: [
            ['三刑', '寅、巳、申', '无恩之刑'],
            ['三刑', '丑、戌、未', '恃势之刑'],
            ['三刑', '子、卯', '无礼之刑'],
            ['自刑', '辰、午、酉、亥', '自刑'],
            ['六害', '子未、丑午、寅巳、卯辰、申亥、酉戌', '六害（穿）'],
          ],
        },
        {
          kind: 'paragraph',
          text: '"刑"传统上被看作带摩擦、纠缠的关系；"害"又称"穿"，被看作暗中损害。这些名称都带有强烈的民俗色彩，实际分析时更多作为辅助关系参考。',
        },
      ],
    },
    {
      heading: '冲不等于凶',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '"冲"只是地支方位相对、力量相背的符号描述，不等于"有灾""离婚""破财"。把冲刑害直接翻译成坏事，是民间最常见的过度解读。命律只把它作为结构信息标注，不下凶吉结论。',
        },
        {
          kind: 'list',
          items: [
            '冲也可以冲动忌神使其动摇，传统上未必为凶。',
            '合冲并见时，关系需整体判断，不能单看一个冲字。',
            '刑害多为辅助参考，权重低于五行生克与十神。',
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为地支关系科普。冲刑害属传统符号关系，不构成人际、健康、投资或任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》地支冲刑害章节整理', confidence: 'legendary' },
    { text: '六冲三刑六害组合据传统命理通行说法', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['ganzhi-sixhe', 'ganzhi-sanhe', 'ganzhi-overview', 'shensha-rational'],
  confidence: 'legendary',
  disclaimer: '本文为传统地支关系科普，属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 5,
};

export default article;
