// src/components/names/CandidateNameCard.tsx
import { BusinessNameCandidate } from '@/lib/business-name';

interface Props {
  candidate: BusinessNameCandidate;
}

export default function CandidateNameCard({ candidate }: Props) {
  return (
    <div className={`candidate-card ${candidate.isLucky ? 'lucky' : ''}`}>
      <h3>{candidate.name}</h3>
      <p>笔画：{candidate.strokes.join(' + ')}</p>
      <p>五行：{candidate.wuxing.join('、')}</p>
      <p>寓意：{candidate.meaning}</p>
      <p>评分：{candidate.score}</p>
      {candidate.isLucky && <span className="badge">吉</span>}
    </div>
  );
}
