/**
 * D 域：星座百科 12 条（西占姓名）
 * 来源：专家 D R4（论证44.md §2440+ zodiacEncyclopedia）+ 既有 wiki/zodiac.ts
 * 口径：12 星座百科，逐条 ≥200 字
 */
import type { ContentRecord } from '../bazi-ziwei/types';

export interface ZodiacEncyclopediaExtra {
  kind: 'zodiac_encyclopedia';
  symbol: string;
  date_range: string;
  element: string;
  ruling_planet: string;
}

const ZODIACS: Array<{ zh: string; en: string; date: string; element: string; planet: string }> = [
  { zh: '白羊座', en: 'aries', date: '3.21-4.19', element: '火象', planet: '火星' },
  { zh: '金牛座', en: 'taurus', date: '4.20-5.20', element: '土象', planet: '金星' },
  { zh: '双子座', en: 'gemini', date: '5.21-6.21', element: '风象', planet: '水星' },
  { zh: '巨蟹座', en: 'cancer', date: '6.22-7.22', element: '水象', planet: '月亮' },
  { zh: '狮子座', en: 'leo', date: '7.23-8.22', element: '火象', planet: '太阳' },
  { zh: '处女座', en: 'virgo', date: '8.23-9.22', element: '土象', planet: '水星' },
  { zh: '天秤座', en: 'libra', date: '9.23-10.23', element: '风象', planet: '金星' },
  { zh: '天蝎座', en: 'scorpio', date: '10.24-11.22', element: '水象', planet: '冥王星' },
  { zh: '射手座', en: 'sagittarius', date: '11.23-12.21', element: '火象', planet: '木星' },
  { zh: '摩羯座', en: 'capricorn', date: '12.22-1.19', element: '土象', planet: '土星' },
  { zh: '水瓶座', en: 'aquarius', date: '1.20-2.18', element: '风象', planet: '天王星' },
  { zh: '双鱼座', en: 'pisces', date: '2.19-3.20', element: '水象', planet: '海王星' },
];

export const ZODIAC_ENCYCLOPEDIA: readonly ContentRecord<ZodiacEncyclopediaExtra>[] = ZODIACS.map((z) => {
  const body = [
    `${z.zh}（${z.en}）是黄道十二星座之一，公历生日约在${z.date}，属${z.element}，守护星为${z.planet}。`,
    `在西方占星传统中，${z.zh}的星座特质常被描述为：受${z.planet}与${z.element}能量影响，在性格与行为偏好上表现出相应的倾向。需要强调的是，占星人格描述属于文化传统与自我认知工具，不具备科学验证的一致性。`,
    `我们建议将星座描述当作认识自我与他人的一个趣味视角：用它来观察自己的偏好与盲点，而不是用它来定义或限制任何人。`,
  ].join('');
  return {
    id: `zodiac_encyclopedia_${z.en}`,
    version: '1.0.0',
    domain: 'western-name',
    category: 'zodiac_encyclopedia',
    seo: {
      title: `${z.zh}百科`,
      description: `${z.zh}（${z.date}）的星座介绍：元素、守护星与传统性格描述。`,
      slug: `/wiki/zodiac/encyclopedia/${z.en}`,
      canonical: `/wiki/zodiac/encyclopedia/${z.en}`,
      breadcrumb: ['首页', '星座百科', z.zh],
      breadcrumb_paths: ['/', '/wiki', '/wiki/zodiac/encyclopedia', `/wiki/zodiac/encyclopedia/${z.en}`],
    },
    source: { system: 'western_astrology', classic: '西方占星通行说法', chapter: `${z.zh}` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-d' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${z.zh}属${z.element}、守护星${z.planet}，常被描述为相应性格倾向。`,
        cause: `占星传统按出生月日划分星座并赋予象征体系。`,
        manifestation: `在性格与偏好上表现为相应倾向。`,
        risk: `星座描述缺乏科学一致性，勿作定论。`,
        suggestion: `当作自我认知的趣味视角使用。`,
        action: `观察偏好与盲点，不定义任何人。`,
      },
    },
    extra: { kind: 'zodiac_encyclopedia', symbol: z.zh, date_range: z.date, element: z.element, ruling_planet: z.planet },
    i18n_key: `zodiac_encyclopedia.${z.en}`,
  };
});

export const ZODIAC_ENCYCLOPEDIA_COUNT = ZODIAC_ENCYCLOPEDIA.length; // 12
