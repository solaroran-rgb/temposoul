// B'11-4 src/components/zodiac/CompatibilityForm.tsx
/**
 * 双星座选择器 (300ms防抖)
 * @module B'11-4
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { ZODIAC_SIGNS } from '@/pages/fortune/lib/daily-fortune';

interface Props { signA: string; signB: string; onChange: (a: string, b: string) => void; }

export function CompatibilityForm({ signA, signB, onChange }: Props) {
  const [localA, setLocalA] = useState(signA);
  const [localB, setLocalB] = useState(signB);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedChange = useCallback((a: string, b: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(a, b), 300);
  }, [onChange]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <form className="compat-form" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="sign-a" className="sr-only">星座A</label>
      <select id="sign-a" value={localA} onChange={(e) => { setLocalA(e.target.value); debouncedChange(e.target.value, localB); }} style={{ minHeight: '44px' }} aria-label="星座A">
        {ZODIAC_SIGNS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
      <label htmlFor="sign-b" className="sr-only">星座B</label>
      <select id="sign-b" value={localB} onChange={(e) => { setLocalB(e.target.value); debouncedChange(localA, e.target.value); }} style={{ minHeight: '44px' }} aria-label="星座B">
        {ZODIAC_SIGNS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>
    </form>
  );
}
