/**
 * 知识库文章：岁运合参
 * 文件路径：src/data/knowledge/content/dayun-suiyun.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'dayun-suiyun',
  title: '岁运合参',
  metaDescription: '大运与流年如何共同作用，传统命理的分析思路。',
  h1: '岁运合参',
  category: 'dayun',
  tags: ['岁运'],
  sections: [
    {
      heading: '什么是"岁运"：大运与流年一起看',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '"岁运"是传统命理里把"岁"（流年）和"运"（大运）合在一起讨论的简称。前面两篇分别讲了大运是十年气候、流年是当年天气，岁运合参就是把这两层叠加，再放回原命局，看三者干支之间的生克冲合关系。传统说法认为，单看大运看不出一年的变化，单看流年又缺乏十年背景，必须合参才能"断"某一年的倾向。',
        },
        {
          kind: 'list',
          items: [
            '运（大运）：这十年的大背景，决定基调。',
            '岁（流年）：这一年的具体干支，是引发动静的触发点。',
            '原局：固定底盘，岁运都作用于它。',
          ],
        },
        {
          kind: 'paragraph',
          text: '传统分析的典型顺序是：先看这步大运对日主是扶是抑，再看今年流年干支是喜是忌，最后看流年与大运、原局有没有冲合，把这三层叠加成一句倾向性描述。',
        },
      ],
    },
    {
      heading: '合参的典型思路：喜忌与引动',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '传统合参有两条主线。一条是"喜忌"：若原局身弱喜印比，大运流年走到印比干支，就说这十年/这一年运势顺；走到财官杀就说压力大。另一条是"引动"：原局原本安静的某组关系（如某合、某冲），被大运或流年干支触发，就说相应方面这一年被激活。两条主线都是在干支符号之间做关系运算。',
        },
        {
          kind: 'paragraph',
          text: '但这里有一个根本困难：不同流派对"喜用神"的取法不同，同一命局可能被定出不同喜忌，于是同一岁运在不同师傅嘴里可以得出相反结论。这正说明岁运合参是一套解释框架，而非客观算法——它的弹性来自解释者，而不是来自干支本身。',
        },
      ],
    },
    {
      heading: '理性看待：合参给倾向，不给事件',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '岁运合参是在干支符号之间做生克冲合的民俗推演，它最多给出"这一年外部环境偏紧或偏松"这样的模糊倾向，不能预测你会在这一年具体经历什么。大运流年不能决定具体事件；把"合参"读成命运判决，是越出了这套体系的能力边界。',
        },
        {
          kind: 'paragraph',
          text: '命律在年度运势描述中，会展示当年流年与当前大运、原局的结构性关系，并统一标注为民俗倾向，不做"今年必发财""今年必结婚"式断言。理解岁运合参，更多是为了读懂传统命理如何组织自己的话语，而不是据此安排人生。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》岁运合参与喜用神论述整理', confidence: 'legendary' },
    { text: '喜用神取法流派差异见《子平真诠》及现代命理方法论讨论', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['dayun-overview', 'dayun-liunian', 'dayun-jiaoyun', 'dayun-boundary'],
  confidence: 'legendary',
  disclaimer:
    '本文为传统命理方法论科普，岁运合参仅作民俗参考，不预测具体事件，不构成现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 5,
};

export default article;
