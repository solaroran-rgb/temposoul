/**
 * T-10 回炉 · WP-18 十段词条：玄空飞星入门：三元九运与山向飞星
 * 板块：xuankong（/fengshui/xuankong）｜引擎：@temposoul/core/xuankong
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "xuankong-intro",
  title: "玄空飞星入门：三元九运与山向飞星",
  metaDescription: "玄空飞星以三元九运与坐向起星盘，以山星向星论宅运。本文梳理下卦、替卦与当代边界。",
  h1: "玄空飞星入门：三元九运与山向飞星",
  category: "fengshui",
  tags: ["玄空飞星", "风水", "三元九运"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "玄空飞星是理气风水中体系最完整的一支。它把时间纳入风水：以二十年为一运、九运为一循环（三元九运），每一运由一颗星当令。再据住宅的坐向起「星盘」——把九星按固定轨迹（洛书轨迹）飞布入九宫，分别得出山星与向星两套飞星，据二者的组合与当令星的旺衰论宅运。" },
        { kind: 'paragraph', text: "玄空的核心概念是「下卦」与「替卦」：坐向落在每山正中十五度之内者用下卦，偏出者用替卦（起星），两者的飞星排法不同。此外还有城门诀、收山出煞、零神正神等进阶规则。玄空体系层次多、规则细，也因此不同传承的分歧点较多。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定住宅坐向的度数，判定所属二十四山。", "第二步：判定用下卦还是替卦（是否偏出每山正中十五度）。", "第三步：定当前所属元运（三元九运，每运二十年）。", "第四步：据元运与坐向起星盘，飞布山星与向星入九宫。", "第五步：看当令星与山向星的组合，读各宫的旺衰与组合含义。", "第六步：如需，参城门诀与零正神等进阶规则。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["星", "数", "传统属性"],
          rows: [
            ["一白", "1", "坎，传统主文秀"],
            ["二黑", "2", "坤，传统主病符"],
            ["三碧", "3", "震，传统主口舌"],
            ["四绿", "4", "巽，传统主文昌"],
            ["五黄", "5", "中，传统主煞"],
            ["六白", "6", "乾，传统主权贵"],
            ["七赤", "7", "兑，传统主破军"],
            ["八白", "8", "艮，传统主财丁"],
            ["九紫", "9", "离，传统主喜庆"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，玄空以山星管人丁、向星管财禄，当运星见山或见水有不同的吉凶说法，并由此衍生出一套布局取向。这一体系在清末民初的《沈氏玄空学》等著作中系统化，但各派在替卦起星、城门诀与零正神的取用上仍有分歧。" },
        { kind: 'paragraph', text: "此为传统命理观点，玄空的旺衰与吉凶组合属于传统风水评价体系，不是可验证的物理事实；它不涉及建筑结构安全、采光通风等现代居住品质的客观指标，也不承诺任何改运效果。命律呈现元运、坐向与星盘的推算结果，并把释义标注为传统说法。" },
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
        { kind: 'list', items: ["误解：玄空能改变运势。澄清：玄空是传统评价体系，不承诺任何改运效果。", "误解：所有坐向都用下卦。澄清：偏出每山正中十五度者用替卦，排法不同。", "误解：玄空结论可以替代居住环境的客观评估。澄清：它与采光、通风、结构安全等客观指标无关。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["《沈氏玄空学》及历代玄空著作：替卦起星、城门诀与零正神取用各派不一，相关细节出处待考。", "元运判定、坐向归类与山向飞星的排布可按本文步骤复算；旺衰释义属民俗层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否标明了坐向度数与下卦/替卦的判定。", "二查：是否标明了所属元运及其起止年。", "三查：是否出现改运、化解类的效果承诺——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的玄空飞星页以坐向与元运为输入，输出下卦或替卦判定、山星与向星的九宫飞布及当令星标记，并披露所用口径。解释部分分为可复算的星盘数据与传统的旺衰释义两层，后者标注为传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "《沈氏玄空学》及历代玄空著作：替卦起星、城门诀与零正神取用各派不一，相关细节出处待考。", confidence: 'legendary' },
    { text: "元运判定、坐向归类与山向飞星的排布可按本文步骤复算；旺衰释义属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/xuankong",
    exports: ["generateXuanKong", "flyStars", "resolveXuanKongPeriod"],
    note: "与 /fengshui/xuankong 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：xuankong排盘", url: "/fengshui/xuankong" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["bazhai-intro", "residential-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 6,
};

export default article;
