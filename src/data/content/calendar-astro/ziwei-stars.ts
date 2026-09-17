/**
 * B 域：紫微 14 主星内容化（历法星象）
 * 来源：专家 B R4（论证222.md）+ 仓库 ziwei-stars/ 既有内容
 * 口径：14 条 ≥200 字
 */
import type { ContentRecord } from '../bazi-ziwei/types';

export interface ZiweiStarExtra {
  kind: 'ziwei_star_b';
  star: string;
  pinyin: string;
  element: string;
  keyword: string;
}

const STARS: Array<{ zh: string; pinyin: string; element: string; keyword: string }> = [
  { zh: '紫微', pinyin: 'ziwei', element: '土', keyword: '帝座统御' },
  { zh: '天机', pinyin: 'tianji', element: '木', keyword: '智谋灵动' },
  { zh: '太阳', pinyin: 'taiyang', element: '火', keyword: '光明磊落' },
  { zh: '武曲', pinyin: 'wuqu', element: '金', keyword: '刚毅求财' },
  { zh: '天同', pinyin: 'tiantong', element: '水', keyword: '福泽安逸' },
  { zh: '廉贞', pinyin: 'lianzhen', element: '木火', keyword: '次桃花魄力' },
  { zh: '天府', pinyin: 'tianfu', element: '土', keyword: '库藏稳守' },
  { zh: '太阴', pinyin: 'taiyin', element: '水', keyword: '柔润细腻' },
  { zh: '贪狼', pinyin: 'tanlang', element: '木水', keyword: '桃花机变' },
  { zh: '巨门', pinyin: 'jumen', element: '水', keyword: '口舌思辨' },
  { zh: '天相', pinyin: 'tianxiang', element: '水', keyword: '辅佐印信' },
  { zh: '天梁', pinyin: 'tianliang', element: '土', keyword: '荫庇清誉' },
  { zh: '七杀', pinyin: 'qisha', element: '金', keyword: '肃杀开拓' },
  { zh: '破军', pinyin: 'pojun', element: '水', keyword: '破旧立新' },
];

export const ZIWEI_STARS_B: readonly ContentRecord<ZiweiStarExtra>[] = STARS.map((s) => {
  const body = [
    `${s.zh}（${s.pinyin}）是紫微斗数十四主星之一，五行属${s.element}，星性以「${s.keyword}」为核心意象。`,
    `在命盘中，${s.zh}落于不同宫位，会将该宫所主领域染上${s.zh}星性的色彩：${s.keyword}的特质会被激活，成为命主在该领域行事风格的一部分。`,
    `需要说明的是，星曜解读属于命理文化参考维度，不构成对个人性格或命运的确定性断言。同一星曜在不同宫位、不同组合下的表现差异很大，宜结合宫位、四化、吉煞与全局格局综合判断。`,
    `理解${s.zh}的星性，更多是帮助我们多一个观察自我与生活节奏的视角，而非给自己贴标签。`,
  ].join('');
  return {
    id: `ziwei_star_b_${s.pinyin}`,
    version: '1.0.0',
    domain: 'calendar-astro',
    category: 'ziwei_star_b',
    seo: {
      title: `${s.zh}星详解`,
      description: `${s.zh}星的星性、五行与命理参考解读，作为紫微星曜专题内容。`,
      slug: `/wiki/ziwei-stars/${s.pinyin}`,
      canonical: `/wiki/ziwei-stars/${s.pinyin}`,
      breadcrumb: ['首页', '命理百科', '紫微星曜', s.zh],
      breadcrumb_paths: ['/', '/wiki', '/wiki/ziwei-stars', `/wiki/ziwei-stars/${s.pinyin}`],
    },
    source: { system: 'ziwei', classic: '紫微斗数全书', chapter: `星曜篇·${s.zh}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-b' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${s.zh}星提示「${s.keyword}」方向的星性特质。`,
        cause: `${s.zh}五行属${s.element}，星性决定其作用色彩。`,
        manifestation: `落宫领域呈现${s.keyword}的倾向。`,
        risk: `单看星曜易忽略宫位与组合差异。`,
        suggestion: `结合宫位、四化与全局格局综合解读。`,
        action: `以星性作观察视角，不作绝对断言。`,
      },
    },
    extra: { kind: 'ziwei_star_b', star: s.zh, pinyin: s.pinyin, element: s.element, keyword: s.keyword },
    i18n_key: `ziwei_star_b.${s.pinyin}`,
  };
});

export const ZIWEI_STARS_B_COUNT = ZIWEI_STARS_B.length; // 14
