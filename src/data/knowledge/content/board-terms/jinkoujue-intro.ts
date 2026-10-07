/**
 * T-10 回炉 · WP-18 十段词条：金口诀入门：地分、将神、贵神与人元
 * 板块：jinkoujue（/divination/jinkoujue）｜引擎：@temposoul/core/divination/jinkoujue
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "jinkoujue-intro",
  title: "金口诀入门：地分、将神、贵神与人元",
  metaDescription: "金口诀（大六壬金口诀）以地分、将神、贵神、人元四位成课，直断吉凶方位。本文梳理课式结构与边界。",
  h1: "金口诀入门：地分、将神、贵神与人元",
  category: "sanshi",
  tags: ["金口诀", "三式", "四位"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "金口诀，全称「大六壬金口诀」，是大六壬系统中简化出来的一支速断课式。它把课式压缩为四位：地分（所占之方）、将神（月将加时所得）、贵神（天乙贵人所临）、人元（由地分遁得的干）。四位自下而上叠成一课，构成一个精简的推演单元。" },
        { kind: 'paragraph', text: "金口诀的简化思路很清晰：大六壬的四课三传信息量大、推演链长，金口诀只保留四位与干支生克，牺牲细部换取速度。传统上它多用于即时问事与方位取向，属于民用速断体系，与完整的大六壬不可等同。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定所占之事与地分（所问方位或来人方位）。", "第二步：取起课时的月将与时辰，月将加时得将神。", "第三步：据干支起贵神，定天乙贵人所临。", "第四步：由地分遁干，得人元。", "第五步：四位自下而上排列成课，据干支生克与神将组合作解释。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["位次", "名称", "取法"],
          rows: [
            ["初（下）", "地分", "所占方位或来人方位"],
            ["二", "将神", "月将加时所得"],
            ["三", "贵神", "天乙贵人所临"],
            ["四（上）", "人元", "由地分遁干所得"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，金口诀以四位的生克与神将组合直断吉凶，口诀化的断语在民间流传较广。这一体系形成于大六壬的民用化过程中，断语多带概括性与经验性，不同传本在用神取舍上并不完全一致。" },
        { kind: 'paragraph', text: "此为传统命理观点，金口诀的吉凶断语属民间传统经验总结，信息粒度较粗，且传本之间存在差异，不构成对具体事件的判断依据。命律呈现四位课式的完整推算过程，并把断语明确标注为传统说法。" },
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
        { kind: 'list', items: ["误解：金口诀与大六壬完全等价。澄清：金口诀是大六壬系统的简化速断支，信息量远少于四课三传。", "误解：四位成课就能断言具体结果。澄清：传统断语为概括性经验，不能推出确定性结论。", "误解：各地传本的断语都一致。澄清：民间传本在用神取舍上有差异。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["金口诀相关传世抄本与民间传本：体系源流与断语细节各本不一，具体出处待考。", "四位取法与课式排布可按本文步骤复算；吉凶断语属民俗层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否标明了起课月将与地分。", "二查：是否把金口诀当成完整大六壬使用。", "三查：是否出现确定性断言——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的金口诀页以地分与起课时刻为输入，输出四位的完整课式与生克关系，并披露所用起课口径。解释部分分为可复算的课式结构与传统的断语释义两层，后者标注为传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "金口诀相关传世抄本与民间传本：体系源流与断语细节各本不一，具体出处待考。", confidence: 'legendary' },
    { text: "四位取法与课式排布可按本文步骤复算；吉凶断语属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/divination/jinkoujue",
    exports: ["generateJinkoujue"],
    note: "与 /divination/jinkoujue 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：jinkoujue排盘", url: "/divination/jinkoujue" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["liuren-intro", "qimen-intro", "taiyi-intro", "why-confidence"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
