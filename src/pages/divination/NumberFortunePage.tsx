import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import { ContentShell } from '@/components/content/ContentShell';
import {
  calcNumberFortune,
  LETTER_VALUE_NOTE,
  NUM81_SOURCE,
  NUM81_TABLE_VERIFIED,
} from '@/data/divination/number81';
import { guardText } from '@/lib/assertions-guard';
import { readUx, writeUx, TTL_30D } from '@/data/content/ux-store';
import { trackEvent, trackPageView } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './number-fortune-page.css';

export default function NumberFortunePage(): ReactElement {
  const [state, setState] = useState<PageState>('idle');
  const [raw, setRaw] = useState<string>('');
  const [result, setResult] = useState<ReturnType<typeof calcNumberFortune> | null>(null);

  useEffect(() => {
    trackPageView('/divination/number');
    const last = readUx<string>('number', 'last-input');
    if (last) setRaw(last);
  }, []);

  function handleCalc(): void {
    if (!raw.trim()) {
      setState('ok-empty');
      return;
    }
    setState('loading');
    const res = calcNumberFortune(raw);
    setResult(res);
    setState(res.complete ? 'ok' : 'degraded');
    writeUx<string>('number', raw, TTL_30D, 'last-input');
    trackEvent('number_fortune_calc', { length: raw.length, number: res.number });
  }

  return (
    <ContentShell title="号码吉凶" state={state} confidence="legendary" emptyHint="请输入号码">
      <div className="number-fortune__form">
        <input
          className="number-fortune__input"
          value={raw}
          placeholder="输入手机号 / 车牌 / 门牌号"
          onChange={(e) => setRaw(e.target.value)}
        />
        <button type="button" className="number-fortune__submit" onClick={handleCalc}>
          测算
        </button>
      </div>

      {result && (
        <section className="number-fortune__result">
          <p className="number-fortune__no">
            数理 <strong>{result.number}</strong> · {result.entry.fortune}
          </p>
          <p className="number-fortune__brief">{guardText(result.entry.brief)}</p>
          {result.entry.text ? (
            <p className="number-fortune__text">{guardText(result.entry.text)}</p>
          ) : (
            <p className="number-fortune__pending">该数理的完整释义尚未收录。</p>
          )}
          <p className="number-fortune__steps">
            计算过程：清洗后序列 {result.digitSeq || '—'} → 取末四位 {result.tail || '—'} → 除 81 取
            余 → {result.number}
          </p>
        </section>
      )}

      <section className="number-fortune__algo">
        <h2 className="number-fortune__h2">算法说明（可复算）</h2>
        <ol className="number-fortune__list">
          <li>仅保留数字与字母，其余字符忽略。</li>
          <li>{LETTER_VALUE_NOTE}</li>
          <li>取序列末四位。</li>
          <li>除以 81 取余；余数为 0 时记为 81。</li>
        </ol>
        <p className="number-fortune__note">
          同一号码在任何时间、任何设备上结果一致，不含随机成分。号码与个人际遇之间不存在已知因果关系。
        </p>
      </section>

      <p className="number-fortune__source">来源：{NUM81_SOURCE}</p>
      {!NUM81_TABLE_VERIFIED && (
        <p className="number-fortune__verify">数据版本提示：吉凶归类尚未与权威版本核验，仅供文化参考。</p>
      )}
    </ContentShell>
  );
}
