import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { TAROT_CARD_MEANINGS, TarotCardMeaning } from '@/data/tarot/card-meanings';
import { dateSeed, pickBySeed } from '@/lib/deterministic';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function DailyTarotPage() {
  const [state, setState] = useState<LookupState>('idle');
  const [card, setCard] = useState<TarotCardMeaning | null>(null);
  const [reversed, setReversed] = useState(false);

  useEffect(() => { trackPageView('/tarot/daily'); }, []);

  const draw = () => {
    setState('loading');
    const dateKey = todayKey();
    const seed = dateSeed(dateKey);
    const picked = pickBySeed(TAROT_CARD_MEANINGS, seed);
    setCard(picked);
    setReversed(seed % 2 === 1);
    setState(picked.ready ? 'ok' : 'ok-empty');
    trackEvent('tarot_daily_draw', { card_id: picked.id, reversed: seed % 2 === 1, date_key: dateKey });
  };

  return (
    <LookupCardLayout
      title="每日塔罗"
      state={state}
      renderPicker={() => <button onClick={draw}>抽取今日塔罗</button>}
      renderResult={() => card && (
        <div>
          <h2>{guardText(card.name)}{reversed ? '（逆位）' : '（正位）'}</h2>
          <p>{guardText(reversed ? card.reversed : card.upright)}</p>
          <small><span className="confidence-badge">{card.confidence}</span></small>
          <p>{guardText(card.disclaimer)}</p>
        </div>
      )}
      emptyMessages={{ 'ok-empty': '该牌义数据准备中', idle: '点击抽取' }}
    />
  );
}
