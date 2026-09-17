// src/data/onomastics/lucky-strokes.ts
export interface LuckyStroke {
  number: number;
  isLucky: boolean;
  description: string;
}

export const LUCKY_STROKES: LuckyStroke[] = [
  { number: 1, isLucky: true, description: '万象起始，大展宏图' },
  { number: 2, isLucky: false, description: '混沌未定，宜守不宜攻' },
  { number: 3, isLucky: true, description: '进取如意，名利双收' },
  { number: 4, isLucky: false, description: '波澜起伏，宜谨慎' },
  { number: 5, isLucky: true, description: '福禄长寿，德望高' },
  { number: 6, isLucky: true, description: '安稳吉庆，天德地祥' },
  { number: 7, isLucky: false, description: '刚毅果断，但多波折' },
  { number: 8, isLucky: true, description: '意志坚固，成就大业' },
  { number: 9, isLucky: false, description: '虽吉但劳心，宜守成' },
  { number: 10, isLucky: false, description: '空虚无实，宜静守' },
  // ... 节选，实际应补全 81 数
];

export function getLuckyStroke(number: number): LuckyStroke {
  return (
    LUCKY_STROKES.find((l) => l.number === number) ?? {
      number,
      isLucky: false,
      description: '数理含义待补充',
    }
  );
}
