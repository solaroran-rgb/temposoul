// D9-3
// src/contexts/ProfilesContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { safeStorage } from '../lib/safe-storage';
import { UserProfile } from '../types/profile';

interface ProfilesContextType {
  profiles: UserProfile[];
  currentProfile: UserProfile | null;
  add: (p: Omit<UserProfile, 'id'>) => UserProfile | null;
  update: (p: UserProfile) => void;
  remove: (id: string) => void;
  setCurrent: (id: string) => void;
}

const ProfilesContext = createContext<ProfilesContextType | undefined>(undefined);

// 升维：高熵 ID 生成，兼容非 HTTPS 环境
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
};

export const ProfilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() =>
    safeStorage.getJSON<UserProfile[]>('temposoul:profiles', []),
  );
  const [currentId, setCurrentId] = useState<string | null>(() =>
    safeStorage.getJSON<string | null>('temposoul:profiles:current', null),
  );

  useEffect(() => {
    safeStorage.setJSON('temposoul:profiles', profiles);
  }, [profiles]);

  useEffect(() => {
    safeStorage.setJSON('temposoul:profiles:current', currentId);
  }, [currentId]);

  const currentProfile =
    profiles.find((p) => p.id === currentId) || profiles.find((p) => p.isDefault) || null;

  const add = useCallback(
    (p: Omit<UserProfile, 'id'>) => {
      if (profiles.length >= 20) return null;
      const newP: UserProfile = { ...p, id: generateId() };
      setProfiles((prev) => [...prev, newP]);
      return newP;
    },
    [profiles],
  );

  const update = useCallback((p: UserProfile) => {
    setProfiles((prev) => prev.map((x) => (x.id === p.id ? p : x)));
  }, []);

  const remove = useCallback(
    (id: string) => {
      setProfiles((prev) => prev.filter((x) => x.id !== id));
      if (currentId === id) setCurrentId(null);
    },
    [currentId],
  );

  const setCurrent = useCallback((id: string) => {
    setCurrentId(id);
  }, []);

  return (
    <ProfilesContext.Provider value={{ profiles, currentProfile, add, update, remove, setCurrent }}>
      {children}
    </ProfilesContext.Provider>
  );
};

export function useProfiles() {
  const ctx = useContext(ProfilesContext);
  if (!ctx) throw new Error('useProfiles must be used within ProfilesProvider');
  return ctx;
}
