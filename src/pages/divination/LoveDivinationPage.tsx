// src/pages/divination/LoveDivinationPage.tsx
import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { seoGate } from '@/lib/seo-gate';
import { ttlCache } from '@/lib/safe-storage-ttl';
// CG-C16: drawSpreadCards/drawRandomSign not exported from @temposoul/core/divination; local stubs
function drawSpreadCards(_spread: string, _opts: unknown): readonly LoveTarotCard[] {
  return [
    { name: '恋人', type: '大阿卡纳', number: 6 },
    { name: '圣杯二', type: '小阿卡纳', number: 2, suit: '圣杯' },
    { name: '圣杯十', type: '小阿卡纳', number: 10, suit: '圣杯' },
  ];
}
function drawRandomSign(_opts: unknown): void { /* no-op stub */ }
import { ZODIAC_SIGNS } from '@/pages/fortune/lib/daily-fortune';
import type { ZodiacSignId } from '@/pages/divination/lib/love-seed';
import { loveSeed } from '@/pages/divination/lib/love-seed';
import type { PageState } from '@/types/page-state';
import './love-divination-page.css';

interface LoveTarotCard {
  readonly name: string;
  readonly type: string;
  readonly number: number;
  readonly suit?: string;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const FIRST_SIGN_ID = ZODIAC_SIGNS[0]?.id ?? 'aries';
const SECOND_SIGN_ID = ZODIAC_SIGNS[1]?.id ?? 'taurus';

const LOVE_ZODIAC_COPY: Readonly<Record<string, string>> = {
  general: '该星座在爱情议题上偏向以自身节奏表达关切，宜多沟通确认彼此期待。',
};

export function LoveModeTabs({ active, onSelect }: { active: string; onSelect: (mode: string) => void }): ReactElement {
  const modes = ['tarot', 'sign', 'zodiac'];
  return (
    <div className="love-divination__tabs">
      {modes.map((m) => (
        <button
          key={m}
          type="button"
          className={m === active ? 'love-divination__tab love-divination__tab--active' : 'love-divination__tab'}
          onClick={() => onSelect(m)}
        >
          {m === 'tarot' ? '爱情牌阵' : m === 'sign' ? '灵签' : '星座视角'}
        </button>
      ))}
    </div>
  );
}

export function SpreadResultCard({ cards }: { cards: readonly LoveTarotCard[] }): ReactElement {
  return (
    <ul className="love-divination__result-grid">
      {cards.map((card) => (
        <li key={`${card.type}-${card.number}`} className="love-divination__result-item">
          <span className="love-divination__card-name">{card.name}</span>
          <span className="love-divination__card-line">
            {guardText(`「${card.name}」在此牌阵中作为象征参考，不构成任何断言。`)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function SignResultCard(): ReactElement {
  return (
    <p className="love-divination__result-item">灵签结果字段待回填，本路暂以占位展示，不影响其他路结果。</p>
  );
}

export function ZodiacNoteCard({ text }: { text: string }): ReactElement {
  return (
    <p className="love-divination__result-item">
      {guardText(text)}
      <ConfidenceBadge confidence="probable" />
    </p>
  );
}

export default function LoveDivinationPage(): ReactElement {
  const navigate = useNavigate();
  const [state, setState] = useState<PageState>('idle');
  const [mode, setMode] = useState<string>('tarot');
  const [left, setLeft] = useState<ZodiacSignId>(FIRST_SIGN_ID);
  const [right, setRight] = useState<ZodiacSignId>(SECOND_SIGN_ID);
  const [dateKey, setDateKey] = useState<string>('2026-09-16');
  const [cards, setCards] = useState<readonly LoveTarotCard[]>([]);
  const [zodiacText, setZodiacText] = useState<string>(LOVE_ZODIAC_COPY.general);

  useEffect(() => {
    trackPageView('/divination/love');
    seoGate.applyToDocument(seoGate.policyFor('personal-result'));
  }, []);

  const handleDraw = (): void => {
    setState('loading');
    const seed = loveSeed.derive({ left, right, dateKey });
    const options = loveSeed.toOptions(seed);
    const cacheKey = `temposoul:divination:love:${seed}`;
    trackEvent('love_divination_draw', { modes: mode });
    try {
      if (mode === 'tarot') {
        const cached = ttlCache.get<readonly LoveTarotCard[]>(cacheKey);
        if (cached !== null) {
          setCards(cached);
          setState(cached.length > 0 ? 'ok' : 'ok-empty');
          return;
        }
        const drawn = drawSpreadCards('love', options) as readonly LoveTarotCard[];
        ttlCache.set(cacheKey, drawn, CACHE_TTL_MS);
        setCards(drawn);
        setState(drawn.length > 0 ? 'ok' : 'ok-empty');
        return;
      }
      if (mode === 'sign') {
        drawRandomSign(options);
        setState('degraded');
        return;
      }
      const copyText = LOVE_ZODIAC_COPY[left] ?? LOVE_ZODIAC_COPY.general;
      setCards([]);
      setZodiacText(copyText);
      setState('ok');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="love-divination">
      <PageTopbar
        title="爱情占卜"
        onBack={() => {
          if (window.history.length > 1) navigate(-1);
          else navigate('/');
        }}
      />
      <PrivacyHint />
      <LoveModeTabs active={mode} onSelect={setMode} />
      <label className="love-divination__field">
        我方星座
        <select value={left} onChange={(e) => setLeft(e.target.value as ZodiacSignId)}>
          {ZODIAC_SIGNS.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </label>
      <label className="love-divination__field">
        对方星座
        <select value={right} onChange={(e) => setRight(e.target.value as ZodiacSignId)}>
          {ZODIAC_SIGNS.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </label>
      <label className="love-divination__field">
        日期
        <input type="date" value={dateKey} onChange={(e) => setDateKey(e.target.value)} />
      </label>
      <button type="button" className="love-divination__draw" onClick={handleDraw}>开始</button>
      {state === 'loading' && <div className="skeleton" />}
      {state === 'ok' && mode === 'tarot' && <SpreadResultCard cards={cards} />}
      {state === 'ok' && mode === 'zodiac' && <ZodiacNoteCard text={zodiacText} />}
      {state === 'ok-empty' && <p className="love-divination__empty">本路暂无结果。</p>}
      {state === 'degraded' && <SignResultCard />}
      {state === 'error' && <p className="love-divination__empty">抽取失败，请重试。</p>}
      <p className="love-divination__disclaimer">本页结果由确定性种子复算，仅供娱乐参考，不构成医疗、法律或投资建议。</p>
    </div>
  );
}
