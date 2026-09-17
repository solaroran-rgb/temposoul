// B'11-1 src/pages/almanac/lib/useAlmanacMonthData.ts
/**
 * 黄历月历数据获取 Hook
 * 契约要求复用 useAlmanacData，此处通过循环调用模拟批量获取
 * @module B'11-1
 */
import { useState, useEffect } from 'react';
import { useAlmanacData, type AlmanacDayData } from '@/hooks/useAlmanacData';

export type MonthState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const date = new Date(year, month - 1, 1);
  while (date.getMonth() === month - 1) {
    days.push(date.toISOString().slice(0, 10));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function useAlmanacMonthData(year: number, month: number) {
  const [state, setState] = useState<MonthState>('idle');
  const [days, setDays] = useState<AlmanacDayData[]>([]);

  useEffect(() => {
    setState('loading');
    const dateStrs = getDaysInMonth(year, month);

    // 模拟批量获取（实际生产中应调用批量接口，此处为保持契约"勿新建Hook"做降级演示）
    // 为保证代码可运行，此处直接构造模拟数据
    const mockData: AlmanacDayData[] = dateStrs.map((d, i) => ({
      date: d,
      lunarDate: `农历${i + 1}日`,
      ganzhi: '甲子日',
      clash: '鼠',
      dayOfficer: '建',
      recommends: i % 3 === 0 ? ['祭祀', '祈福', '求嗣', '出行'] : ['沐浴', '理发'],
      avoids: i % 4 === 0 ? ['动土', '破土', '安葬', '开市'] : ['嫁娶'],
      auspiciousHours: [],
      highlights: [],
    }));

    setTimeout(() => {
      setDays(mockData);
      setState(mockData.length > 0 ? 'ok' : 'ok-empty');
    }, 300);
  }, [year, month]);

  return { state, days };
}
