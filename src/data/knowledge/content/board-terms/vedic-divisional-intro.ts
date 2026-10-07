/**
 * T-10B · WP-18 十段词条：分盘体系 Divisional Charts 入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-divisional-intro",
  title: "分盘体系 Divisional Charts 入门：D1 到 D60",
  metaDescription: "吠陀把主盘按不同粒度再切分为多张分盘（D1/D9/D12/D60 等）。本文梳理分盘的起法逻辑与传统用途边界。",
  h1: "分盘体系 Divisional Charts 入门：D1 到 D60",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "分盘", "Divisional", "D9"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Divisional Charts（分盘）是吠陀占星把主盘 D1（Rasi 盘）按不同粒度再切分得到的一组副盘。常见的有 D1 主盘、D2 Hora、D3 Drekkana、D9 Navamsa、D12 Dwadasamsa、D30 Trimsamsa、D60 Shashtiamsa 等，编号 Dn 即把每个 Rasi 等分为 n 份。" },
        { kind: 'paragraph', text: "分盘的本质是同一组天体黄经在不同几何切片下的重新落座，全部可由 D1 精确换算，不需要重新观测。传统上每张分盘被赋予一个「主管主题」，但这些主题归属是流派解释，不是几何本身。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：先排出主盘 D1，取得各 Graha 的恒星黄经。", "第二步：选定要起的分盘 Dn，明确每份的角度（30°÷n）。", "第三步：对每颗星，计算它在本宫内落入第几份。", "第四步：按该分盘的宫位计数规则，换算出该星在分盘中的落座。", "第五步：汇总各星落座，画出该分盘；不同分盘之间必须与 D1 配对，不可孤立解读。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ['分盘', '每份角度', '传统主管主题（流派说法）'],
          rows: [
            ['D1 Rasi', '30°', '整体命局'],
            ['D9 Navamsa', '3°20′', '婚姻、福泽、强弱核验'],
            ['D12 Dwadasamsa', '2°30′', '父母、谱系'],
            ['D30 Trimsamsa', '1°', '困难与煞（流派分歧大）'],
            ['D60 Shashtiamsa', '0°30′', '极细果报（少自动化）'],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀解读中，分盘被视为「由粗到细」的逐层展开：D1 看大略，D9 看质地，更细分盘看极细微的果报。古典文献为每张分盘指派了主管领域，后世星家据此形成了「主盘定格局、分盘定细节」的读法。" },
        { kind: 'paragraph', text: "此为传统命理观点，分盘的几何换算可复算，但每张分盘「主管什么主题」的指派属历史传承的象征体系，不同流派对分盘数量与权重说法不一。命律只自动化可由 D1 确定性换算的分盘坐标。" },
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
        { kind: 'list', items: ["误解：分盘是独立观测出的另一张盘。澄清：分盘由 D1 按固定几何规则换算，必须与主盘配对。", "误解：分盘越多结论越准。澄清：细分盘规则流派分歧大，盲目叠加不提高可核验性。", "误解：某分盘主管某主题就可直接下判断。澄清：主题指派是传统解释，不能推出具体事件。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["分盘按 30°÷n 的几何换算可据 D1 黄经精确复算，属可核验层。", "各分盘主管主题的指派源自《Brihat Parashara Hora Shastra》等古典传承，具体口径出处待考；本站仅自动化确定性换算部分。"] },
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
        { kind: 'list', items: ["一查：是否给出分盘的换算规则（每份角度），缺规则无法复算。", "二查：是否把「分盘坐标」与「主管主题解释」混为一谈。", "三查：是否由某分盘直接断言具体事件——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘在主盘 D1 之外，按确定性规则输出 D9 等可换算分盘的落座坐标，并标注其为几何换算结果；传统主管主题仅作文化说明，不据此作事件断言。对规则分歧大、尚未自动化的细分盘，页面显式标注为待人工核验。" },
      ],
    },
  ],
  sources: [
    { text: "分盘按 30°÷n 的几何换算可据 D1 黄经精确复算，属可核验层。", confidence: 'verified' },
    { text: "各分盘主管主题的指派源自古典传承，具体口径出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-navamsa-intro", "vedic-rasi-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
