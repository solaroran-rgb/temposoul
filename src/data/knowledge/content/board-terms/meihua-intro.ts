/**
 * T-10 回炉 · WP-18 十段词条：梅花易数入门：起卦、体用与外应
 * 板块：meihua（/divination/meihua）｜引擎：@temposoul/core/divination/meihua
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "meihua-intro",
  title: "梅花易数入门：起卦、体用与外应",
  metaDescription: "梅花易数以先天八卦数起卦，以体用生克断事，重即时外应。本文梳理其起卦法与当代边界。",
  h1: "梅花易数入门：起卦、体用与外应",
  category: "divination",
  tags: ["梅花易数", "易占", "体用"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "梅花易数相传出自邵雍，是易占中最轻便的一支。它不依赖铜钱，而是以先天八卦数为工具，把所见的数字、时间、方位、声音甚至字数直接转成卦：先天数乾一、兑二、离三、震四、巽五、坎六、艮七、坤八，取数以八除得上卦、以六除得动爻。" },
        { kind: 'paragraph', text: "卦成之后，梅花的核心概念是「体用」：以不动之卦为体，以动爻所变之卦为用，据体卦与用卦的五行生克关系判断事情的顺势或逆势，再结合互卦看中间过程、变卦看结果。梅花特别强调「外应」——起卦当下所感所见的异常现象被视为信息的一部分，这也是它被称为「心动起卦」的原因。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：取数。可用年月日时、字数、声数、物数等皆可，取两数分上下卦。", "第二步：上卦 = 数 ÷ 8 取余（余 0 作 8），下卦同法。", "第三步：动爻 = 两数之和 ÷ 6 取余（余 0 作 6）。", "第四步：成卦，据动爻定体卦与用卦，排出互卦与变卦。", "第五步：据体用五行生克看顺势逆势，参互卦看过程、变卦看结果。", "第六步：如有外应，并入参考。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["体用关系", "传统读法", "说明"],
          rows: [
            ["用生体", "顺", "传统视为有助"],
            ["体克用", "顺", "传统视为可为"],
            ["体生用", "逆", "传统视为耗力"],
            ["用克体", "逆", "传统视为受阻"],
            ["体用比和", "平", "传统视为相当"],
            ["互卦", "过程", "看中间阶段"],
            ["变卦", "结果", "看事之终结"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，梅花易数以体用生克为主轴，配上卦象类物与外应，形成一套即时判断的方法。它在明清以后广为流传，衍生出多种起数法与断法，各家对体用取舍与外应的权重并不完全一致。" },
        { kind: 'paragraph', text: "此为传统命理观点，梅花的吉凶读法属于传统解释框架，外应一项尤其依赖占者的主观感受，不具备可复算性。命律呈现卦象、体用、互变与生克关系的完整结构，并把解释明确标注为传统说法。" },
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
        { kind: 'list', items: ["误解：梅花易数必须铜钱摇卦。澄清：梅花以数起卦，铜钱属六爻一路。", "误解：外应是客观可复算的信息。澄清：外应依赖占者当下主观感受，不可复算，只能作参考。", "误解：体用生克能确定事情结果。澄清：传统上是倾向性读法，不能推出确定性结论。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["《梅花易数》传世文本及后世注本：起数法与断法各本不一，相关细节出处待考。", "先天数取卦、动爻取余、体用与互变的排布可按本文复算；吉凶读法属民俗层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否说明了取数的来源与方法——不说明则卦无法复算。", "二查：是否把外应当成了客观证据。", "三查：是否出现确定性结果断言——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的梅花页支持数字与时间两种起卦输入，输出本卦、互卦、变卦与体用生克关系，并在结果区标注所用起卦口径。解释部分区分可复算的卦象结构与传统的生克读法，后者一律标注为传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "《梅花易数》传世文本及后世注本：起数法与断法各本不一，相关细节出处待考。", confidence: 'legendary' },
    { text: "先天数取卦、动爻取余、体用与互变的排布可按本文复算；吉凶读法属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/divination/meihua",
    exports: ["generateMeihua"],
    note: "与 /divination/meihua 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：meihua排盘", url: "/divination/meihua" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["liuyao-intro", "xiaoliuren-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
