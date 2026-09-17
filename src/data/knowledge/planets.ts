export type Confidence = 'legendary' | 'verified' | 'probable';

export type ContentBlock =

 | { kind: 'paragraph'; text: string }
 | { kind: 'list'; items: string[] }
 | { kind: 'table'; headers: string[]; rows: string[][] }
 | { kind: 'quote'; text: string; author?: string }
 | { kind: 'callout'; tone: 'boundary' | 'info' | 'warning'; text: string }
 | { kind: 'engineRef'; engineId: string };

export interface KnowledgeArticle {
 slug: string;
 title: string;
 metaDescription: string;
 h1: string;
 category: string;
 tags: string[];
 sections: { heading: string; level: 2 | 3; blocks: ContentBlock[] }[];
 sources: { text: string; confidence: Confidence }[];
 citationStrategy: string;
 reviewedBy: string;
 ready: boolean;
 relatedSlugs: string[];
 confidence: Confidence;
 disclaimer: string;
 updatedAt: string;
}

export const planetsData: KnowledgeArticle[] = [
 {
 slug: 'mars',
 title: '火星 (Mars)',
 metaDescription: '探索火星的天文学物理特征及其在占星学中的象征意义对比。',
 h1: '火星：从红色星球到行动力的象征',
 category: 'planet',
 tags: ['行星', '古典占星', '天文学'],
 sections: [
 {
 heading: '摘要',
 level: 2,
 blocks: [{ kind: 'paragraph', text: '火星是太阳系第四颗行星，在天文学与占星学中扮演着截然不同但同样重要的角色。' }],
 },
 {
 heading: '天文学视角',
 level: 2,
 blocks: [
 { kind: 'paragraph', text: '火星因其表面富含氧化铁而呈现红色，拥有太阳系最高的火山（奥林帕斯山）和最深的峡谷（水手号峡谷）。' },
 ],
 },
 {
 heading: '占星学视角',
 level: 2,
 blocks: [
 { kind: 'paragraph', text: '在传统占星学中，火星被视为行动力、竞争与勇气的象征符号，是白羊座的守护星。' },
 { kind: 'callout', tone: 'boundary', text: '占星学中的"火星"是一个象征原型，与天文学中真实的火星物理实体在概念上是完全分离的。' },
 ],
 },
 ],
 sources: [{ text: 'NASA Mars Exploration Program', confidence: 'verified' }],
 citationStrategy: 'external-link',
 reviewedBy: 'Astro-Science Review Board',
 ready: true,
 relatedSlugs: ['venus'],
 confidence: 'verified',
 disclaimer: '本词条旨在提供天文学与占星学的文化对比科普，不构成任何行为指导。',
 updatedAt: '2026-09-10',
 },
 {
 slug: 'venus',
 title: '金星 (Venus)',
 metaDescription: '金星的物理特征及其在占星学中关于美与价值的象征。',
 h1: '金星：启明星与爱的原型',
 category: 'planet',
 tags: ['行星', '古典占星', '天文学'],
 sections: [
 {
 heading: '摘要',
 level: 2,
 blocks: [{ kind: 'paragraph', text: '金星是距离地球最近的行星，以其浓厚的大气层和极高的表面温度著称。' }],
 },
 ],
 sources: [{ text: 'JPL Horizons System', confidence: 'verified' }],
 citationStrategy: 'external-link',
 reviewedBy: 'Astro-Science Review Board',
 ready: true,
 relatedSlugs: ['mars'],
 confidence: 'verified',
 disclaimer: '本词条旨在提供天文学与占星学的文化对比科普，不构成任何行为指导。',
 updatedAt: '2026-09-12',
 },
];
