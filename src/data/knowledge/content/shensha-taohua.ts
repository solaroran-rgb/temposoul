/**
 * 知识库文章：桃花煞
 * 文件路径：src/data/knowledge/content/shensha-taohua.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'shensha-taohua',
  title: '桃花煞',
  metaDescription: '桃花的查法，以及它在传统与当代语境中的不同解读。',
  h1: '桃花煞',
  category: 'shensha',
  tags: ['桃花', '神煞'],
  sections: [
    {
      heading: '桃花是什么：以三合局查出来的一个地支',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '桃花，又称咸池、败神，是传统命理中最广为人知的神煞之一。它的查法以年支或日支所属的三合局为基准，固定指向另一个地支：申子辰见酉、寅午戌见卯、巳酉丑见午、亥卯未见子。也就是说，只要你的年支或日支落在某一三合局，四柱（或大运、流年）地支中出现对应那个字，就说命局带桃花。这是一条纯查表规则，可复算、可核对。',
        },
        {
          kind: 'table',
          header: ['年支/日支（三合局）', '桃花所在地支', '口诀俗称'],
          rows: [
            ['申子辰（水局）', '酉', '申子辰鸡叫乱人伦'],
            ['寅午戌（火局）', '卯', '寅午戌兔从茅里出'],
            ['巳酉丑（金局）', '午', '巳酉丑跃马南方走'],
            ['亥卯未（木局）', '子', '亥卯未鼠子当头忌'],
          ],
        },
        {
          kind: 'paragraph',
          text: '桃花按所在柱位还有细分：年、月柱出现称"墙内桃花"，传统认为主夫妻和顺；日时柱出现称"墙外桃花"，附会说法较多。这种柱位分工纯属后世附会，并非查表规则本身，读者不必当真。',
        },
      ],
    },
    {
      heading: '传统怎么读：从"情欲"到"人缘"的语义漂移',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '桃花在古书中被描述为与情感、魅力、异性缘相关的符号。早期典籍把它和情欲、酒色联系在一起，所以又叫"败神"；后世命理口语逐渐中性化，把它解释为"有魅力、有人缘、擅长社交"。现代网络语境又进一步衍生出"正桃花""烂桃花""桃花劫"等说法，大多是营销话术，并非古籍原文。',
        },
        {
          kind: 'paragraph',
          text: '需要强调：命中桃花地支并不代表一个人一定会有婚外情、一定会离婚，也不代表一定有旺盛的异性缘。现实中的感情状况由性格、成长经历、社会环境、双方选择共同决定，一个干支符号无法单独解释这些。把桃花直接等同于"命里有情人"，是把查表结果强行套成事件预言。',
        },
      ],
    },
    {
      heading: '理性看待：桃花只是一个可复算的旁注',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '桃花是神煞体系中一个可复算的地支符号，不是对婚恋、感情的预言。它不能判断一段关系的成败，更不能据此怀疑伴侣、催促结婚或做出重大情感决定。把它当成传统文化标签即可，切勿据此产生现实焦虑或人际猜忌。',
        },
        {
          kind: 'paragraph',
          text: '命律在排盘中若命中桃花，仅在神煞区列出"命中该地支"这一结构事实，不附加"正缘""外遇"式判断，也不给出任何感情建议。是否相信它的民俗含义，完全由读者自行判断；任何涉及亲密关系的决定，都应回到真实沟通与现实处境本身。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》咸池（桃花）查法及《三命通会》神煞篇整理', confidence: 'legendary' },
    { text: '墙内/墙外桃花的柱位分法见后世命理通俗读物，属附会，已标注', confidence: 'probable' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['shensha-overview', 'shensha-rational', 'ganzhi-sanhe', 'why-not-predict'],
  confidence: 'legendary',
  disclaimer: '本文为传统命理文化科普，桃花查法仅作民俗参考，不构成婚恋或人际关系建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
