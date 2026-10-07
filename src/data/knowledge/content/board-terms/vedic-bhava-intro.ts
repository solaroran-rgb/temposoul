/**
 * T-10B · WP-18 十段词条：十二宫 Bhava 入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-bhava-intro",
  title: "十二宫 Bhava 入门：从上升点划分的人生领域",
  metaDescription: "Bhava 是吠陀的十二宫，从 Lagna 起划分，每宫传统对应一类人生领域。本文梳理宫位起法与主题归属边界。",
  h1: "十二宫 Bhava 入门：从上升点划分的人生领域",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Bhava", "十二宫", "宫位"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Bhava（音译「婆婆」，常译「宫」或「宫位」）是吠陀占星从上升点 Lagna 起、按顺序划分的十二个宫位。它与 Rasi（黄道星座）是两套坐标：Rasi 按黄道 30° 等分，Bhava 按出生时刻的上升点起划。某 Graha 落在第几宫，即它处于哪个 Bhava。" },
        { kind: 'paragraph', text: "传统上每个 Bhava 对应一类人生领域，例如第 1 宫（Lagna 宫）主自我与身体，第 2 宫主财富与言语，第 7 宫主伴侣，第 10 宫主事业等。宫位划分的起点是可复算的上升点；「某宫主何领域」的主题归属则是传统象征层。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：按出生时刻与经纬度求上升点 Lagna。", "第二步：从 Lagna 所在度数起，按所用宫位制划分十二个 Bhava。", "第三步：求各 Graha 的恒星黄经，判断其落入第几宫。", "第四步：据各宫主题表，标出每宫对应的传统领域。", "第五步：记录落宫、宫主星（该宫 Rasi 的守护曜）作为解读输入。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["Bhava", "序", "传统对应领域（要略）"],
          rows: [
            ["第 1 宫", "Lagna 宫", "自我、身体、外貌"],
            ["第 2 宫", "", "财富、言语、家庭"],
            ["第 4 宫", "", "家宅、母亲、内心"],
            ["第 7 宫", "", "伴侣、合作"],
            ["第 9 宫", "", "幸运、导师、远行"],
            ["第 10 宫", "", "事业、名望"],
            ["第 12 宫", "", "消耗、归隐"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀解读中，落于某宫的星被认为会影响该宫对应的人生领域，宫主星的强弱与位置也被纳入判断。十二宫主题的配对在古典文献中成套传承。" },
        { kind: 'paragraph', text: "此为传统命理观点，宫位划分的起点（上升点）可复算，但「某宫主何领域、落何星主何吉凶」的配对属历史传承的象征体系，不同流派对宫位制与主题权重说法不一。" },
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
        { kind: 'list', items: ["误解：Bhava 十二宫就是 Rasi 十二宫。澄清：Rasi 按黄道等分，Bhava 按上升点起划，是两套坐标。", "误解：某星落某宫就一定在该领域出事。澄清：宫位主题是传统配对，落宫只给倾向，不能推出具体事件。", "误解：宫位制是唯一的。澄清：整宫制、等分宫等不同宫位制会改变落宫结果，流派有别。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["宫位划分的起点（上升点 Lagna）可据出生时刻与经纬度复算，属可核验层。", "十二宫主题配对与宫主星判断源自《Brihat Parashara Hora Shastra》等古典传承，具体口径与宫位制选择出处待考。"] },
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
        { kind: 'list', items: ["一查：是否说明 Bhava 与 Rasi 是两套坐标，避免混为一谈。", "二查：是否标明所用宫位制（整宫/等分等）。", "三查：是否由落宫直接断言某领域事件——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘列出各 Graha 的落宫（Bhava）与宫主星，标注宫位划分起点为可复算的上升点；宫位主题配对单独分层，标注为传统说法，并提示不同宫位制会改变落宫结果，不据此作具体领域的事件断言。" },
      ],
    },
  ],
  sources: [
    { text: "宫位划分的起点（上升点 Lagna）可据出生时刻与经纬度复算，属可核验层。", confidence: 'verified' },
    { text: "十二宫主题配对与宫主星判断源自古典传承，具体口径与宫位制选择出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-lagna-intro", "vedic-rasi-intro", "vedic-yoga-intro", "why-confidence"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
