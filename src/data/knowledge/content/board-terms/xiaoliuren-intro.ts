/**
 * T-10 回炉 · WP-18 十段词条：小六壬入门：六宫速断与落宫法
 * 板块：xiaoliuren（/divination/xiaoliuren）｜引擎：@temposoul/core/divination/xiaoliuren
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "xiaoliuren-intro",
  title: "小六壬入门：六宫速断与落宫法",
  metaDescription: "小六壬以月日时数落六宫（大安、留连、速喜、赤口、小吉、空亡）做速断。本文梳理落宫法与边界。",
  h1: "小六壬入门：六宫速断与落宫法",
  category: "divination",
  tags: ["小六壬", "速占", "六宫"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "小六壬是民间流传最广的速占法之一，也叫「诸葛马前课」一类的简便课式。它以六个固定宫位为结果集：大安、留连、速喜、赤口、小吉、空亡。起法极简——以农历月数、日数、时辰数依次在六宫上顺数，最后落到的那一宫即为结果。" },
        { kind: 'paragraph', text: "小六壬与六爻、梅花不同：它没有卦象、没有五行生克的推演链，只有一张六宫结果表配固定的口诀。因此它的信息粒度很粗，传统上也只用于「当下这事顺不顺」这类粗粒度的问题，不适合复杂问事。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：取农历月份数，从大安起顺数至该月，得第一落点。", "第二步：从第一落点起，顺数农历日数，得第二落点。", "第三步：从第二落点起，顺数时辰序号，得最终落宫。", "第四步：读该宫的固定口诀与传统释义。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["宫位", "传统性质标记", "传统意象"],
          rows: [
            ["大安", "安定", "身不动时，宜守"],
            ["留连", "拖延", "事难成，卒未归"],
            ["速喜", "喜庆", "人即至，求财中路"],
            ["赤口", "口舌", "防咒诅，恐闲非"],
            ["小吉", "和合", "人来喜，交易成"],
            ["空亡", "落空", "音信稀，事不成"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，六宫各有固定口诀，占者据落宫直接读出结果。这套口诀在民间口耳相传，版本众多，措辞与宫位顺序在不同地区略有出入，属于典型的民俗速占体系。" },
        { kind: 'paragraph', text: "此为传统命理观点，六宫口诀是民间传统的概括性说法，信息粒度很粗，不构成对具体事件的判断依据。命律呈现落宫的计算过程与传统口诀，并明确标注两者性质不同：前者可复算，后者属民俗说法。" },
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
        { kind: 'list', items: ["误解：小六壬能替代六爻或梅花的细部推演。澄清：小六壬只有六宫粗粒度结果，不适合复杂问事。", "误解：六宫口诀各处完全一致。澄清：民间版本众多，措辞与顺序有地区差异。", "误解：落宫结果就是事件的确定答案。澄清：传统上是倾向性速断，不能推出确定性结论。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["民间流传的六壬时课口诀：版本众多且口耳相传，具体出处待考，本文不标单一来源。", "月日时三数落宫的推算可按本文步骤复算；六宫口诀属民俗层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否用了农历月日——用公历直接套数会落错宫。", "二查：是否把六宫结果当成复杂问事的答案。", "三查：是否出现确定性断言——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的小六壬页以月日时为输入，输出落宫的完整推算过程与对应口诀，并把「可复算的落宫步骤」与「传统口诀释义」分两层呈现，后者标注为民俗说法。页面不提供事件性判断。" },
      ],
    },
  ],
  sources: [
    { text: "民间流传的六壬时课口诀：版本众多且口耳相传，具体出处待考，本文不标单一来源。", confidence: 'legendary' },
    { text: "月日时三数落宫的推算可按本文步骤复算；六宫口诀属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/divination/xiaoliuren",
    exports: ["generateXiaoliuren"],
    note: "与 /divination/xiaoliuren 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：xiaoliuren排盘", url: "/divination/xiaoliuren" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["liuyao-intro", "meihua-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 4,
};

export default article;
