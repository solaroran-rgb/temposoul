/**
 * B16-补交 · 知识库文章：夏至
 * 文件路径：src/data/knowledge/content/solar-terms/xiazhi.ts
 * schema 合规：sections 结构，无 heading 变体，全必填字段
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'xiazhi',
  title: '夏至：日长之至 日影短至',
  metaDescription: '夏至是二十四节气中的第十个节气，太阳到达黄经90°。本文介绍夏至的天文含义、物候特征与民俗传统。',
  h1: '夏至：日长之至 日影短至',
  category: 'solar-terms',
  tags: ['节气', '夏至'],
  sections: [
    {
      heading: '夏至是什么',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '夏至是二十四节气中的第十个节气，约在每年公历6月21—22日交节，太阳到达黄经90°。这天北半球白昼最长、黑夜最短，太阳直射北回归线。' },
        { kind: 'paragraph', text: '夏至并非一年最热之时，而是盛夏将至的标志。此后地面吸热多、散热慢，气温继续升高，约二三十天后才进入伏天。' },
      ],
    },
    {
      heading: '物候特征',
      level: 2,
      blocks: [
        { kind: 'list', items: [
          '初候鹿角解：鹿角开始脱落。',
          '二候蜩始鸣：夏蝉开始鸣叫。',
          '三候半夏生：半夏这种药草在沼泽中生长。',
        ] },
      ],
    },
    {
      heading: '民俗传统',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: '夏至有吃面、称人、祭地等习俗，“冬至饺子夏至面”是民间广为流传的食俗。' },
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
