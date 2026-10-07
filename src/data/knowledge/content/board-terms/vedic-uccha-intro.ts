/**
 * T-18B · WP-18 十段词条：吠陀行星旺弱入门
 * 板块：paipan（Vedic 尊贵）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-uccha-intro",
  title: "吠陀行星旺弱入门：尊贵、失势与分界点",
  metaDescription: "吠陀占星中每颗行星在特定星座为尊贵（Uccha）或失势（Neecha），并有精确的度数分界。本文梳理行星旺弱表与传统判断边界。",
  h1: "吠陀行星旺弱入门：尊贵、失势与分界点",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Uccha", "Neecha", "尊贵", "失势", "旺弱"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "吠陀占星中，每颗行星在黄道十二宫的特定位置处于尊贵（Uccha，旺）或失势（Neecha，弱）状态。例如太阳在白羊 10° 为尊贵巅峰、在天秤 10° 为失势最低点；月亮在金牛 5° 为尊贵、在天蝎 5° 为失势。每颗行星的尊贵与失势宫位相隔正好 180°（对宫），且有精确的巅峰度数。" },
        { kind: 'paragraph', text: "行星尊贵与失势的宫位及度数是固定的对照表，可按行星黄经查表确定，属可复算层。但「行星旺则力强、弱则力衰」的判断以及由旺弱推得的运势解释属传统占星层。此外还有「友星/敌星」之分（每颗行星对其他行星有友敌关系），进一步细化行星力量评估。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：确定出生盘中每颗行星的恒星黄经。", "第二步：查行星旺弱表，确认该行星所在星座是否为尊贵宫或失势宫。", "第三步：读取行星在该宫内的具体度数，判断是否接近巅峰度（如太阳白羊10°）。", "第四步：如需更细，再查该行星的友星敌星关系表。", "第五步：将旺弱状态标注为排盘数据，供传统解读参考。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["行星", "尊贵宫（Uccha）", "失势宫（Neecha）"],
          rows: [
            ["太阳", "白羊座（10°巅峰）", "天秤座（10°最低）"],
            ["月亮", "金牛座（5°巅峰）", "天蝎座（5°最低）"],
            ["火星", "摩羯座（28°巅峰）", "巨蟹座（28°最低）"],
            ["水星", "处女座（15°巅峰）", "双鱼座（15°最低）"],
            ["木星", "巨蟹座（5°巅峰）", "摩羯座（5°最低）"],
            ["金星", "双鱼座（27°巅峰）", "处女座（27°最低）"],
            ["土星", "天秤座（20°巅峰）", "白羊座（20°最低）"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "行星旺弱体系在吠陀经典中有明确记载，传统认为尊贵行星力量充盈、表现顺畅，失势行星力量受阻、表现内敛。此外还有「Neecha Bhanga」（失势消解）的特殊规则：当某些条件满足时，失势可被中和甚至反转。行星友敌关系则用于评估行星在合相时的互动质量。这些规则是吠陀力量评估的重要组成。" },
        { kind: 'paragraph', text: "此为传统命理观点，行星旺弱的宫位与度数对照表是固定的可复算数据，但「旺行星主吉、弱行星主凶」的判断及 Neecha Bhanga 的效果解释属历史传承的占星体系，不能据此预测具体事件。" },
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
        { kind: 'list', items: ["误解：失势行星一定不好。澄清：失势只是力量状态的传统标记，传统读法中失势亦可转化，且需全盘综合看。", "误解：旺弱只看星座不看度数。澄清：每颗行星有精确的巅峰度数，越接近巅峰力量越强。", "误解：罗睺计都也用同一套旺弱表。澄清：罗睺计都为交点推算点，其旺弱宫位与实体行星有差异，需按专门规则查。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["七颗实体行星（日月火水木金土）的尊贵宫、失势宫与巅峰度数对照表是固定数据，可按黄经查表复算，属可核验层。", "行星旺弱的吉凶解释、Neecha Bhanga 消解规则与友敌关系释义多属吠陀传统传承，具体出处待考。"] },
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
        { kind: 'list', items: ["一查：是否说明旺弱宫位与度数是固定对照表，可复算。", "二查：是否区分了旺弱查表数据层与吉凶判断层。", "三查：是否由行星旺弱直接断言运势好坏——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘按旺弱表输出每颗行星的尊贵或失势状态及接近巅峰度的距离，标注为可复算的查表结果；旺弱的吉凶解释分层展示，注明属传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "七颗实体行星的尊贵宫、失势宫与巅峰度数对照表是固定数据，可按黄经查表复算，属可核验层。", confidence: 'verified' },
    { text: "行星旺弱吉凶解释、Neecha Bhanga 消解规则与友敌关系释义多属吠陀传统传承，具体出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-graha-intro", "vedic-rasi-intro", "vedic-bhava-intro", "vedic-yoga-intro"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
