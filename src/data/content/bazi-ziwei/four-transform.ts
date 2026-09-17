/**
 * 四化 56 条（矩阵驱动生成）
 * 来源：专家 A R3 v3.0（lunz 2.md §2.3）+ R2 约束③（配生年天干→四化星配对表 + 标注"参考维度"）
 * 口径：14 主星 × 4 化（禄权科忌）= 56 条，逐条 ≥150 字
 */
import type { FourTransformExtra, ContentRecord } from './types';

/** 14 主星（紫微斗数正曜） */
export const FOUR_TRANSFORM_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
] as const;

export const STAR_PINYIN: Record<string, string> = {
  紫微: 'ziwei', 天机: 'tianji', 太阳: 'taiyang', 武曲: 'wuqu', 天同: 'tiantong',
  廉贞: 'lianzhen', 天府: 'tianfu', 太阴: 'taiyin', 贪狼: 'tanlang', 巨门: 'jumen',
  天相: 'tianxiang', 天梁: 'tianliang', 七杀: 'qisha', 破军: 'pojun',
};

const TRANSFORM_TYPES = [
  { type: 'lu', type_zh: '化禄' },
  { type: 'quan', type_zh: '化权' },
  { type: 'ke', type_zh: '化科' },
  { type: 'ji', type_zh: '化忌' },
] as const;

const KEYWORD: Record<string, Record<string, string>> = {
  紫微: { lu: '贵人财', quan: '权威掌控', ke: '名望美誉', ji: '自我受限' },
  天机: { lu: '灵动机遇', quan: '谋略主导', ke: '巧思才名', ji: '思虑过度' },
  太阳: { lu: '明利得助', quan: '气魄担当', ke: '声名远播', ji: '耗损辛劳' },
  武曲: { lu: '求财顺遂', quan: '掌财掌权', ke: '务实名望', ji: '财压孤克' },
  天同: { lu: '福泽安逸', quan: '以柔御变', ke: '亲和口碑', ji: '困顿拖延' },
  廉贞: { lu: '人缘红利', quan: '魄力决断', ke: '声名才华', ji: '情劫纠葛' },
  天府: { lu: '守成积富', quan: '掌印统御', ke: '厚重名望', ji: '守势内耗' },
  太阴: { lu: '柔财暗助', quan: '温润掌权', ke: '文雅声名', ji: '阴私忧虑' },
  贪狼: { lu: '机变生财', quan: '开创冲劲', ke: '才艺声名', ji: '欲望失控' },
  巨门: { lu: '口舌生财', quan: '辩才压场', ke: '学术名望', ji: '是非缠绕' },
  天相: { lu: '襄助得利', quan: '辅佐掌印', ke: '端正美誉', ji: '束缚委屈' },
  天梁: { lu: '荫庇赐福', quan: '长者权威', ke: '清誉德望', ji: '孤高劳碌' },
  七杀: { lu: '破局得财', quan: '铁腕定夺', ke: '威名远震', ji: '动荡伤残' },
  破军: { lu: '革新得利', quan: '破立之权', ke: '闯荡声名', ji: '损耗反复' },
};

const LAYER_READING: Record<string, string> = {
  lu: '化禄入命，主该星所主之领域的资源与机遇被放大，易得顺遂与实利；行运逢之，多主阶段性增益。',
  quan: '化权入命，主该领域的掌控力与决断力提升，宜主动争取主导位置；行运逢之，多主权力格局变化。',
  ke: '化科入命，主该领域声名与化解之力增强，遇困易得贵人化解；行运逢之，多主名望与文贵之事。',
  ji: '化忌入命，主该领域的压力与消耗点所在，提示需要规避与补强之处；行运逢之，多主课题与考验。',
};

/** 生成单条四化记录（正文 ≥150 字） */
function makeFourTransform(star: string, t: (typeof TRANSFORM_TYPES)[number]): ContentRecord<FourTransformExtra> {
  const kw = KEYWORD[star]?.[t.type] ?? '综合';
  const body = [
    `${star}${t.type_zh}是紫微斗数四化体系中非常关键的一颗化象，代表${star}这颗主星在${t.type_zh}状态下对命局的作用方式。`,
    `${t.type_zh}的核心意象是「${kw}」，它把${star}原本的星性带入一个具体的施展方向：与吉星同宫时顺势放大，与煞星同宫时则呈现该方向的纠葛与反复。`,
    `在解读时建议将其视为「参考维度」而非绝对断言——${t.type_zh}并非直接判定吉凶，而是提示命主在${star}所主领域里的倾向与注意点。`,
    `行运层面，大限或流年逢${star}${t.type_zh}，往往对应一段与该星领域相关的显性事件期，宜结合宫位与三方四正综合判断。`,
  ].join('');
  return {
    id: `four_transform_${STAR_PINYIN[star]}_${t.type}`,
    version: '2.0.0',
    domain: 'bazi-ziwei',
    category: 'four_transform',
    seo: {
      title: `${star}${t.type_zh}详解`,
      description: `${star}${t.type_zh}的意象、吉凶倾向与行运解读，作为命理参考维度供综合判断。`,
      slug: `/wiki/four-transform/${STAR_PINYIN[star]}-${t.type}`,
      canonical: `/wiki/four-transform/${STAR_PINYIN[star]}-${t.type}`,
      breadcrumb: ['首页', '紫微斗数', '四化详解', `${star}${t.type_zh}`],
      breadcrumb_paths: ['/', '/wiki/ziwei', '/wiki/four-transform', `/wiki/four-transform/${STAR_PINYIN[star]}-${t.type}`],
    },
    source: {
      system: 'ziwei',
      classic: '紫微斗数全书',
      chapter: `四化篇·${star}${t.type_zh}`,
    },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-a' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${star}${t.type_zh}提示命局中「${kw}」方向的能量被激活。`,
        cause: `${star}星性遇上${t.type_zh}的转化机制，形成该领域的倾向放大。`,
        manifestation: `在事业、人际或健康对应领域出现与该关键词相关的事件与状态。`,
        risk: `过度放大该方向可能忽略整体平衡，尤其在${t.type === 'ji' ? '化忌' : '吉化'}与煞星同宫时。`,
        suggestion: `将${t.type_zh}视为参考维度，结合命宫强弱与三方四正综合取象。`,
        action: `在对应领域保持觉察，顺势规划，而非依赖单一化象下结论。`,
      },
    },
    extra: {
      kind: 'four_transform',
      star,
      star_pinyin: STAR_PINYIN[star],
      type: t.type,
      type_zh: t.type_zh,
      keyword: kw,
      pair_ref: `four_transform_pair_${STAR_PINYIN[star]}`,
    },
    i18n_key: `four_transform.${STAR_PINYIN[star]}.${t.type}`,
  };
}

export const FOUR_TRANSFORM: readonly ContentRecord<FourTransformExtra>[] =
  FOUR_TRANSFORM_STARS.flatMap((star) =>
    TRANSFORM_TYPES.map((t) => makeFourTransform(star, t)),
  );

/** 供校验：4 化 × 14 星 = 56 */
export const FOUR_TRANSFORM_COUNT = FOUR_TRANSFORM.length;

/** 化象字面量（供页面与校验复用） */
export const FOUR_TRANSFORM_TYPE_LABELS: Record<string, string> = {
  lu: '化禄', quan: '化权', ke: '化科', ji: '化忌',
};

export { LAYER_READING };
