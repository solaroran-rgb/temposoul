/**
 * 四化配对 10 条（生年天干 → 四化星配对表）
 * 来源：专家 A R3 v3.0（lunz 2.md §2.3）+ R2 约束③补
 * 口径：10 天干 × 1 条 = 10 条，逐条 ≥80 字，页面标注"参考维度"
 */
import type { FourTransformPairExtra, ContentRecord } from './types';

const STEM_PINYIN: Record<string, string> = {
  甲: 'jia', 乙: 'yi', 丙: 'bing', 丁: 'ding', 戊: 'wu',
  己: 'ji', 庚: 'geng', 辛: 'xin', 壬: 'ren', 癸: 'gui',
};

/** 生年天干 → 四化星（禄/权/科/忌）经典口诀表 */
const STEM_PAIRS: Array<{
  stem: string;
  lu: string;
  quan: string;
  ke: string;
  ji: string;
  note: string;
}> = [
  { stem: '甲', lu: '廉贞', quan: '破军', ke: '武曲', ji: '太阳', note: '甲廉破武阳，破军化权主开创之权。' },
  { stem: '乙', lu: '天机', quan: '天梁', ke: '紫微', ji: '太阴', note: '乙机梁紫阴，天机化禄主灵动机缘。' },
  { stem: '丙', lu: '天同', quan: '天机', ke: '文昌', ji: '廉贞', note: '丙同机昌廉，天同化禄主福泽安逸。' },
  { stem: '丁', lu: '太阴', quan: '天同', ke: '天机', ji: '巨门', note: '丁阴同机巨，太阴化禄主柔财暗助。' },
  { stem: '戊', lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机', note: '戊贪阴弼机，贪狼化禄主机变生财。' },
  { stem: '己', lu: '武曲', quan: '贪狼', ke: '天梁', ji: '文曲', note: '己武贪梁曲，武曲化禄主求财顺遂。' },
  { stem: '庚', lu: '太阳', quan: '武曲', ke: '太阴', ji: '天同', note: '庚阳武阴同，太阳化禄主明利得助。' },
  { stem: '辛', lu: '巨门', quan: '太阳', ke: '文曲', ji: '文昌', note: '辛巨阳曲昌，巨门化禄主口舌生财。' },
  { stem: '壬', lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲', note: '壬梁紫辅武，天梁化禄主荫庇赐福。' },
  { stem: '癸', lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼', note: '癸破巨阴贪，破军化禄主革新得利。' },
];

export const FOUR_TRANSFORM_PAIRS: readonly ContentRecord<FourTransformPairExtra>[] =
  STEM_PAIRS.map((p) => {
    const body = [
      `生年天干为「${p.stem}」时，紫微斗数四化口诀为「${p.note}」，即${p.lu}化禄、${p.quan}化权、${p.ke}化科、${p.ji}化忌。`,
      `此配对表用于排盘时确定命盘中四化星的落点：以生年天干为基准，在十二宫中按口诀找到对应四化星及其所在宫位。`,
      `需要说明的是，四化星仅代表该星在该宫位的能量倾向被激活的方向，属于「参考维度」，不构成直接的吉凶断言；`,
      `具体论断仍需结合命宫强弱、三方四正吉煞分布以及大限流年的动态变化综合判断。`,
    ].join('');
    return {
      id: `four_transform_pair_${STEM_PINYIN[p.stem]}`,
      version: '2.0.0',
      domain: 'bazi-ziwei',
      category: 'four_transform_pair',
      seo: {
        title: `${p.stem}干四化配对表`,
        description: `生年天干${p.stem}的四化星配对：${p.lu}化禄、${p.quan}化权、${p.ke}化科、${p.ji}化忌，供排盘参考。`,
        slug: `/wiki/four-transform/pairs/${STEM_PINYIN[p.stem]}`,
        canonical: `/wiki/four-transform/pairs/${STEM_PINYIN[p.stem]}`,
        breadcrumb: ['首页', '紫微斗数', '四化配对', `${p.stem}干`],
        breadcrumb_paths: ['/', '/wiki/ziwei', '/wiki/four-transform', `/wiki/four-transform/pairs/${STEM_PINYIN[p.stem]}`],
      },
      source: {
        system: 'ziwei',
        classic: '紫微斗数全书',
        chapter: `四化篇·${p.stem}干`,
      },
      compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
      review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-a' },
      body: {
        plain_reading: body,
        insight_loop: {
          insight: `${p.stem}干四化确定命盘中禄权科忌四星落宫。`,
          cause: `生年天干决定四化的起始配对，是排盘的静态基准之一。`,
          manifestation: `四化星所落宫位成为该领域能量倾向的提示点。`,
          risk: `仅凭单干四化论断容易失之片面。`,
          suggestion: `结合本命四化与大限四化分层参看。`,
          action: `排盘时以配对表为准，输出四化星所在宫位供综合解读。`,
        },
      },
      extra: {
        kind: 'four_transform_pair',
        heavenly_stem: p.stem,
        stem_pinyin: STEM_PINYIN[p.stem],
        lu_star: p.lu,
        quan_star: p.quan,
        ke_star: p.ke,
        ji_star: p.ji,
        note: p.note,
      },
      i18n_key: `four_transform_pair.${STEM_PINYIN[p.stem]}`,
    };
  });

export const FOUR_TRANSFORM_PAIRS_COUNT = FOUR_TRANSFORM_PAIRS.length;
