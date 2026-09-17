// src/components/names/NameCard.tsx
import { FavoriteButton } from '@/components/favorites/FavoriteButton';
import type { NameCatalogEntry } from '@/data/names/catalog-index';

interface Props {
  entry: NameCatalogEntry;
}

export default function NameCard({ entry }: Props) {
  return (
    <div className="name-card">
      <h3>{entry.name}</h3>
      <p>{entry.pinyin}</p>
      <p>
        五行：{entry.wuxing} | 笔画：{entry.strokes}
      </p>
      <p>{entry.meaning}</p>
      <FavoriteButton type="name" refId={entry.id} title={entry.name} />
    </div>
  );
}
