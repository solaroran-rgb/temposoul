import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { BirthDayPicker } from '@/components/divination/BirthDayPicker';
import { NUMEROLOGY_ENTRIES, NumerologyEntry } from '@/data/divination/numerology';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';

function computeLifeNumber(month: number, day: number): number {
  let sum = String(month).split('').concat(String(day).split('')).reduce((a, b) => a + Number(b), 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, b) => a + Number(b), 0);
  }
  return sum;
}

export default function NumerologyPage() {
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [state, setState] = useState<LookupState>('idle');
  const [entry, setEntry] = useState<NumerologyEntry | null>(null);

  useEffect(() => { trackPageView('/divination/numerology'); }, []);

  const calc = () => {
    setState('loading');
    const n = computeLifeNumber(month, day);
    const found = NUMEROLOGY_ENTRIES.find((x) => x.number === n) ?? null;
    setEntry(found);
    setState(found?.ready ? 'ok' : 'ok-empty');
    trackEvent('numerology_calc', { number: n, is_master: found?.isMaster ?? false });
  };

  return (
    <LookupCardLayout
      title="生命灵数"
      state={state}
      renderPicker={() => (
        <div>
          <BirthDayPicker month={month} day={day} onChange={(m, d) => { setMonth(m); setDay(d); }} />
          <button onClick={calc}>计算</button>
        </div>
      )}
      renderResult={() => entry && (
        <div>
          <h2>{guardText(entry.title)}</h2>
          <p>{guardText(entry.body)}</p>
          <small>{guardText(entry.source.text)} · <span className="confidence-badge">{entry.confidence}</span></small>
          <p>{guardText(entry.disclaimer)}</p>
        </div>
      )}
      emptyMessages={{ 'ok-empty': '该灵数条目数据准备中', idle: '请选择生日' }}
    />
  );
}
