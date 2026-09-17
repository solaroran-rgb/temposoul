/**
 * 知识库文章：交运与换运
 * 文件路径：src/data/knowledge/content/dayun-jiaoyun.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'dayun-jiaoyun',
  title: '交运与换运',
  metaDescription: '交脱运的时间点与民间说法，以及理性看待。',
  h1: '交运与换运',
  category: 'dayun',
  tags: ['交运'],
  sections: [
    {
      heading: '交运是什么：两柱大运之间的切换点',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '大运每十年换一柱，两柱之间的那个时间点就叫"交运"（也叫交脱运、换运）。比如你十三岁从乙丑运交到丙寅运，十三岁前后这段时间就是交运点。因为大运干支变了，传统说法把这个节点看作"阶段切换"：旧的气候退去、新的气候登场。交运点由起运岁数加每十年一柱推算出来，时间上可复算。',
        },
        {
          kind: 'paragraph',
          text: '民间对交运有很多讲究，比如"交运那年要躲星""交运时辰不能见人""换运必动荡"。这些说法是把"干支切换"这个抽象节点，附会成需要特别应对的时刻，越传越玄。它们并非排盘规则本身，而是后世民俗想象。',
        },
      ],
    },
    {
      heading: '为什么交运容易被夸大：人生转折的心理投射',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '人在二三十岁、三四十岁确实会经历升学、就业、结婚、换岗、家庭变化等真实转折，这些转折和"换大运"的十年节奏在时间上有一定重合。于是人们容易把真实发生的人生变化，归因到"换运"头上，进而觉得交运很灵验。这是一种确认偏误：记住应验的巧合，忽略大量换运而生活如常的例子。',
        },
        {
          kind: 'paragraph',
          text: '事实上，真正推动人生转折的是教育、职业选择、家庭事件、经济周期等现实因素。把转折归功于交运，既不能帮你做出更好选择，也可能让你在换运年徒增焦虑，甚至花冤枉钱去"化解"。',
        },
      ],
    },
    {
      heading: '理性看待：交运是时间刻度，不是劫难',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '交运只是两柱大运之间可复算的时间切换点，不意味着这一年必然动荡、必然倒霉，也不需要"躲星""不见人"之类仪式。把换运当作普通的十年刻度即可，切勿因交运而焦虑、破财或改变正常生活节奏。人生的变化由现实决定，不由干支切换决定。',
        },
        {
          kind: 'paragraph',
          text: '命律在大运时间线上标注每柱起止年龄，交运点自然落在柱与柱的交界处，但不附加"此年大凶""宜躲不宜动"之类说法。把它当成一个回顾十年阶段、规划下一阶段的自然节点，比把它当成需要防备的劫难更有建设性。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》交脱运（大运换柱时点）论述整理', confidence: 'legendary' },
    { text: '"交运躲星""换运动荡"等民间说法见民俗命理资料，已标注为附会', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['dayun-overview', 'dayun-qiyun', 'dayun-suiyun', 'dayun-boundary'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理科普，交运时点仅作历法说明，不构成吉凶判断或现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
