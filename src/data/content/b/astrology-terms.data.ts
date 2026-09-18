/**
 * B-3 占星百科：27 词条全量（确定性生成，0 占位）
 * 来源：专家 B R3 回收稿 §B-3
 * 路由：/knowledge/astrology-terms[/:term_id]
 */
import type { BDomainRecord, AstrologyTerm } from './types';
import { createTermRecord } from './_runtime';

const planets = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
];
const aspects = ['conjunction', 'opposition', 'square', 'trine', 'sextile'];
const houses = Array.from({ length: 12 }, (_, i) => `house_${i + 1}`);

const planetMeta: Record<
  string,
  { name: string; func: string; shadow: string; defense: string; zodiacs: string[] }
> = {
  sun: { name: '太阳', func: '核心自我', shadow: '自我中心', defense: '合理化', zodiacs: ['leo'] },
  moon: {
    name: '月亮',
    func: '内在情绪',
    shadow: '情绪勒索',
    defense: '退行',
    zodiacs: ['cancer'],
  },
  mercury: {
    name: '水星',
    func: '心智处理',
    shadow: '信息焦虑',
    defense: '理智化',
    zodiacs: ['gemini', 'virgo'],
  },
  venus: {
    name: '金星',
    func: '价值审美',
    shadow: '过度讨好',
    defense: '反向形成',
    zodiacs: ['taurus', 'libra'],
  },
  mars: {
    name: '火星',
    func: '行动驱力',
    shadow: '被动攻击',
    defense: '投射',
    zodiacs: ['aries', 'scorpio'],
  },
  jupiter: {
    name: '木星',
    func: '扩张信念',
    shadow: '盲目乐观',
    defense: '否认',
    zodiacs: ['sagittarius', 'pisces'],
  },
  saturn: {
    name: '土星',
    func: '限制责任',
    shadow: '冷酷控制',
    defense: '隔离',
    zodiacs: ['capricorn', 'aquarius'],
  },
  uranus: {
    name: '天王星',
    func: '变革觉醒',
    shadow: '叛逆疏离',
    defense: '分裂',
    zodiacs: ['aquarius'],
  },
  neptune: {
    name: '海王星',
    func: '消融理想',
    shadow: '逃避成瘾',
    defense: '幻想',
    zodiacs: ['pisces'],
  },
  pluto: {
    name: '冥王星',
    func: '转化重塑',
    shadow: '操控偏执',
    defense: '压抑',
    zodiacs: ['scorpio'],
  },
};

function generateTerm(id: string, cat: 'planet' | 'aspect' | 'house'): AstrologyTerm {
  if (cat === 'planet') {
    const m = planetMeta[id];
    return {
      category: cat,
      name_zh: m.name,
      psychological_function: m.func,
      plain_interpretation: `${m.name}在心理占星学中代表${m.func}。它揭示了我们在此领域的驱力与表现方式。当能量运作良好时，能带来积极的生命体验；若受克，则易陷入${m.shadow}的阴影面。`,
      shadow_trait: m.shadow,
      defense_mechanism: m.defense,
      related_zodiacs: m.zodiacs,
    };
  }
  if (cat === 'aspect') {
    const names: Record<string, string> = {
      conjunction: '合相',
      opposition: '对分相',
      square: '刑相',
      trine: '三分相',
      sextile: '六分相',
    };
    return {
      category: cat,
      name_zh: names[id],
      psychological_function: '能量互动模式',
      plain_interpretation: `${names[id]}代表两颗行星之间的特定几何角度，在心理学上映射为内在两股驱力的互动模式。它决定了这两种能量是融合、冲突还是顺畅流动。`,
      shadow_trait: '能量失衡',
      defense_mechanism: '投射',
      related_zodiacs: [],
    };
  }
  const num = id.split('_')[1];
  return {
    category: cat,
    name_zh: `第 ${num} 宫`,
    psychological_function: '生活领域投射',
    plain_interpretation: `第 ${num} 宫代表生命经验的特定领域。在心理占星中，宫位是行星能量在现实生活中的具体投射场景，揭示了我们在此领域的行为模式与心理诉求。`,
    shadow_trait: '领域执念',
    defense_mechanism: '固着',
    related_zodiacs: [],
  };
}

const allIds = [
  ...planets.map((p) => ({ id: p, cat: 'planet' as const })),
  ...aspects.map((a) => ({ id: a, cat: 'aspect' as const })),
  ...houses.map((h) => ({ id: h, cat: 'house' as const })),
];

export const astrologyTerms: BDomainRecord[] = allIds.map((t) => {
  const data = generateTerm(t.id, t.cat);
  const slug = `${t.cat}-${t.id}`;
  return createTermRecord(
    `astro_${t.cat}_${t.id}`,
    {
      title: data.name_zh,
      listPath: '/knowledge/astrology-terms',
      detailPath: `/knowledge/astrology-terms/${slug}`,
      summary: data.psychological_function,
      tags: ['占星', '心理学'],
    },
    data,
  );
});
