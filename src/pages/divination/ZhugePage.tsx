import { useEffect, useState } from 'react';
import { LookupCardLayout, LookupState } from '@/components/divination/LookupCardLayout';
import { ZHUGE_ENTRIES, ZhugeEntry } from '@/data/divination/zhuge';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView, trackEvent } from '@/lib/analytics';

export default function ZhugePage() {
  const [signNo, setSignNo] = useState(1);
  const [state, setState] = useState<LookupState>('idle');
  const [entry, setEntry] = useState<ZhugeEntry | null>(null);

  useEffect(() => { trackPageView('/divination/zhuge'); }, []);

  const lookup = () => {
    setState('loading');
    const found = ZHUGE_ENTRIES.find((x) => x.signNo === signNo) ?? null;
    setEntry(found);
    setState(found?.ready ? 'ok' : 'ok-empty');
    trackEvent('zhuge_lookup', { sign_no: signNo });
  };

  return (
    <LookupCardLayout
      title="诸葛神算"
      state={state}
      renderPicker={() => (
        <div>
          <select value={signNo} onChange={(e) => setSignNo(Number(e.target.value))}>
            {ZHUGE_ENTRIES.map((x) => <option key={x.signNo} value={x.signNo}>{x.signNo}</option>)}
          </select>
          <button onClick={lookup}>查看</button>
          <p>起数规则说明：起数算法开发中，当前为签号/卦序预览模式。</p>
        </div>
      )}
      renderResult={() => entry && (
        <div>
          <h2>{guardText(entry.title)}</h2>
          <p>签号：{entry.signNo}</p>
          <p>卦序：{guardText(entry.subject)}</p>
          <p>{guardText(entry.poem)}</p>
          <p>{guardText(entry.gloss)}</p>
          <p>{guardText(entry.disclaimer)}</p>
        </div>
      )}
      emptyMessages={{ 'ok-empty': '该签文数据准备中，当前为预览模式', idle: '请选择签号' }}
    />
  );
}
