// 封装 Push 权限与本地存储逻辑，供 B 域 DailyRhythmCard 直接调用（专家 D 第6轮交付）
import { useState, useEffect } from 'react';
import { safeStorage } from '../lib/safe-storage';

export type PushState = 'unsupported' | 'denied' | 'granted' | 'prompting';

export interface PushPreferences {
  almanac: boolean;
  astrology: boolean;
  dailyRedDot: boolean; // 降级方案：应用内红点
}

const DEFAULT_PREFS: PushPreferences = { almanac: false, astrology: false, dailyRedDot: false };

export const usePushSettings = () => {
  const [pushState, setPushState] = useState<PushState>('prompting');
  const [prefs, setPrefs] = useState<PushPreferences>({ ...DEFAULT_PREFS });

  useEffect(() => {
    if (!('Notification' in window)) {
      setPushState('unsupported');
      setPrefs((prev) => ({
        ...prev,
        dailyRedDot: safeStorage.getJSON('temposoul:settings:daily_red_dot', false),
      }));
      return;
    }
    if (Notification.permission === 'granted') {
      setPushState('granted');
      setPrefs(safeStorage.getJSON('temposoul:settings:push_preferences', { ...DEFAULT_PREFS }));
    } else if (Notification.permission === 'denied') {
      setPushState('denied');
    }
  }, []);

  const requestPermission = async () => {
    setPushState('prompting');
    const permission = await Notification.requestPermission();
    setPushState(permission === 'granted' ? 'granted' : 'denied');
    if (permission === 'granted') {
      setPrefs(safeStorage.getJSON('temposoul:settings:push_preferences', { ...DEFAULT_PREFS }));
    }
  };

  const updatePref = (key: keyof PushPreferences, value: boolean) => {
    const newPrefs = { ...prefs, [key]: value };
    setPrefs(newPrefs);
    if (key === 'dailyRedDot') {
      safeStorage.setJSON('temposoul:settings:daily_red_dot', value);
    } else {
      safeStorage.setJSON('temposoul:settings:push_preferences', newPrefs);
    }
  };

  return { pushState, prefs, requestPermission, updatePref };
};
