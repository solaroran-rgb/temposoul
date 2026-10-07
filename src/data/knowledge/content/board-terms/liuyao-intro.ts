/**
 * T-10 回炉 · WP-18 十段词条：六爻入门：摇卦、装卦与六亲六神
 * 板块：liuyao（/divination/liuyao）｜引擎：@temposoul/core/divination/liuyao
 * 纪律：s4 含强制合规句；s6 无实证一律「出处待考」；不改引擎计算。
 */
import type { KnowledgeArticle } from '../../schema';

const article: KnowledgeArticle = {
  slug: "liuyao-intro",
  title: "六爻入门：摇卦、装卦与六亲六神",
  metaDescription: "六爻以三枚铜钱摇六次成卦，装六亲六神后断事。本文梳理摇卦装卦流程与当代可核验边界。",
  h1: "六爻入门：摇卦、装卦与六亲六神",
  category: "divination",
  tags: ["六爻", "易占", "六亲"],
  sections: [
    {
      heading: '它是什么：定义与适用边界',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "六爻，又称纳甲筮法，是易占中最流行的一支。它以三枚铜钱摇六次，每次得一爻，自下而上叠成六爻卦。卦成之后要「装卦」：纳地支、定六亲、安六神、取世应、标动爻与变卦，最后据卦中各爻的生克旺衰作解释。" },
        { kind: 'paragraph', text: "六爻的关键在于「装」这一步。同一个卦象，因所占之事的用神不同、因月日对爻的旺衰影响不同，读法可以完全不同。因此六爻不是查卦辞式的固定答案，而是一套以卦为框架的关系推演。它的符号体系来自京房纳甲与后世筮法的累积，与《周易》卦爻辞的原本用法并不相同。" },
      ],
    },
    {
      heading: '怎么起：可复算的步骤',
      level: 2,
      blocks: [
        { kind: 'list', items: ["第一步：静心起占，明确所问之事（六爻以事为用神取向的前提）。", "第二步：三枚铜钱摇六次，每次记字背组合，自下而上成六爻。", "第三步：记录动爻（老阴、老阳），排出变卦。", "第四步：纳地支于各爻，定世爻与应爻。", "第五步：以卦宫五行定六亲（父母、兄弟、子孙、妻财、官鬼）。", "第六步：按日干安六神（青龙、朱雀等），据月日定旺衰。", "第七步：据用神爻的旺衰、生克、动变作解释。"] },
      ],
    },
    {
      heading: '组合与对照',
      level: 2,
      blocks: [
        {
          kind: 'table',
          header: ["要素", "内容", "作用"],
          rows: [
            ["本卦", "六次摇得的卦", "所占之事的主体"],
            ["变卦", "动爻变化后的卦", "事态的发展方向"],
            ["世应", "世爻与应爻", "区分主客与我他"],
            ["六亲", "父母兄弟子孙妻财官鬼", "以卦宫五行定关系角色"],
            ["六神", "青龙朱雀勾陈螣蛇白虎玄武", "辅助信息层"],
            ["月日", "占卜时的月建日辰", "定各爻旺衰"],
            ["用神", "据所问之事择爻", "解释的焦点"],
          ],
        },
      ],
    },
    {
      heading: '传统命理观点：这一说的来历',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "传统上，六爻以用神的旺衰与动变判断事情的吉凶成败，六神则用来补充性质描述。这套方法在明清筮书中高度成熟，形成了以《增删卜易》《卜筮正宗》为代表的多个流派，彼此在用神取舍与旺衰细则上仍有差异。" },
        { kind: 'paragraph', text: "此为传统命理观点，六爻的吉凶判断是传统评价体系，不是可验证的事实预测；同一卦在不同流派手中可以得出不同结论。命律呈现完整的卦象与装卦结构，并把解释部分明确标注为传统说法，不给出事件性断言。" },
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
        { kind: 'list', items: ["误解：摇出某卦就有一个固定的标准答案。澄清：六爻要装卦后结合用神与月日看，同一卦在不同问事下读法不同。", "误解：六爻能预言具体事件的时间与结果。澄清：传统上只作倾向性判断，不能推出确定性结论。", "误解：六爻就是《周易》卦爻辞的用法。澄清：六爻属纳甲筮法体系，与卦爻辞原本的用法不同。"] },
      ],
    },
    {
      heading: '出处与白话：能查证的才标 verified',
      level: 2,
      blocks: [
        { kind: 'list', items: ["《增删卜易》《卜筮正宗》等传世筮书：用神取舍与旺衰细则各派不一，相关细节出处待考。", "摇卦、纳甲、定世应、排六亲的步骤可按本文复算；吉凶判断属民俗层，属待考。"] },
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
        { kind: 'list', items: ["一查：是否记录了摇卦时的月日——缺月日则旺衰无从判断。", "二查：是否标明了用神与所问之事。", "三查：是否出现确定性的时间与结果断言——有则属越界。"] },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        { kind: 'paragraph', text: "命律的六爻页支持摇卦输入，输出本卦、变卦、世应、六亲、六神的完整结构，并披露所用装卦口径。解释部分分层呈现：可复算层给卦象与装卦数据，民俗层给传统释义并标注为传统说法，不作事件断言。" },
      ],
    },
  ],
  sources: [
    { text: "《增删卜易》《卜筮正宗》等传世筮书：用神取舍与旺衰细则各派不一，相关细节出处待考。", confidence: 'legendary' },
    { text: "摇卦、纳甲、定世应、排六亲的步骤可按本文复算；吉凶判断属民俗层，属待考。", confidence: 'verified' },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  engineModule: {
    module: "@temposoul/core/divination/liuyao",
    exports: ["generateLiuyao"],
    note: "与 /divination/liuyao 排盘页同源；引擎计算口径本文不改。",
  },
  relatedFeatures: [
    { label: "在工具里看它：liuyao排盘", url: "/divination/liuyao" },
    { label: '知识库总览', url: '/knowledge' },
  ],
  relatedSlugs: ["meihua-intro", "xiaoliuren-intro", "why-confidence", "why-folk-vs-fact"],
  confidence: 'legendary',
  disclaimer: "口径版本 v1.0 · 2026-10-08 · 本文为传统术数与民俗文化科普，属娱乐参考，不构成任何现实决策建议。",
  updatedAt: '2026-10-08',
  readingMinutes: 6,
};

export default article;
