/**
 * T-10B · WP-18 十段词条：九分盘 Navamsa（D9）入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-navamsa-intro",
  title: "九分盘 Navamsa（D9）入门：把一宫细分为九份",
  metaDescription: "Navamsa 是吠陀最常用的分盘：每个 Rasi 30° 再九等分，每份 3°20′，共 108 份。本文梳理 D9 的起法与传统用途边界。",
  h1: "九分盘 Navamsa（D9）入门：把一宫细分为九份",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Navamsa", "D9", "分盘"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Navamsa（音译「纳瓦姆」，意为「九份」）是吠陀占星中最重要的分盘之一，记作 D9。它把每一个 Rasi 的 30° 再均分为九份，每份 3°20′（3.3333°），全盘十二宫合计 108 份。出生时各 Graha 落在 D9 的哪一份，构成一张独立于主盘 D1 的副盘。" },
        { kind: 'paragraph', text: "在传统用法中，D9 被认为用于「核验」主盘行星的强弱与看婚姻、福泽等深层主题。但 D9 的换算规则是纯几何等分，可精确复算；「D9 看婚姻」的用途则是后世流派赋予的解释，属于象征层。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：取得主盘 D1 中每颗 Graha 的恒星黄经。", "第二步：对每颗星，先定其所在 Rasi（每 30° 一段）。", "第三步：计算该星在本宫内已走过的度数，除以 3°20′，得到它在本宫内的第几份（1–9）。", "第四步：按该 Rasi 的起始宫顺序，数九份对应的宫位，即为该星在 D9 中的落座。", "第五步：把全部 Graha 的 D9 落座汇总，画出 D9 分盘。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ['盘', '划分粒度', '份数', '传统用途'],
          rows: [
            ['D1 主盘 Rasi', '每宫 30°', '12 宫', '整体命局基础'],
            ['D9 Navamsa', '每宫 3°20′', '108 份', '核验强弱、婚姻福泽'],
            ['D2 Hora', '每宫二分', '—', '财富（流派差异大）'],
            ['D12 Dwadasamsa', '每宫十二分', '—', '父母谱系'],
            ['D60 Shashtiamsa', '每宫六十分', '—', '极细分盘（较少自动化）'],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀解读中，有「D1 是果实，D9 是花」之类的说法，意谓主盘给出大致轮廓，D9 用来判断其内在质地与能否落实。D9 中行星的落座常被与婚姻配偶、晚年福泽等主题相联系，古典文献对此着墨颇多。" },
        { kind: 'paragraph', text: "此为传统命理观点，D9 的几何换算可复算，但其「主婚姻、主福泽」的解读属历史传承的象征体系，不同流派对 D9 与 D1 的权重关系说法不一。命律在呈现时区分可复算的分盘坐标与传统解释。" },
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
        { kind: 'list', items: ["误解：D9 是另一套独立的星盘。澄清：D9 由 D1 按固定几何规则换算而来，不是重新观测，主盘与分盘必须配对解读。", "误解：D9 专看婚姻，结论直接可用。澄清：D9 看婚姻是传统流派用途，属象征解释，不能推出婚姻的具体时间或结果。", "误解：分盘越多越准。澄清：分盘是不同粒度的切片，细分盘规则流派分歧大，盲目叠加不会提高可核验性。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["Navamsa 每宫九等分、每份 3°20′ 的换算规则可据 D1 黄经精确复算，属可核验层。", "「D9 主婚姻福泽」的用途源自《Brihat Parashara Hora Shastra》等古典传承，具体解读口径出处待考，本文不标单一权威结论。"] },
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
        { kind: 'list', items: ["一查：是否给出 D9 的具体换算规则（每份 3°20′），缺规则的分盘无法复算。", "二查：是否把「分盘坐标」与「婚姻福泽解释」混为一谈。", "三查：是否出现由 D9 直接断言婚姻或事件的表述——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘在主盘 D1 之外，按固定规则输出 D9 分盘的各星落座坐标，并标注其为可复算的几何换算；传统用途说明单独分层，标注为古典传承的象征说法，不作婚姻或福泽的具体断言。" },
      ],
    },
  ],
  sources: [
    { text: "Navamsa 每宫九等分、每份 3°20′ 的换算规则可据 D1 黄经精确复算，属可核验层。", confidence: 'verified' },
    { text: "「D9 主婚姻福泽」的用途源自古典传承，解读口径出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-divisional-intro", "vedic-rasi-intro", "why-folk-vs-fact", "why-confidence"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
