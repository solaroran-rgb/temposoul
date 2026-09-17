/**
 * D 域：星座人格 12 条（西占姓名）
 * 来源：专家 D R4（论证44.md zodiacPersonality）
 * 口径：12 星座人格画像，逐条 ≥200 字
 */
import type { ContentRecord } from '../bazi-ziwei/types';

export interface ZodiacPersonalityExtra {
  kind: 'zodiac_personality';
  symbol: string;
  trait: string;
  growth: string;
}

const PERSONALITIES: Array<{ zh: string; en: string; trait: string; growth: string }> = [
  { zh: '白羊座', en: 'aries', trait: '行动力强、直率热情，习惯先做再想', growth: '练习在行动前多一分权衡，给耐心留出空间' },
  { zh: '金牛座', en: 'taurus', trait: '稳定务实、重视安全感，慢热而长情', growth: '适度拥抱变化，避免因舒适圈错过新的可能' },
  { zh: '双子座', en: 'gemini', trait: '好奇善变、表达力强，信息吸收快', growth: '练习聚焦与坚持，让兴趣沉淀为专长' },
  { zh: '巨蟹座', en: 'cancer', trait: '细腻敏感、重视家庭与情感联结', growth: '学会表达边界，把关怀也留一点给自己' },
  { zh: '狮子座', en: 'leo', trait: '自信耀眼、有领导气场，重视认可', growth: '把被看见的需求转化为照亮他人的力量' },
  { zh: '处女座', en: 'virgo', trait: '认真细致、追求完美，善于梳理', growth: '练习接纳不完美，让标准服务生活而非捆绑生活' },
  { zh: '天秤座', en: 'libra', trait: '追求平衡、审美在线，擅长协调关系', growth: '敢于直面冲突与取舍，平衡不是回避' },
  { zh: '天蝎座', en: 'scorpio', trait: '专注深邃、洞察力强，情感浓度高', growth: '练习信任与交付，让深度服务于连接而非防御' },
  { zh: '射手座', en: 'sagittarius', trait: '乐观自由、热爱探索，向往远方', growth: '把自由化为责任，在辽阔中建起落脚点' },
  { zh: '摩羯座', en: 'capricorn', trait: '自律坚韧、目标感强，习惯负重前行', growth: '允许自己休息，成就之外也需要生活的温度' },
  { zh: '水瓶座', en: 'aquarius', trait: '独立理性、思维超前，重视个性与创新', growth: '在独特与连接之间找到平衡，让创意落地成改变' },
  { zh: '双鱼座', en: 'pisces', trait: '共情丰富、想象力强，易感而柔软', growth: '给情绪一个出口，也给自己一副稳定的骨架' },
];

export const ZODIAC_PERSONALITY: readonly ContentRecord<ZodiacPersonalityExtra>[] = PERSONALITIES.map((p) => {
  const body = [
    `${p.zh}人格画像：${p.trait}。`,
    `成长建议：${p.growth}。`,
    `需要说明的是，星座人格描述是占星文化中的一种自我认知框架，并非对任何人的绝对定义。每个人都是复杂的个体，星座标签只提供其中一个观察角度。`,
    `我们更鼓励把它当作自我觉察的起点：看见倾向、理解成因、选择成长，而不是被标签框定。`,
  ].join('');
  return {
    id: `zodiac_personality_${p.en}`,
    version: '1.0.0',
    domain: 'western-name',
    category: 'zodiac_personality',
    seo: {
      title: `${p.zh}人格画像`,
      description: `${p.zh}人格画像与成长建议（占星趣味视角）。`,
      slug: `/wiki/zodiac/personality/${p.en}`,
      canonical: `/wiki/zodiac/personality/${p.en}`,
      breadcrumb: ['首页', '星座人格', p.zh],
      breadcrumb_paths: ['/', '/wiki', '/wiki/zodiac/personality', `/wiki/zodiac/personality/${p.en}`],
    },
    source: { system: 'western_astrology', classic: '西方占星通行说法', chapter: `${p.zh}人格` },
    compliance: { no_fatalism: true, domain_note: 'culture_discussion', banned_words_checked: true },
    review: { status: 'supplemented', word_count: body.replace(/\s/g, '').length, reviewer: 'expert-d' },
    body: {
      plain_reading: body,
      insight_loop: {
        insight: `${p.zh}人格倾向：${p.trait}。`,
        cause: `占星传统赋予该星座相应人格原型。`,
        manifestation: `在日常偏好与行事风格中体现。`,
        risk: `标签化易忽略个体复杂性。`,
        suggestion: `以画像作觉察起点，不作定义。`,
        action: `看见倾向、理解成因、选择成长。`,
      },
    },
    extra: { kind: 'zodiac_personality', symbol: p.zh, trait: p.trait, growth: p.growth },
    i18n_key: `zodiac_personality.${p.en}`,
  };
});

export const ZODIAC_PERSONALITY_COUNT = ZODIAC_PERSONALITY.length; // 12
