// src/data/names/popularity-seed.ts
export interface PopularitySeed {
  nameId: string;
  seedViews: number;
}

// 种子热度（标注"参考热度"，站内统计参考，非客观排名）
export const POPULARITY_SEED: PopularitySeed[] = [
  { nameId: 'm001', seedViews: 950 },
  { nameId: 'm002', seedViews: 900 },
  { nameId: 'm003', seedViews: 880 },
  { nameId: 'f001', seedViews: 920 },
  { nameId: 'f002', seedViews: 890 },
  { nameId: 'f003', seedViews: 870 },
  // ... 扩展覆盖常用名字
];
