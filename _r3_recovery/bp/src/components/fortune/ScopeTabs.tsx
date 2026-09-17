// B'11-3 src/components/fortune/ScopeTabs.tsx
/**
 * 时间维度Tab
 * @module B'11-3
 */
import type { ZodiacScope } from '@/pages/fortune/lib/daily-fortune';

interface Props { value: ZodiacScope; onChange: (s: ZodiacScope) => void; }
const SCOPES: { key: ZodiacScope; label: string }[] = [
  { key: 'today', label: '今日' }, { key: 'week', label: '本周' },
  { key: 'month', label: '本月' }, { key: 'year', label: '本年' },
];

export function ScopeTabs({ value, onChange }: Props) {
  return (
    <div className="scope-tabs" role="tablist" aria-label="运势时间范围">
      {SCOPES.map((s) => (
        <button key={s.key} type="button" role="tab" aria-selected={value === s.key}
          className={`scope-tabs__tab ${value === s.key ? 'is-active' : ''}`}
          onClick={() => onChange(s.key)}>{s.label}</button>
      ))}
    </div>
  );
}
