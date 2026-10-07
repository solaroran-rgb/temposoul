/**
 * T-10 回炉 · WP-18 十段词条：雷诺曼牌入门：36 张牌与牌阵读法
 * 板块：lenormand（/divination/lenormand）｜引擎：@temposoul/core/divination/lenormand
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "lenormand-intro",
  title: "雷诺曼牌入门：36 张牌与牌阵读法",
  metaDescription: "雷诺曼牌以 36 张象征牌读具体人事与走向，牌阵简明。本文梳理牌义体系、牌阵与边界。",
  h1: "雷诺曼牌入门：36 张牌与牌阵读法",
  category: "divination",
  tags: ["雷诺曼", "牌阵", "西洋占卜"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "雷诺曼牌是一套 36 张的欧洲象征牌，得名于十九世纪巴黎的占卜师玛丽·安妮·雷诺曼。它不同于塔罗：塔罗以大阿尔卡那的原型叙事为骨干，雷诺曼则以日常物件的直白象征为主——骑手、三叶草、船、房子、树、云、蛇、棺材、花束、镰刀……每张牌对应一个相对固定的关键词。" },
        { kind: 'paragraph', text: "雷诺曼的读法核心是「组合」：单张牌只给关键词，两张牌相邻才产生句子。因此雷诺曼牌阵（尤其是三张的无牌阵与九宫的方阵）本质上是把关键词按位置关系连读。它偏向具体人事与近期走向的速读，不作原型层面的心理叙事。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：明确所问之事，雷诺曼以具体问题为宜。", "第二步：洗牌并选定牌阵（三张线阵、五张十字、九宫方阵等）。", "第三步：按位置抽牌并正面排布。", "第四步：先读每张牌的关键词，再读相邻牌的组合义。", "第五步：若牌阵含「指示牌」，据指示牌定位主体。", "第六步：按位置的时间或角色指向组织成一段读解。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["牌", "关键词", "组合倾向"],
          rows: [
            ["骑手", "消息、到来", "与云组合：消息不明"],
            ["三叶草", "小幸运、短暂", "与山组合：小阻滞"],
            ["船", "远行、贸易", "与房子组合：搬家"],
            ["房子", "家庭、居所", "与树组合：家宅与安稳"],
            ["树", "健康、长久", "与云组合：不确定"],
            ["云", "不明、困惑", "与太阳组合：转晴"],
            ["蛇", "曲折、绕行", "与心组合：感情波折"],
            ["棺材", "结束、终止", "与花束组合：结束后有喜"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "在欧洲民间传统中，雷诺曼牌被用以读具体人事与近期走向，牌义以口诀化的关键词传承。这套体系在十九世纪以后的欧陆与拉美民间流传较广，各版本牌义措辞略有差异。" },
        { kind: 'paragraph', text: "此为传统命理观点，雷诺曼的牌义与组合读法属欧洲民俗占卜传统，不具备可验证的预测效力。命律呈现抽牌结果与关键词组合的读解路径，并明确标注为传统说法，不作事件断言。" },
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
        { kind: 'list', items: ["误解：雷诺曼就是塔罗的简化版。澄清：两者来源与读法逻辑不同，雷诺曼以关键词组合为主，塔罗以原型叙事为主。", "误解：单张牌就能给出完整答案。澄清：雷诺曼的读解依赖相邻牌的组合，单张只给关键词。", "误解：抽牌结果可以确定未来。澄清：传统上是倾向性速读，不能推出确定性结论。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["雷诺曼牌义体系源自十九世纪欧陆民间传承，各版本措辞不一，具体出处待考，本文不标单一权威来源。", "牌阵抽牌与位置排布可复现；牌义组合读法属民俗层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否标明了所用牌阵与位置规则。", "二查：是否只读单张牌下结论——漏掉组合读法会失真。", "三查：是否出现确定性断言——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的雷诺曼页以牌阵为输入，输出抽牌结果、每张牌的关键词与相邻组合的读解路径，并说明所用牌阵规则。解释部分明确标注为欧洲民俗占卜传统，不作事件断言。" },
      ],
    },
  ],
  sources: [
    { text: "雷诺曼牌义体系源自十九世纪欧陆民间传承，各版本措辞不一，具体出处待考，本文不标单一权威来源。", confidence: 'legendary' },
    { text: "牌阵抽牌与位置排布可复现；牌义组合读法属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/divination/lenormand",
    exports: ["drawLenormandSpread"],
    note: "与 /divination/lenormand 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：lenormand排盘", url: "/divination/lenormand" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["tarot-intro", "ssgw-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
