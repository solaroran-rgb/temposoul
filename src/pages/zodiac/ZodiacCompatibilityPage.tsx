// B'11-4 src/pages/zodiac/ZodiacCompatibilityPage.tsx
/**
 * 星座配对页
 * @module B'11-4
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompatibilityForm } from '@/components/zodiac/CompatibilityForm';
import { CompatibilityResultCard } from '@/components/zodiac/CompatibilityResultCard';
import { calculateCompatibility } from '@/data/astro-compat/matrix';
import { getCompatCorpus } from '@/data/astro-compat/pool';
import { PageTopbar } from '@/components/PageTopbar';
import { trackPageView, trackChartSubmit } from '@/lib/analytics';

export default function ZodiacCompatibilityPage() {
  const nav = useNavigate();
  const [signA, setSignA] = useState('aries');
  const [signB, setSignB] = useState('leo');

  useEffect(() => {
    trackPageView('/zodiac/compatibility');
  }, []);

  const handleChange = (a: string, b: string) => {
    setSignA(a);
    setSignB(b);
    trackChartSubmit({ mode: 'zodiac_compat', trueSolarTime: false });
  };

  const score = useMemo(() => calculateCompatibility(signA, signB), [signA, signB]);
  const corpus = useMemo(() => getCompatCorpus(signA, signB), [signA, signB]);

  return (
    <main className="page-zodiac-compat">
      <PageTopbar title="星座配对" onBack={() => nav("/")} />
      <CompatibilityForm signA={signA} signB={signB} onChange={handleChange} />
      <CompatibilityResultCard score={score} corpus={corpus} />
    </main>
  );
}
