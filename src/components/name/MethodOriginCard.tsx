/**
 * C9-姓名配对：方法来源卡（本地侧补交：C 交付清单缺该组件）
 */
import type { MethodOrigin } from '../../types/pair';

export function MethodOriginCard({ origin }: { origin: MethodOrigin }) {
  if (!origin) return null;
  return (
    <section className="method-origin-card">
      <h3 className="method-origin-card__title">方法来源</h3>
      <p className="method-origin-card__name">
        {origin.name}
        {origin.era ? <span className="method-origin-card__era"> · {origin.era}</span> : null}
      </p>
      <p className="method-origin-card__basis">
        {origin.hasClassicalBasis ? '有传统文献依据' : '现代民俗演绎'}
      </p>
      <p className="method-origin-card__note">{origin.note}</p>
    </section>
  );
}
