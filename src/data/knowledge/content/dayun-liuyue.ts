/**
 * 知识库文章：流月流日
 * 文件路径：src/data/knowledge/content/dayun-liuyue.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'dayun-liuyue',
  title: '流月流日',
  metaDescription: '更短周期的干支作用，以及它的参考限度。',
  h1: '流月流日',
  category: 'dayun',
  tags: ['流月'],
  sections: [
    {
      heading: '流月流日：把干支切到月和日',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '在大运（十年）、流年（一年）之下，传统命理还把干支继续细分到流月、流日。流月是每月一柱的干支，按节气换月；流日是每天一柱的干支，按六十甲子逐日顺推。它们的排法和年柱、日柱的历法规则一致，完全可复算。理论上，你可以把今天的干支拿出来，和原局、大运、流年再做一次生克冲合。',
        },
        {
          kind: 'list',
          items: [
            '大运：十年一柱，最长周期。',
            '流年：一年一柱。',
            '流月：一月一柱（按节气换月）。',
            '流日：一日一柱（六十甲子顺推）。',
          ],
        },
      ],
    },
    {
      heading: '为什么越细越不能当真：解释爆炸',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '干支周期越切越细，会带来一个逻辑问题：同一命局叠加大运、流年、流月、流日四层干支，任意两层之间都能找出生克冲合，可以无穷无尽地"读出"含义。这就产生了解释爆炸——任何一天都能被说成"有动"，任何一天也都能被说成"平稳"，完全取决于解读者怎么挑关系讲。这样的体系丧失了区分度，和随机猜测差别不大。',
        },
        {
          kind: 'paragraph',
          text: '现实中，人的情绪、事务本来就每天起伏，把某天的心情好坏归因到"今天流日冲了某某"，事后总能找到对应关系；但这种事后附会无法预测、无法证伪。真正负责任的命理讨论，都会把分析停在大运、流年这一层，而不是去"算今天哪个时辰吉时"。',
        },
      ],
    },
    {
      heading: '理性看待：流月流日只做历法对照',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '流月流日是可复算的历法干支，但把它们叠加到命局上去"断每日吉凶"属于过度细化，没有可靠依据。切勿据此挑选"吉时"办事、决定重要日程，或被"今日犯冲"之类说法影响情绪。每天该做什么，应根据现实计划和身体状态决定。',
        },
        {
          kind: 'paragraph',
          text: '命律在黄历等模块中，会提供当日干支、节气等历法信息作为文化参考，但不据此输出"今日宜忌""吉时凶时"式断言。把流月流日当成了解传统历法的窗口，比当成每日行动指南更合适。',
        },
      ],
    },
  ],
  sources: [
    { text: '据干支历法（节气换月、六十甲子日记日）规则整理', confidence: 'verified' },
    { text: '流月流日过度推演的批评参考现代理性命理方法论资料', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['dayun-liunian', 'dayun-suiyun', 'dayun-boundary', 'paipan-jieqi'],
  confidence: 'legendary',
  disclaimer: '本文为传统历法与命理科普，流月流日干支仅作文化参考，不构成日程安排或现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
