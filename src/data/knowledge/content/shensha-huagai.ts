/**
 * 知识库文章：华盖
 * 文件路径：src/data/knowledge/content/shensha-huagai.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shensha-huagai',
  title: '华盖',
  metaDescription: '华盖星的查法与"孤高好艺"的传统说法。',
  h1: '华盖',
  category: 'shensha',
  tags: ['华盖', '神煞'],
  sections: [
    {
      heading: '华盖的查法：三合局的最后一个字',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '华盖的查法同样以年支或日支所属三合局为基准，指向该局的最后一个字：申子辰见辰、寅午戌见戌、巳酉丑见丑、亥卯未见未。例如年支为卯，属亥卯未木局，则见未即为华盖。它和桃花、驿马一样，都是从三合局派生出来的固定查表符号。',
        },
        {
          kind: 'table',
          header: ['年支/日支（三合局）', '华盖所在地支'],
          rows: [
            ['申子辰（水局）', '辰'],
            ['寅午戌（火局）', '戌'],
            ['巳酉丑（金局）', '丑'],
            ['亥卯未（木局）', '未'],
          ],
        },
        {
          kind: 'paragraph',
          text: '可以看到，华盖恰好是三合局"墓地"那一隅（辰戌丑未四库）。古人以墓库为收藏、内敛之所，又因华盖本是古代帝王车驾上的伞盖，星名与之相附，遂成此煞。',
        },
      ],
    },
    {
      heading: '传统说法：孤高、好艺术、近玄学',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '古书中把华盖描述为"主孤高、好技艺、喜清静"。命带华盖的人被说成性格偏内敛、对艺术、宗教、哲学、玄学有兴趣，不喜热闹应酬。民间甚至有"华盖坐命，聪明孤寡"之类说法，把它和孤独、出家联系起来。这些描述在古代农耕社会、人际交往相对固定的背景下，是对"偏内向型人格"的一种民俗归类。',
        },
        {
          kind: 'paragraph',
          text: '当代视角看，"喜欢独处、对抽象或艺术领域有兴趣"是一种再普通不过的性格倾向，人口中比例不低，完全不需要用神煞来解释。把华盖读成"命里注定孤独终老"或"适合出家"，是把一种气质标签夸大成命运判决，既不科学也无必要。',
        },
      ],
    },
    {
      heading: '理性看待：华盖只说"内敛"，不说"孤苦"',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '华盖是落在三合局墓库位的一个符号，传统附会为偏内向、喜艺术玄学，但它不能预测一个人是否孤独、是否婚姻不顺、是否与宗教有缘。切勿因命带华盖而自我暗示"注定孤单"，也不必据此否定正常的社交与亲密关系。',
        },
        {
          kind: 'paragraph',
          text: '命律排盘中若命中华盖，仅标注查表结果与"传统主静、近艺"的民俗含义，不做"孤僻""僧道命"式判断。性格内向与否是可观察、可自我调整的现实心理特征，与干支符号无关。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》华盖查法（三合墓库位）整理', confidence: 'legendary' },
    { text: '"华盖主孤高近艺"的民俗释义见古代命理通俗语汇', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['shensha-overview', 'shensha-rational', 'ganzhi-sanhe', 'ganzhi-canggan'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理文化科普，华盖查法仅作民俗参考，不构成性格、婚恋或人生选择建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
