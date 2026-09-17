/**
 * C12-知识库文章：六十甲子与纪年
 * 文件路径：src/data/knowledge/content/ganzhi-jiazi.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'ganzhi-jiazi',
  title: '六十甲子与纪年',
  metaDescription: '六十甲子的排列规律、纪年换算，以及它在命理中的用法。',
  h1: '六十甲子与纪年',
  category: 'ganzhi',
  tags: ['甲子', '干支'],
  sections: [
    {
      heading: '什么是六十甲子',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '十天干与十二地支按阳干配阳支、阴干配阴支的规则依次相配，得到 60 组不重复的组合：甲子、乙丑、丙寅……一直到癸亥，称为六十甲子或六十花甲子。它是中国古代最长寿的连续循环记数系统之一，既用来记日，也用来记年。',
        },
        {
          kind: 'paragraph',
          text: '60 这个数来自 10 与 12 的最小公倍数。走完一遍正好 60 年，所以"六十一甲子"也被用来形容一个循环。',
        },
      ],
    },
    {
      heading: '排列规律',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '天干进一、地支也进一，同步推进。',
            '天干轮完 10 位回到甲，地支仍剩 2 位继续。',
            '因阳干只配阳支、阴干只配阴支，组合数为 10×12÷2=60。',
            '第 61 组重新回到甲子，循环往复。',
          ],
        },
        {
          kind: 'paragraph',
          text: '例如：甲子（1）、乙丑（2）……癸酉（10）、甲戌（11）、乙亥（12）、丙子（13）……如此排列。每过一组，干支各前进一步。',
        },
      ],
    },
    {
      heading: '纪年换算',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '用干支记年，一个重要前提是：干支年以立春为界，而不是公历 1 月 1 日。比如 2026 年 2 月 4 日立春之前出生，年柱仍属上一干支年；立春之后才换到新一年柱。这一点在排盘时尤其关键，直接按公历年份套干支常常会错。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '干支纪年是传统时间编码，不是"生肖运势"的依据。生肖只是年支的动物象征，把"属某生肖"等同于"命如何"是民间附会，不属排盘本身。',
        },
      ],
    },
    {
      heading: '在命理中的用法',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '八字四柱，本质上就是把出生的年、月、日、时各自定位到六十甲子中的某一组。年柱、月柱、日柱、时柱各占一组干支。大运、流年也是干支：每十年换一柱大运，每年换一柱流年。整个命理分析，就是在这几组干支之间看生克合冲。',
        },
        {
          kind: 'paragraph',
          text: '命律排盘会把这四柱干支直接列出，并标注是否经过立春换年、节气换月、真太阳时校时，方便你对照万年历自行核对。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为干支纪年科普。干支只编码时间，不预测事件，不构成任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《史记·历书》《渊海子平》六十甲子与纪年规则整理', confidence: 'legendary' },
    { text: '立春换年、节气换月据传统命理通行规则', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['ganzhi-overview', 'bazi-intro', 'ganzhi-nayin-table', 'paipan-jieqi'],
  confidence: 'legendary',
  disclaimer: '本文为传统历法科普，干支只编码时间，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
