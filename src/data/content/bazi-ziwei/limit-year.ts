/**
 * 限年 3 条（大限/小限/流年）
 * 来源：专家 A R3 v3.0（lunz 2.md 文件树 limit-year.ts）+ R2 约束②全量生成（≥150 字/条）
 * 口径：da_xian / xiao_xian / liu_nian = 3 条
 */
import type { LimitYearExtra, ContentRecord } from './types';

const L: Array<{
  id: string;
  type: LimitYearExtra['type'];
  type_zh: string;
  definition: string;
  start_rule: string;
  span: string;
  layer: LimitYearExtra['four_transform_layer'];
  guide: string;
}> = [
  {
    id: 'da_xian', type: 'da_xian', type_zh: '大限',
    definition: '大限是紫微斗数以十年为一阶段的行运框架，描述人生各十年的主题基调。',
    start_rule: '以命宫为起点，按阳男阴女顺行、阴男阳女逆行，每宫十年。',
    span: '10 年/宫',
    layer: 'decade',
    guide: '大限盘的命宫为限运重心，结合本命盘四化看十年主题。',
  },
  {
    id: 'xiao_xian', type: 'xiao_xian', type_zh: '小限',
    definition: '小限是以一岁为一阶段的行运框架，细化到大限内的年度变化。',
    start_rule: '以命宫起一岁，男顺女逆（按生年阴阳）逐年一宫。',
    span: '1 年/宫',
    layer: 'annual',
    guide: '小限盘用于观察单一年份的显性事件，与大限、流年互参。',
  },
  {
    id: 'liu_nian', type: 'liu_nian', type_zh: '流年',
    definition: '流年是以农历年为单位的天干地支年运，结合命盘判断该年的应事领域。',
    start_rule: '以流年干支为基准，流年命宫落于该年支的宫位。',
    span: '1 年/干支',
    layer: 'annual',
    guide: '流年盘重点看流年命宫、四化与吉煞落宫，判断年度课题。',
  },
];

export const LIMIT_YEAR: readonly ContentRecord<LimitYearExtra>[] = L.map((l) => {
  const body = [
    `${l.type_zh}是紫微斗数行运体系中的一个时间尺度。${l.definition}`,
    `起法方面，${l.start_rule}`,
    `解读时，${l.guide}；${l.type_zh}的四化联动${l.layer === 'decade' ? '以十年大限盘为主体' : '以流年/小限盘为细节'}，需与本命盘、大限盘三层叠加综合判断。`,
    `需要说明的是，限年解读属于命理参考框架，用于阶段规划与自我观察，不构成对具体事件的吉凶断言。`,
  ].join('');
  return {
    id: `limit_year_${l.id}`,
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'limit_year',
    seo: {
      title: `${l.type_zh}详解`,
      description: `${l.type_zh}的概念、起法与四化联动解读，作为限年工具参考。`,
      slug: `/wiki/limit-year/${l.id}`,
      canonical: `/wiki/limit-year/${l.id}`,
      breadcrumb: ['首页', '命理百科', '限年', l.type_zh],
      breadcrumb_paths: ['/', '/wiki', '/wiki/limit-year-guide', `/wiki/limit-year/${l.id}`],
    },
    source: { system: 'ziwei', classic: '紫微斗数全书', chapter: `限年篇·${l.type_zh}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'polished', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-a' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${l.type_zh}提供${l.span}尺度的行运框架。`,
        cause: `${l.start_rule}`,
        manifestation: `在该时间尺度内，对应宫位领域成为显性议题。`,
        risk: `单看一层限年易失之片面。`,
        suggestion: `本命-大限-${l.type_zh}三层叠加参看。`,
        action: `以限年提示作阶段规划，不作绝对吉凶判断。`,
      },
    },
    extra: {
      kind: 'limit_year',
      type: l.type,
      type_zh: l.type_zh,
      definition: l.definition,
      start_rule: l.start_rule,
      span: l.span,
      four_transform_layer: l.layer,
      input_fields: ['出生年月日时', '性别', '当前农历年'],
      output_fields: ['大限/小限/流年命宫', '四化落宫', '吉煞分布'],
      guide_text: l.guide,
    },
    i18n_key: `limit_year.${l.id}`,
  };
});

export const LIMIT_YEAR_COUNT = LIMIT_YEAR.length; // 3
