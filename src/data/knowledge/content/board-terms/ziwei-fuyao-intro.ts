/**
 * T-18B · WP-18 十段词条：紫微辅煞星入门
 * 板块：paipan（紫微星曜）｜引擎：src/lib/full-chart-engine/ziwei
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "ziwei-fuyao-intro",
  title: "紫微辅煞星入门：六吉星与六煞星",
  metaDescription: "紫微斗数在十四主星之外有六吉星（左右昌曲魁钺）与六煞星（火铃羊陀空劫）。本文梳理辅曜的安星规则与传统类象边界。",
  h1: "紫微辅煞星入门：六吉星与六煞星",
  category: "paipan",
  tags: ["紫微斗数", "辅星", "六吉星", "六煞星", "左辅右弼"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "紫微斗数在十四主星之外，还安有一组辅曜与煞曜。六吉星为左辅、右弼、文昌、文曲、天魁、天钺，传统认为各带辅助之力；六煞星为擎羊、陀罗、火星、铃星、地空、地劫，传统认为各带阻碍或激荡之力。辅煞星的安星规则由出生月、时、年干等参数确定，是排盘的组成部分。" },
        { kind: 'paragraph', text: "辅煞星的安星规则（由出生参数推得落宫）是可复算的排盘数据；但「某星入某宫主吉或主凶」的类象解释属传统星曜释义层。六吉星六煞星并非绝对的好与坏——传统读法中煞星亦可激发主星能量，吉星亦可过于安逸，需结合主星与宫位综合看。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：安左辅右弼——左辅从辰宫起正月顺数至出生月，右弼从戌宫起正月逆数至出生月。", "第二步：安文昌文曲——文昌从戌宫起子时逆数至生时，文曲从辰宫起子时顺数至生时。", "第三步：安天魁天钺——按出生年天干查表，定魁钺所在宫位。", "第四步：安擎羊陀罗——按出生年天干，擎羊在禄前一位、陀罗在禄后一位。", "第五步：安火星铃星、地空地劫——按出生年支与生时查表，各有固定安星规则。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["对照项", "六吉星", "六煞星"],
          rows: [
            ["成员", "左辅右弼文昌文曲天魁天钺", "擎羊陀罗火星铃星地空地劫"],
            ["传统定性", "辅助、贵人、文采", "阻碍、激荡、破耗"],
            ["安星依据", "月时年干查表", "年干年支时查表"],
            ["可复算性", "安星规则确定", "安星规则确定"],
            ["吉凶判断", "非绝对吉", "非绝对凶"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "紫微斗数的辅曜体系是后世在十四主星基础上逐步扩充的。传统认为左辅右弼助力人际关系、文昌文曲主文才学业、天魁天钺主贵人扶持；擎羊陀罗主刑伤拖延、火星铃星主突发激荡、地空地劫主虚幻破耗。这些类象是紫微星曜释义的重要组成部分，各派细节略有差异。" },
        { kind: 'paragraph', text: "此为传统命理观点，辅煞星的安星规则可复算，但「某星主某吉凶」的类象解释属历史传承的星曜释义体系，不能据此预测具体事件。" },
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
        { kind: 'list', items: ["误解：六吉星在命宫就一定好。澄清：吉星亦需结合主星强弱与宫位综合看，单星不构成结论。", "误解：六煞星在命宫就一定不好。澄清：传统读法中煞星可激发主星，火铃同宫主爆发力，并非全凶。", "误解：辅煞星比主星重要。澄清：辅煞星是辅助参照，十四主星仍是命盘核心。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["六吉星六煞星的安星规则（由出生月时年干年支查表）是确定的排盘规则，可复算，属可核验层。", "各辅煞星的类象释义与吉凶判断多属紫微斗数传统传承，具体出处待考。"] },
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
        { kind: 'list', items: ["一查：是否说明辅煞星的安星规则是排盘可复算数据。", "二查：是否区分了安星规则可复算层与星曜吉凶类象层。", "三查：是否由某辅煞星直接断言事件吉凶——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的紫微盘按安星规则输出六吉星六煞星的落宫位置，标注为可复算的排盘结果；星曜类象与吉凶解释分层展示，注明属传统说法，不附加事件断言。" },
      ],
    },
  ],
  sources: [
    { text: "六吉星六煞星的安星规则是确定的排盘规则，可复算，属可核验层。", confidence: 'verified' },
    { text: "各辅煞星的类象释义与吉凶判断多属紫微斗数传统传承，具体出处待考。", confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/ziwei",
    exports: ["generateZiweiChart"],
    note: "与紫微排盘同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：紫微排盘", url: "/ziwei" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["ziwei-stars-intro", "ziwei-palaces-intro", "ziwei-pattern-intro", "ziwei-sihua-intro"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
