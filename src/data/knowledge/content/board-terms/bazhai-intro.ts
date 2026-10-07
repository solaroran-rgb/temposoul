/**
 * T-10 回炉 · WP-18 十段词条：八宅入门：东西四宅与游年九星
 * 板块：bazhai（/fengshui/bazhai）｜引擎：@temposoul/core/bazhai
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "bazhai-intro",
  title: "八宅入门：东西四宅与游年九星",
  metaDescription: "八宅以坐向分东西四宅，以游年九星论八方吉凶。本文梳理东西四命、游年与当代边界。",
  h1: "八宅入门：东西四宅与游年九星",
  category: "fengshui",
  tags: ["八宅", "风水", "东西四宅"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "八宅是阳宅风水中最简明的一支。它先把住宅按坐向分为「东四宅」与「西四宅」两类：坐东、南、北、东南者为东四宅，坐西、西南、西北、东北者为西四宅；再把人按出生年份换算为「东四命」或「西四命」，主张命宅相配。" },
        { kind: 'paragraph', text: "在此之上，八宅用「游年九星」（生气、延年、天医、伏位为四吉，绝命、五鬼、六煞、祸害为四凶，加中宫辅弼）按固定翻卦次序布入八方，得出每方的吉凶标记，用于门、主、灶的取向。八宅的规则高度固定，属于风水体系中「易学难精」里最容易学的一支，也因此信息粒度较粗。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定住宅坐向（以大门或主体朝向为准，各家取法不同）。", "第二步：据坐向归为东四宅或西四宅。", "第三步：据出生年份与性别换算命卦，归为东四命或西四命。", "第四步：按游年翻卦次序把九星布入八方。", "第五步：读各方的吉凶标记，用于门、主、灶的取向参考。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["星", "归类", "传统意象"],
          rows: [
            ["生气", "四吉", "生旺、进取"],
            ["延年", "四吉", "和睦、长久"],
            ["天医", "四吉", "安稳、助力"],
            ["伏位", "四吉", "平稳、守成"],
            ["绝命", "四凶", "破败、耗损"],
            ["五鬼", "四凶", "是非、变动"],
            ["六煞", "四凶", "口舌、阻滞"],
            ["祸害", "四凶", "损耗、不和"],
            ["辅弼", "中宫", "居中无方位"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，八宅被用来判断门、主、灶三者的配合，四吉方宜开门设灶、四凶方宜作厕或储物。这套规则在明清阳宅书中定型较早，但在坐向取法与命卦换算上，不同传承之间存在差异。" },
        { kind: 'paragraph', text: "此为传统命理观点，八宅的吉凶方位标记属于传统风水评价体系，不是可验证的物理事实。它不涉及建筑结构安全、采光通风等现代居住品质的客观指标。命律呈现坐向判定与九星分布的计算结果，并把吉凶释义标注为传统说法。" },
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
        { kind: 'list', items: ["误解：八宅可以替代建筑与环境层面的居住评估。澄清：八宅属传统评价体系，与采光、通风、结构安全等客观指标无关。", "误解：坐向取法各家一致。澄清：以大门还是以主体朝向为准，各传承取法不同。", "误解：四凶方就一定不能用。澄清：传统上四凶方也有「宜作厕、宜储物」的用法，单看标签不构成结论。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["《阳宅十书》《八宅明镜》等传世阳宅书：坐向取法与命卦换算各本不一，相关细节出处待考。", "坐向归类、命卦换算与九星翻卦布方可按本文步骤复算；吉凶释义属民俗层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否标明了坐向的取法依据。", "二查：是否把吉凶方位当成了居住品质的客观指标。", "三查：是否出现改运、化解类的效果承诺——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的八宅页以坐向（或门向度数）与出生信息为输入，输出东四宅/西四宅的归类、命卦与九星八方分布，并披露所用取法口径。解释部分区分可复算的方位数据与传统的吉凶释义，后者标注为传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "《阳宅十书》《八宅明镜》等传世阳宅书：坐向取法与命卦换算各本不一，相关细节出处待考。", confidence: 'legendary' },
    { text: "坐向归类、命卦换算与九星翻卦布方可按本文步骤复算；吉凶释义属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/bazhai",
    exports: ["analyzeBaZhai", "analyzeBaZhaiByDoorDegree"],
    note: "与 /fengshui/bazhai 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：bazhai排盘", url: "/fengshui/bazhai" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["xuankong-intro", "residential-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
