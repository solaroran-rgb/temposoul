/**
 * B16-补交 · 知识库文章：春分
 * 文件路径：src/data/knowledge/content/solar-terms/chunfen.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'chunfen',
  title: '春分：昼夜均分的中点',
  metaDescription: '春分时太阳位于黄经0°，昼夜几乎等长。本文介绍春分的天文含义、物候特征与民俗传统。',
  h1: '春分：昼夜均分的中点',
  category: 'solar-terms',
  tags: ['节气', '春分'],
  sections: [
    {
      heading: '春分是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '春分是春季九十天的中分点，太阳位于黄经0°（春分点）。这一天昼夜几乎等长，此后北半球昼渐长、夜渐短。' },
        { kind: 'paragraph', text: '春分时节气候温和、雨水充沛、阳光明媚，中国大部分地区的越冬作物进入春季生长阶段，是传统历法中重要的农时节点。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候玄鸟至：燕子从南方飞回北方。',
          '二候雷乃发声：春雷开始响起。',
          '三候始电：开始出现闪电。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '春分有"竖蛋"的民俗游戏，民间认为春分这天最容易把鸡蛋竖起来。此外还有踏青、放风筝、吃春菜等传统活动。' },
        { kind: 'callout', tone: 'boundary', text: '春分的天文日期与物候描述可核验，民俗游戏与活动仅供文化体验参考，不构成对现实结果的任何保证。' },
      ],
    },
  ],
  sources: [
    { text: '据《礼记·月令》及《春秋繁露》相关记述整理', confidence: 'verified' },
    { text: '春分民俗据民间岁时文化资料整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['lichun', 'almanac-intro', 'paipan-jieqi'],
  confidence: 'verified',
  disclaimer: '本文为节气与民俗科普，属传统文化参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
