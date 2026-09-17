// 修正：IT-3.1 依据（重映射真实返回结构，显式传入 topic: 'custom'）
// 修正：IT-1.5 依据（使用 safeStorage.getJSON/setJSON）
import { useState, useEffect } from 'react';
import { safeStorage } from '@/lib/safe-storage';

export interface AlmanacGod {
  name: string;
  type: string;
  [key: string]: unknown;
}

export interface AlmanacDayData {
  date: string;
  weekday: string;
  lunarDate: string;
  ganzhi: Record<string, unknown>;
  zodiac: string;
  dayOfficer: string;
  clash: string;
  recommends: string[];
  avoids: string[];
  highlights: string[];
  cautions: string[];
  gods: AlmanacGod[];
}

export interface UseAlmanacDataReturn {
  data: AlmanacDayData | null;
  loading: boolean;
  error: string | null;
}

// 获取设备本地时区的 YYYY-MM-DD 格式日期，防止跨日错乱
function getLocalDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  return formatter.format(date);
}

export function useAlmanacData(targetDate?: string): UseAlmanacDataReturn {
  const [data, setData] = useState<AlmanacDayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAlmanac = async () => {
      setLoading(true);
      setError(null);
      const localDate = targetDate || getLocalDateString();

      // 契约 §4 缓存策略：日级短 TTL，按日期做 Key 天然隔离
      const cacheKey = `temposoul:fortune:almanac:${localDate}`;
      const cached = safeStorage.getJSON<AlmanacDayData | null>(cacheKey, null);

      if (cached) {
        if (isMounted) {
          setData(cached);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch('/api/v1/divination/almanac', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dateType: 'solar',
            topic: 'custom', // 显式传入 topic，确保命中 IT-3.1 真实结构
            startDate: localDate,
            endDate: localDate,
            responseMode: 'full',
          }),
        });

        const json = await response.json();
        if (!json.ok) throw new Error(json.error?.message || '黄历数据加载失败');

        const day = json.data?.days?.[0];
        if (!day) throw new Error('未获取到当日黄历数据');

        const mappedData: AlmanacDayData = {
          date: day.date || localDate,
          weekday: day.weekday || '',
          lunarDate: day.lunarDate || '',
          ganzhi: day.ganzhi || {},
          zodiac: day.zodiac || '',
          dayOfficer: day.dayOfficer || '',
          clash: day.clash || '',
          recommends: day.recommends || [],
          avoids: day.avoids || [],
          highlights: day.highlights || [],
          cautions: day.cautions || [],
          gods: day.gods || [],
        };

        if (isMounted) {
          setData(mappedData);
          safeStorage.setJSON(cacheKey, mappedData);
        }
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : '黄历数据加载失败');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAlmanac();
    return () => {
      isMounted = false;
    };
  }, [targetDate]);

  return { data, loading, error };
}
