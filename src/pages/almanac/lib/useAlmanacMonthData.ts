// B'11-1 src/pages/almanac/lib/useAlmanacMonthData.ts（数据关修正：真实 API 批量获取，移除 mock 假数据）
/**
 * 黄历月历数据获取 Hook
 * 数据关修正：不再使用 mock 假数据，改为与 useAlmanacData 同源的
 * POST /api/v1/divination/almanac 真实接口。
 *
 * 2026-09-18 修复：整月一次性请求（responseMode=full）因每日携带月相求根证据，
 * 30 天序列化后超过 Worker 1MB 响应上限，返回 413 RESPONSE_TOO_LARGE，
 * 导致 monthState=error、页面降级为「部分数据暂不可用」。
 * 现按 15 天分片 + detailMode=compact（剥离 moonPhaseEvidence 等重字段）拉取，
 * 每片约 0.5MB，合并去重排序后回填。月历视图仅需 date/recommends/avoids 三字段。
 */
import { useState, useEffect } from 'react';
import { safeStorage } from '@/lib/safe-storage';
import type { AlmanacDayData } from '@/hooks/useAlmanacData';

export type MonthState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function monthRange(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${pad(month)}-${pad(lastDay)}`;
  return { start, end };
}

// 将整月 [start, end] 按 15 天切片，避免单日 full 数据撑爆 1MB 响应上限
const CHUNK_DAYS = 15;

function chunkRange(start: string, end: string): Array<{ start: string; end: string }> {
  const chunks: Array<{ start: string; end: string }> = [];
  const cursor = new Date(`${start}T00:00:00Z`);
  const endDate = new Date(`${end}T00:00:00Z`);
  while (cursor <= endDate) {
    const chunkEnd = new Date(cursor);
    chunkEnd.setUTCDate(chunkEnd.getUTCDate() + CHUNK_DAYS - 1);
    // 直接对齐到整月结束日，避免只 setUTCDate(日号) 导致跨月错位
    if (chunkEnd > endDate) chunkEnd.setTime(endDate.getTime());
    chunks.push({
      start: cursor.toISOString().slice(0, 10),
      end: chunkEnd.toISOString().slice(0, 10),
    });
    cursor.setUTCDate(chunkEnd.getUTCDate() + 1);
  }
  return chunks;
}

function mapDay(day: unknown): AlmanacDayData {
  const d = day as Record<string, unknown>;
  return {
    date: (d.date as string) || '',
    weekday: (d.weekday as string) || '',
    lunarDate: (d.lunarDate as string) || '',
    ganzhi: (d.ganzhi as Record<string, unknown>) || {},
    zodiac: (d.zodiac as string) || '',
    dayOfficer: (d.dayOfficer as string) || '',
    clash: (d.clash as string) || '',
    recommends: (d.recommends as string[]) || [],
    avoids: (d.avoids as string[]) || [],
    highlights: (d.highlights as string[]) || [],
    cautions: (d.cautions as string[]) || [],
    gods: (d.gods as AlmanacDayData['gods']) || [],
  };
}

export function useAlmanacMonthData(year: number, month: number) {
  const [state, setState] = useState<MonthState>('idle');
  const [days, setDays] = useState<AlmanacDayData[]>([]);

  useEffect(() => {
    let isMounted = true;
    setState('loading');
    const { start, end } = monthRange(year, month);
    const cacheKey = `temposoul:fortune:almanac:month:${start}`;

    const cached = safeStorage.getJSON<AlmanacDayData[] | null>(cacheKey, null);
    if (cached && cached.length > 0) {
      if (isMounted) {
        setDays(cached);
        setState('ok');
      }
      return;
    }

    const fetchChunk = async (chunk: { start: string; end: string }): Promise<AlmanacDayData[]> => {
      const response = await fetch('/api/v1/divination/almanac', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dateType: 'solar',
          topic: 'custom',
          startDate: chunk.start,
          endDate: chunk.end,
          detailMode: 'compact', // 关键：剥离月相求根证据，把单日体积从 ~47KB 降到可接受范围
        }),
      });
      const json = await response.json();
      if (!json.ok) throw new Error(json.error?.message || '黄历数据加载失败');
      const rawDays: unknown[] = json.data?.days ?? [];
      return rawDays.map(mapDay);
    };

    const fetchMonth = async () => {
      try {
        const chunks = chunkRange(start, end);
        // 并行拉取各分片，任一片失败不阻断整体，全部失败才判 error
        const results = await Promise.allSettled(chunks.map(fetchChunk));
        const merged: AlmanacDayData[] = [];
        let okCount = 0;
        for (const r of results) {
          if (r.status === 'fulfilled') {
            okCount += 1;
            merged.push(...r.value);
          }
        }
        if (isMounted) {
          if (okCount === 0) {
            setState('error');
            return;
          }
          // 按日期去重并升序排序
          const byDate = new Map<string, AlmanacDayData>();
          for (const d of merged) {
            if (d.date) byDate.set(d.date, d);
          }
          const sorted = Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
          setDays(sorted);
          setState(sorted.length > 0 ? 'ok' : 'ok-empty');
          if (sorted.length > 0) safeStorage.setJSON(cacheKey, sorted);
        }
      } catch {
        if (isMounted) setState('error');
      }
    };

    fetchMonth();
    return () => {
      isMounted = false;
    };
  }, [year, month]);

  return { state, days };
}
