/**

* C9-终版：知识库正文 · 理性专栏
* 存放于 content/ 供按需 import；注册表登记后生效
  */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'why-not-predict',
  title: '为什么命律不做吉凶预测与事件断言',
  metaDescription:
    '命律不做吉凶打分、不预测具体事件。本文说明我们为什么这样设计，以及命理能提供什么、不能提供什么。',
  h1: '为什么命律不做吉凶预测与事件断言',
  category: 'boundary',
  tags: ['产品理念', '边界说明', '理性命理'],
  sections: [
    {
      heading: '我们的立场',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律 TempoSoul 不提供"吉/凶"总分，不预测"某月会发生某事"，也不承诺任何改运效果。这不是保守，而是我们对用户负责的底线。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '命理可以描述一种倾向性框架，但无法、也不应该替代你对具体事件的判断。',
        },
      ],
    },
    {
      heading: '三个具体原因',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '可验证性：排盘中的节气、干支、藏干等属于可复算的结构性事实；而"吉凶""运势高低"属于解释性判断，无法通过数据核验。',
            '责任边界：断言型输出（如"本月必破财"）可能引发焦虑或被用于不当决策，我们不承担、也不制造这类风险。',
            '方法论：传统命理本身是一套解释系统，不同流派对同一命局常有不同读法，我们选择并列呈现多口径，而非给出唯一"正确答案"。',
          ],
        },
      ],
    },
    {
      heading: '我们提供什么',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '结构性事实：四柱、五行分布、十神、神煞等（可核验、可复算）。',
            '文化解读：传统文献与民俗中的对应说法（标注为民俗参考）。',
            '置信度标识：每个维度明确标注"可核验 / 较可靠 / 民俗"，让你知道哪些能信、哪些只是文化传统。',
          ],
        },
      ],
    },
  ],
  sources: [{ text: '本文为命律编辑部产品立场说明，非古籍引文', confidence: 'verified' }],
  citationStrategy: 'paraphrase',
  reviewedBy: '命律编辑部',
  ready: true,
  relatedFeatures: [{ label: '八字排盘', url: '/result?system=bazi' }],
  relatedSlugs: ['why-confidence', 'why-bazi-limits', 'why-folk-vs-fact'],
  confidence: 'verified',
  disclaimer: '本文为产品理念说明，不构成任何建议或承诺。',
  pinned: true,
  updatedAt: '2026-09-16',
  readingMinutes: 3,
};

export default article;
