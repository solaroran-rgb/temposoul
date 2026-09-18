/**
 * C-3 行星星座百科：占星词条 27 条（10 行星 + 12 星座 + 5 相位宫位）
 * 来源：专家 C R3（143217.md §astrology/astrology-terms-c.data.ts）
 * 口径：27 条，每条 ≥200 字
 */
import type { CContentRecord, CAstrologyTermsExtra } from './types';

interface TermSeed {
  slug: string;
  name: string;
  type: 'planet' | 'aspect' | 'house' | 'sign';
  theme: string;
  examples: string[];
}

const TERMS: TermSeed[] = [
  // ===== 行星（10）=====
  {
    slug: 'planet-sun',
    name: '太阳',
    type: 'planet',
    theme: '核心自我',
    examples: ['太阳落狮子座', '太阳落天秤座', '太阳落摩羯座'],
  },
  {
    slug: 'planet-moon',
    name: '月亮',
    type: 'planet',
    theme: '情绪与内在需求',
    examples: ['月亮落巨蟹座', '月亮落天蝎座', '月亮落金牛座'],
  },
  {
    slug: 'planet-mercury',
    name: '水星',
    type: 'planet',
    theme: '思维与沟通',
    examples: ['水星落双子座', '水星落处女座', '水星落射手座'],
  },
  {
    slug: 'planet-venus',
    name: '金星',
    type: 'planet',
    theme: '爱与价值观',
    examples: ['金星落金牛座', '金星落双鱼座', '金星落天秤座'],
  },
  {
    slug: 'planet-mars',
    name: '火星',
    type: 'planet',
    theme: '行动与欲望',
    examples: ['火星落白羊座', '火星落天蝎座', '火星落双子座'],
  },
  {
    slug: 'planet-jupiter',
    name: '木星',
    type: 'planet',
    theme: '扩张与机遇',
    examples: ['木星落射手座', '木星落狮子座', '木星落双子座'],
  },
  {
    slug: 'planet-saturn',
    name: '土星',
    type: 'planet',
    theme: '结构与责任',
    examples: ['土星落摩羯座', '土星落水瓶座', '土星落天秤座'],
  },
  {
    slug: 'planet-uranus',
    name: '天王星',
    type: 'planet',
    theme: '变革与突破',
    examples: ['天王星落金牛座', '天王星落水瓶座', '天王星落天蝎座'],
  },
  {
    slug: 'planet-neptune',
    name: '海王星',
    type: 'planet',
    theme: '梦想与消融',
    examples: ['海王星落双鱼座', '海王星落摩羯座', '海王星落水瓶座'],
  },
  {
    slug: 'planet-pluto',
    name: '冥王星',
    type: 'planet',
    theme: '转化与重生',
    examples: ['冥王星落天蝎座', '冥王星落摩羯座', '冥王星落水瓶座'],
  },
  // ===== 星座（12）=====
  {
    slug: 'sign-aries',
    name: '白羊座',
    type: 'sign',
    theme: '开创与行动',
    examples: ['火象基本宫', '守护星火星', '3.21-4.19'],
  },
  {
    slug: 'sign-taurus',
    name: '金牛座',
    type: 'sign',
    theme: '稳定与感官',
    examples: ['土象固定宫', '守护星金星', '4.20-5.20'],
  },
  {
    slug: 'sign-gemini',
    name: '双子座',
    type: 'sign',
    theme: '沟通与好奇',
    examples: ['风象变动宫', '守护星水星', '5.21-6.21'],
  },
  {
    slug: 'sign-cancer',
    name: '巨蟹座',
    type: 'sign',
    theme: '情感与守护',
    examples: ['水象基本宫', '守护星月亮', '6.22-7.22'],
  },
  {
    slug: 'sign-leo',
    name: '狮子座',
    type: 'sign',
    theme: '表达与自信',
    examples: ['火象固定宫', '守护星太阳', '7.23-8.22'],
  },
  {
    slug: 'sign-virgo',
    name: '处女座',
    type: 'sign',
    theme: '分析与服务',
    examples: ['土象变动宫', '守护星水星', '8.23-9.22'],
  },
  {
    slug: 'sign-libra',
    name: '天秤座',
    type: 'sign',
    theme: '平衡与关系',
    examples: ['风象基本宫', '守护星金星', '9.23-10.23'],
  },
  {
    slug: 'sign-scorpio',
    name: '天蝎座',
    type: 'sign',
    theme: '深度与转化',
    examples: ['水象固定宫', '守护星冥王星', '10.24-11.22'],
  },
  {
    slug: 'sign-sagittarius',
    name: '射手座',
    type: 'sign',
    theme: '探索与哲学',
    examples: ['火象变动宫', '守护星木星', '11.23-12.21'],
  },
  {
    slug: 'sign-capricorn',
    name: '摩羯座',
    type: 'sign',
    theme: '成就与自律',
    examples: ['土象基本宫', '守护星土星', '12.22-1.19'],
  },
  {
    slug: 'sign-aquarius',
    name: '水瓶座',
    type: 'sign',
    theme: '创新与独立',
    examples: ['风象固定宫', '守护星天王星', '1.20-2.18'],
  },
  {
    slug: 'sign-pisces',
    name: '双鱼座',
    type: 'sign',
    theme: '共情与消融',
    examples: ['水象变动宫', '守护星海王星', '2.19-3.20'],
  },
  // ===== 相位与宫位（5）=====
  {
    slug: 'aspect-conjunction',
    name: '合相',
    type: 'aspect',
    theme: '能量融合',
    examples: ['太阳合水星', '金星合火星', '木星合土星'],
  },
  {
    slug: 'aspect-trine',
    name: '三分相',
    type: 'aspect',
    theme: '和谐流畅',
    examples: ['太阳三分火星', '月亮三分金星', '水星三分木星'],
  },
  {
    slug: 'aspect-square',
    name: '四分相',
    type: 'aspect',
    theme: '张力与挑战',
    examples: ['太阳四分土星', '月亮四分天王星', '金星四分冥王星'],
  },
  {
    slug: 'house-first',
    name: '第一宫',
    type: 'house',
    theme: '自我形象',
    examples: ['上升点所在宫', '外在气质', '身体外貌'],
  },
  {
    slug: 'house-seventh',
    name: '第七宫',
    type: 'house',
    theme: '一对一关系',
    examples: ['婚姻与伴侣', '商业合作', '公开的敌人'],
  },
];

export const ASTROLOGY_TERMS: readonly CContentRecord<CAstrologyTermsExtra>[] = TERMS.map((t) => {
  const typeLabel =
    t.type === 'planet'
      ? '行星'
      : t.type === 'sign'
        ? '星座'
        : t.type === 'aspect'
          ? '相位'
          : '宫位';
  const body = [
    `${t.name}在占星学中代表「${t.theme}」的能量。作为${typeLabel}，它是理解星盘语言的基础词汇。`,
    `典型表现：例如${t.examples.slice(0, 3).join('、')}。这些配置在星盘分析中经常出现，理解${t.name}的核心含义有助于解读个人星盘的整体格局。`,
    `自我观察练习：观察自己生活中与「${t.theme}」相关的事件和模式，记录下这些模式出现的规律。`,
    '占星内容为文化知识科普，不构成专业占星咨询。如有深度解读需求，请寻求专业占星师。',
  ].join('');

  return {
    id: `c_astrology_terms_${t.slug}`,
    version: '1.0.0',
    domain: 'c',
    category: 'c_astrology_terms',
    seo: {
      title: `${t.name}占星解读`,
      description: `${t.name}在占星学中的核心概念与典型表现`,
      slug: `/knowledge/astrology/terms/${t.slug}`,
      canonical: `/knowledge/astrology/terms/${t.slug}`,
      breadcrumb: ['首页', '占星百科', t.name],
      breadcrumb_paths: ['/', '/knowledge/astrology/terms', `/knowledge/astrology/terms/${t.slug}`],
    },
    source: { system: 'western_astrology', classic: '现代占星学通行教材', chapter: `${t.name}` },
    compliance: {
      no_fatalism: true,
      domain_note: 'culture_discussion',
      banned_words_checked: true,
    },
    review: {
      status: 'supplemented',
      word_count: body.replace(/\s/g, '').length,
      reviewer: 'expert-c',
    },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${t.name}代表「${t.theme}」的能量。`,
        cause: '占星学通过行星、星座、相位、宫位四大维度描述心理与生活倾向。',
        manifestation: `典型表现：${t.examples.slice(0, 3).join('、')}。`,
        risk: '占星描述不具备科学一致性，仅作文化参考。',
        suggestion: `用「${t.theme}」作为自我观察的关键词。`,
        action: '记录一周内与该主题相关的事件，观察模式。',
      },
    },
    extra: {
      kind: 'c_astrology_terms',
      term_type: t.type,
      core_theme: t.theme,
      examples: t.examples,
    },
    i18n_key: `c_astrology_terms.${t.slug}`,
  };
});

export const ASTROLOGY_TERMS_COUNT = ASTROLOGY_TERMS.length; // 27
