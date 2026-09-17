import { zodiacWikiData, type AstroWikiEntry } from './zodiac';

export interface ParentingArticle {
 slug: string;
 title: string;
 metaDescription: string;
 zodiacFocus: string[];
 scientific_parenting_tips: string[];
 content: string;
 disclaimer: string;
 confidence: 'legendary' | 'verified' | 'probable';
 ready: boolean;
 updatedAt: string;
}

export const astroWikiRegistry: AstroWikiEntry[] = [
 ...zodiacWikiData,
 {
 id: 'retrograde',
 title: '逆行 (Retrograde)',
 aliases: ['水逆', '行星逆行'],
 pinyin: 'nixing',
 category: 'concept',
 summary: '天文学中的视运动现象，在占星学中被赋予反思与回溯的象征。',
 content: '逆行（Retrograde）并非行星真正倒退，而是由于地球与其他行星公转速度不同产生的视觉错觉（视运动）。在占星学中，如著名的"水逆"，常被解读为沟通、交通或技术容易出现延迟或需要复核的时期。',
 sources: [{ text: 'Astronomical Almanac', confidence: 'verified' }],
 confidence: 'verified',
 disclaimer: '逆行是正常天文现象，占星学解读仅供文化参考，请勿产生不必要的心理焦虑。',
 ready: true,
 updatedAt: '2026-09-01',
 },
];

export const parentingData: ParentingArticle[] = [
 {
 slug: 'fire-sign-child',
 title: '火象星座儿童的性格探索与引导',
 metaDescription: '探讨白羊座、狮子座、射手座儿童在占星学中的性格原型，并结合现代心理学提供科学育儿建议。',
 zodiacFocus: ['白羊座', '狮子座', '射手座'],
 scientific_parenting_tips: [
 '提供充足的户外运动时间以释放精力。',
 '建立清晰且一致的规则边界，避免情绪化惩罚。',
 '鼓励自主选择，在安全范围内允许试错。',
 ],
 content: '火象星座在占星学中通常被描述为充满活力、热情且直接。这类孩子可能表现出较强的领导欲和探索欲。家长应关注他们的精力管理，帮助他们识别和命名自己的情绪，学习延迟满足。',
 disclaimer: '本文内容结合了占星文化探讨与科学育儿建议。星象部分仅供娱乐与文化探索，不构成医疗或心理判断。',
 confidence: 'verified',
 ready: true,
 updatedAt: '2026-09-15',
 },
];
