/**
 * C12-知识库文章：日主：日干为什么是"我"
 * 文件路径：src/data/knowledge/content/paipan-daymaster.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'paipan-daymaster',
  title: '日主：日干为什么是"我"',
  metaDescription:
    '日主即日柱天干，是十神关系的原点。本文讲清日干如何确定、它在整张盘里的中心地位，以及"日主强弱"是怎么被估算的。',
  h1: '日主：日干为什么是"我"',
  category: 'paipan',
  tags: ['日主', '日干', '日元', '身强身弱'],
  sections: [
    {
      heading: '什么是日主：日柱天干就是"我"',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '四柱里，日柱由一天干一地支组成，其中日柱的天干就叫日主（也叫日干、日元）。十神系统把这个天干当作"我"：其余天干和所有地支藏干，都要相对它来判断是同我、我生、我克、克我还是生我，从而贴上比肩、劫财、食神、伤官、正财、偏财、正官、七杀、正印、偏印的标签。因此日主是整张盘的坐标原点——日主排错，所有十神全错。',
        },
        {
          kind: 'paragraph',
          text: '日主本身是十天干之一，也分阴阳五行：甲乙属木（甲阳乙阴）、丙丁属火、戊己属土、庚辛属金、壬癸属水。说"日主甲木"，就是指日干是甲这个阳木。但要注意，这只是一个五行坐标，不是说你"是一棵树"或性格如木。',
        },
      ],
    },
    {
      heading: '日主强弱：生扶与消耗的对比',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '传统分析常说的"身强身弱"，是估算日主在整张盘里力量够不够。粗略看分两边：一边是生扶日主的印（生我）和比劫（同我）；另一边是消耗日主的食伤（我生）、财（我克）、官杀（克我）。生扶多、消耗少，倾向身强；反之倾向身弱。但这只是粗略——月令（出生节气）对五行旺衰影响很大，还要看有没有合、冲、藏干等复杂因素。',
        },
        {
          kind: 'table',
          header: ['力量方向', '十神', '对日主的作用'],
          rows: [
            ['生扶', '印、比劫', '补给日主，使偏强'],
            ['消耗', '食伤、财、官杀', '泄耗日主，使偏弱'],
            ['调节', '月令、合冲、藏干', '影响上面各项的实际比重'],
          ],
        },
        {
          kind: 'paragraph',
          text: '为什么要估日主强弱？因为它决定同一个十神该怎么读：身强时，财、官杀、食伤往往是"可用"的出口；身弱时，这些消耗型十神可能变成负担，反需印、比劫来扶。可见"身强身弱"不是夸人身体好坏，而是结构上的力量对比。',
        },
      ],
    },
    {
      heading: '边界：日主不是人格测试',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '"你日主甲木，所以你正直向上""你日主壬水，所以你聪明流动"之类，是把天干象征当人格画像。日主只是十神系统的坐标原点，不直接描述性格，更不预测健康、财运。',
        },
        {
          kind: 'paragraph',
          text: '另外，"身强身弱"也不是中医意义上的身体强弱，和免疫力、体质毫无关系。把八字术语跨界套到健康上，是典型的越界——健康问题应交给医生，而不是日主旺衰。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律把日柱天干单独高亮为日主，据此标注各柱十神，并给出基于五行计数与月令的粗略强弱结构描述。描述只说"生扶／消耗的相对比重"，不输出"你身体弱""你命硬"之类判断。',
        },
      ],
    },
  ],
  sources: [{ text: '据《渊海子平》《滴天髓》日主及扶抑强弱通说整理', confidence: 'legendary' }],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'shishen-overview',
    'paipan-overview',
    'paipan-sizhu',
    'paipan-faq',
    'why-not-predict',
  ],
  confidence: 'legendary',
  disclaimer: '本文为传统命理民俗科普，不构成健康、医疗或任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
