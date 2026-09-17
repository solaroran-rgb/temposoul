/**
 * C9-姓名配对：边界免责条（本地侧补交：C 交付清单缺该组件）
 */
import { guardText } from '../../lib/assertions-guard';

export function PairDisclaimer({ caveats, disclaimer }: { caveats: string[]; disclaimer: string }) {
  return (
    <section className="pair-disclaimer">
      {caveats && caveats.length > 0 && (
        <ul className="pair-disclaimer__caveats">
          {caveats.map((c, i) => (
            <li key={i}>{guardText(c)}</li>
          ))}
        </ul>
      )}
      <p className="pair-disclaimer__text">{guardText(disclaimer)}</p>
    </section>
  );
}
