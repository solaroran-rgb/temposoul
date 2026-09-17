/**
 * C12-知识库文章：AI 解读的边界：为什么它不能替你做决定
 * 文件路径：src/data/knowledge/content/why-ai-boundary.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'why-ai-boundary',
  title: 'AI 解读的边界：为什么它不能替你做决定',
  metaDescription: 'AI 解读基于传统文献与模式归纳，不能替代个人判断与专业建议。',
  h1: 'AI 解读的边界：为什么它不能替你做决定',
  category: 'boundary',
  tags: ['AI', '边界'],
  sections: [
    {
      heading: 'AI 在命律里到底做了什么',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律里的 AI 解读，做的事情可以拆成两步：第一步是用公开规则把出生时间排成年月日时四柱、五行计数、十神关系，这部分是确定性计算；第二步是把这些结构化结果，用整理过的传统语汇描述成一段可读文字。它并没有"看见"你的未来，也没有接入任何外部现实信息。',
        },
        {
          kind: 'paragraph',
          text: '换句话说，AI 在这里更像一个"传统文献的整理者与转述者"：它把规则算出来，再按文献口径写成你能读懂的话。它不是拥有超自然感知的预言者。',
        },
      ],
    },
    {
      heading: '它擅长什么',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '把枯燥的干支结构解释成可读的段落。',
            '在多篇传统文献之间做归纳，给出相对一致的说法。',
            '24 小时在线，帮你快速理解自己排盘结果的含义。',
          ],
        },
        {
          kind: 'paragraph',
          text: '这些都是"解释与整理"的工作，前提是输入数据正确、文献口径清楚。',
        },
      ],
    },
    {
      heading: '它不擅长、也不该做什么',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: 'AI 解读不能替你做重大决定，不能给出医疗诊断、法律意见、投资建议，也不能判断某段关系该不该继续、某个职业该不该换。这些决定需要你结合现实处境、专业人士意见和自己的价值观来做。',
        },
        {
          kind: 'paragraph',
          text: '原因有三：其一，训练材料是历史文献，不包含你的具体现实；其二，它对自己生成的文字没有"负责能力"，说得再肯定也不构成承诺；其三，把人生决策外包给一段算法文本，本身就会削弱你对自己生活的掌控感。',
        },
      ],
    },
    {
      heading: '怎么把 AI 解读用在对的地方',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '把 AI 解读当作一个"陪你梳理思路的对话对象"：它提供一种传统视角，你拿去对照自己的真实经历，再决定是否采纳。如果某段解读让你不安或兴奋，先回到现实——找医生、找律师、找信任的人聊聊，而不是据此行动。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为 AI 产品能力边界说明。任何 AI 生成内容均不构成医疗、法律、投资或其他专业建议，重大决策请咨询有资质的专业人士。',
        },
      ],
    },
  ],
  sources: [
    { text: '命律 AI 解读模块设计文档（内部）', confidence: 'verified' },
    { text: '生成式 AI 使用边界与心理影响的通用科普', confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['why-bazi-limits', 'why-rational-decl', 'why-data-source', 'why-confidence'],
  confidence: 'verified',
  disclaimer: '本文为产品能力边界说明，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
