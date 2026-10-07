/**
 * T-10B · WP-18 十段词条：九曜 Graha 入门
 * 板块：vedic（/vedic）｜引擎：@temposoul/core/vedic
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "vedic-graha-intro",
  title: "九曜 Graha 入门：日月五星与罗睺计都",
  metaDescription: "Graha 即吠陀的「曜」，含日月五星实体天体与罗睺、计都两个交点推算点。本文梳理九曜构成与可核验边界。",
  h1: "九曜 Graha 入门：日月五星与罗睺计都",
  category: "paipan",
  tags: ["吠陀占星", "vedic", "Graha", "九曜", "罗睺计都"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "Graha（音译「格拉哈」，意为「攫取者」，常译「曜」或「星」）是吠陀占星的行星系统。传统九曜为：Surya 太阳、Chandra 月亮、Mangala 火星、Budha 水星、Guru 木星、Shukra 金星、Shani 土星，加上 Rahu 罗睺与 Ketu 计都。" },
        { kind: 'paragraph', text: "其中日月五星是真实天体，位置可天文复算；Rahu 与 Ketu 并非实体天体，而是月亮轨道与黄道的南北两个交点，由推算得到，合称「交点」或「隐曜」。这一点与中国七政四余中的罗睺、计都概念同源而异流。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定出生时刻与地点。", "第二步：按天文算法求日月五星在所求时刻的恒星黄经。", "第三步：求月亮升交点（Rahu）与降交点（Ketu）位置，两者相差 180°。", "第四步：按恒星黄道口径（减 Ayanamsa）确定各曜所在 Rasi。", "第五步：记录各曜度数、顺逆状态与所在宫位，作为解读输入。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["Graha", "性质", "可复算性"],
          rows: [
            ["Surya 太阳", "恒星（视运动中心）", "天体位置可复算"],
            ["Chandra 月亮", "地球卫星", "天体位置可复算"],
            ["Mangala 火星", "行星", "天体位置可复算"],
            ["Budha 水星", "行星", "天体位置可复算"],
            ["Guru 木星", "行星", "天体位置可复算"],
            ["Shukra 金星", "行星", "天体位置可复算"],
            ["Shani 土星", "行星", "天体位置可复算"],
            ["Rahu 罗睺", "月亮升交点（推算点）", "交点位置可推算"],
            ["Ketu 计都", "月亮降交点（推算点）", "与罗睺相差 180°"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在传统吠陀体系中，每一 Graha 被赋予一套象征含义，例如太阳主自我与权威、月亮主心境、木星主智慧与资粮等；罗睺、计都则被视为带有「拉扯」与「放下」意味的推算点。这些象征在古典文献中成套传承。" },
        { kind: 'paragraph', text: "此为传统命理观点，九曜中七曜的天体位置可天文复算，罗睺计都为交点推算点可复推；但各曜的象征含义与吉凶判断属历史传承的解释框架，不同流派措辞有别。" },
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
        { kind: 'list', items: ["误解：罗睺、计都是两颗真实行星。澄清：它们是月亮轨道与黄道的交点，属推算点，现代天文学无对应实体。", "误解：吠陀九曜比西洋七星多两颗「煞星」。澄清：多出来的是交点推算点，不是额外的天体。", "误解：某曜落某宫就能断性格或事件。澄清：象征含义只给倾向性描述，不能推出单点结论。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["日月五星位置与月亮交点（Rahu/Ketu）可据天文算法复算，属可核验层。", "九曜的象征含义源自《Brihat Parashara Hora Shastra》等古典传承，具体释义口径出处待考。"] },
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
        { kind: 'list', items: ["一查：是否区分了实体天体（七曜）与交点推算点（罗睺计都）。", "二查：是否说明所用黄道口径（恒星黄道）与 Ayanamsa。", "三查：是否出现由某曜直接断言吉凶的表述——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的吠陀盘把九曜分两层呈现：可核验层列出日月五星与罗睺计都的黄经、落座与交点属性；象征层给出传统含义，并标注为古典传承。页面明确罗睺计都为交点推算点，不让其被误读为实体天体。" },
      ],
    },
  ],
  sources: [
    { text: "日月五星位置与月亮交点 Rahu/Ketu 可据天文算法复算，属可核验层。", confidence: 'verified' },
    { text: "九曜象征含义源自《Brihat Parashara Hora Shastra》等古典传承，释义口径出处待考。", confidence: 'legendary' },
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
  relatedSlugs: ["vedic-rasi-intro", "vedic-nakshatra-intro", "qizheng-intro", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
