/**
 * 知识库文章：大运是什么
 * 文件路径：src/data/knowledge/content/dayun-overview.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'dayun-overview',
  title: '大运是什么',
  metaDescription: '大运是命局之外的十年周期，本文说明它的概念与作用。',
  h1: '大运是什么',
  category: 'dayun',
  tags: ['大运', '基础'],
  sections: [
    {
      heading: '大运：命局之上的十年干支周期',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '大运是传统命理在"命局"（一个人出生时的四柱八字）之外，另外排出来的一组十年一换的干支。命局被认为是固定不变的"底盘"，大运则是随年龄推进、每十年换一柱的"外部气候"。传统说法把人生比作植物：命局是种子和土壤，大运是逐年变化的季节气候——同一颗种子，在不同气候下长势不同。这个比喻说明了大运在命理体系中的定位：它是叠加在固定命局上的周期性变量。',
        },
        {
          kind: 'paragraph',
          text: '每一柱大运管十年，干支各一字，按性别与年干阴阳从月柱顺推或逆推出来。例如月柱是甲子，顺排下一柱就是乙丑、丙寅、丁卯……逆排则是癸亥、壬戌、辛酉……具体顺逆规则在《起运时间的计算规则》一文中详述。大运的干支同样可以套入五行生克、十神关系，用来描述这十年命局所面临的外部环境特征。',
        },
        {
          kind: 'list',
          items: [
            '命局（四柱）：出生时刻固定不变，被认为是"底盘"。',
            '大运：每十年换一柱，随年龄推进，描述阶段性外部气候。',
            '流年：每一年一柱，是更短的年度变量。',
          ],
        },
      ],
    },
    {
      heading: '传统怎么读大运：它如何参与命局',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '排好大运后，传统分析会把大运干支当作"额外"的干支，加入原命局一起看五行生克。比如大运走到某柱，其天干或地支与原局某字形成冲、合、生、克，就说这十年相应方面被引动。大运天干一般主前五年、地支主后五年是一种民间分法，更严谨的做法是干支同参、看整体对日主强弱的影响，而非死板地拆成两半。',
        },
        {
          kind: 'paragraph',
          text: '需要明白，这套"大运参与命局"的读法是一套自洽的民俗解释框架，不是可证伪的因果定律。它的全部操作都是在干支符号之间做生克冲合，属于符号游戏；把它翻译回现实时，只能得到"这十年外部环境偏某类倾向"这样模糊的描述，不可能精确到具体事件。',
        },
      ],
    },
    {
      heading: '理性看待：大运是阶段标签，不是命运剧本',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '大运只是按固定规则排出的十年一换的干支符号，用来描述阶段性氛围，它不能预测你哪一年会升职、结婚、破财或生病。人生的每一次重大选择由现实决策、努力与机遇决定，大运不写剧本。切勿因"换大运"而产生强烈焦虑，或据此做出辞职、离婚、大额投资等重大决定。',
        },
        {
          kind: 'paragraph',
          text: '命律在排盘中把大运列成一条时间线，标注每柱起止年龄与干支，并附"传统民俗参考"提示。它的价值更多是一种时间结构感——帮助你把人生分段看待，理解不同阶段可以有不同重心，而不是给某十年下吉凶判决。',
        },
      ],
    },
  ],
  sources: [
    {
      text: '据《渊海子平》《三命通会》大运排法及"命局为体、大运为用"论述整理',
      confidence: 'legendary',
    },
    {
      text: '大运天干前五年、地支后五年的民间分法见后世通俗读物，已标注为非严谨做法',
      confidence: 'probable',
    },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['dayun-qiyun', 'dayun-liunian', 'dayun-suiyun', 'dayun-boundary', 'paipan-sizhu'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理科普，大运排法仅作民俗参考，不构成人生阶段或现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
