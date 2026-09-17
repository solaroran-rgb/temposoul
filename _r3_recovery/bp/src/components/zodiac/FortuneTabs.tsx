// B'11-2 src/components/zodiac/FortuneTabs.tsx
/**
 * 四档Tab
 * @module B'11-2
 */
import type { ZodiacScope } from '@/pages/fortune/lib/daily-fortune';

interface Props { value: ZodiacScope; onChange: (s: ZodiacScope) => void; }
const SCOPES: { key: ZodiacScope; label: string }[] = [
  { key: 'today', label: '今日' }, { key: 'week', label: '本周' },
  { key: 'month', label: '本月' }, { key: 'year', label: '本年' },
];

export function FortuneTabs({ value, onChange }: Props) {
  return (
    <div className="fortune-tabs" role="tablist" aria-label="运势时间维度">
      {SCOPES.map((s) => (
        <button key={s.key} type="button" role="tab" aria-selected={value === s.key}
          className={`fortune-tabs__tab ${value === s.key ? 'is-active' : ''}`}
          onClick={() => onChange(s.key)}>{s.label}</button>
      ))}
    </div>
  );
}
