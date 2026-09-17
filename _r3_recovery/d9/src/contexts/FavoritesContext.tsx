// D9-2
// src/contexts/FavoritesContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { safeStorage } from '../lib/safe-storage';
import { FavoriteItem } from '../types/favorites';
import { useAuth } from '../lib/auth/AuthContext';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  isFavorited: (type: FavoriteItem['type'], refId: string) => boolean;
  toggle: (item: Omit<FavoriteItem, 'id' | 'createdAt'>) => void;
  remove: (id: string) => void;
  clear: () => void;
  exportJSON: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storageKey = user ? `temposoul:favorites:${user.id}` : 'temposoul:favorites:anon';

  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => 
    safeStorage.getJSON<FavoriteItem[]>(storageKey, [])
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 升维：统一的防抖提交管道
  const commitToStorage = useCallback((items: FavoriteItem[], key: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      safeStorage.setJSON(key, items);
    }, 300);
  }, []);

  // 升维：自动监听 Auth 变化，无感触发匿名数据合并
  useEffect(() => {
    if (user) {
      const anonKey = 'temposoul:favorites:anon';
      const anonList = safeStorage.getJSON<FavoriteItem[]>(anonKey, []);
      if (anonList.length > 0) {
        const userKey = `temposoul:favorites:${user.id}`;
        const userList = safeStorage.getJSON<FavoriteItem[]>(userKey, []);

        const map = new Map<string, FavoriteItem>();
        userList.forEach(i => map.set(i.id, i));
        anonList.forEach(i => {
          const ex = map.get(i.id);
          if (!ex || new Date(i.createdAt) > new Date(ex.createdAt)) map.set(i.id, i);
        });

        const merged = Array.from(map.values());
        setFavorites(merged);
        safeStorage.setJSON(userKey, merged);
        safeStorage.remove(anonKey);
      }
    }
  }, [user]);

  useEffect(() => {
    setFavorites(safeStorage.getJSON<FavoriteItem[]>(storageKey, []));
  }, [storageKey]);

  const isFavorited = useCallback((type: FavoriteItem['type'], refId: string) => {
    return favorites.some(f => f.type === type && f.refId === refId);
  }, [favorites]);

  const toggle = useCallback((item: Omit<FavoriteItem, 'id' | 'createdAt'>) => {
    setFavorites(prev => {
      const existing = prev.find(f => f.type === item.type && f.refId === item.refId);
      let next: FavoriteItem[];
      if (existing) {
        next = prev.filter(f => f.id !== existing.id);
      } else {
        const newItem: FavoriteItem = {
          ...item,
          id: `${item.type}-${item.refId}`,
          createdAt: new Date().toISOString()
        };
        next = [newItem, ...prev];
      }
      commitToStorage(next, storageKey);
      return next;
    });
  }, [storageKey, commitToStorage]);

  const remove = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.filter(f => f.id !== id);
      commitToStorage(next, storageKey);
      return next;
    });
  }, [storageKey, commitToStorage]);

  const clear = useCallback(() => {
    setFavorites([]);
    commitToStorage([], storageKey);
  }, [storageKey, commitToStorage]);

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(favorites, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'temposoul-favorites.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorited, toggle, remove, clear, exportJSON }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
