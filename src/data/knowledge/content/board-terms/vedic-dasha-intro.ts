/**
 * T-10B · WP-18 十段词条：Vimshottari 大运入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-dasha-intro",
  title: "Vimshottari 大运入门：以生宿起算的 120 年周期",
  metaDescription: "Vimshottari Dasha 以出生月宿守护星起算，九曜按固定年限循环，总周期 120 年。本文梳理其起法与时间边界。",
  h1: "Vimshottari 大运入门：以生宿起算的 120 年周期",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Dasha", "大运", "Vimshottari"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Vimshottari Dasha（常译「维摩泄利大运」，简称 Dasha）是吠陀占星的时间周期系统。它以出生月宿（Janma Nakshatra）的守护星为首运主星，按 Ketu→金星→太阳→月亮→火星→罗睺→木星→土星→水星的固定顺序循环排布九个大运（Mahadasha）。" },
        { kind: 'paragraph', text: "九曜年限分别为 Ketu 7、金星 20、太阳 6、月亮 10、火星 7、罗睺 18、木星 16、土星 19、水星 17 年，合计 120 年。每个大运内部再按同序分为九个小运（Antardasha）。这套年限与顺序是固定约定，可精确复算起止时刻。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定出生时刻与月亮黄经，确定生宿。", "第二步：按生宿守护星，确定首运主星。", "第三步：据月亮在该宿内已走过的比例，计算首运的剩余年限（balance）。", "第四步：按固定年限依次排出九个大运的起止时刻。", "第五步：在每个大运内，按大运年限×小运主星年限÷120 排出九个小运。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["体系", "起算锚点", "周期规则", "可复算性"],
          rows: [
            ["吠陀 Vimshottari", "生宿守护星", "九曜固定年限合计 120 年", "起止时刻可复算"],
            ["八字大运", "月柱阴阳顺逆", "每运十年，三天折一年", "起运岁数可复算"],
            ["七政四余限", "星曜行度宫位", "流派各异", "口径分歧大"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀解读中，不同大运主星被认为对应不同的人生主题阶段，例如某曜当运时被认为该曜的象征事项会被「激活」。这种「某运主吉/主凶」的叙述在古典传承中广为流传。" },
        { kind: 'paragraph', text: "此为传统命理观点，大运的年限与起止时刻可精确复算，但「某运主何吉凶主题」的叙述属历史传承的象征解释，不能据此预测具体事件。命律只输出可复算的时间序列。" },
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
        { kind: 'list', items: ["误解：Vimshottari 大运就是八字大运。澄清：两者起算锚点与年限规则完全不同，算法不通用。", "误解：某曜当运就一定发生某事。澄清：大运时间序列可复算，但「主吉主凶」是传统解释，不能推出单点事件。", "误解：大运从出生那天才开始。澄清：首运起点早于出生时刻，需按生宿余量回推。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["九曜固定年限合计 120 年、首尾相接的时间序列可据生宿精确复算，属可核验层。", "大运「主吉主凶主题」的叙述源自《Brihat Parashara Hora Shastra》等古典传承，具体解读出处待考。"] },
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
        { kind: 'list', items: ["一查：是否给出九曜固定年限与合计 120 年，缺此无法复算。", "二查：是否说明首运起点早于出生时刻（按生宿余量回推）。", "三查：是否由某运直接断言吉凶事件——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘按固定年限输出九个大运与小运的起止日期序列，保证首尾相接无断档，并标注为可复算的时间结果；「某运主题」的传统叙述仅作文化说明，不据此作任何预测或建议。" },
      ],
    },
  ],
  sources: [
    { text: "九曜固定年限合计 120 年、首尾相接的时间序列可据生宿精确复算，属可核验层。", confidence: 'verified' },
    { text: "大运「主吉主凶主题」的叙述源自古典传承，具体解读出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-nakshatra-intro", "vedic-rasi-intro", "dayun-overview", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
