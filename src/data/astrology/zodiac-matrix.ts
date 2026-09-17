// src/data/astrology/zodiac-matrix.ts
export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';

export interface ZodiacSign {
  id: string;
  name: string;
  enName: string;
  symbol: string;
  element: Element;
  modality: Modality;
  ruler: string;
  dateRange: string;
  ready: boolean;
  completeness: 'full' | 'partial' | 'stub';
  description: string;
}

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: 'aries', name: '白羊座', enName: 'Aries', symbol: '♈', element: 'fire', modality: 'cardinal', ruler: '火星', dateRange: '3.21-4.19', ready: true, completeness: 'full', description: '黄道第一宫，象征新生与开拓。受火星守护，行动力强，性格直率热情，勇于冒险，具有天生的领导力与竞争意识。' },
  { id: 'taurus', name: '金牛座', enName: 'Taurus', symbol: '♉', element: 'earth', modality: 'fixed', ruler: '金星', dateRange: '4.20-5.20', ready: true, completeness: 'full', description: '黄道第二宫，象征稳定与物质。受金星守护，重视安全感与美感，性格沉稳务实，对艺术和自然有天然的感知力，耐力极佳。' },
  { id: 'gemini', name: '双子座', enName: 'Gemini', symbol: '♊', element: 'air', modality: 'mutable', ruler: '水星', dateRange: '5.21-6.21', ready: true, completeness: 'full', description: '黄道第三宫，象征沟通与变化。受水星守护，思维敏捷善于表达，好奇心旺盛，具有多面性和极强的环境适应能力。' },
  { id: 'cancer', name: '巨蟹座', enName: 'Cancer', symbol: '♋', element: 'water', modality: 'cardinal', ruler: '月亮', dateRange: '6.22-7.22', ready: false, completeness: 'stub', description: '' },
  { id: 'leo', name: '狮子座', enName: 'Leo', symbol: '♌', element: 'fire', modality: 'fixed', ruler: '太阳', dateRange: '7.23-8.22', ready: false, completeness: 'stub', description: '' },
  { id: 'virgo', name: '处女座', enName: 'Virgo', symbol: '♍', element: 'earth', modality: 'mutable', ruler: '水星', dateRange: '8.23-9.22', ready: false, completeness: 'stub', description: '' },
  { id: 'libra', name: '天秤座', enName: 'Libra', symbol: '♎', element: 'air', modality: 'cardinal', ruler: '金星', dateRange: '9.23-10.23', ready: false, completeness: 'stub', description: '' },
  { id: 'scorpio', name: '天蝎座', enName: 'Scorpio', symbol: '♏', element: 'water', modality: 'fixed', ruler: '冥王星', dateRange: '10.24-11.22', ready: false, completeness: 'stub', description: '' },
  { id: 'sagittarius', name: '射手座', enName: 'Sagittarius', symbol: '♐', element: 'fire', modality: 'mutable', ruler: '木星', dateRange: '11.23-12.21', ready: false, completeness: 'stub', description: '' },
  { id: 'capricorn', name: '摩羯座', enName: 'Capricorn', symbol: '♑', element: 'earth', modality: 'cardinal', ruler: '土星', dateRange: '12.22-1.19', ready: false, completeness: 'stub', description: '' },
  { id: 'aquarius', name: '水瓶座', enName: 'Aquarius', symbol: '♒', element: 'air', modality: 'fixed', ruler: '天王星', dateRange: '1.20-2.18', ready: false, completeness: 'stub', description: '' },
  { id: 'pisces', name: '双鱼座', enName: 'Pisces', symbol: '♓', element: 'water', modality: 'mutable', ruler: '海王星', dateRange: '2.19-3.20', ready: false, completeness: 'stub', description: '' }
];

export const ELEMENTS: Element[] = ['fire', 'earth', 'air', 'water'];
export const MODALITIES: Modality[] = ['cardinal', 'fixed', 'mutable'];

export const ELEMENT_LABELS: Record<Element, string> = { fire: '火象', earth: '土象', air: '风象', water: '水象' };
export const MODALITY_LABELS: Record<Modality, string> = { cardinal: '开创', fixed: '固定', mutable: '变动' };
