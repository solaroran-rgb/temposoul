// D9-2
// src/components/favorites/FavoriteButton.tsx
import React from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { FavoriteItem } from '../../types/favorites';

interface Props {
  type: FavoriteItem['type'];
  refId: string;
  title: string;
  system?: string;
}

export const FavoriteButton: React.FC<Props> = ({ type, refId, title, system }) => {
  const { isFavorited, toggle } = useFavorites();
  const active = isFavorited(type, refId);

  return (
    <button 
      className={`favorite-btn ${active ? 'favorite-btn--active' : ''}`}
      onClick={() => toggle({ type, refId, title, system })}
      aria-label={active ? '取消收藏' : '收藏'}
      aria-pressed={active}
    >
      {active ? '★' : '☆'}
    </button>
  );
};
