export interface TarotCardMeaning {
  id: string;
  name: string;
  arcana: 'major' | 'minor';
  upright: string;
  reversed: string;
  ready: boolean;
  confidence: 'verified' | 'probable' | 'legendary';
  disclaimer: string;
}

const MAJOR = [
  '愚者','魔术师','女祭司','女皇','皇帝','教皇','恋人','战车','力量','隐者','命运之轮','正义','倒吊人','死神','节制','恶魔','塔','星星','月亮','太阳','审判','世界'
];

const SUITS = ['权杖','圣杯','宝剑','星币'];
const RANKS = ['Ace','2','3','4','5','6','7','8','9','10','Page','Knight','Queen','King'];

export const TAROT_CARD_MEANINGS: TarotCardMeaning[] = [
  ...MAJOR.map((name, i) => ({
    id: `major-${i}`,
    name,
    arcana: 'major' as const,
    upright: `${name}正位：象征一段值得观察的旅程。`,
    reversed: `${name}逆位：提示重新审视当前方向。`,
    ready: true,
    confidence: 'legendary' as const,
    disclaimer: '塔罗内容仅供文化娱乐与自我反思参考，不构成决策依据。',
  })),
  ...SUITS.flatMap((suit) => RANKS.map((rank, i) => ({
    id: `minor-${suit}-${i}`,
    name: `${suit}${rank}`,
    arcana: 'minor' as const,
    upright: `${suit}${rank}正位：日常层面的象征。`,
    reversed: `${suit}${rank}逆位：提示调整日常节奏。`,
    ready: false,
    confidence: 'legendary' as const,
    disclaimer: '塔罗内容仅供文化娱乐与自我反思参考，不构成决策依据。',
  }))),
];
