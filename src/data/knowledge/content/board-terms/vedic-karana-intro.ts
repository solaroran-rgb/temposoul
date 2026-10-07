/**
 * T-18 切片C · WP-18 十段词条：卡拉纳 Karana 入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-karana-intro",
  title: "卡拉纳 Karana 入门：太阴日的半日划分",
  metaDescription: "Karana 把一个 Tithi（12°）均分为两半，每半 6°，一个朔望月共六十个 Karana。本文梳理其划分、十一名称的循环规则与可复算边界。",
  h1: "卡拉纳 Karana 入门：太阴日的半日划分",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Karana", "卡拉纳", "太阴日"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Karana（音译「卡拉纳」）是 Tithi（太阴日）的半日划分：一个 Tithi 对应日月黄经差 12°，把它从中间均分，前后各 6°，每一半就是一个 Karana。由此一个朔望月（30 个 Tithi）共合 60 个 Karana。它与 Tithi 同源，都是月亮相对太阳相位进度的时间单位，只是刻度更细一半。" },
        { kind: 'paragraph', text: "Karana 的几何划分可精确复算：给出日月黄经差即可算出当前落在第几个 6° 区间。它沿用十一个名称，其中七个名称在朔望月中循环出现，另四个为固定 Karana，只在特定位置出现。七个循环 Karana 名称反复排列、四个固定 Karana 首尾定位，凑满 60 个；各 Karana 的吉凶属性与守护神属传统层。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：求所求时刻月亮与太阳的恒星黄经。", "第二步：算月亮黄经减太阳黄经，取 0–360° 内差值。", "第三步：将差值除以 6°，商数加 1，即得 Karana 序号（1–60）。", "第四步：按「七名称循环加四固定」的固定排列，把序号对应到 Karana 名称。", "第五步：记录 Karana 序号与名称，与所属 Tithi 一并标注。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["对照项", "Karana 卡拉纳", "Tithi 太阴日"],
          rows: [
            ["度量对象", "日月黄经差的半段", "日月黄经差的整段"],
            ["单位跨度", "每段 6°", "每段 12°"],
            ["一个朔望月数量", "60 个", "30 个"],
            ["名称规则", "七循环加四固定共十一名", "按序号 1–30 命名"],
            ["可复算性", "黄经差对 6° 区间可复算", "黄经差对 12° 区间可复算"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀择日体系中，十一 Karana 各被赋予不同的吉凶倾向与守护神，常用于判断某一时段适合起何种事务。七个循环 Karana 与四个固定 Karana 的属性划分，是古典择日传承的一部分。" },
        { kind: 'paragraph', text: "此为传统命理观点，Karana 的 6° 划分与六十区间可复算，但「某 Karana 宜某事、主吉凶」的解释及其守护神归属属历史传承的象征体系，不能据此预测具体事件。" },
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
        { kind: 'list', items: ["误解：Karana 是一种独立的天体。澄清：它是日月相位的半日刻度，不是天上某颗星。", "误解：六十个 Karana 名称各不相同。澄清：只有十一个名称，其中七个循环重复、四个固定，凑成六十区间。", "误解：某 Karana 时段就一定适合做某事。澄清：吉凶倾向是传统择日说法，不能据此推出具体事件结果。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["一个 Tithi 均分两个 Karana、各 6°、一朔望月合 60 个 Karana 的划分可据日月黄经差精确复算，属可核验层。", "十一 Karana 名称（七循环加四固定）的吉凶属性与守护神归属源自古典择日传承，具体释义出处待考。"] },
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
        { kind: 'list', items: ["一查：是否说明 Karana 是 Tithi 的半日、每段 6°、一朔望月六十个。", "二查：是否区分了「七循环加四固定」的名称规则与传统吉凶属性。", "三查：是否由某 Karana 直接断言具体事务成败——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘按日月黄经差输出当前 Karana 序号与名称，并标注为可复算的相位区间结果；对 Karana 的传统吉凶倾向与守护神仅作分层展示，注明属民俗择日说法，与 Tithi、Nakshatra 分别标注以免刻度混淆。" },
      ],
    },
  ],
  sources: [
    { text: "一个 Tithi 均分两个 Karana、各 6°、一朔望月合 60 个 Karana 的划分可据日月黄经差精确复算，属可核验层。", confidence: 'verified' },
    { text: "十一 Karana 名称的吉凶属性与守护神归属源自古典择日传承，具体释义出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-tithi-intro", "vedic-nakshatra-intro", "vedic-dasha-intro"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
