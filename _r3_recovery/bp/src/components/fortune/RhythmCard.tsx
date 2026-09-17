// B'11-5 src/components/fortune/RhythmCard.tsx
/**
 * 首页节律卡片
 * @module B'11-5
 */
import { useState, useEffect } from 'react';
import { readRecords, type PersonalHistoryRecord } from '@/lib/history-records';
import { safeStorage } from '@/lib/safe-storage';
import { generateRhythm } from '@/pages/fortune/lib/rhythm-engine';
import { guardText } from '@/lib/assertions-guard';
import PrivacyHint from '@/components/PrivacyHint';

export function RhythmCard() {
  const [rhythm, setRhythm] = useState<ReturnType<typeof generateRhythm> | null>(null);

  useEffect(() => {
    try {
      const records = readRecords<PersonalHistoryRecord>();
      if (!Array.isArray(records) || records.length === 0) return;
      const latest = records[0];
      if (!latest?.date || !latest?.pillars) return;
      const today = new Date().toISOString().slice(0, 10);
      setRhythm(generateRhythm({
        dayPillar: latest.pillars.day?.ganZhi ?? '',
        zodiac: latest.zodiac ?? '',
        signId: latest.signId,
      }, today));

      const prefs = safeStorage.getJSON<{ rhythmReminder?: boolean }>('temposoul:settings:push_preferences', {});
      const lastToast = safeStorage.getJSON<string>('lastRhythmToastDate', '');
      if (prefs.rhythmReminder && lastToast !== today) {
        safeStorage.setJSON('lastRhythmToastDate', today);
      }
    } catch { /* 静默降级 */ }
  }, []);

  if (!rhythm) {
    return <div className="rhythm-card rhythm-card--empty"><p>{guardText('完成排盘后显示每日节律')}</p></div>;
  }

  return (
    <article className="rhythm-card" aria-label="每日节律">
      <h3 className="rhythm-card__title">今日节律</h3>
      <dl className="rhythm-card__list">
        <div><dt>焦点</dt><dd>{guardText(rhythm.focus)}</dd></div>
        <div><dt>建议</dt><dd>{guardText(rhythm.advice)}</dd></div>
        <div><dt>提醒</dt><dd>{guardText(rhythm.reminder)}</dd></div>
      </dl>
      <PrivacyHint />
    </article>
  );
}
