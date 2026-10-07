/**
 * T-10B · WP-18 十段词条：煞 Dosha 入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-dosha-intro",
  title: "煞 Dosha 入门：传统认为需留意的星盘配置",
  metaDescription: "Dosha 是吠陀盘中传统认为需留意的配置（如 Mangal Dosha、Kaal Sarp）。本文梳理其判定条件与豁免分歧边界。",
  h1: "煞 Dosha 入门：传统认为需留意的星盘配置",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Dosha", "煞", "Mangal"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Dosha（音译「多沙」，常译「煞」）指吠陀盘中传统认为需要留意的配置。例如 Mangal / Kuja Dosha（火星居于命宫起第 1、2、4、7、8、12 宫）、Kaal Sarp Dosha（七曜全落在罗睺—计都轴的同一侧）、Guru-Chandal（木星与罗睺同宫）、Kemadruma（月亮两侧无星）等。" },
        { kind: 'paragraph', text: "各 Dosha 的触发条件是一组可由 D1 盘面检查的位置关系，因此「是否触发」可机械判定；但「此煞主何后果、如何化解」的叙述属传统象征层，且各流派的豁免规则分歧很大。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：排出主盘 D1，取得各 Graha 的宫位与罗睺—计都轴。", "第二步：逐条对照 Dosha 的触发条件（特定星落特定宫、全星在轴同侧等）。", "第三步：条件满足者，判定为该 Dosha 触发。", "第四步：记录触发项及其判定条件。", "第五步：对豁免规则分歧大的 Dosha，显式标注为待人工核验，不自动断言后果。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["Dosha", "触发条件（要略）", "可判定性"],
          rows: [
            ["Mangal Dosha", "火星居命起 1/2/4/7/8/12 宫", "宫位可判定；豁免规则分歧"],
            ["Kaal Sarp", "七曜全在罗睺—计都轴同侧", "可由 D1 确定性判定"],
            ["Guru-Chandal", "木星与罗睺同宫", "可由 D1 确定性判定"],
            ["Kemadruma", "月亮两侧宫位无星", "可由 D1 确定性判定"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀传承中，触发 Dosha 的盘被认为需要留意特定人生领域（如婚姻、平顺），并发展出成套的「化解」说法。这类叙述在民间流传很广，也常被渲染成焦虑来源。" },
        { kind: 'paragraph', text: "此为传统命理观点，Dosha 是否触发可由盘面机械判定，但「主何后果、如何化解」属历史传承的象征解释，不同流派的触发条件与豁免规则分歧极大，不存在唯一标准。命律只输出可判定的触发事实，不渲染后果、不推销化解。" },
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
        { kind: 'list', items: ["误解：命中 Mangal Dosha 婚姻必然不顺。澄清：触发是结构事实，「主婚姻不顺」是传统解释，且豁免规则流派分歧大。", "误解：Dosha 一旦触发无法改变。澄清：它只是盘面位置关系的描述，不构成对现实的决定。", "误解：所有 Dosha 判定标准统一。澄清：各流派触发条件与豁免规则差异很大，不能套用单一说法。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["可由 D1 确定性推导的 Dosha 触发条件属可核验层；本站按确定性清单自动化。", "「煞主何后果、如何化解」的叙述源自《Brihat Parashara Hora Shastra》等古典传承，具体口径与豁免规则出处待考。"] },
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
        { kind: 'list', items: ["一查：是否给出 Dosha 的具体触发条件，缺条件无法复核。", "二查：是否把「触发」渲染成「必然后果」或推销化解。", "三查：是否承认各流派豁免规则分歧、不套用单一标准——否则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘只自动化可由 D1 确定性判定的 Dosha，每条输出触发条件、传统依据与局限说明；对豁免规则分歧大、未自动化的条目显式列为待人工核验，不渲染后果、不提供任何「化解」服务，避免制造焦虑。" },
      ],
    },
  ],
  sources: [
    { text: "可由 D1 确定性推导的 Dosha 触发条件属可核验层；本站按确定性清单自动化。", confidence: 'verified' },
    { text: "「煞主何后果、如何化解」的叙述源自古典传承，具体口径与豁免规则出处待考。", confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/vedic",
    exports: ["generateVedicChart"],
    note: "与 /vedic 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：吠陀排盘", url: "/vedic" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["vedic-yoga-intro", "vedic-lagna-intro", "why-not-predict", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
