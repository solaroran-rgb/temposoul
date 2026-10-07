/**
 * T-10 回炉 · WP-18 十段词条：住宅风水入门：形势、理气与居住参考
 * 板块：residential（/fengshui/residential）｜引擎：@temposoul/core/residential-fengshui
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "residential-intro",
  title: "住宅风水入门：形势、理气与居住参考",
  metaDescription: "住宅风水含形势与理气两路。本文梳理坐向、户型、外局的传统看法与当代边界。",
  h1: "住宅风水入门：形势、理气与居住参考",
  category: "fengshui",
  tags: ["住宅风水", "形势", "理气"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "住宅风水（阳宅风水）传统上分两路：形势（峦头）看可见的形态——山川形势、道路走向、周边建筑、户型格局；理气看不可见的推算——坐向、元运、飞星、命卦。两路在历史上各自发展，明清以后趋于合参，但至今仍是两套相对独立的评价体系。" },
        { kind: 'paragraph', text: "住宅风水的现实落点通常是户型与布局：门、主卧、厨房、卫生间的位置关系，开门见灶、穿堂风、横梁压顶之类的说法，都属于民间流传较广的居住禁忌与偏好。这些内容里，一部分可以用现代居住常识解释（如通风、采光、动线），另一部分则属于纯传统的象征体系。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定住宅坐向与入户方位。", "第二步：考察外局形势——周边道路、水体、建筑高度与间距。", "第三步：看户型格局——动线、开门见什么、厨卫位置。", "第四步：如需理气，按八宅或玄空等体系起盘。", "第五步：形势与理气合参，读综合性的居住参考。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["路径", "看什么", "可核验性"],
          rows: [
            ["形势（峦头）", "山川、道路、周边建筑、户型", "部分与居住常识重叠"],
            ["理气·八宅", "坐向、命卦、游年九星", "可复算，释义属传统"],
            ["理气·玄空", "元运、山向飞星", "可复算，释义属传统"],
            ["采光通风", "朝向、窗墙比、进深", "客观指标，非风水范畴"],
            ["结构安全", "承重、抗震、消防", "客观指标，须专业评估"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，住宅风水被用来择址与取向，形成了一套以「藏风聚气」为核心理念的居住偏好体系。这套理念在古代聚落选址中有其经验基础，但在现代城市语境下，很多规则的适用条件已发生变化。" },
        { kind: 'paragraph', text: "此为传统命理观点，住宅风水属于传统居住文化评价体系，与建筑结构安全、采光通风、消防疏散等现代客观指标不是同一回事，也不能替代专业评估。命律呈现坐向、外局与户型的传统看法，并明确区分「与居住常识重叠的部分」与「纯传统象征的部分」。" },
        {
          kind: 'callout',
          tone: 'boundary',
          text: "以上释义属传统术数与民俗文化范畴，不构成对具体事件的判断，也不承诺任何改运效果。",
        },
      ],
    },
    {
      heading: '常见误解：误解 → 澄清',
      level: 2,
      blocks: [
        { kind: 'list', items: ["误解：风水判断可以替代房屋质量与安全评估。澄清：结构安全、消防、采光属客观指标，须专业评估，风水不涉及。", "误解：所有户型禁忌都有现实依据。澄清：部分禁忌与通风采光动线相关，其余属传统象征体系。", "误解：调整布局就能改变运势。澄清：传统风水不承诺改运效果，布局调整的实际收益在于居住舒适度。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["《阳宅十书》《阳宅集成》等传世阳宅文献：形势与理气的取法各本不一，相关细节出处待考。", "坐向判定、外局与户型的结构化描述可复现；吉凶释义属民俗层，属待考。"] },
        {
          kind: 'callout',
          tone: 'boundary',
          text: "凡无实证可查者一律标注「出处待考」，不编造书名、篇目与原文。",
        },
      ],
    },
    {
      heading: '三步自检：怎么判断看到的内容靠不靠谱',
      level: 2,
      blocks: [
        { kind: 'list', items: ["一查：是否区分了「居住常识」与「传统象征」两类说法。", "二查：是否把风水结论当成房屋质量的判断依据。", "三查：是否出现改运、化解类的效果承诺——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的住宅风水页以坐向与户型信息为输入，输出形势与理气两条路径的结构化描述，并显式区分「与居住常识重叠的部分」和「纯传统象征的部分」。页面不作居住质量的判断，也不承诺任何改运效果。" },
      ],
    },
  ],
  sources: [
    { text: "《阳宅十书》《阳宅集成》等传世阳宅文献：形势与理气的取法各本不一，相关细节出处待考。", confidence: 'legendary' },
    { text: "坐向判定、外局与户型的结构化描述可复现；吉凶释义属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/residential-fengshui",
    exports: ["generateResidentialFengshui"],
    note: "与 /fengshui/residential 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：residential排盘", url: "/fengshui/residential" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["bazhai-intro", "xuankong-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
