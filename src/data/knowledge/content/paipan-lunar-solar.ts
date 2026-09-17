/**
 * C12-知识库文章：农历与公历：排盘用哪种历
 * 文件路径：src/data/knowledge/content/paipan-lunar-solar.ts
 */
import type { KnowledgeArticle } from '../schema';

const article: KnowledgeArticle = {
  slug: 'paipan-lunar-solar',
  title: '农历与公历：排盘用哪种历',
  metaDescription:
    '排盘既不用纯农历也不用纯公历，而要换算到以节气为骨架的干支历。本文讲清三种历法的区别、常见换算坑与夏令时问题。',
  h1: '农历与公历：排盘用哪种历',
  category: 'paipan',
  tags: ['农历', '公历', '历法换算', '夏令时'],
  sections: [
    {
      heading: '三种历法：公历、农历、干支历',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '很多人以为八字按农历排，其实不对。排盘真正用的是第三种历——干支历，它以太阳位置为骨架：年看立春，月看节气，日按六十甲子循环，时按太阳时。公历（格里历）是现代通用纪年，农历（夏历）是兼顾月相和节气的阴阳合历。报出生时间时，无论你手里是公历生日还是农历生日，最终都要先还原成"真实发生的那个公历时刻"，再换算到干支历。',
        },
        {
          kind: 'table',
          header: ['历法', '依据', '排盘用途'],
          rows: [
            ['公历', '人为纪年', '输入出生时刻的基准'],
            ['农历', '月相＋节气', '民俗生日，需先转公历'],
            ['干支历', '太阳位置', '排盘真正使用的历'],
          ],
        },
        {
          kind: 'paragraph',
          text: '用农历生日排盘的坑在于：农历有闰月，农历某年某个月可能有两个（如闰六月），而排盘的月令根本不认闰月，只认节气。所以直接拿"农历八月"去套月柱，往往对不上。正确做法是把农历生日（注意标注是否闰月）换算回公历那一天，再按节气排。',
        },
      ],
    },
    {
      heading: '换算的几个坑：时区、夏令时、跨夜',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '第一个坑是时区。中国统一用北京时间（东八区），但若你出生在境外、或长辈记录时用了当地时间，必须先把它转成对应北京时间，再做真太阳时校正。第二个坑是夏令时：中国大陆在 1986–1991 年间实行过夏令时，时钟被人为拨快一小时，那段时间出生的人，报的钟点要先减回一小时才是真实太阳时间。第三个坑是跨午夜：23 点后出生涉及早夜子时与日柱切换，需要按所选排盘口径处理。',
        },
        {
          kind: 'list',
          items: [
            '境外出生：先把当地时间转成北京时间。',
            '1986–1991 年中国出生：核对是否夏令时，必要时回拨一小时。',
            '农历闰月：先转公历，别直接套月令。',
            '出生证明与记忆不符：以出生证明／医院记录为准。',
          ],
        },
      ],
    },
    {
      heading: '边界：历法准确≠解读准确',
      level: 2,
      blocks: [
        {
          kind: 'callout',
          tone: 'boundary',
          text: '历法换算只是保证排盘数据正确，它不提高任何后续解读的"准确度"。即便公历农历、夏令时都核对无误，据此得出的性格、运势结论仍属民俗解释，不具科学预测力。',
        },
        {
          kind: 'paragraph',
          text: '此外，不必纠结"农历八月初八"这种民俗表述。八字记录的是你出生那一刻的太阳位置，和记不记农历生日无关；喜欢过农历生日是文化习惯，和排盘是两件事。',
        },
      ],
    },
    {
      heading: '在命律里怎么呈现',
      level: 2,
      blocks: [
        {
          kind: 'paragraph',
          text: '命律支持输入公历出生时间，并提供出生地选择用于真太阳时校正；对 1986–1991 年时段会提示夏令时问题。换算过程在后台完成，用户只需保证报来的是真实出生时刻（必要时核对出生证明）。',
        },
      ],
    },
  ],
  sources: [
    {
      text: '据公历、农历、干支历区别及中国夏令时实行年份（1986–1991）通行资料整理',
      confidence: 'verified',
    },
  ],
  citationStrategy: 'paraphrase',
  reviewedBy: 'content-team',
  ready: true,
  relatedSlugs: [
    'paipan-overview',
    'paipan-jieqi',
    'paipan-true-solar-time',
    'paipan-faq',
    'paipan-shichen',
  ],
  confidence: 'legendary',
  disclaimer: '本文为历法科普，不构成任何现实决策建议。',
  updatedAt: '2026-09-16',
  readingMinutes: 6,
};

export default article;
