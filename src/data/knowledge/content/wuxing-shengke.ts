/**
 * C12-知识库文章：五行相生相克详解
 * 文件路径：src/data/knowledge/content/wuxing-shengke.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'wuxing-shengke',
  title: '五行相生相克详解',
  metaDescription: '相生相克的完整序列、原理，以及"相克不等于不好"的边界说明。',
  h1: '五行相生相克详解',
  category: 'wuxing',
  tags: ['五行', '生克'],
  sections: [
    {
      heading: '五行是什么：五种运行状态',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '五行——金、木、水、火、土——不是五种具体物质，而是古人用来分类世间变化的五种运行状态：木主生发、火主炎上、土主承载、金主收敛、水主润下。它们更像五种功能角色，而不是五种原子。理解这一点，是理解相生相克的前提。',
        },
        {
          kind: 'paragraph',
          text: '五行之间的关系，主要靠"相生"与"相克"两套循环来描述。相生讲谁助长谁，相克讲谁约束谁。两套循环一起构成一个动态平衡的模型，而不是简单的"谁克谁谁倒霉"。',
        },
      ],
    },
    {
      heading: '相生：谁助长谁',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '相生序列是一个圆圈：木生火、火生土、土生金、金生水、水生木。古人的想象是：钻木取火所以木生火；火烧成灰所以火生土；金属矿石出自土石所以土生金；金属表面凝露或古人以金为水源象征所以金生水；水滋润树木所以水生木。',
        },
        {
          kind: 'list',
          items: [
            '木生火：木柴燃烧，火焰升腾。',
            '火生土：火燃成灰，归于土壤。',
            '土生金：金属矿藏产于土石之中。',
            '金生水：金寒凝露，或为古人对水源的象征联想。',
            '水生木：水滋养草木生长。',
          ],
        },
      ],
    },
    {
      heading: '相克：谁约束谁',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '相克序列隔位相交：木克土、土克水、水克火、火克金、金克木。含义同样是功能约束：草木破土而木克土；土能挡水而土克水；水能灭火而水克火；火能熔金而火克金；金属能伐木而金克木。',
        },
        {
          kind: 'table',
          text: '五行生克对照',
          header: ['五行', '所生（我生）', '所被生（生我）', '所克（我克）', '所被克（克我）'],
          rows: [
            ['木', '火', '水', '土', '金'],
            ['火', '土', '木', '金', '水'],
            ['土', '金', '火', '水', '木'],
            ['金', '水', '土', '木', '火'],
            ['水', '木', '金', '火', '土'],
          ],
        },
      ],
    },
    {
      heading: '相克不等于不好',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '"克"是约束与制衡，不是伤害与灾祸。没有克，系统会失控：木无金修剪则疯长，火无水约束则成灾。把"我克"当成"我倒霉"是对五行模型的庸俗化。',
        },
        {
          kind: 'paragraph',
          text: '在命理分析里，生克同时被用来描述力量平衡：生太多可能泄身太过，克太多又可能压力过重。判断好坏要看整体结构，而不是看到一个"克"字就紧张。这也是为什么命律只做五行计数与结构描述，不替你下"被克所以不好"的结论。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为五行学说科普。生克关系属传统模型，不构成医疗、投资或任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《尚书·洪范》《五行大义》通行本整理', confidence: 'legendary' },
    { text: '五行生克序列据传统命理通行说法整理', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'wuxing-basics',
    'wuxing-wangshuai',
    'wuxing-misunderstand',
    'wuxing-buyi',
    'why-folk-vs-fact',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统五行学说科普，属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
