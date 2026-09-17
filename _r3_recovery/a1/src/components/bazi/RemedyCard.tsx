
// A11-1 · src/components/bazi/RemedyCard.tsx · 补益建议卡
import { getRemedy } from '../../data/bazi/remedy-tiers';

export function RemedyCard({ missing }: { missing: string[] }) {
  const entries = missing.map(getRemedy).filter((e): e is NonNullable<typeof e> => e !== null);
  if (entries.length === 0) return null;
  return (
    <div className="ts-remedy-card">
      {entries.map(e => (
        <section key={e.element} className="ts-remedy-card__item">
          <h3 className="ts-remedy-card__title">补{e.element}·民俗参考</h3>
          <dl className="ts-remedy-card__grid">
            <div><dt>字根</dt><dd>{e.radicals.join(' ')}</dd></div>
            <div><dt>颜色</dt><dd>{e.colors.join('、')}</dd></div>
            <div><dt>方位</dt><dd>{e.directions.join('、')}</dd></div>
            <div><dt>材质</dt><dd>{e.materials.join('、')}</dd></div>
          </dl>
          <p className="ts-remedy-card__meta">出处：{e.source}｜{e.note}</p>
        </section>
      ))}
    </div>
  );
}

export default RemedyCard;

---

