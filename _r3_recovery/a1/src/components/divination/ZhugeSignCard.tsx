
// A11-5 · src/components/divination/ZhugeSignCard.tsx · 签文卡
import type { ZhugeSign } from '../../data/zhuge/types';
import { usePromptCopyShare } from '../../hooks/usePromptCopyShare';

export function ZhugeSignCard({ sign }: { sign: ZhugeSign }) {
  const share = `${sign.signTitle}\n${sign.poem}\n解曰：${sign.gloss}\n吉凶：${sign.fortune}\n出处：${sign.source}\n——民间文化传承，娱乐参考`;
  const { copied, copy } = usePromptCopyShare(share);
  return (
    <article className="ts-zhuge-sign">
      <header className="ts-zhuge-sign__head">
        <span className="ts-zhuge-sign__no">第 {sign.signNo} 签</span>
        <span className="ts-badge ts-badge--legendary">{sign.fortune}</span>
      </header>
      <div className="ts-zhuge-sign__title">{sign.signTitle}</div>
      <pre className="ts-zhuge-sign__poem">{sign.poem}</pre>
      <div className="ts-zhuge-sign__gloss">{sign.gloss}</div>
      <p className="ts-zhuge-sign__meta">出处：{sign.source}</p>
      <button type="button" className="ts-btn" onClick={() => void copy()}>复制</button>
      {copied && <span className="ts-zhuge-sign__hint">已复制</span>}
    </article>
  );
}

export default ZhugeSignCard;

