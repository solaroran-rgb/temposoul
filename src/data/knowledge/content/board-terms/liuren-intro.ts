/**
 * T-10 回炉 · WP-18 十段词条：大六壬入门：月将加时、四课与三传
 * 板块：liuren（/divination/liuren）｜引擎：@temposoul/core/divination/liuren
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "liuren-intro",
  title: "大六壬入门：月将加时、四课与三传",
  metaDescription: "大六壬以月将加时起四课三传，占事物缘起与发展。本文梳理课式结构、课体与当代边界。",
  h1: "大六壬入门：月将加时、四课与三传",
  category: "sanshi",
  tags: ["大六壬", "三式", "四课三传"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "大六壬与太乙、奇门并称三式，是三式中信息粒度最细、推演链最长的一支。它以「月将加时」为起课枢纽：把当月月将加到所占时辰的地支上，排出天地盘，再由天地盘起四课，由四课发三传，最后配六兽、遁干、年命、类神作综合解释。" },
        { kind: 'paragraph', text: "大六壬的结构层次分明：四课看事之缘起（第一课为干上、第四课为支上），三传看事之发展（初传为发端、中传为过程、末传为结果），课体则是若干种典型格局的归类。传统上又把课体分为若干种，如元首、重审、知一、涉害之类，各课体有不同的推演重点。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：定所占的月将与时辰。月将依节气而定，非依农历月。", "第二步：月将加时，排天地盘。", "第三步：起四课——干上神、干阴、支上神、支阴。", "第四步：据四课的克贼关系定发用，发三传（初、中、末）。", "第五步：配六兽、遁干，定贵人顺逆。", "第六步：定课体，加入年命与类神作综合解释。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["层次", "内容", "作用"],
          rows: [
            ["天地盘", "月将加时所得", "课式的底座"],
            ["四课", "干上、干阴、支上、支阴", "看事之缘起与我他关系"],
            ["三传", "初传、中传、末传", "看事之发端、过程与结果"],
            ["六兽", "青龙、朱雀等", "辅助性质描述"],
            ["遁干", "旬遁所得", "补充信息层"],
            ["年命", "行年与本命", "定位占者"],
            ["类神", "据所问之事取", "解释的焦点"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，大六壬以课体的归类与三传的生克为断事主轴，被认为三式中「最细」。历代壬书在月将取用、贵人顺逆与课体归类上仍有分歧，形成了不同的传承脉络。" },
        { kind: 'paragraph', text: "此为传统命理观点，大六壬的课体归类与断语属传统评价体系，各派在月将与贵人规则上并不一致，不能据此推出确定性事件结论。命律呈现完整的四课三传结构，并把解释明确标注为传统说法。" },
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
        { kind: 'list', items: ["误解：月将按农历月份取。澄清：月将依节气而定，与农历月份不是同一套分界。", "误解：大六壬能断言事件的确定结果。澄清：传统上是倾向性推演，不能推出确定性结论。", "误解：各派课体归类完全一致。澄清：月将与贵人规则的差异会导致课体归类不同。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["《六壬大全》《壬归》等传世壬书：月将取用、贵人顺逆与课体归类各派不一，相关细节出处待考。", "月将加时、起四课、发三传的步骤可按本文复算；断语属民俗层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否标明了月将的取用依据（依节气而非农历月）。", "二查：是否标明了所问之事对应的类神。", "三查：是否出现确定性断言——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的大六壬页以月将与时刻为输入，输出天地盘、四课、三传、六兽与课体的完整结构，并披露所用起课口径。解释部分分层：可复算层给课式数据，民俗层给传统释义并标注为传统说法。" },
      ],
    },
  ],
  sources: [
    { text: "《六壬大全》《壬归》等传世壬书：月将取用、贵人顺逆与课体归类各派不一，相关细节出处待考。", confidence: 'legendary' },
    { text: "月将加时、起四课、发三传的步骤可按本文复算；断语属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/divination/liuren",
    exports: ["generateLiuren"],
    note: "与 /divination/liuren 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：liuren排盘", url: "/divination/liuren" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["jinkoujue-intro", "qimen-intro", "taiyi-intro", "why-confidence"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 6,
};

export default article;
