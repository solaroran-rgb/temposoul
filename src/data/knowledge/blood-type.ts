export interface BloodTypeEntry {
  type: 'A' | 'B' | 'AB' | 'O';
  historicalOrigin: string;
  folkTraits: string[];
  scientificNote: string;
  reflection: string;
  ready: boolean;
  disclaimer: string;
}

export const BLOOD_TYPE_ENTRIES: BloodTypeEntry[] = [
  { type: 'A', historicalOrigin: '血型性格说源于20世纪初的民间传播。', folkTraits: ['认真', '谨慎', '负责'], scientificNote: '现代心理学未证实血型与性格存在稳定因果关系。', reflection: '你如何看待标签与自我认知？', ready: true, disclaimer: '血型性格内容仅供文化娱乐参考，不构成人格定论。' },
  { type: 'B', historicalOrigin: '血型性格说在流行文化中常被简化传播。', folkTraits: ['自由', '创意', '直率'], scientificNote: '血型与性格关联缺乏可靠科学证据。', reflection: '哪些标签曾影响你？', ready: true, disclaimer: '血型性格内容仅供文化娱乐参考，不构成人格定论。' },
  { type: 'AB', historicalOrigin: 'AB型在血型性格说中常被描述为混合型。', folkTraits: ['理性', '多变', '独立'], scientificNote: '血型不能预测人格或行为。', reflection: '你更认同自己的哪一面？', ready: true, disclaimer: '血型性格内容仅供文化娱乐参考，不构成人格定论。' },
  { type: 'O', historicalOrigin: 'O型在民间叙事中常被赋予领导特质。', folkTraits: ['果断', '乐观', '包容'], scientificNote: '血型与领导力无科学因果关系。', reflection: '你如何定义自己的优势？', ready: true, disclaimer: '血型性格内容仅供文化娱乐参考，不构成人格定论。' },
];
