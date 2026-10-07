/**
 * T-10B · WP-18 十段词条：二十七宿 Nakshatra 入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-nakshatra-intro",
  title: "二十七宿 Nakshatra 入门：月亮的二十七段宿度",
  metaDescription: "Nakshatra 把黄道等分为 27 段（每段 13°20′），是吠陀大运起算的锚点。本文梳理二十七宿的划分、守护星与边界。",
  h1: "二十七宿 Nakshatra 入门：月亮的二十七段宿度",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Nakshatra", "二十七宿", "月宿"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Nakshatra（音译「 Nakshatra」，常译「月宿」或「二十七宿」）把 360° 黄道等分为 27 段，每段 13°20′（13.3333°）；每段再分 4 拍（Pada），每拍 3°20′，全盘共 108 拍。它以月亮为主要观测对象：出生时月亮所在的宿称 Janma Nakshatra（生宿）。" },
        { kind: 'paragraph', text: "二十七宿与中国二十八宿表面相似，实为两套体系：吠陀二十七宿是严格等分的坐标约定，中国二十八宿按距星实测划定、各宿跨度不等，二者不可直接互换。二十七宿的等分划分可精确复算；其守护星与象征含义属传统层。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：求出生时刻月亮的恒星黄经。", "第二步：将黄经除以 13°20′，得到月亮落在第几宿（1–27）。", "第三步：计算月亮在该宿内已走过的比例，用于起大运的余量。", "第四步：按该宿的守护星表，确定首运主星。", "第五步：记录生宿、所在拍（Pada）与守护星，作为大运起算输入。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["对照项", "吠陀二十七宿", "中国二十八宿"],
          rows: [
            ["划分方式", "27 段严格等分", "按距星实测，跨度不等"],
            ["每段跨度", "13°20′", "各宿不同"],
            ["观测重点", "月亮", "日月五星行踪"],
            ["守护星", "九曜循环", "无对应守护星制"],
            ["可复算性", "等分坐标可复算", "宿界按实测坐标可换算"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀体系中，二十七宿各有守护星，按 Ketu→金星→太阳→月亮→火星→罗睺→木星→土星→水星的九曜循环排列；生宿的守护星被认为决定人生第一段大运的主星。二十七宿也被用于择时与人事对照。" },
        { kind: 'paragraph', text: "此为传统命理观点，二十七宿的等分划分可复算，但守护星循环与「生宿定首运」的解释属历史传承的象征体系，不能据此预测具体事件。" },
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
        { kind: 'list', items: ["误解：吠陀二十七宿就是中国二十八宿。澄清：前者是 27 等分坐标，后者按距星实测不等分，体系不同。", "误解：生宿决定了一生命运。澄清：生宿只是大运起算的锚点，传统上给时间周期起点，不是命运定论。", "误解：二十七宿是 27 颗真实恒星。澄清：它是黄道上的 27 段坐标，不等同于具体星群。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["二十七宿每段 13°20′ 的等分划分可据月亮黄经精确复算，属可核验层。", "二十七宿守护星循环与生宿起运法源自《Brihat Parashara Hora Shastra》等古典传承，具体释义出处待考。"] },
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
        { kind: 'list', items: ["一查：是否说明二十七宿是 27 等分坐标，而非中国二十八宿。", "二查：是否给出月亮黄经换算宿位的规则（13°20′）。", "三查：是否由生宿直接断言命运或事件——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘按严格等分输出月亮所在宿、所在拍与守护星，并标注为可复算的坐标结果；与七政四余盘的真实宿界（按距星实测换算）分别标注，避免两套宿制混淆。生宿起运的解释单独分层，标注为传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "二十七宿每段 13°20′ 的等分划分可据月亮黄经精确复算，属可核验层。", confidence: 'verified' },
    { text: "二十七宿守护星循环与生宿起运法源自古典传承，释义出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-dasha-intro", "vedic-graha-intro", "qizheng-intro", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
