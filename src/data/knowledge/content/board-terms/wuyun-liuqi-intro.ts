/**
 * T-10 回炉 · WP-18 十段词条：五运六气入门：岁运、司天与在泉
 * 板块：wuyun-liuqi（/metaphysics/wuyun-liuqi）｜引擎：@temposoul/core/wuyun-liuqi
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "wuyun-liuqi-intro",
  title: "五运六气入门：岁运、司天与在泉",
  metaDescription: "五运六气以天干地支推每年的岁运与客气主气，属传统历法气候学说。本文梳理其推算结构与当代边界。",
  h1: "五运六气入门：岁运、司天与在泉",
  category: "sanshi",
  tags: ["五运六气", "运气学说", "历法"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "五运六气，简称「运气学说」，是传统医学与历法交叉的一套年度气候推演体系，集中见于《黄帝内经·素问》的七篇大论。它以干支纪年为输入，把一年拆成「五运」与「六气」两条线索：五运看岁运的太过与不及，六气看司天、在泉与主气客气的结构。" },
        { kind: 'paragraph', text: "五运由年干推导，十干各有对应的运；六气由年支推导，十二支各有对应的司天与在泉。两者叠加，再考虑客主加临与胜复郁发等关系，构成一套描述年度气候倾向的符号系统。需要明确的是，这是古代在有限观测条件下建立的理论模型，与现代气象学不是同一套知识体系。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：取所求年份的干支。", "第二步：由年干定岁运（太过 / 不及），并定五运的初运与客运序列。", "第三步：由年支定司天之气与在泉之气。", "第四步：排六气的初之气至终之气，分主气与客气两层。", "第五步：看客主加临与胜复关系，得出该年的气候倾向描述。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["项目", "由何推导", "说明"],
          rows: [
            ["岁运", "年干", "十干各有对应，分太过与不及"],
            ["客运", "岁运顺推", "五步运行于一年"],
            ["司天", "年支", "主上半岁之气"],
            ["在泉", "年支", "主下半岁之气"],
            ["主气", "固定序列", "年年不变的六步"],
            ["客气", "司天顺推", "随年支而变"],
            ["客主加临", "主客相叠", "传统上的相得与不相得"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，五运六气被用以推度年度气候倾向与相应的物候节律，并由此衍生出一套因时制宜的养生观念。这套体系建立于古代的观测条件与阴阳五行框架之下，历代医家对其具体推法细节也有不同理解。" },
        { kind: 'paragraph', text: "此为传统命理观点，五运六气是古代气候理论模型，与现代气象学的观测预报体系不同，不能据此判断实际天气，更不能作为任何健康处理依据。命律只呈现推算结构与传统文化含义，不作气候断言，也不给任何养生处方式的建议。" },
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
        { kind: 'list', items: ["误解：五运六气可以预报天气。澄清：它是古代理论模型，与现代气象预报不是同一体系，不能作为天气依据。", "误解：某年「火运太过」就意味着一定会很热。澄清：传统术语描述的是倾向，不是对实际气温的断言。", "误解：按运气结果调理就能避免不适。澄清：任何身体不适都应寻求专业医疗帮助，本文不构成健康建议。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["《黄帝内经·素问》七篇大论（运气七篇）：传世文本，推法细节历代注家理解不一，部分细节出处待考。", "干支与岁运、司天、在泉的对应关系可按本文步骤复算；气候倾向的实际效验属待考层，现代气象学另成体系。"] },
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
        { kind: 'list', items: ["一查：是否标明了所用干支年与流派口径。", "二查：是否把传统气候倾向当成气象预报使用。", "三查：是否出现健康处理或调理建议——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的五运六气页以公历年份为输入，输出岁运、司天、在泉与主客六气的结构化盘面，并附术语卡解释每个字段的含义。页面明确区分「可复算的干支推导」与「传统的气候倾向描述」，并在显著位置声明其不构成气候断言与健康建议。" },
      ],
    },
  ],
  sources: [
    { text: "《黄帝内经·素问》七篇大论（运气七篇）：传世文本，推法细节历代注家理解不一，部分细节出处待考。", confidence: 'legendary' },
    { text: "干支与岁运、司天、在泉的对应关系可按本文步骤复算；气候倾向的实际效验属待考层，现代气象学另成体系。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/wuyun-liuqi",
    exports: ["calculateWuyunLiuqi"],
    note: "与 /metaphysics/wuyun-liuqi 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：wuyun-liuqi排盘", url: "/metaphysics/wuyun-liuqi" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["huangji-jingshi-intro", "ganzhi-overview", "wuxing-basics", "why-bazi-limits"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
