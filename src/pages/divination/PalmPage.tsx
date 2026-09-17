import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { PALM_ENTRIES, PalmEntry } from '@/data/divination/palm';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';

export default function PalmPage() {
  const [lineId, setLineId] = useState('heart');
  const [state, setState] = useState<LookupState>('idle');
  const [entry, setEntry] = useState<PalmEntry | null>(null);

  useEffect(() => { trackPageView('/divination/palm'); }, []);

  const lookup = () => {
    setState('loading');
    const found = PALM_ENTRIES.find((x) => x.lineId === lineId) ?? null;
    setEntry(found);
    setState(found?.ready ? 'ok' : 'ok-empty');
    trackEvent('palm_lookup', { line_id: lineId });
  };

  return (
    <LookupCardLayout
      title="手相"
      state={state}
      renderPicker={() => (
        <div>
          <select value={lineId} onChange={(e) => setLineId(e.target.value)}>
            {PALM_ENTRIES.map((x) => <option key={x.lineId} value={x.lineId}>{x.title}</option>)}
          </select>
          <button onClick={lookup}>查看</button>
        </div>
      )}
      renderResult={() => entry && (
        <div>
          <h2>{guardText(entry.title)}</h2>
          <div className="palm-columns">
            <section><h3>医学功能</h3><p>{guardText(entry.medicalFunction)}</p></section>
            <section><h3>民俗说法</h3><p>{guardText(entry.folkClaim)}</p></section>
          </div>
          <small>{guardText(entry.source.text)} · <span className="confidence-badge">{entry.confidence}</span></small>
          <p>{guardText(entry.disclaimer)}</p>
        </div>
      )}
      emptyMessages={{ 'ok-empty': '该线数据准备中', idle: '请选择掌线' }}
    />
  );
}
