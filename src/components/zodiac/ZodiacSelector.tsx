// B'11-2 src/components/zodiac/ZodiacSelector.tsx
/**
 * 12生肖选择器
 * @module B'11-2
 */
import { ZODIAC_SIGNS } from '@/pages/fortune/lib/daily-fortune';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function ZodiacSelector({ value, onChange }: Props) {
  return (
    <fieldset className="zodiac-selector" role="radiogroup" aria-label="选择生肖">
      <legend className="sr-only">请选择您的生肖</legend>
      <div className="zodiac-selector__grid">
        {ZODIAC_SIGNS.map((s) => (
          <label
            key={s.id}
            className={`zodiac-selector__option ${value === s.id ? 'is-active' : ''}`}
          >
            <input
              type="radio"
              name="zodiac"
              value={s.id}
              checked={value === s.id}
              onChange={() => onChange(s.id)}
              className="sr-only"
            />
            <span>{s.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
