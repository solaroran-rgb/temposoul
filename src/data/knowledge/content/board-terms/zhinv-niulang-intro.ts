/**
 * T-10B · WP-18 十段词条：牛郎织女与银河
 * 板块：paipan（/knowledge）｜无对应引擎
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "zhinv-niulang-intro",
  title: "牛郎织女与银河：七夕星象的文化",
  metaDescription: "牛郎星（河鼓二）与织女星隔银河相望，是七夕传说的星象原型。本文梳理两星位置、银河带与民俗文化边界。",
  h1: "牛郎织女与银河：七夕星象的文化",
  category: "paipan",
  tags: ["牛郎织女", "银河", "七夕", "星象文化"],
  sections: [
    {
      heading: "它是什么：定义与适用边界",
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "牛郎织女的星象原型是银河两岸的两颗亮星：河西的织女星（天琴座 α）与河东的牛郎星（河鼓二，天鹰座 α），中间斜贯天际的乳白色光带即银河。两星与银河的相对位置，在夏秋之夜的中纬度天空最为醒目。" },
        { kind: 'paragraph', text: "可复算部分：两星的坐标、亮度以及与银河带的关系可精确推算。民俗部分：鹊桥相会、七夕乞巧等属传统节日文化层，需与实测天象分开看待，星象事实与传说叙事不可混为一谈。" },
      ],
    },
    {
      heading: "怎么查：可复算的步骤",
      level: 2,
      blocks: [
        { kind: 'list', items: [
          "第一步：夏秋之夜向头顶附近寻找明亮的织女星，其旁有小星呈三角形排列。",
          "第二步：向银河东岸寻找牛郎星，其两侧各有一颗小星（民间谓一双儿女）。",
          "第三步：横跨天际的光带即银河，分隔两星所在方向。",
          "第四步：记录观测时刻，注意两星随季节东升西落。",
          "第五步：区分天文事实（两颗恒星在银河两侧方向相近）与传说（一年一度相会）。",
        ] },
      ],
    },
    {
      heading: "组合与对照",
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["对照项", "织女星", "牛郎星"],
          rows: [
            ["中文名", "织女（天琴座 α）", "河鼓二（天鹰座 α）"],
            ["方位", "银河以西", "银河以东"],
            ["亮度", "全天最亮恒星之一", "全天前列亮星"],
            ["伴星", "旁有渐台小星", "两侧各一小星"],
            ["可复算性", "坐标可精算", "坐标可精算"],
          ],
        },
      ],
    },
    {
      heading: "传统说法与来历",
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "古代把银河视为天河，把两星想象为被阻隔的夫妇，相传每年七月初七由喜鹊搭桥相会，由此演为七夕乞巧的节日，寄托人们对相聚与巧艺的向往。" },
        { kind: 'paragraph', text: "此为传统命理观点，两星与银河的位置可实测复算，但「七夕相会预兆姻缘」的解读属历史传承的民俗象征，不能据此判断个人感情，也不构成对人际关系的预测。" },
        {
          kind: 'callout',
          tone: 'boundary',
          text: "以上释义属传统术数与民俗文化范畴，不构成对具体事件的判断，也不承诺任何改运效果。",
        },
      ],
    },
    {
      heading: "常见误解：误解 → 澄清",
      level: 2,
      blocks: [
        { kind: 'list', items: [
          "误解：牛郎织女每年七夕真的靠近相会。澄清：两星相距极远，全年相对位置几乎不变，七夕只是黄昏观测的文化意象。",
          "误解：银河是天上的河流。澄清：银河是大量遥远恒星密集形成的光带，并非水体。",
          "误解：七夕晚上两星才出现在天空。澄清：两星夏季夜晚常见，只是文化节日定在七月初七。",
        ] },
      ],
    },
    {
      heading: "出处与白话：能查证的才标 verified",
      level: 2,
      blocks: [
        { kind: 'list', items: [
          "织女星、牛郎星（河鼓二）的坐标、亮度与银河带位置可据星表复算，属可核验层。",
          "鹊桥相会、七夕乞巧等说法，据民间传说与岁时文化资料整理，具体出处待考。",
        ] },
        {
          kind: 'callout',
          tone: 'boundary',
          text: "凡无实证可查者一律标注「出处待考」，不编造书名、篇目与原文。",
        },
      ],
    },
    {
      heading: "三步自检：怎么判断看到的内容靠不靠谱",
      level: 2,
      blocks: [
        { kind: 'list', items: [
          "一查：是否说明两星全年相对位置不变，七夕相会是文化意象。",
          "二查：是否区分银河是恒星光带而非水体。",
          "三查：是否由星象直接断言姻缘祸福，有则属越界。",
        ] },
      ],
    },
    {
      heading: "在命律里怎么呈现",
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的星象科普板块夏季视图标注织女星、牛郎星与银河走向，附观测时刻提示；两星坐标按观测地可复算。鹊桥相会与乞巧的节日解释单独分层，标注为传统民俗，不与排盘计算挂钩。" },
      ],
    },
  ],
  sources: [
    { text: "织女星（天琴座 α）与牛郎星（河鼓二，天鹰座 α）隔银河相望，坐标与亮度可据星表复算。", confidence: 'verified' },
    { text: "鹊桥相会、七夕乞巧等说法，据民间传说与岁时文化资料整理，出处待考。", confidence: 'legendary' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedFeatures: [
    { label: "知识库总览", url: "/knowledge" },
    { label: "在工具里看它：排盘", url: "/result?system=bazi" },
  ],
  relatedSlugs: ["ershiba-su-intro", "almanac-intro", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 5,
};

export default article;
