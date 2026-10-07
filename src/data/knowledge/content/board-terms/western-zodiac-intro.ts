/**
 * T-18B · WP-18 十段词条：西洋十二星座入门
 * 板块：paipan（西洋占星）｜引擎：@temposoul/core/astrolabe
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "western-zodiac-intro",
  title: "西洋十二星座入门：黄道宫、守护星与元素",
  metaDescription: "西洋占星将黄道等分为十二宫，每宫30°，各配一个守护星与四元素属性。本文梳理十二星座的划分规则与传统象征的边界。",
  h1: "西洋十二星座入门：黄道宫、守护星与元素",
  category: "paipan",
  tags: ["西洋占星", "十二星座", "黄道十二宫", "守护星", "四元素"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "西洋占星将 360° 黄道等分为十二宫，每宫 30°，依次为白羊、金牛、双子、巨蟹、狮子、处女、天秤、天蝎、射手、摩羯、水瓶、双鱼。每宫配一个传统守护星（如白羊守护火星、金牛守护金星）与一组元素属性（火、土、风、水各三宫）。出生时太阳所在的宫位即为常说的「太阳星座」。" },
        { kind: 'paragraph', text: "十二星座的 30° 等分划分与太阳黄经定位是可复算的天文坐标；守护星配属与元素分组是传统占星的符号约定。西洋占星使用回归黄道（以春分点为白羊0°），与吠陀占星的恒星黄道相差约 24° 的岁差值，二者不可直接互换。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：确定出生时刻太阳的回归黄经。", "第二步：将黄经除以 30°，得到太阳落在第几宫（1–12）。", "第三步：按宫位查守护星表与元素属性。", "第四步：如需完整星盘，再排月亮、上升点与各行星所在宫位。", "第五步：记录太阳星座、月亮星座与上升点，作为占星解读的基本输入。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["对照项", "西洋十二星座", "吠陀二十七宿"],
          rows: [
            ["划分", "12 等分，每宫 30°", "27 等分，每宿 13°20′"],
            ["黄道基准", "回归黄道（春分点起）", "恒星黄道（岁差校正）"],
            ["核心观测", "太阳为主", "月亮为主"],
            ["守护体系", "七颗古典行星", "九曜循环"],
            ["可复算性", "黄经定位可复算", "黄经定位可复算"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "西洋十二星座体系源自古巴比伦与古希腊的占星传统，经托勒密《四书》系统化，后经中世纪与文艺复兴发展至现代。传统认为各星座有其性格原型：白羊主开创、金牛主稳固、双子主沟通，等等。太阳星座被视为自我认同的核心象征，月亮星座主情绪模式，上升点主外在表现。这些说法是西洋占星的核心内容。" },
        { kind: 'paragraph', text: "此为传统命理观点，十二星座的 30° 等分与黄经定位是可复算的天文坐标，但「某星座主某性格」的原型解释属历史传承的象征体系，不能据此预测个人命运或具体事件。" },
        {
          kind: 'callout',
          tone: 'boundary',
          text: "以上释义属传统占星与民俗文化范畴，不构成对个人命运的判断，也不承诺任何改运效果。",
        },
      ],
    },
    {
      heading: '常见误解：误解 → 澄清',
      level: 2,
      blocks: [
        { kind: 'list', items: ["误解：太阳星座就是全部星座。澄清：完整星盘还含月亮、上升点与各行星宫位，太阳只是其中一层。", "误解：十二星座就是天空中的十二个星座形状。澄清：西洋黄道十二宫是等分坐标，与实际星座星群边界并不重合。", "误解：同星座的人性格都一样。澄清：星座原型是象征框架，个人性格还受月亮、上升、行星相位等多重因素影响。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["十二星座每宫30°的等分划分与太阳黄经定位是可复算的天文坐标，属可核验层。", "各星座的性格原型、守护星配属与元素释义多属传统占星传承，具体出处待考。"] },
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
        { kind: 'list', items: ["一查：是否说明十二星座是30°等分的黄道坐标，而非实际星群。", "二查：是否区分了天文坐标可复算层与星座性格原型层。", "三查：是否由太阳星座直接断言性格或命运——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的西洋占星盘按回归黄道输出太阳、月亮、上升点所在宫位，并标注为可复算的天文坐标结果；星座性格原型与象征解释分层展示，注明属传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "十二星座每宫30°等分划分与太阳黄经定位是可复算的天文坐标，属可核验层。", confidence: 'verified' },
    { text: "各星座性格原型、守护星配属与元素释义多属传统占星传承，具体出处待考。", confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/astrolabe",
    exports: ["generateAstrolabeChart"],
    note: "与西洋占星排盘同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：西洋占星排盘", url: "/astrolabe" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["vedic-rasi-intro", "vedic-lagna-intro", "vedic-ayanamsa-intro", "vedic-graha-intro"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
