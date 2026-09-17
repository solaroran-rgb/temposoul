import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { SUPERSTITION_ENTRIES, SuperstitionEntry } from '@/data/divination/superstition';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';

export default function SuperstitionPage() {
  const [kind, setKind] = useState<'eye-twitch' | 'sneeze'>('eye-twitch');
  const [period, setPeriod] = useState('子时');
  const [state, setState] = useState<LookupState>('idle');
  const [entry, setEntry] = useState<SuperstitionEntry | null>(null);

  useEffect(() => { trackPageView('/divination/superstition'); }, []);

  const lookup = () => {
    setState('loading');
    const found = SUPERSTITION_ENTRIES.find((x) => x.kind === kind && x.period === period) ?? null;
    setEntry(found);
    setState(found?.ready ? 'ok' : 'ok-empty');
    trackEvent('superstition_lookup', { kind, period });
  };

  return (
    <LookupCardLayout
      title="眼跳喷嚏"
      state={state}
      renderPicker={() => (
        <div>
          <select value={kind} onChange={(e) => setKind(e.target.value as 'eye-twitch' | 'sneeze')}>
            <option value="eye-twitch">眼跳</option>
            <option value="sneeze">喷嚏</option>
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            {['子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时'].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={lookup}>查看</button>
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
      emptyMessages={{ 'ok-empty': '该时辰条目数据准备中', idle: '请选择类型与时辰' }}
    />
  );
}
