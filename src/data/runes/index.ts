export interface RuneEntry {
  id: string;
  name: string;
  symbol: string;
  phonetic: string;
  meaning: string;
  reversedMeaning?: string;
  ready: boolean;
  confidence: 'verified' | 'probable' | 'legendary';
  disclaimer: string;
}

const RUNES: [string, string, string, string][] = [
  ['Fehu','ᚠ','F','财富与资源'], ['Uruz','ᚢ','U','力量与健康'], ['Thurisaz','ᚦ','Th','挑战与保护'],
  ['Ansuz','ᚨ','A','沟通与智慧'], ['Raidho','ᚱ','R','旅行与秩序'], ['Kenaz','ᚲ','K','创意与知识'],
  ['Gebo','ᚷ','G','礼物与交换'], ['Wunjo','ᚹ','W','喜悦与和谐'], ['Hagalaz','ᚺ','H','变化与突破'],
  ['Nauthiz','ᚾ','N','需求与忍耐'], ['Isa','ᛁ','I','静止与内省'], ['Jera','ᛃ','J','收获与周期'],
  ['Eihwaz','ᛇ','Ei','坚韧与转化'], ['Perthro','ᛈ','P','命运与未知'], ['Algiz','ᛉ','Z','保护与连接'],
  ['Sowilo','ᛊ','S','太阳与成功'], ['Tiwaz','ᛏ','T','正义与勇气'], ['Berkano','ᛒ','B','生长与关怀'],
  ['Ehwaz','ᛖ','E','移动与信任'], ['Mannaz','ᛗ','M','自我与群体'], ['Laguz','ᛚ','L','水与直觉'],
  ['Ingwaz','ᛜ','Ng','种子与潜能'], ['Dagaz','ᛞ','D','黎明与觉醒'], ['Othala','ᛟ','O','家园与传承'],
];

export const RUNE_ENTRIES: RuneEntry[] = RUNES.map(([name, symbol, phonetic, meaning], i) => ({
  id: `rune-${i}`,
  name,
  symbol,
  phonetic,
  meaning,
  reversedMeaning: `${meaning}的反向提醒。`,
  ready: true,
  confidence: 'legendary',
  disclaimer: '如尼符文仅供文化娱乐与自我反思参考，不构成决策依据。',
}));
