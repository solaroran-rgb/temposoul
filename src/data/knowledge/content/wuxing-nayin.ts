/**
 * C12-知识库文章：纳音五行入门
 * 文件路径：src/data/knowledge/content/wuxing-nayin.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'wuxing-nayin',
  title: '纳音五行入门',
  metaDescription: '六十甲子纳音的由来、查法，及其在命理中的参考位置。',
  h1: '纳音五行入门',
  category: 'wuxing',
  tags: ['纳音', '五行'],
  sections: [
    {
      heading: '什么是纳音五行',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '五行通常以天干地支本身的阴阳五行来论，比如甲木、丙火。但还有另一套系统，把六十甲子两两配成三十组，每组安一个"五行+物象"的名字，叫纳音五行。例如甲子、乙丑叫"海中金"，丙寅、丁卯叫"炉中火"。它像给每一对干支起了一个有画面感的别名。',
        },
        {
          kind: 'paragraph',
          text: '纳音之说在汉代律历思想中已有萌芽，到唐宋命理书（如《李虚中命书》《三命通会》）中广泛使用。它的"音"原与律吕（十二律）相配，后世更多当作一种分类标签使用。',
        },
      ],
    },
    {
      heading: '怎么查：三十组纳音',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '六十甲子按顺序两两成组，共三十组。查表时先找到你的年柱干支属于哪一对，再读对应的纳音名。例如年柱甲子或乙丑，纳音都是海中金。完整对照表另见"六十甲子纳音对照表"一文。',
        },
        {
          kind: 'table',
          text: '纳音五行节选（前十二组）',
          header: ['干支 pair', '纳音'],
          rows: [
            ['甲子、乙丑', '海中金'],
            ['丙寅、丁卯', '炉中火'],
            ['戊辰、己巳', '大林木'],
            ['庚午、辛未', '路旁土'],
            ['壬申、癸酉', '剑锋金'],
            ['甲戌、乙亥', '山头火'],
            ['丙子、丁丑', '涧下水'],
            ['戊寅、己卯', '城头土'],
            ['庚辰、辛巳', '白蜡金'],
            ['壬午、癸未', '杨柳木'],
            ['甲申、乙酉', '泉中水'],
            ['丙戌、丁亥', '屋上土'],
          ],
        },
      ],
    },
    {
      heading: '它在命理里的位置',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '早期禄命法（如李虚中系统）较重年柱纳音，用纳音五行的生克来论命。子平法兴起后，论命以日干为核心、以正五行为主，纳音逐渐退为参考，更多用于取象——比如"海中金"被形容为沉于海底的金，需淘洗方显。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '纳音取象是文学性的比喻，不是对命运的论断。"海中金"不等于你藏着一笔大钱，"路旁土"也不等于你平庸。把它当意象读，别当事实套。',
        },
      ],
    },
    {
      heading: '命律怎么用纳音',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律在排盘结果中会标注年柱、日柱的纳音名，作为一种传统象义参考，并注明它属于辅助系统，权重低于日干正五行与十神。我们不依据纳音直接下吉凶结论，也不据纳音推荐任何改运做法。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为纳音学说科普。纳音取象属民俗文化内容，不构成任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《三命通会》《渊海子平》纳音章节整理', confidence: 'legendary' },
    { text: '六十甲子纳音表据通行本整理，详见 ganzhi-nayin-table', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['wuxing-basics', 'ganzhi-nayin-table', 'ganzhi-jiazi', 'wuxing-shengke'],
  confidence: 'legendary',
  disclaimer: '本文为传统纳音学说科普，属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 5,
};

export default article;
