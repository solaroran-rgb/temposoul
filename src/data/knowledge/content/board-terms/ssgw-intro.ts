/**
 * T-10 回炉 · WP-18 十段词条：三山国王灵签入门：抽签、签诗与签解
 * 板块：ssgw（/divination/ssgw）｜引擎：@temposoul/core/divination/ssgw
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "ssgw-intro",
  title: "三山国王灵签入门：抽签、签诗与签解",
  metaDescription: "三山国王灵签为地方信仰签诗，抽签得号附签诗与解。本文梳理签制结构、签文性质与边界。",
  h1: "三山国王灵签入门：抽签、签诗与签解",
  category: "divination",
  tags: ["三山国王", "灵签", "地方信仰"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "三山国王是粤东与潮汕一带的地方信仰神祇，其庙宇系统中的灵签俗称「三山国王灵签」，是民间「抽签问事」的典型形态。签制通常为若干签（本系统收录九十二签），每签含签号、签诗（多为七言四句）、典故与签解文字。" },
        { kind: 'paragraph', text: "灵签与传统术数不同：它不依赖出生时间或起卦时刻，而是以随机的签号为结果，再据签诗与典故作解释。这决定了它的信息粒度极粗——同一签可对应无数种问事情境，签解只是概括性的方向性文字。理解这一点，才能正确看待灵签的定位。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：明确所问之事，灵签以一签一事为宜。", "第二步：按庙宇或系统规则取得签号（掷筊确认或随机抽签）。", "第三步：查该签号的签诗与典故。", "第四步：读签解文字，含事项分类的传统释义。", "第五步：据所问之事与签解作参考性阅读。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["项目", "灵签", "八字/六爻等"],
          rows: [
            ["输入", "随机签号", "出生时间或起卦时刻"],
            ["可复算性", "签号可复现，抽取随机", "可据输入复算"],
            ["信息粒度", "粗，概括性方向", "细，多层结构"],
            ["解释来源", "签诗与典故", "符号体系与规则"],
            ["适用", "一签一事的速问", "较复杂或需结构的问事"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在民间信仰中，灵签被视作神明示意的渠道，签诗的典故与签解方向被用以参照行事。这套实践属于地方信仰文化的一部分，签文多由庙宇系统世代传承，措辞在不同庙宇之间存在差异。" },
        { kind: 'paragraph', text: "此为传统命理观点，灵签的签解是民间信仰中的概括性方向文字，抽取本身是随机的，不构成对具体事件的判断依据。命律把三山国王灵签作为地方信仰文化资料呈现，保留签诗原文与典故，解释部分标注为传统说法。" },
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
        { kind: 'list', items: ["误解：灵签与八字一样是精密术数。澄清：灵签以随机签号为结果，信息粒度远粗于术数体系。", "误解：同一签在不同问事下含义相同。澄清：签解需结合所问事项读，同一签在不同情境下指向不同。", "误解：抽到下签就意味着事情一定会不顺。澄清：签解是概括性方向，不能推出确定性结论。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["三山国王灵签签文属地方庙宇系统传承的信仰文本，各庙版本措辞不一，具体出处待考。", "签号与签文的对应可查；签解的效验属信仰层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否明确了所问之事——一签一事是灵签的基本规则。", "二查：是否把签解当成了确定性结论。", "三查：是否出现医疗、法律、投资类断言——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的三山国王灵签页支持随机抽签与按号查签两种入口，输出签号、签诗、典故与签解，并说明签制来源。页面把签文作为地方信仰文化资料呈现，解释标注为传统说法，不作事件断言。" },
      ],
    },
  ],
  sources: [
    { text: "三山国王灵签签文属地方庙宇系统传承的信仰文本，各庙版本措辞不一，具体出处待考。", confidence: 'legendary' },
    { text: "签号与签文的对应可查；签解的效验属信仰层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/divination/ssgw",
    exports: ["drawRandomSign", "resolveSignByNumber"],
    note: "与 /divination/ssgw 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：ssgw排盘", url: "/divination/ssgw" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["lenormand-intro", "zhuge-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
