
// A11-4 · src/components/ziwei/StarNatureCard.tsx · 星性卡
export function StarNatureCard({ nature }: { nature: string }) {
  return (
    <section className="ts-star-nature">
      <h2 className="ts-card__title">星性概述</h2>
      <p className="ts-star-nature__text">{nature}</p>
    </section>
  );
}

export default StarNatureCard;

