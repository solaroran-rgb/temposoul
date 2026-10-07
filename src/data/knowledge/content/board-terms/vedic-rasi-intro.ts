/**
 * T-10B · WP-18 十段词条：吠陀十二宫 Rasi 入门：黄道星座与守护星
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-rasi-intro",
  title: "吠陀十二宫 Rasi 入门：黄道星座与守护星",
  metaDescription: "Rasi 即吠陀占星的黄道十二宫，每宫 30°，以恒星黄道为基准。本文梳理十二宫划分、守护星与可核验边界。",
  h1: "吠陀十二宫 Rasi 入门：黄道星座与守护星",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Rasi", "黄道十二宫"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Rasi（罗睺，常译「宫」或「星座」）是吠陀占星（Jyotish）对黄道十二段的称呼。吠陀把 360° 黄道均分为十二宫，每宫 30°，与西洋占星的十二宫在名称与顺序上对应，但基准不同：吠陀采用恒星黄道，西洋普遍采用回归黄道，两者因岁差（Ayanamsa）而错开约二十余度。" },
        { kind: 'paragraph', text: "每一个 Rasi 由一颗 Graha（曜）守护，并有传统上归属的元素与阴阳属性。行星落入某一 Rasi，即称「在某宫」或「居某座」。需要强调：Rasi 的度数划分是可天文复算的结构事实，而「某行星落某宫主何吉凶」的解读属传统象征层，二者在命律呈现时分开标注。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定出生时刻与地点，吠陀盘对时间精度敏感。", "第二步：求各天体的黄经（恒星黄经，需减去 Ayanamsa）。", "第三步：按每 30° 一段划分为十二个 Rasi，确定每颗 Graha 落入哪一宫。", "第四步：按各宫守护星表，标出该宫的守护曜。", "第五步：记录上升点（Lagna）所在的 Rasi，作为命宫起点。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["Rasi", "跨度", "守护曜", "传统元素"],
          rows: [
            ["Mesha 白羊", "0–30°", "Mangala 火星", "火"],
            ["Vrishabha 金牛", "30–60°", "Shukra 金星", "土"],
            ["Mithuna 双子", "60–90°", "Budha 水星", "风"],
            ["Karka 巨蟹", "90–120°", "Chandra 月亮", "水"],
            ["Simha 狮子", "120–150°", "Surya 太阳", "火"],
            ["Kanya 处女", "150–180°", "Budha 水星", "土"],
            ["Tula 天秤", "180–210°", "Shukra 金星", "风"],
            ["Vrishchika 天蝎", "210–240°", "Mangala 火星", "水"],
            ["Dhanu 射手", "240–270°", "Guru 木星", "火"],
            ["Makara 摩羯", "270–300°", "Shani 土星", "土"],
            ["Kumbha 水瓶", "300–330°", "Shani 土星", "风"],
            ["Meena 双鱼", "330–360°", "Guru 木星", "水"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀体系中，每颗 Graha 落入不同 Rasi 被认为带有不同的强弱与意味，例如某曜居其守护之宫称「本座」，居其旺升之宫称「擢升」，居对宫则称「落陷」。这些强弱标记在古典文献中被广泛用于判断行星的发挥程度。" },
        { kind: 'paragraph', text: "此为传统命理观点，Rasi 的度数划分可天文复算，但守护星归属与强弱判断属历史传承的象征体系，不同流派在细分判定上常有出入。现代读者宜把它视作一套文化解释框架，而不是可验证的自然规律。" },
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
        { kind: 'list', items: ["误解：吠陀十二宫与西洋十二星座完全相同。澄清：名称顺序对应，但吠陀用恒星黄道、西洋用回归黄道，因岁差错开约二十余度，同一天体落座可能不同。", "误解：守护星是天文学事实。澄清：守护星归属是文化约定，度数划分才是可复算的结构事实。", "误解：行星落某宫就能断具体吉凶。澄清：传统上只给强弱倾向描述，不能推出单点事件结论。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["十二宫每宫 30° 的划分与恒星黄道坐标可据天文算法复算，属可核验层；守护星与元素归属源自《Brihat Parashara Hora Shastra》等古典传承，具体流派口径出处待考。", "岁差（Ayanamsa）的换算差数属天文事实，本文采用 Lahiri 口径，与西洋回归黄道的差异属坐标系选择。"] },
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
        { kind: 'list', items: ["一查：是否说明所用黄道口径（恒星/回归）与 Ayanamsa 体系，缺此项的落座结果无法核对。", "二查：是否把「度数划分」与「守护星象征」混为一谈。", "三查：是否出现断言具体事件的表述——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘页列出各 Graha 所在 Rasi 的度数与宫名，并明确标注采用 Lahiri 恒星黄道；守护星与强弱解释单独分层呈现，标注为传统说法。页面同时披露所用岁差口径，让用户知道哪些数字可自行核对、哪些只是文化解释。" },
      ],
    },
  ],
  sources: [
    { text: "Rasi 每宫 30° 的划分与恒星黄道坐标可据天文算法复算，属可核验层。", confidence: 'verified' },
    { text: "守护星与元素归属源自《Brihat Parashara Hora Shastra》等古典传承，流派口径出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-ayanamsa-intro", "vedic-graha-intro", "qizheng-intro", "why-confidence"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
