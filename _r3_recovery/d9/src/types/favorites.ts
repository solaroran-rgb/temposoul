// D9-2
// src/types/favorites.ts
export interface FavoriteItem {
  id: string;
  type: 'chart' | 'article' | 'name';
  refId: string;
  title: string;
  system?: string;
  tags?: string[];
  createdAt: string;
}
