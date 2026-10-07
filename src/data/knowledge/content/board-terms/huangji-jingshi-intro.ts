/**
 * T-10 回炉 · WP-18 十段词条：皇极经世入门：元会运世与值年卦
 * 板块：huangji-jingshi（/metaphysics/huangji-jingshi）｜引擎：@temposoul/core/huangji-jingshi
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "huangji-jingshi-intro",
  title: "皇极经世入门：元会运世与值年卦",
  metaDescription: "皇极经世以元会运世推步天地气化与治乱节律。本文梳理四级时间单位、卦配年法与当代可核验边界。",
  h1: "皇极经世入门：元会运世与值年卦",
  category: "sanshi",
  tags: ["皇极经世", "邵雍", "元会运世"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "皇极经世是北宋邵雍所传的一套宏观时间易学体系，以「元、会、运、世」四级时间单位推步长周期的气化节律。四级之间按固定进率叠加：一世三十年，一运十二世，一会三十运，一元十二会，由此构成一套自上而下的时间坐标。它关心的不是个人命局，而是以卦象标记大尺度时段的性质。" },
        { kind: 'paragraph', text: "在四级坐标之上，皇极经世用六十四卦配年：以一定的卦序规则把卦分配到具体的年、世、运、会之上，得出所谓「值年卦」。值年卦的推法在历代注家之间并不统一，尤其在起卦的基准年与卦序的取用上存在分歧，这是当代使用这套体系时必须先说明的前提。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定所求公历年份，换算到皇极经世的内部纪年坐标。", "第二步：按进率定位该年所属的世、运、会、元。", "第三步：按所用卦序规则取该层级对应的卦。", "第四步：得出值年卦，并据卦辞卦象作传统解释。", "第五步：如需更长周期，向上取值运卦、值会卦。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["层级", "进率", "折算年数"],
          rows: [
            ["世", "基准单位", "30 年"],
            ["运", "12 世", "360 年"],
            ["会", "30 运", "10800 年"],
            ["元", "12 会", "129600 年"],
            ["值年卦", "按卦序配年", "随流派而异"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，皇极经世被用以观察长时段的气化与治乱节律，值年卦被解释为当年大势的性质标记。这套学说形成于北宋的易学语境，后人在此基础上又衍生出多种配卦与断法，彼此并不完全兼容。" },
        { kind: 'paragraph', text: "此为传统命理观点，值年卦的起卦基准年与卦序取用在历代注家之间存在分歧，同一年份按不同流派可得出不同的卦。命律因此把流派口径作为显式参数披露，不把某一派的结果当作唯一正确答案，也不据此给出事件性判断。" },
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
        { kind: 'list', items: ["误解：皇极经世可以推算个人命运。澄清：它是宏观时间周期的易学框架，不以个人出生信息起盘。", "误解：值年卦只有唯一正确的一个。澄清：配卦规则因流派而异，不同派可给出不同卦。", "误解：值年卦能断言当年会发生什么。澄清：传统上只作性质标记，不能推出具体事件。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["邵雍《皇极经世书》及历代注家：配卦与起元细节各派不一，本文未作单一流派定论，相关细节出处待考。", "元会运世四级进率为体系内固定设定，属可复算层；值年卦的取用规则属待考层。"] },
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
        { kind: 'list', items: ["一查：是否标明了所用流派与起卦基准年。", "二查：是否把宏观周期结论套用到个人层面。", "三查：是否出现当年事件的断言——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的皇极经世页以公历年份为输入，输出该年在元会运世坐标中的位置与值年卦，并在结果区标注所用口径与已知分歧点。页面不提供事件性判断，也不把宏观周期结论外推到个人，解释部分一律标注为传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "邵雍《皇极经世书》及历代注家：配卦与起元细节各派不一，本文未作单一流派定论，相关细节出处待考。", confidence: 'legendary' },
    { text: "元会运世四级进率为体系内固定设定，属可复算层；值年卦的取用规则属待考层。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/huangji-jingshi",
    exports: ["calculateHuangjiJingshi"],
    note: "与 /metaphysics/huangji-jingshi 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：huangji-jingshi排盘", url: "/metaphysics/huangji-jingshi" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["taiyi-intro", "wuyun-liuqi-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
