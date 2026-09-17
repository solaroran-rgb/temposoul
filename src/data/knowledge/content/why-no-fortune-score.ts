/**
 * C12-知识库文章：为什么我们不给你打"运势分"
 * 文件路径：src/data/knowledge/content/why-no-fortune-score.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'why-no-fortune-score',
  title: '为什么我们不给你打"运势分"',
  metaDescription: '运势分数会带来伪精确与误读，命律用分层描述+置信度标识替代单一分数。',
  h1: '为什么我们不给你打"运势分"',
  category: 'boundary',
  tags: ['产品理念', '运势'],
  sections: [
    {
      heading: '一个 87 分，到底意味着什么',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '很多命理产品喜欢在首页给你一个大数字：今日运势 87 分、爱情运 72 分、事业运 91 分。这种做法看起来直观，其实掩盖了一个根本问题——没有人能说清楚这个分数是怎么算出来的。它既不像考试分数那样有标准答案，也不像股票指数那样有公开权重，更多是把一堆民俗形容词压缩成一个数字，再让你误以为它精确。',
        },
        {
          kind: 'paragraph',
          text: '命律选择不这么做。我们认为，一个看起来精确、实际无法复算的分数，比没有分数更危险：它会让用户把注意力从"理解自己"转移到"盯着分数涨跌"上，把一次民俗体验误当成可量化的结论。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '命律不对任何维度打出吉凶分数，也不承诺某段时间运气好坏。任何"运势分""幸运指数"都不属于可复算事实，不应作为现实决策依据。',
        },
      ],
    },
    {
      heading: '伪精确的三个来源',
      level: 2,
      blocks: [
        {
          kind: 'list',
          items: [
            '来源一：把定性描述硬转成数字。"今天比较顺"被写成 +5 分，但"顺"没有单位，数字只是包装。',
            '来源二：权重不可复现。今天五行缺木给 +8，明天改成 +6，没有公开规则，用户无法核对。',
            '来源三：基线漂移。今天 80 分显得普通，明天 85 分就像变好了，但这可能只是算法调参，不是你的真实变化。',
          ],
        },
        {
          kind: 'paragraph',
          text: '当一个数字同时不透明、不可复算、还天天变动，它制造的不是确定感，而是焦虑——用户会反复刷新、为几分之差纠结。这与命理文化"知人则哲"的初衷背道而驰。',
        },
      ],
    },
    {
      heading: '我们用什么替代单一分数',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律把每一个结论拆成两层：可核验层与民俗解释层。可核验层是排出来的干支、节气、五行计数、神煞命中，这些有规则、能复算；民俗解释层是"这组结构传统上怎么被形容"，我们明确标注为传统说法，并附上置信度。',
        },
        {
          kind: 'table',
          text: '替代方案对照',
          header: ['做法', '传统产品', '命律'],
          rows: [
            ['结论形式', '一个总分', '分层描述 + 置信度标识'],
            ['可复算性', '不公开', '干支/节气/计数可逐项核对'],
            ['误读风险', '高（把分数当事实）', '低（标注民俗与边界）'],
            ['决策建议', '暗示"分高就做"', '不替代现实决策'],
          ],
        },
        {
          kind: 'paragraph',
          text: '也就是说，我们宁可给你一段"这组干支在传统里常被这样描述，属于民俗参考"的文字，也不给你一个看似精确却无法解释的数字。',
        },
      ],
    },
    {
      heading: '如果你确实想看趋势',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律的每日运势模块会按日期展示干支结构与传统宜忌，但它不打分、不排名、不制造"今天必须做什么"的紧迫感。它更像一份"今日干支历"，帮你理解当天的文化语境，而不是替你安排生活。',
        },
        {
          kind: 'callout',
          tone: 'boundary',
          text: '本文为产品理念说明。运势描述属民俗参考，不构成投资、婚恋、医疗、法律等任何现实决策建议。',
        },
      ],
    },
  ],
  sources: [
    { text: '命律产品理念文档（内部）', confidence: 'verified' },
    { text: '传统命理"不立妄言"的科普性写作共识', confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: ['why-confidence', 'why-not-predict', 'why-rational-decl', 'why-bazi-limits'],
  confidence: 'verified',
  disclaimer: '本文为产品理念说明，运势相关描述属民俗参考，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 2,
};

export default article;
