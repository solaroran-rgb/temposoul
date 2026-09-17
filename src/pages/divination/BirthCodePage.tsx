import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { BirthDayPicker } from '@/components/divination/BirthDayPicker';
import { BIRTH_CODE_ENTRIES, BirthCodeEntry } from '@/data/divination/birth-code';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';

export default function BirthCodePage() {
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [state, setState] = useState<LookupState>('idle');
  const [entry, setEntry] = useState<BirthCodeEntry | null>(null);

  useEffect(() => { trackPageView('/divination/birth-code'); }, []);

  const lookup = () => {
    setState('loading');
    const found = BIRTH_CODE_ENTRIES.find((x) => x.monthDay === `${month}-${day}`) ?? null;
    setEntry(found);
    setState(found?.ready ? 'ok' : 'ok-empty');
    trackEvent('birth_code_lookup', { month, day });
  };

  return (
    <LookupCardLayout
      title="生日密码"
      state={state}
      renderPicker={() => (
        <div>
          <BirthDayPicker month={month} day={day} onChange={(m, d) => { setMonth(m); setDay(d); }} />
          <button onClick={lookup}>查看</button>
        </div>
      )}
      renderResult={() => entry && (
        <div>
          <h2>{guardText(entry.title)}</h2>
          <p>{guardText(entry.body)}</p>
          <p>关键词：{entry.keywords.map(guardText).join('、')}</p>
          <small>{guardText(entry.source.text)} · <span className="confidence-badge">{entry.confidence}</span></small>
          <p>{guardText(entry.disclaimer)}</p>
        </div>
      )}
      emptyMessages={{ 'ok-empty': '该日期生日密码数据准备中', idle: '请选择生日' }}
    />
  );
}
