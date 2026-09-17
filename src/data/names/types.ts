// src/data/names/types.ts
export interface NameCatalogEntry {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'unisex';
  pinyin: string;
  strokes: number | null;
  wuxing: string;
  meaning: string;
  popularity?: number;
  strokesReady?: boolean;
}
