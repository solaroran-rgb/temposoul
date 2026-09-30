/**
 * 知识库文章：生肖相合相冲
 * 文件路径：src/data/knowledge/content/zodiac-culture/compat.ts
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: 'zodiac-compat',
  title: '生肖相合相冲：六合、六冲与三合',
  metaDescription: '民间常说"鼠马相冲""牛羊相合"。本文梳理生肖相合相冲的出处、配对表与理性看待方式。',
  h1: '生肖相合相冲：六合、六冲与三合',
  category: 'zodiac-culture',
  tags: ['生肖', '相合相冲', '民俗'],
  sections: [
    {
      heading: '相合相冲是什么',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '生肖的"相合""相冲"，本质上是十二地支之间关系在动物标签上的投影。因为每个生肖对应一个地支（鼠=子、牛=丑……），地支之间的六合、六冲、三合关系，就被说成了生肖之间的"合"与"冲"。',
        },
        {
          kind: 'paragraph',
          text: '需要先说明：这套关系是传统命理用来描述干支互动的符号工具，后来被民间简化为"两个人属相合不合"的通俗说法。它的原意比民间用法复杂得多。',
        },
      ],
    },
    {
      heading: '六合：六组"相合"生肖',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '地支六合共有六组，对应六对生肖相合：',
        },
        {
          kind: 'list',
          items: [
            '子丑合：鼠与牛',
            '寅亥合：虎与猪',
            '卯戌合：兔与狗',
            '辰酉合：龙与鸡',
            '巳申合：蛇与猴',
            '午未合：马与羊',
          ],
        },
      ],
    },
    {
      heading: '六冲：六组"对冲"生肖',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '地支六冲是位置相对相冲的六组，对应六对生肖相冲：',
        },
        {
          kind: 'table',
          text: '生肖六冲对照',
          header: ['冲对', '说明'],
          rows: [
            ['鼠 ↔ 马', '子午相冲'],
            ['牛 ↔ 羊', '丑未相冲'],
            ['虎 ↔ 猴', '寅申相冲'],
            ['兔 ↔ 鸡', '卯酉相冲'],
            ['龙 ↔ 狗', '辰戌相冲'],
            ['蛇 ↔ 猪', '巳亥相冲'],
          ],
        },
      ],
    },
    {
      heading: '三合：三个生肖一组',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '地支三合局把四个生肖分成四组，每组三个生肖相合：申子辰合水（猴鼠龙）、亥卯未合木（猪兔羊）、寅午戌合火（虎马狗）、巳酉丑合金（蛇鸡牛）。民间常说"三合贵人"，指的就是同属一局的生肖。',
        },
      ],
    },
    {
      heading: '理性看待：合冲不等于合婚',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '"相冲"是地支位置的术语，不是"两个人天生不合、不能在一起"。把属相合冲当作婚恋、合伙的唯一甚至主要依据，是对传统符号的过度简化。',
        },
        {
          kind: 'paragraph',
          text: '两个人相处是否合适，取决于性格、沟通、价值观与现实处境，生肖标签只提供一种文化视角。历史上属相"相冲"而婚姻美满、属相"相合"而分道扬镳的例子比比皆是。把它当聊天谈资无妨，据此拒绝一段关系则大可不必。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为生肖民俗科普，相合冲说法属传统文化，不构成婚恋、交友或合作的决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《三命通会》《渊海子平》等地支六合六冲三合通行说法整理', confidence: 'legendary' },
    { text: '生肖与地支对应关系据传统纪年常识整理', confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['ganzhi-sixhe', 'ganzhi-clash', 'ganzhi-sanhe', 'zodiac-legend'],
  confidence: 'legendary',
  disclaimer: '本文为生肖民俗科普，属传统文化参考，不构成婚恋或任何现实决策建议。',
  updatedAt: '2026-09-20',
  readingMinutes: 4,
};

export default article;
