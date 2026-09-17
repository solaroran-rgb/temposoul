/**
 * C12-知识库文章：八字能说明什么、不能说明什么
 * 文件路径：src/data/knowledge/content/why-bazi-limits.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'why-bazi-limits',
  title: '八字能说明什么、不能说明什么',
  metaDescription: '八字是解释框架而非预测工具，本文界定它的能力边界。',
  h1: '八字能说明什么、不能说明什么',
  category: 'boundary',
  tags: ['八字', '边界'],
  sections: [
    {
      heading: '八字本质上是一套时间符号系统',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '八字把出生的年月日时转成四组干支，这一步是历法运算，规则公开、可复算。真正进入"命理"的部分，是后人在这套符号上叠加的解释框架：五行强弱、十神关系、格局用神、大运流年。这些解释系统历史悠久、流派众多，但它们不是自然科学定律，而是一套沿用千年的文化解释语言。',
        },
        {
          kind: 'paragraph',
          text: '理解这一点，才能谈"八字能说明什么"：它能说明的，是在这套传统解释语言内部，一个人的时间结构被描述成了什么样子；它不能说明的，是你明天会发生什么事、某笔投资该不该做、某段关系会不会成。',
        },
      ],
    },
    {
      heading: '它可以做什么',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '提供一面文化镜子：用传统语汇描述性格倾向、节奏偏好、人际风格。',
            '作为自我反思的切入点：借五行、十神的语言梳理自己，而非接受定论。',
            '保留民俗体验：让读者理解中国传统时间观与符号文化的一部分。',
          ],
        },
        {
          kind: 'paragraph',
          text: '这些用途都属于"解释与反思"，而不是"预测与指令"。把八字当作一个可以对话的传统文本，比把它当成命运判决书要健康得多。',
        },
      ],
    },
    {
      heading: '它不能做什么',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '八字不能预测具体事件、不能告诉你该不该结婚/辞职/投资/就医，也不能判断一个人"命好命坏"。任何声称能由八字直接推出这些结论的说法，都超出了这套系统可负责的范围。',
        },
        {
          kind: 'list',
          items: [
            '不能替代医学诊断与治疗，健康问题请就医。',
            '不能替代法律咨询，合同与纠纷请找执业律师。',
            '不能替代财务与投资判断，资金决策请独立尽调。',
            '不能把"缺某五行"当作必须补什么的处方。',
          ],
        },
      ],
    },
    {
      heading: '为什么有人觉得它"很准"',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '传统描述往往使用高度概括、几乎适用于多数人的语汇（比如"你有时外向有时独处"），加上人们倾向于记住符合预期的部分、忽略不符的部分，这会产生强烈的"准"的感受。这是心理层面的常见现象，并不构成八字具有预测力的证据。',
        },
        {
          kind: 'paragraph',
          text: '命律不否认这种文化体验的价值，但坚持把它和"可复算的排盘"分开标注：前者是民俗，后者是计算。把二者混为一谈，既不尊重传统，也误导用户。',
        },
      ],
    },
  ],
  sources: [
    { text: '据《渊海子平》《三命通会》通行本及命理方法论科普整理', confidence: 'legendary' },
    { text: '巴纳姆效应等心理现象的科普性说明', confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'bazi-intro',
    'why-no-fortune-score',
    'why-folk-vs-fact',
    'why-ai-boundary',
    'wuxing-misunderstand',
  ],
  confidence: 'verified',
  disclaimer: '本文为传统命理科普与边界说明，属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
