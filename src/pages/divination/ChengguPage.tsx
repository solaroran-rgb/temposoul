import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { ContentShell } from '@/components/content/ContentShell';
import {
  calcChenggu,
  CHENGGU_SOURCE,
  HOUR_ORDER,
  CHENGGU_TABLE_VERIFIED,
} from '@/data/divination/chenggu';
import { LunarUtil } from '@temposoul/core/calendar';
import { guardText } from '@/lib/assertions-guard';
import { readUx, writeUx, TTL_30D } from '@/data/content/ux-store';
import { trackEvent, trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './chenggu-page.css';

interface LastInput {
  dateTime: string;
  gender: 'male' | 'female';
}

export default function ChengguPage(): ReactElement {
  const [state, setState] = useState<PageState>('idle');
  const [dateTime, setDateTime] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [result, setResult] = useState<ReturnType<typeof calcChenggu> | null>(null);
  const [hint, setHint] = useState<string>('');

  useEffect(() => {
    trackPageView('/divination/chenggu');
    const last = readUx<LastInput>('divination', 'chenggu', 'last-input');
    if (last) {
      setDateTime(last.dateTime);
      setGender(last.gender);
    }
  }, []);

  function handleCalc(): void {
    if (!dateTime) {
      setHint('请先选择出生日期与时间');
      setState('ok-empty');
      return;
    }
    setState('loading');
    try {
      const date = new Date(dateTime);
      if (Number.isNaN(date.getTime())) throw new Error('日期无效');
      const lunar = LunarUtil.getLunar(date);
      if (!lunar) throw new Error('农历换算失败');

      const hourZhi = String(lunar.hour ?? '').slice(-1);
      const res = calcChenggu({
        yearGanzhi: lunar.year,
        monthNumber: lunar.monthNumber,
        dayNumber: lunar.dayNumber,
        hourZhi,
        gender,
      });

      setResult(res);

      // L2 降级：时辰地支未落在 12 时辰内
      if (!HOUR_ORDER.includes(hourZhi)) {
        setState('degraded');
        trackEvent('chenggu_calc', { level: res.level, degraded: true });
        return;
      }

      setState('ok');
      writeUx<LastInput>('divination', { dateTime, gender }, TTL_30D, 'chenggu', 'last-input');
      trackEvent('chenggu_calc', { level: res.level, degraded: false });
    } catch (err) {
      setHint(err instanceof Error ? err.message : '计算失败');
      setState('error');
    }
  }

  return (
    <ContentShell
      title="称骨算命"
      state={state}
      confidence="legendary"
      emptyHint={hint || '请填写出生信息'}
      errorHint={hint || '计算失败，请稍后重试'}
    >
      <div className="chenggu__form">
        <label className="chenggu__label">
          出生日期与时间
          <input
            className="chenggu__input"
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </label>
        <label className="chenggu__label">
          性别
          <select
            className="chenggu__select"
            value={gender}
            onChange={(e) => setGender(e.target.value === 'female' ? 'female' : 'male')}
          >
            <option value="male">男</option>
            <option value="female">女</option>
          </select>
        </label>
        <button type="button" className="chenggu__submit" onClick={handleCalc}>
          计算骨重
        </button>
      </div>

      {result && (
        <section className="chenggu__result">
          <p className="chenggu__total">
            总骨重 <strong>{result.totalLabel}</strong>
          </p>
          <p className="chenggu__breakdown">
            年 {result.yearWeight} 钱 · 月 {result.monthWeight} 钱 · 日 {result.dayWeight} 钱 · 时{' '}
            {result.hourWeight} 钱（合计 {result.totalQian} 钱）
          </p>
          <p className="chenggu__poem">{guardText(result.poem)}</p>
          {result.genderNote ? <p className="chenggu__gender">{guardText(result.genderNote)}</p> : null}
          {result.poemPending && <p className="chenggu__pending">该档位判词尚未收录，暂不提供释义。</p>}
        </section>
      )}

      <p className="chenggu__source">来源：{CHENGGU_SOURCE}</p>
      {!CHENGGU_TABLE_VERIFIED && (
        <p className="chenggu__verify">数据版本提示：骨重表尚未与权威版本逐项核验，结果仅供文化参考。</p>
      )}
    </ContentShell>
  );
}
