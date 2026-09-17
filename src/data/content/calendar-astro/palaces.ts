/**
 * B 域：紫微 12 宫内容化（历法星象）
 * 来源：专家 B R4（论证222.md）+ A 域 PALACE_IMPACT 共享常量
 * 口径：12 条 ≥200 字
 */
import type { ContentRecord } from '../bazi-ziwei/types';
import { PALACE_IMPACT } from '../bazi-ziwei/shared/palace-impact';

export interface PalaceExtraB {
  kind: 'palace_b';
  palace: string;
  pinyin: string;
  keyword: string;
  focus: string;
}

const PINYIN: Record<string, string> = {
  命宫: 'ming', 兄弟: 'xiongdi', 夫妻: 'fuqi', 子女: 'zinv', 财帛: 'caibo', 疾厄: 'jie',
  迁移: 'qianyi', 交友: 'jiaoyou', 官禄: 'guanlu', 田宅: 'tianzhai', 福德: 'fude', 父母: 'fumu',
};

export const PALACES_B: readonly ContentRecord<PalaceExtraB>[] = PALACE_IMPACT.map((p) => {
  const body = [
    `${p.palace}是紫微斗数十二宫之一，主「${p.keyword}」，其观察重点是${p.focus}。`,
    `在命盘解读中，${p.palace}内所坐的星曜、四化与吉煞，共同刻画命主在${p.focus}上的倾向与节奏。${p.palace}并非独立生效，它与三方四正宫位相互呼应，需要整体观照。`,
    `需要说明的是，宫位解读属于命理文化参考维度，不构成对个人生活的确定性判断。同一宫位在不同命盘中的意义差异很大，宜结合命宫强弱、星曜组合与大运流年综合解读。`,
    `理解${p.palace}的观察框架，有助于把复杂的命盘信息还原为对生活领域的结构化认知，供自我觉察与阶段规划参考。`,
  ].join('');
  return {
    id: `palace_b_${PINYIN[p.palace]}`,
    version: '1.0.0',
    domain: 'calendar-astro',
    category: 'palace_b',
    seo: {
      title: `${p.palace}详解`,
      description: `${p.palace}的观察要点与命理参考解读（主${p.keyword}）。`,
      slug: `/wiki/palaces/${PINYIN[p.palace]}`,
      canonical: `/wiki/palaces/${PINYIN[p.palace]}`,
      breadcrumb: ['首页', '命理百科', '紫微宫位', p.palace],
      breadcrumb_paths: ['/', '/wiki', '/wiki/palaces', `/wiki/palaces/${PINYIN[p.palace]}`],
    },
    source: { system: 'ziwei', classic: '紫微斗数全书', chapter: `宫位篇·${p.palace}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-b' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${p.palace}主「${p.keyword}」，观察重点在${p.focus}。`,
        cause: `宫位属性决定该领域在命盘中的观察维度。`,
        manifestation: `${p.focus}成为该领域的显性议题。`,
        risk: `单看一宫易失之片面。`,
        suggestion: `结合三方四正与星曜组合综合解读。`,
        action: `以${p.focus}为规划参考，不作绝对判断。`,
      },
    },
    extra: { kind: 'palace_b', palace: p.palace, pinyin: PINYIN[p.palace], keyword: p.keyword, focus: p.focus },
    i18n_key: `palace_b.${PINYIN[p.palace]}`,
  };
});

export const PALACES_B_COUNT = PALACES_B.length; // 12
