/**
 * 宫星对照 168 条索引 + 3 条手写示例（palace-star 域）
 * 来源：专家 A R3 v3.0（lunz 2.md §2.4）+ v6.0 修正（PALACE_STAR_INDEX 3 手写 + 165 模板）
 * 口径：12 宫 × 14 主星 = 168 条；3 条手写示例逐条 ≥120 字，165 条模板由 generator 拼装
 */
import type { PalaceStarExtra, ContentRecord } from './types';
import { PALACE_NAMES, PALACE_PINYIN } from './shared/palace-impact';

export const PALACES = [...PALACE_NAMES] as const;
export const PALACE_PINYIN_MAP: Record<string, string> = Object.fromEntries(
  PALACE_NAMES.map((p, i) => [p, PALACE_PINYIN[i]]),
);

export const MAIN_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
] as const;

export const STAR_PINYIN: Record<string, string> = {
  紫微: 'ziwei', 天机: 'tianji', 太阳: 'taiyang', 武曲: 'wuqu', 天同: 'tiantong',
  廉贞: 'lianzhen', 天府: 'tianfu', 太阴: 'taiyin', 贪狼: 'tanlang', 巨门: 'jumen',
  天相: 'tianxiang', 天梁: 'tianliang', 七杀: 'qisha', 破军: 'pojun',
};

/** 168 条索引：3 条手写示例（id 前缀 handwritten）+ 165 条模板 */
export const PALACE_STAR_INDEX: Array<{ palace: string; star: string; id: string; is_example: boolean }> = [];

for (const palace of PALACES) {
  for (const star of MAIN_STARS) {
    const isExample =
      (palace === '命宫' && star === '紫微') ||
      (palace === '夫妻' && star === '贪狼') ||
      (palace === '财帛' && star === '武曲');
    PALACE_STAR_INDEX.push({
      palace,
      star,
      id: `${isExample ? 'handwritten' : 'template'}_${PALACE_PINYIN_MAP[palace]}_${STAR_PINYIN[star]}`,
      is_example: isExample,
    });
  }
}

/** 3 条手写示例（≥120 字/条） */
const HANDWRITTEN: Array<ContentRecord<PalaceStarExtra>> = [
  {
    id: 'handwritten_ming_ziwei',
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'palace_star',
    seo: {
      title: '命宫紫微详解',
      description: '紫微坐命宫的性格底色、格局层次与人生基调，作为命理参考维度。',
      slug: '/wiki/palace-star/ming-ziwei',
      canonical: '/wiki/palace-star/ming-ziwei',
      breadcrumb: ['首页', '紫微斗数', '宫星详解', '命宫紫微'],
      breadcrumb_paths: ['/', '/wiki/ziwei', '/wiki/palace-star', '/wiki/palace-star/ming-ziwei'],
    },
    source: { system: 'ziwei', classic: '紫微斗数全书', chapter: '星曜篇·紫微' },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'polished', word_count: 0, reviewer: 'expert-a' },
    body: {
      plain_reading:
        '紫微坐命宫，为北斗帝星入垣，主性格稳重、有主见，天生具有统御气质与领袖意识。命主通常目标明确，自尊心强，重视体面与秩序，在群体中易成为核心人物。紫微喜得左辅右弼、文昌文曲拱照，则贵气更显；若孤坐无辅，则易显孤高，需后天修合人际。本象作为参考维度，提示命主在自我定位与事业格局上的天然倾向，宜结合三方四正综合解读。',
      insight_loop: {
        insight: '命宫紫微提示自我定位偏高层级，具统御与担当气质。',
        cause: '紫微为帝星，落命宫放大自尊与掌控倾向。',
        manifestation: '在团队中易居主导位，重视面子与秩序。',
        risk: '孤坐无辅时易显孤高，人际上需主动经营。',
        suggestion: '发挥统筹之长，同时练习倾听与授权。',
        action: '以领导力为职业主轴，配合团队协作补足。',
      },
    },
    extra: { kind: 'palace_star', palace: '命宫', palace_pinyin: 'ming', star: '紫微', star_pinyin: 'ziwei', is_example: true },
    i18n_key: 'palace_star.ming_ziwei',
  },
  {
    id: 'handwritten_fuqi_tanlang',
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'palace_star',
    seo: {
      title: '夫妻宫贪狼详解',
      description: '贪狼坐夫妻宫的感情模式、桃花特质与相处建议，作为命理参考维度。',
      slug: '/wiki/palace-star/fuqi-tanlang',
      canonical: '/wiki/palace-star/fuqi-tanlang',
      breadcrumb: ['首页', '紫微斗数', '宫星详解', '夫妻宫贪狼'],
      breadcrumb_paths: ['/', '/wiki/ziwei', '/wiki/palace-star', '/wiki/palace-star/fuqi-tanlang'],
    },
    source: { system: 'ziwei', classic: '紫微斗数全书', chapter: '星曜篇·贪狼' },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'polished', word_count: 0, reviewer: 'expert-a' },
    body: {
      plain_reading:
        '贪狼坐夫妻宫，主感情热烈、重视浪漫与新鲜感，命主在亲密关系中往往主动且善于经营氛围。贪狼为桃花星，感情机会较多，需注意区分欣赏与投入，避免因追求刺激而忽略稳定经营。若得禄存、天魁等吉星拱照，则能化桃花为助力，人缘与姻缘两旺；逢煞则需留意情劫与反复。本象作为参考维度，提示命主以真诚沟通与共同成长来夯实关系基础。',
      insight_loop: {
        insight: '夫妻宫贪狼提示感情热烈、桃花缘旺，重在经营稳定。',
        cause: '贪狼为桃花星入夫妻宫，放大浪漫与新鲜感需求。',
        manifestation: '恋爱机会多，关系中主动且善于制造惊喜。',
        risk: '易因追求刺激或外界诱惑而波动。',
        suggestion: '将热情转化为共同目标，重视承诺与边界。',
        action: '感情中以长期陪伴与深度沟通为核心。',
      },
    },
    extra: { kind: 'palace_star', palace: '夫妻', palace_pinyin: 'fuqi', star: '贪狼', star_pinyin: 'tanlang', is_example: true },
    i18n_key: 'palace_star.fuqi_tanlang',
  },
  {
    id: 'handwritten_caibo_wuqu',
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'palace_star',
    seo: {
      title: '财帛宫武曲详解',
      description: '武曲坐财帛宫的求财风格、理财倾向与财格层次，作为命理参考维度。',
      slug: '/wiki/palace-star/caibo-wuqu',
      canonical: '/wiki/palace-star/caibo-wuqu',
      breadcrumb: ['首页', '紫微斗数', '宫星详解', '财帛宫武曲'],
      breadcrumb_paths: ['/', '/wiki/ziwei', '/wiki/palace-star', '/wiki/palace-star/caibo-wuqu'],
    },
    source: { system: 'ziwei', classic: '紫微斗数全书', chapter: '星曜篇·武曲' },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'polished', word_count: 0, reviewer: 'expert-a' },
    body: {
      plain_reading:
        '武曲坐财帛宫，为财星入财位，主求财务实、行动力强，适合以专业能力与实干换取财富。命主理财风格偏稳健进取，重视效率与回报，厌恶投机与空谈。武曲属金，刚毅果决，若得化禄或禄存同宫，财源稳定易积累；逢煞则辛苦得财，需防因过于执着而影响身心。本象作为参考维度，提示命主在财务规划上宜以长期积累和专业深耕为主线。',
      insight_loop: {
        insight: '财帛宫武曲提示求财务实、行动力强，宜专业深耕。',
        cause: '武曲为财星入财帛宫，放大实干与效率倾向。',
        manifestation: '以专业能力换取收入，理财风格稳健进取。',
        risk: '过于执着回报易忽略平衡，逢煞则辛苦。',
        suggestion: '以长期积累为主，避免投机性操作。',
        action: '在专业领域持续深耕，财务上定期复盘。',
      },
    },
    extra: { kind: 'palace_star', palace: '财帛', palace_pinyin: 'caibo', star: '武曲', star_pinyin: 'wuqu', is_example: true },
    i18n_key: 'palace_star.caibo_wuqu',
  },
];

export { HANDWRITTEN as PALACE_STAR_EXAMPLES };
export const PALACE_STAR_INDEX_COUNT = PALACE_STAR_INDEX.length; // 168
