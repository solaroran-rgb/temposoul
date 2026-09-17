// src/components/name/NumberMeaningCard.tsx
import { NumberMeaning } from '@/data/onomastics/number-meanings';

interface Props {
  meaning: NumberMeaning;
}

export default function NumberMeaningCard({ meaning }: Props) {
  return (
    <div className="number-meaning-card">
      <h3>
        {meaning.number} · {meaning.title}
      </h3>
      <p>
        <strong>优势：</strong>
        {meaning.positive.join('、')}
      </p>
      <p>
        <strong>挑战：</strong>
        {meaning.challenge.join('、')}
      </p>
      <p>
        <strong>事业：</strong>
        {meaning.career}
      </p>
      <p>
        <strong>关系：</strong>
        {meaning.relationship}
      </p>
      <p className="disclaimer">{meaning.disclaimer}</p>
    </div>
  );
}
