/**
 * T-10 回炉 · WP-18 十段词条：奇门遁甲入门：九宫、八门与九星八神
 * 板块：qimen（/divination/qimen）｜引擎：@temposoul/core/divination/qimen
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "qimen-intro",
  title: "奇门遁甲入门：九宫、八门与九星八神",
  metaDescription: "奇门遁甲以九宫八门九星八神构成时空格局，用于方位与择时参考。本文梳理其起局结构与当代边界。",
  h1: "奇门遁甲入门：九宫、八门与九星八神",
  category: "sanshi",
  tags: ["奇门遁甲", "三式", "九宫"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "奇门遁甲与太乙神数、大六壬并称三式，是一套把时间与空间同时纳入盘面的术数体系。它的盘面由四层要素叠成：九宫为底，八门（开休生伤杜景死惊）布于九宫，九星（天蓬、天芮等）与八神（值符、腾蛇等）再叠其上，另加三奇六仪与旬首遁局。四层叠加之后，盘上的每一格都带有一组组合信息。" },
        { kind: 'paragraph', text: "奇门起局以节气与干支为枢纽：先定所用局（阳遁或阴遁若干局），再按旬首定值符与值使，依次排布九星、八门、八神。传统上奇门多用于方位选择与择时，例如出行、谋事、谈判的方位取向，属于「用事」层面的术数，而不是论命体系。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定求测的公历时刻，换算到干支历并确定所属节气。", "第二步：据节气与局数定阳遁或阴遁第几局。", "第三步：定旬首，据旬首定值符星与值使门。", "第四步：按阳顺阴逆的规则，把九星、八门、八神布入九宫。", "第五步：排三奇六仪，完成盘面。", "第六步：据用事取向读取相应的宫位组合。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["层级", "成员", "作用"],
          rows: [
            ["九宫", "坎一至离九", "盘面底座"],
            ["八门", "开休生伤杜景死惊", "主行事方向与人事"],
            ["九星", "天蓬、天芮等九星", "主性质与气场标记"],
            ["八神", "值符、腾蛇等八神", "辅助信息层"],
            ["三奇六仪", "乙丙丁与六仪", "遁甲布子"],
            ["遁局", "阳遁九局 / 阴遁九局", "由节气与干支定"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，奇门的八门各有吉凶属性的说法，开、休、生被视为三吉门；九星与八神也各有传统释义。这些释义在历代奇门书中不断增删，形成了多个并不完全一致的流派，尤其在遁局起法与置闰、拆补等处理上存在分歧。" },
        { kind: 'paragraph', text: "此为传统命理观点，奇门各派在遁局起法与超神接气的处理上互有出入，且吉凶门的说法属于民俗评价体系，不是可验证的事实判断。命律只呈现盘面结构与传统释义，不据此断言具体行事的成败。" },
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
        { kind: 'list', items: ["误解：奇门可以断定谋事成败。澄清：奇门是方位与择时的参考框架，不能推出事件结论。", "误解：所有奇门用同一个遁局起法。澄清：超神接气与置闰处理各派不同，跨派比对没有意义。", "误解：三吉门一定好、凶门一定坏。澄清：传统门义需结合宫位与用事综合看，单看门名不构成结论。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["《遁甲演义》《奇门遁甲统宗》等传世奇门文献：遁局起法与超神接气处理各派不一，相关细节出处待考。", "节气、干支与九宫布盘步骤可按本文复算；吉凶释义属民俗层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否标明了求测时刻与所用遁局。", "二查：是否把门星的吉凶标签当成了事件结论。", "三查：是否跨流派比对数值——不同派的盘面不宜直接比较。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的奇门页以时刻为输入，输出九宫盘面与八门九星八神的分布，并附口径与证据链折叠区说明所用起局规则。页面提供方位与择时的参考性阅读，明确标注为传统说法，不给出事件成败的判断。" },
      ],
    },
  ],
  sources: [
    { text: "《遁甲演义》《奇门遁甲统宗》等传世奇门文献：遁局起法与超神接气处理各派不一，相关细节出处待考。", confidence: 'legendary' },
    { text: "节气、干支与九宫布盘步骤可按本文复算；吉凶释义属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/divination/qimen",
    exports: ["generateQimen"],
    note: "与 /divination/qimen 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：qimen排盘", url: "/divination/qimen" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["taiyi-intro", "liuren-intro", "almanac-intro", "why-confidence"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 6,
};

export default article;
