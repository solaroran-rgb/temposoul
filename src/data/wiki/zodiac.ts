export type Confidence = 'legendary' | 'verified' | 'probable';

export interface AstroWikiEntry {
 id: string;
 title: string;
 aliases: string[];
 pinyin: string;
 category: 'planet' | 'sign' | 'house' | 'aspect' | 'concept';
 summary: string;
 content: string;
 sources: { text: string; confidence: Confidence }[];
 confidence: Confidence;
 disclaimer: string;
 ready: boolean;
 updatedAt: string;
}

export const zodiacWikiData: AstroWikiEntry[] = [
 {
 id: 'aries',
 title: '白羊座 (Aries)',
 aliases: ['牡羊座', '白羊宫'],
 pinyin: 'baiyangzuo',
 category: 'sign',
 summary: '黄道十二宫的第一宫，象征开端与原始的生命冲动。',
 content: '白羊座（Aries）是黄道带的起点，对应春分点。在占星学中，它由[火星](wiki://planet/mars)守护，代表着直接的行动力与开拓精神。',
 sources: [{ text: 'Ptolemy Tetrabiblos', confidence: 'legendary' }],
 confidence: 'verified',
 disclaimer: '星座特质描述属于占星学文化范畴，请勿将其作为人格测试的科学定论。',
 ready: true,
 updatedAt: '2026-08-20',
 },
 {
 id: 'taurus',
 title: '金牛座 (Taurus)',
 aliases: ['金牛宫'],
 pinyin: 'jinniuzuo',
 category: 'sign',
 summary: '黄道十二宫的第二宫，象征物质、稳定与感官体验。',
 content: '金牛座（Taurus）属于土象星座，由[金星](wiki://planet/venus)守护。它关注资源的积累、感官的享受以及环境的稳定性。',
 sources: [{ text: 'Ptolemy Tetrabiblos', confidence: 'legendary' }],
 confidence: 'verified',
 disclaimer: '星座特质描述属于占星学文化范畴，请勿将其作为人格测试的科学定论。',
 ready: true,
 updatedAt: '2026-08-20',
 },
];
