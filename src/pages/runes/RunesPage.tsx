import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { RUNE_ENTRIES, RuneEntry } from '@/data/runes';
import { seqSeed, pickBySeed } from '@/lib/deterministic';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function RunesPage() {
  const [state, setState] = useState<LookupState>('idle');
  const [entry, setEntry] = useState<RuneEntry | null>(null);
  const [clickSeq, setClickSeq] = useState(0);
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => { trackPageView('/runes'); }, []);

  const draw = () => {
    setState('loading');
    const dateKey = todayKey();
    const seed = seqSeed(dateKey, clickSeq);
    const picked = pickBySeed(RUNE_ENTRIES, seed);
    setEntry(picked);
    setIsReversed(seed % 3 === 0);
    setClickSeq((n) => n + 1);
    setState(picked.ready ? 'ok' : 'ok-empty');
    trackEvent('rune_draw', { rune_id: picked.id, seq: clickSeq });
  };

  return (
    <LookupCardLayout
      title="如尼符文"
      state={state}
      renderPicker={() => <button onClick={draw}>抽取符文</button>}
      renderResult={() => entry && (
        <div>
          <h2>{entry.symbol} {guardText(entry.name)}{isReversed ? '（逆）' : ''}</h2>
          <p>音值：{guardText(entry.phonetic)}</p>
          <p>{guardText(entry.meaning)}</p>
          {isReversed && entry.reversedMeaning && <p>{guardText(entry.reversedMeaning)}</p>}
          <small><span className="confidence-badge">{entry.confidence}</span></small>
          <p>{guardText(entry.disclaimer)}</p>
        </div>
      )}
      emptyMessages={{ 'ok-empty': '该符文数据准备中', idle: '点击抽取' }}
    />
  );
}
