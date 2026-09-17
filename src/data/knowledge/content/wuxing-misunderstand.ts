/**
 * C12-知识库文章：关于五行最常见的 5 个误解
 * 文件路径：src/data/knowledge/content/wuxing-misunderstand.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'wuxing-misunderstand',
  title: '关于五行最常见的 5 个误解',
  metaDescription: '缺什么补什么、五行越多越好……本文逐一厘清。',
  h1: '关于五行最常见的 5 个误解',
  category: 'wuxing',
  tags: ['五行', '误解'],
  sections: [
    {
      heading: '误解一：五行是五种物质',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '很多人以为五行就是金块、木头、流水、火焰、泥土这五样东西。其实五行描述的是五种运行状态：木主生发、火主炎上、土主承载、金主肃降收敛、水主润下。它是功能模型，不是元素周期表。把它当实物，后续所有推论都会跑偏。',
        },
      ],
    },
    {
      heading: '误解二：缺什么就必须补什么',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '八字里少某一行，不代表要去补它。传统命理讲究整体平衡：有时候缺的反而是忌神，补上更糟；有时候偏枯成特殊格局，反而不能扶。"缺=补"是民间简化版，丢掉了扶抑、调候、从格等前提。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '命律不提供"缺什么补什么"的改名、配色、戴饰建议。五行分布只是结构描述，不构成任何现实处方。',
        },
      ],
    },
    {
      heading: '误解三：五行越多越好',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '有人觉得八字里五行齐全就是好命，偏枯就是不好。这是误解。命理看的是结构是否有情、是否成格局，而不是"五个字凑齐"。历史上许多成格的八字恰恰是五行偏于一行，全与不全本身不决定好坏。',
        },
      ],
    },
    {
      heading: '误解四：克就是凶、生就是吉',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '看到"金克木"就紧张，看到"水生木"就高兴，这是把生克道德化了。生克是制衡关系：无克则系统失衡，无生则力量不续。传统命理里"食神制杀""官印相生"等组合，恰恰是利用克与生来达成结构平衡。',
        },
      ],
    },
    {
      heading: '误解五：五行缺什么对应身体缺什么',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '八字缺木不等于肝有问题，缺水不等于肾不好。命理五行与中医脏腑分属不同语境的类比，不能互相诊断。把两者混为一谈，是健康恐吓类命理产品最常用的话术。',
        },
        {
          kind: 'list',
          items: [
            '五行是运行状态分类，不是物质元素。',
            '缺一行不必补，更不能据此改名戴饰。',
            '五行齐全不代表好，偏枯不代表坏。',
            '生克是制衡，不是吉凶。',
            '五行与身体的对应是文化类比，不用于诊断。',
          ],
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为五行观念澄清。任何把五行与健康、财运、命运直接挂钩的说法都属民俗参考，不构成医疗、投资或任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《五行大义》《三命通会》相关论述整理', confidence: 'legendary' },
    { text: '五行误解的常见来源为民简化解读与商业话术', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'wuxing-shengke',
    'wuxing-buyi',
    'wuxing-zangxiang',
    'wuxing-wangshuai',
    'why-bazi-limits',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统五行观念科普，不构成医疗、投资或任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
