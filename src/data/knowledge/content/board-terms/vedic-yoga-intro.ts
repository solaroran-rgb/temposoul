/**
 * T-10B · WP-18 十段词条：星组合 Yoga 入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-yoga-intro",
  title: "星组合 Yoga 入门：由星体位置触发的格局",
  metaDescription: "Yoga 是吠陀盘中由特定星体位置关系构成的组合（如五大瑜伽）。本文梳理其触发条件与流派分歧边界。",
  h1: "星组合 Yoga 入门：由星体位置触发的格局",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Yoga", "格局", "组合"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Yoga（音译「瑜伽」，此处指「组合/格局」，与身心瑜伽无关）是吠陀盘中由特定星体位置关系构成的结构化判定。例如 Pancha Mahapurusha Yoga（五大瑜伽）要求某曜居本座或擢升座且落入角宫；Gajakesari Yoga 指月亮与木星互处角宫；Budha-Aditya Yoga 指水星与太阳同宫。" },
        { kind: 'paragraph', text: "Yoga 的触发条件是一组可由 D1 盘面确定性检查的位置关系，因此哪些 Yoga 成立、哪些不成立，是可机械判定的结构事实；但某 Yoga 「主何成就」的叙述属传统象征层。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：排出主盘 D1，取得各 Graha 的落座、宫位与强弱标记。", "第二步：逐条对照 Yoga 的触发条件（落座要求、宫位要求、同宫/互宫要求）。", "第三步：条件全部满足者，判定为该 Yoga 成立。", "第四步：记录成立的 Yoga 及其触发条件。", "第五步：对规则分歧大、无法确定性判定的 Yoga，显式标注为待人工核验，不臆造。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["Yoga", "触发条件（要略）", "可判定性"],
          rows: [
            ["Pancha Mahapurusha", "某曜居本座/擢升且落角宫", "可由 D1 确定性判定"],
            ["Gajakesari", "月亮与木星互处角宫", "可由 D1 确定性判定"],
            ["Budha-Aditya", "水星与太阳同宫", "可由 D1 确定性判定"],
            ["Neecha-Bhanga", "落陷曜的取消条件", "流派分歧大，待终审"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀解读中，成立的 Yoga 被认为对应某种禀赋或成就倾向，例如五大瑜伽传统上被视作「出众格局」。古典文献为各类 Yoga 配了成套的吉凶叙述。" },
        { kind: 'paragraph', text: "此为传统命理观点，Yoga 是否成立可由盘面机械判定，但「主何成就、主吉主凶」的叙述属历史传承的象征解释，不同流派在触发条件与豁免规则上分歧较大。命律只自动化可确定性判定的部分。" },
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
        { kind: 'list', items: ["误解：Yoga 就是身心锻炼的瑜伽。澄清：此处 Yoga 指星盘格局组合，与身心瑜伽无关。", "误解：命中某 Yoga 就一定有相应成就。澄清：Yoga 成立是结构事实，「主何成就」是传统解释，不能推出单点结论。", "误解：所有 Yoga 都能自动判定。澄清：规则分歧大的 Yoga（如落陷取消）需人工终审，不可臆造。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["可由 D1 确定性推导的 Yoga 触发条件，属可核验层；本站按确定性清单自动化。", "Yoga 的吉凶叙述与豁免规则源自《Brihat Parashara Hora Shastra》等古典传承，具体口径出处待考；分歧项显式列为待终审。"] },
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
        { kind: 'list', items: ["一查：是否给出 Yoga 的具体触发条件，缺条件无法复核。", "二查：是否把「Yoga 成立」与「Yoga 主吉凶」混为一谈。", "三查：是否由某 Yoga 直接断言成就或事件——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘只自动化可由 D1 确定性推导的 Yoga，每条输出触发条件、传统依据与局限说明；对规则分歧大、未自动化的条目，显式列为「待命理顾问终审」，不做臆造，也不据此作吉凶判断。" },
      ],
    },
  ],
  sources: [
    { text: "可由 D1 确定性推导的 Yoga 触发条件属可核验层；本站按确定性清单自动化。", confidence: 'verified' },
    { text: "Yoga 的吉凶叙述与豁免规则源自古典传承，具体口径出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-dosha-intro", "vedic-graha-intro", "vedic-rasi-intro", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
