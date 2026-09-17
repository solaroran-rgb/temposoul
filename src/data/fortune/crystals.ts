export type Confidence = 'legendary' | 'verified' | 'probable';

export interface CrystalEntry {
 id: string;
 name: string;
 hardness: number;
 zodiac: string[];
 element: string[];
 description: string;
 disclaimer: string;
 confidence: Confidence;
 ready: boolean;
}

export const CRYSTALS_META = {
 disclaimer: '水晶与宝石的能量说法属于民俗与神秘学范畴，仅供文化探索与审美参考，不具备医学或科学改运效力。',
};

export const crystalsData: CrystalEntry[] = [
 {
 id: 'amethyst',
 name: '紫水晶 (Amethyst)',
 hardness: 7,
 zodiac: ['水瓶座', '双鱼座'],
 element: ['水', '风'],
 description: '在西方神秘学中，紫水晶常被视为直觉与平静的象征，常被用于冥想辅助。',
 disclaimer: CRYSTALS_META.disclaimer,
 confidence: 'verified',
 ready: true,
 },
 {
 id: 'citrine',
 name: '黄水晶 (Citrine)',
 hardness: 7,
 zodiac: ['天蝎座', '射手座'],
 element: ['火', '土'],
 description: '黄水晶在色彩心理学中代表温暖与活力，常被作为秋季或阳光主题的首饰佩戴。',
 disclaimer: CRYSTALS_META.disclaimer,
 confidence: 'verified',
 ready: true,
 },
 {
 id: 'rose-quartz',
 name: '粉晶 (Rose Quartz)',
 hardness: 7,
 zodiac: ['金牛座', '天秤座'],
 element: ['土', '风'],
 description: '粉晶以其柔和的粉色著称，在流行文化中常与自我关爱和人际和谐的心理暗示联系在一起。',
 disclaimer: CRYSTALS_META.disclaimer,
 confidence: 'verified',
 ready: true,
 },
 {
 id: 'obsidian',
 name: '黑曜石 (Obsidian)',
 hardness: 5.5,
 zodiac: ['白羊座', '摩羯座'],
 element: ['火', '土'],
 description: '黑曜石是一种天然火山玻璃，在古代常被制作成工具或护身符，现代多用于沉稳风格的配饰。',
 disclaimer: CRYSTALS_META.disclaimer,
 confidence: 'verified',
 ready: true,
 },
];
