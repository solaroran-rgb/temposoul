/**
 * T-10B · WP-18 十段词条：岁差 Ayanamsa 入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-ayanamsa-intro",
  title: "岁差 Ayanamsa 入门：恒星黄道与回归黄道的差",
  metaDescription: "Ayanamsa 是回归黄经与恒星黄经之差，因地球自转轴进动产生。本文梳理其天文原理与吠陀采用的 Lahiri 口径。",
  h1: "岁差 Ayanamsa 入门：恒星黄道与回归黄道的差",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Ayanamsa", "岁差", "Lahiri"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Ayanamsa（音译「阿衍」，常译「岁差」）指回归黄经与恒星黄经之间的差值。地球自转轴存在约 25,772 年周期的进动，使春分点相对恒星背景缓慢西移，约每年 50.29 角秒。因此同一天体在「以春分点为 0° 的回归黄道」与「以固定恒星为基准的恒星黄道」下，黄经并不相同。" },
        { kind: 'paragraph', text: "吠陀占星采用恒星黄经，主流口径为 Lahiri（Chitrapaksha）；另有 Raman、Krishnamurti 等体系，彼此可差 1° 以上。换算关系为：恒星黄经 = 回归黄经 − Ayanamsa（模 360°）。岁差本身是已验证的天文现象。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：按天文算法求所求时刻天体的回归黄经。", "第二步：选定 Ayanamsa 体系（本站采用 Lahiri）。", "第三步：按该体系的锚点公式求该时刻的 Ayanamsa 数值。", "第四步：恒星黄经 = 回归黄经 − Ayanamsa（模 360°）。", "第五步：据恒星黄经定各 Graha 所在 Rasi。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["体系", "黄道基准", "Ayanamsa", "落座差异"],
          rows: [
            ["西洋占星", "回归黄道（春分点 0°）", "取 0", "以春分点为白羊 0°"],
            ["吠陀 Lahiri", "恒星黄道", "约 23.85°（J2000 锚点）", "较回归落座退后约 24°"],
            ["七政四余", "回归/宿度体系为主", "口径各异", "与吠陀恒星口径不同"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀传承中，坚持恒星黄道被认为是「与星宿实测对齐」的正宗做法；不同 Ayanamsa 体系的选择，历史上伴随着流派之争。吠陀星家认为，采用不同岁差会导致星体落座结果不同。" },
        { kind: 'paragraph', text: "此为传统命理观点，岁差现象本身是可验证的天文事实，但「采用哪种 Ayanamsa 才算正宗」属流派选择，会改变落座结果，不涉及吉凶真伪。命律仅提供 Lahiri 一种口径，并显式标注。" },
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
        { kind: 'list', items: ["误解：吠陀与西洋星座不同是因为算出了不同的星。澄清：天体位置相同，差异来自黄道基准（恒星 vs 回归）与 Ayanamsa。", "误解：Ayanamsa 是固定常数。澄清：它随时间按进动率逐年变化，需按所求时刻计算。", "误解：选哪个 Ayanamsa 决定准不准。澄清：它只决定坐标对齐口径，不提高预测效力。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["岁差（约每年 50.29″、周期约 25,772 年）属 IAU 已验证天文理论，可精确计算，属可核验层。", "Lahiri 等各 Ayanamsa 体系的选择属流派约定；本站采用 Lahiri（J2000 锚点 23°51′11.5″），具体流派争议出处待考。"] },
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
        { kind: 'list', items: ["一查：是否标明所用 Ayanamsa 体系，缺口径的落座结果无法核对。", "二查：是否区分了「岁差天文事实」与「流派口径选择」。", "三查：是否把选 Ayanamsa 渲染成决定命运准度——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘固定采用 Lahiri 恒星黄道，并在结果中披露锚点与换算公式；同时说明西洋回归黄道 Ayanamsa 取 0，二者落座差异来自坐标系，而非天体不同。页面不就不同体系的吉凶高下作判断。" },
      ],
    },
  ],
  sources: [
    { text: "岁差（约每年 50.29″、周期约 25,772 年）属 IAU 已验证天文理论，可精确计算，属可核验层。", confidence: 'verified' },
    { text: "Lahiri 等 Ayanamsa 体系的选择属流派约定；流派争议出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-rasi-intro", "vedic-graha-intro", "paipan-jieqi", "why-confidence"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
