/**
 * C12-知识库文章：天干地支总览
 * 文件路径：src/data/knowledge/content/ganzhi-overview.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'ganzhi-overview',
  title: '天干地支总览',
  metaDescription: '十天干十二地支的起源、组合规则，以及六十甲子的构成。',
  h1: '天干地支总览',
  category: 'ganzhi',
  tags: ['干支', '基础'],
  sections: [
    {
      heading: '天干地支是什么',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '天干地支，简称干支，是中国古代用来记年、月、日、时的一套符号系统。天干有十个：甲、乙、丙、丁、戊、己、庚、辛、壬、癸；地支有十二个：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。两者按顺序相配，从甲子开始，到癸亥结束，共六十组，称为六十甲子。',
        },
        {
          kind: 'paragraph',
          text: '这套系统至少在商代甲骨文中已用于记日，后来扩展到记年、记月、记时，并被命理、历法、择吉等传统术数广泛借用。它本质上是一套可循环的时间编号。',
        },
      ],
    },
    {
      heading: '十天干与十二地支',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '天干五行阴阳',
          header: ['天干', '阴阳', '五行'],
          rows: [
            ['甲', '阳', '木'],
            ['乙', '阴', '木'],
            ['丙', '阳', '火'],
            ['丁', '阴', '火'],
            ['戊', '阳', '土'],
            ['己', '阴', '土'],
            ['庚', '阳', '金'],
            ['辛', '阴', '金'],
            ['壬', '阳', '水'],
            ['癸', '阴', '水'],
          ],
        },
        {
          kind: 'table',
          text: '地支五行生肖',
          header: ['地支', '阴阳', '五行', '生肖'],
          rows: [
            ['子', '阳', '水', '鼠'],
            ['丑', '阴', '土', '牛'],
            ['寅', '阳', '木', '虎'],
            ['卯', '阴', '木', '兔'],
            ['辰', '阳', '土', '龙'],
            ['巳', '阴', '火', '蛇'],
            ['午', '阳', '火', '马'],
            ['未', '阴', '土', '羊'],
            ['申', '阳', '金', '猴'],
            ['酉', '阴', '金', '鸡'],
            ['戌', '阳', '土', '狗'],
            ['亥', '阴', '水', '猪'],
          ],
        },
      ],
    },
    {
      heading: '干支怎么配对成六十甲子',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '天干和地支各按固定顺序递进：甲配子、乙配丑、丙配寅……如此阳干配阳支、阴干配阴支，走完十干后干循环、地支继续，直到第 60 组癸亥后回到甲子。因为天干数 10、地支数 12 的最小公倍数是 60，所以正好组成六十组，周而复始。',
        },
        {
          kind: 'list',
          items: [
            '阳干（甲丙戊庚壬）只配阳支（子寅辰午申戌）。',
            '阴干（乙丁己辛癸）只配阴支（丑卯巳未酉亥）。',
            '因此不会出现"甲丑""乙子"这种阴阳错配。',
          ],
        },
      ],
    },
    {
      heading: '在命律里的位置',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律排盘的全部上层解释，都建立在干支这套可复算符号上。先把出生时间转成年月日时四柱干支，再谈五行、十神、神煞。干支对每一篇详解（如某一天干、某一地支的性情与类象）另见对应条目。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '干支是时间符号与分类系统，不携带吉凶。本节所列阴阳五行、生肖对应属传统归类，不构成命运判断或现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《史记·历书》《渊海子平》天干地支章节整理', confidence: 'legendary' },
    { text: '干支五行阴阳归属据传统通行说法', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['ganzhi-jiazi', 'bazi-intro', 'wuxing-shengke', 'ganzhi-canggan'],
  confidence: 'legendary',
  disclaimer: '本文为干支基础科普，属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 5,
};

export default article;
