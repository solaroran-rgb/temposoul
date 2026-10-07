/**
 * T-18 · WP-18 十段词条：太阴日 Tithi 入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-tithi-intro",
  title: "太阴日 Tithi 入门：月亮与太阳的三十段相位",
  metaDescription: "Tithi 是月亮相对太阳的黄经差单位，每 12° 为一段，30 段合成一个朔望月。本文梳理 Tithi 的划分、盈亏月与可复算边界。",
  h1: "太阴日 Tithi 入门：月亮与太阳的三十段相位",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Tithi", "太阴日", "月相"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Tithi（音译「提提」，常译「太阴日」）以月亮相对太阳的黄经差划分时间：日月黄经差每 12° 为一段，30 段合一个朔望月（约 29.53 天）。它衡量的不是月亮在星空的固定位置，而是月亮相对太阳的相位进度，因此与公历日、恒星日都不是一回事。" },
        { kind: 'paragraph', text: "Tithi 的几何划分可精确复算：任意时刻给出日月黄经即可算出落在第几段。它与吠陀二十七宿（Nakshatra）互补——Nakshatra 看月亮落在哪段恒星背景，Tithi 看月亮与太阳拉开了多少角度；传统层对每段 Tithi 赋予的守护神与吉凶属性则属传承说法。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：求出生或择时时刻月亮的恒星黄经。", "第二步：求同一时刻太阳的恒星黄经。", "第三步：计算月亮黄经减太阳黄经，取 0–360° 内的差值。", "第四步：将差值除以 12°，商数加 1，即得 Tithi 序号（1–30）。", "第五步：序号 1–15 记盈月（Shukla Paksha），16–30 记亏月（Krishna Paksha）。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["对照项", "Tithi 太阴日", "Nakshatra 二十七宿"],
          rows: [
            ["度量对象", "月亮与太阳的黄经差", "月亮在恒星背景的宿位"],
            ["单位", "每段 12°，共 30 段", "每段 13°20′，共 27 段"],
            ["周期", "朔望月约 29.53 天", "恒星月约 27.32 天"],
            ["关键节点", "第 1 段近朔、第 15 段近望", "生宿即月亮所在宿"],
            ["可复算性", "日月黄经差可直接计算", "月亮黄经对宿度可直接计算"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统体系中，30 个 Tithi 各有守护神与吉凶属性，常被用于择日、斋戒与仪式时机：例如第 11 段 Ekadashi 被传统视为斋戒日，第 30 段新月夜与第 15 段满月夜被赋予特殊意义。部分流派还按出生日 Tithi 参与判断性格与运势。" },
        { kind: 'paragraph', text: "此为传统命理观点，Tithi 的几何划分可复算，但「某段主吉某段主凶」「Ekadashi 宜斋戒」等解释属历史传承的象征体系，不能据此预测具体事件。" },
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
        { kind: 'list', items: ["误解：Tithi 就是农历日或公历日。澄清：Tithi 是日月相位单位，长度约为 0.98 天，农历日按月相定日序与之相关但不同，公历日与相位无关。", "误解：Tithi 第 15 段必然是满月当天。澄清：第 15 段是「近望」的相位区间，满月精确时刻落在其中某时刻，二者不能划等号。", "误解：30 个 Tithi 的长度相等。澄清：月亮绕行速度有快慢，各段时长在 0.9–1.0 天之间浮动，序号是几何等分的约定。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["Tithi 每段 12°、30 段合一个朔望月的划分可据日月黄经精确复算，属可核验层。", "各 Tithi 的守护神、吉凶属性与择日用法源自古典历法传承，具体释义出处待考。"] },
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
        { kind: 'list', items: ["一查：是否说明 Tithi 是日月黄经差每 12° 一段的几何划分。", "二查：是否给出序号 1–30、盈亏月分界的可复算规则。", "三查：是否由某段 Tithi 直接断言吉凶事件——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘按日月黄经输出出生时刻的 Tithi 序号与盈亏月归属，并标注为可复算的相位结果；对 Tithi 的传统属性仅作分层展示，注明属民俗说法。择日语境中若涉及 Tithi，同样与黄历建除等体系分开标注，避免体系混用。" },
      ],
    },
  ],
  sources: [
    { text: "Tithi 每段 12°、30 段合一个朔望月的划分可据日月黄经精确复算，属可核验层。", confidence: 'verified' },
    { text: "各 Tithi 的守护神、吉凶属性与择日用法源自古典历法传承，具体释义出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-nakshatra-intro", "vedic-dasha-intro", "vedic-graha-intro", "qizheng-intro"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
