
// A11-3 · src/components/bazi/ToCompatibilityCTA.tsx · 合婚 CTA
import { Link } from 'react-router-dom';

export interface ToCompatibilityCTAProps {
  query?: string;
}

export function ToCompatibilityCTA({ query }: ToCompatibilityCTAProps) {
  const to = query ? `/bazi/compatibility?${query}` : '/bazi/compatibility';
  return (
    <div className="ts-compat-cta">
      <p className="ts-compat-cta__hint">如需双人合婚分析，请前往合婚页补全对方信息。</p>
      <Link to={to} className="ts-btn ts-btn--primary">前往八字合婚</Link>
    </div>
  );
}

export default ToCompatibilityCTA;

---

