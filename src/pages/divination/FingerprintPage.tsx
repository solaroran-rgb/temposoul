import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { FINGERPRINT_ENTRIES, FingerprintEntry } from '@/data/divination/fingerprint';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';

export default function FingerprintPage() {
  const [dou, setDou] = useState(0);
  const [state, setState] = useState<LookupState>('idle');
  const [entry, setEntry] = useState<FingerprintEntry | null>(null);

  useEffect(() => { trackPageView('/divination/fingerprint'); }, []);

  const lookup = () => {
    setState('loading');
    const found = FINGERPRINT_ENTRIES.find((x) => x.douCount === dou) ?? null;
    setEntry(found);
    setState(found?.ready ? 'ok' : 'ok-empty');
    trackEvent('fingerprint_lookup', { dou });
  };

  return (
    <LookupCardLayout
      title="指纹斗数"
      state={state}
      renderPicker={() => (
        <div>
          <select value={dou} onChange={(e) => setDou(Number(e.target.value))}>
            {Array.from({ length: 11 }, (_, i) => i).map((n) => (
              <option key={n} value={n}>{n}斗</option>
            ))}
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
      emptyMessages={{ 'ok-empty': '该斗数条目数据准备中', idle: '请选择斗数' }}
    />
  );
}
