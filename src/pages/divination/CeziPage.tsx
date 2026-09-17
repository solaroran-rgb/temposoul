import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { CEZI_ENTRIES, CeziEntry } from '@/data/divination/cezi';
import { djb2 } from '@/lib/hash';
import { seedToIndex } from '@/lib/deterministic';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';
import './CeziPage.css';

export default function CeziPage() {
  const [text, setText] = useState('');
  const [state, setState] = useState<LookupState>('idle');
  const [entry, setEntry] = useState<CeziEntry | null>(null);

  useEffect(() => { trackPageView('/divination/cezi'); }, []);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) { setState('ok-empty'); return; }
    setState('loading');
    const idx = seedToIndex(parseInt(djb2(trimmed), 36) || 0, CEZI_ENTRIES.length);
    const found = CEZI_ENTRIES[idx];
    setEntry(found);
    setState(found.ready ? 'ok' : 'ok-empty');
    trackEvent('cezi_submit', { chars: trimmed.length, hexagram_id: found.hexagramId });
  };

  return (
    <LookupCardLayout
      title="测字"
      state={state}
      renderPicker={() => (
        <div className="cezi-picker">
          <input
            className="cezi-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="输入汉字"
            maxLength={16}
          />
          <button className="cezi-btn" onClick={submit}>测字</button>
        </div>
      )}
      renderResult={() => entry && (
        <div className="cezi-result">
          <h2>{guardText(entry.title)}</h2>
          <p>{guardText(entry.body)}</p>
          <small>
            {guardText(entry.source.text)} ·
            <span className="confidence-badge">{entry.confidence}</span>
          </small>
          <p className="cezi-disclaimer">{guardText(entry.disclaimer)}</p>
        </div>
      )}
      emptyMessages={{ 'ok-empty': '该字对应卦象数据准备中', idle: '请输入汉字' }}
    />
  );
}
