/**
 * T-10B · WP-18 十段词条：上升点 Lagna（命宫）入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-lagna-intro",
  title: "上升点 Lagna 入门：命宫与十二宫的起点",
  metaDescription: "Lagna（上升点）是出生时刻东方地平线升起的黄道点，为吠陀命盘十二宫的起点。本文梳理其起法与时间地点敏感性。",
  h1: "上升点 Lagna 入门：命宫与十二宫的起点",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Lagna", "上升点", "命宫"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Lagna（常译「上升点」或「命宫起点」）指出生时刻出生地东方地平线与黄道的交点。它是吠陀命盘十二宫（Bhava）划分的起点：从 Lagna 所在度数起，按顺序划分十二个宫位。Lagna 所在的 Rasi 称为「上升星座」或「命宫星座」。" },
        { kind: 'paragraph', text: "与七政（日月五星）不同，Lagna 不是天体，而是由出生时刻与经纬度推算出的地平点，因此它对出生时间与地点极度敏感——时间误差几分钟，上升点就可能跨入相邻的宫位。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：精确确定出生时刻（含真太阳时校正）与出生地经纬度。", "第二步：按天文算法计算该时刻东方地平线与黄道的交点黄经。", "第三步：将该交点换算到恒星黄道（减 Ayanamsa），得到 Lagna 的恒星黄经。", "第四步：据 Lagna 黄经定其所在 Rasi。", "第五步：从 Lagna 起顺序划分十二宫，再落定各 Graha 的宫位。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["要素", "性质", "敏感项"],
          rows: [
            ["Lagna 上升点", "地平线与黄道交点（推算点）", "出生时刻、经纬度"],
            ["Rasi 落座", "上升点所在黄道宫", "Ayanamsa 口径"],
            ["十二宫 Bhava", "从 Lagna 起划分", "宫位制（流派差异）"],
            ["七曜位置", "天体真实黄经", "时刻误差"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀解读中，Lagna 被视为命盘的「外壳」，代表个体向外呈现的状态与身体倾向；上升星座与命宫内的星被认为对整体格局影响很大。古典文献把 Lagna 放在优先位置。" },
        { kind: 'paragraph', text: "此为传统命理观点，Lagna 的几何位置可据出生时刻与经纬度复算，但「上升主外貌与命运走向」的解释属历史传承的象征体系。时间不准时上升点可能错宫，结论便失去依托。" },
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
        { kind: 'list', items: ["误解：上升点是一颗真实星星。澄清：它是地平线与黄道的推算交点，不是天体。", "误解：不知道精确出生时辰也能准确看上升。澄清：上升点对时刻极敏感，时辰模糊则上升落宫不可靠。", "误解：上升星座等于西洋太阳星座。澄清：上升是地平线点，太阳是实际天体，两者是不同坐标。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["Lagna 作为地平与黄道交点的位置，可据出生时刻与经纬度天文复算，属可核验层。", "「上升主外貌与命运走向」的解读源自《Brihat Parashara Hora Shastra》等古典传承，具体口径出处待考。"] },
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
        { kind: 'list', items: ["一查：是否要求精确出生时刻与地点，缺此上升点不可靠。", "二查：是否区分了「上升点（推算交点）」与「太阳（天体）」。", "三查：是否由上升点直接断言外貌或命运——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘在缺省时刻时显式提示上升点不可靠；给出 Lagna 度数、所在 Rasi 与十二宫划分，并标注其为可复算的地平推算结果。上升象征含义单独分层，标注为传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "Lagna 作为地平与黄道交点的位置可据出生时刻与经纬度天文复算，属可核验层。", confidence: 'verified' },
    { text: "「上升主外貌与命运走向」的解读源自古典传承，具体口径出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-bhava-intro", "vedic-rasi-intro", "paipan-true-solar-time", "why-confidence"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
