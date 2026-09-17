/**
 * C12-知识库文章：五行旺衰与四时
 * 文件路径：src/data/knowledge/content/wuxing-wangshuai.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'wuxing-wangshuai',
  title: '五行旺衰与四时',
  metaDescription: '五行在四季中的旺相休囚死，以及它在命局强弱判断中的作用。',
  h1: '五行旺衰与四时',
  category: 'wuxing',
  tags: ['五行', '旺衰'],
  sections: [
    {
      heading: '什么叫旺衰：五行也看"季节"',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '同一个五行，出现在不同季节，力量强弱不同。古人用五个状态来描述它在某一时令的处境：旺、相、休、囚、死。当令的那一行最旺，它所生的行为相（次旺），生它的行退休，克它的行被囚，它所克的行入死。这套规则是命理判断日主强弱的重要参照。',
        },
        {
          kind: 'paragraph',
          text: '注意：这里的"死"不是死亡，而是"力量最弱、无从发挥"的状态名；"囚"也不是囚禁，而是"被压制、无力生长"。它们是相对强弱的刻度，不是事件预言。',
        },
      ],
    },
    {
      heading: '四时旺相休囚死表',
      level: 2,
      blocks: [
        {
          kind: 'table',
          text: '五行四时旺衰对照',
          header: ['时令', '旺', '相', '休', '囚', '死'],
          rows: [
            ['春（木令）', '木', '火', '水', '金', '土'],
            ['夏（火令）', '火', '土', '木', '水', '金'],
            ['秋（金令）', '金', '水', '土', '火', '木'],
            ['冬（水令）', '水', '木', '金', '土', '火'],
            ['四季月（土令）', '土', '金', '火', '木', '水'],
          ],
        },
        {
          kind: 'paragraph',
          text: '所谓"四季月"，指辰、戌、丑、未四个月（每季最后一个月），传统上把它们归为土旺。这样五行轮流当令，一年形成循环。',
        },
      ],
    },
    {
      heading: '在命局里怎么用',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '八字以日干为"我"。比如日干是木，生在春天（木令），木旺，日主得令，力量偏强；生在秋天（金令），木死，日主失令，力量偏弱。再配合四柱里其他干支的生克、地支藏干、大运扶抑，传统命理据此判断日主是偏强还是偏弱，并进一步讨论喜用方向。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '旺衰只是一种传统的强弱估计，不是"你这个人强不强""命好不好"的判决。偏强偏弱本身没有好坏，后续取用更是流派分歧很大的环节。',
        },
      ],
    },
    {
      heading: '常见误用',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '误用一：把"死"当大凶。它只是相对力量最弱，不代表灾祸。',
            '误用二：只看月令就断强弱，忽略地支根气、天干透干与大运。',
            '误用三：把"弱"直接等同于"要补"，不看是否从弱、是否调候优先。',
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为五行旺衰学说科普。强弱判断属传统分析框架，不构成健康、投资或任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》四时旺相休囚死通说整理', confidence: 'legendary' },
    { text: '五行旺衰规则据传统命理通行说法', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'wuxing-shengke',
    'wuxing-basics',
    'ganzhi-shengwang',
    'wuxing-buyi',
    'wuxing-misunderstand',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统五行学说科普，属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 5,
};

export default article;
