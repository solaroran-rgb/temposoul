/**
 * 知识库文章：大运流年能预测具体事件吗
 * 文件路径：src/data/knowledge/content/dayun-boundary.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'dayun-boundary',
  title: '大运流年能预测具体事件吗',
  metaDescription: '不能。本文说明大运流年的能力边界与常见误用。',
  h1: '大运流年能预测具体事件吗',
  category: 'dayun',
  tags: ['边界', '大运'],
  sections: [
    {
      heading: '直接回答：不能',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '这篇文章标题就是答案：大运流年不能预测具体事件。它不能告诉你哪一年会升职、哪一年会结婚、哪一年会破财、哪一年会生病。传统命理把大运、流年讲得再玄妙，它的全部操作也只是在干支符号之间做生克冲合，输出的是"这十年/这一年外部环境偏某类倾向"的模糊描述，而不是一份事件时间表。把它读成事件预言，是最常见也最危险的误用。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '大运流年是民俗解释框架，不是预测工具。它不能预测你会在哪一年发生什么具体事，更不能替代医疗、法律、投资、婚恋等现实决策。任何声称"精确算准你某年某事"的说法，都超出了这套体系的能力边界，请保持警惕。',
        },
      ],
    },
    {
      heading: '为什么不能：三个根本原因',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '第一，符号同构但事件无穷。同一柱大运、流年干支，对应全球以亿计的人，他们在这一年经历完全不同的事。干支相同无法区分谁会结婚、谁会失业、谁会搬家，说明符号本身不携带具体事件信息。',
        },
        {
          kind: 'paragraph',
          text: '第二，解释有弹性。同一个"冲"，可被说成搬家、换工作、旅行、争执，也可被说成什么都没发生。解读者总是事后挑一个说得通的解释，这让它看起来"准"，实则无法事前预测。第三，重大现实因素被忽略。一个人是否升职取决于能力与机遇，是否生病取决于健康与医疗，是否破财取决于财务决策——这些由现实决定，干支管不着。',
        },
        {
          kind: 'list',
          items: [
            '符号相同 → 亿万人同年同干支，事件却千差万别。',
            '解释有弹性 → 事后总能圆，事前测不准。',
            '现实因素主导 → 健康、职业、财务由现实决策决定。',
          ],
        },
      ],
    },
    {
      heading: '它能做什么：一个时间结构的反思框架',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '划清边界不是否定大运流年的全部价值。它可以作为一种文化和心理工具：把人生按十年、一年分段，帮你反思"这一阶段我更适合做什么、上一阶段我经历了什么"。它给你一种时间节奏感，让你不把某段低谷或高光当成永恒。但它提供的是反思视角，不是行动指令。',
        },
        {
          kind: 'paragraph',
          text: '命律正是按这个定位设计：排盘给出可复算的大运流年时间线，运势描述给倾向性、区间化的民俗说明，明确标注置信度和边界，不打分、不预言、不推销化解服务。如果你读到任何"某年必有某事、需花钱化解"的话术，请记住这篇文章的结论。',
        },
      ],
    },
  ],
  sources: [
    { text: '据传统命理"大运流年主气不主事"的方法论立场整理', confidence: 'verified' },
    { text: '对命理预测滥用与确认偏误的批评参考现代理性思维普及资料', confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'dayun-overview',
    'dayun-liunian',
    'why-not-predict',
    'why-no-fortune-score',
    'why-bazi-limits',
  ],
  confidence: 'verified',
  disclaimer:
    '本文为产品边界说明，大运流年不预测具体事件，不构成任何医疗、法律、投资、婚恋或现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 4,
};

export default article;
