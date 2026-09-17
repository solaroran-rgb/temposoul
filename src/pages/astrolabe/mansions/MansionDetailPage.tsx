import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { useDocumentSeo } from '@/hooks/useDocumentSeo';
import { findMansion } from '@/data/astrolabe/mansions';
import { getMansionSeo } from '@/data/astrolabe/mansions/seo';
import { lookupBirthMansion, type BirthMansionResult } from '@/data/astrolabe/mansions/birth-mansion';
import './MansionsPage.css';

export default function MansionDetailPage() {
  const { id } = useParams();
  const mansion = findMansion(id);
  const [birthResult, setBirthResult] = useState<BirthMansionResult | null>(null);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const seo = useMemo(() => {
    if (!mansion) return { title: '宿度详解', description: '二十八宿宿度详解' };
    const s = getMansionSeo(mansion.id);
    return { title: s.ogTitle, description: s.description, ogTitle: s.ogTitle, ogDescription: s.ogDescription };
  }, [mansion]);

  useDocumentSeo(seo);

  useEffect(() => {
    if (mansion) trackPageView(`/astrolabe/mansions/${mansion.id}`);
  }, [mansion]);

  const onQuery = useCallback(() => {
    const r = lookupBirthMansion(month, day);
    setBirthResult(r);
    trackEvent('birth_mansion_query', { has_result: true, mansion_id: r.mansionId });
  }, [month, day]);

  if (!mansion) return <Navigate to="/astrolabe/mansions" replace />;

  return (
    <div className="a23-page">
      <PageTopbar title={mansion.name} onBack={() => window.history.back()} />
      <div className="a23-boundary-callout a23-boundary-callout--info" role="note">
        天文层为现代星表数据，民俗层为传统文化参考，请分开理解。
      </div>

      <div className="mansion-columns">
        <section>
          <h3>天文层</h3>
          <p>距星：{mansion.astro.distanceStarName}（{mansion.astro.distanceStarWestern}）</p>
          <p>黄经：{mansion.astro.eclipticLongitudeDeg}° · 历元 {mansion.astro.eclipticEpoch}</p>
          <p>精度：{mansion.astro.accuracyGrade} · {mansion.astro.accuracyNote}</p>
          <p>{mansion.astro.precessionNote}</p>
          <small>{mansion.astro.astroSourceRef}</small>
        </section>
        <section>
          <h3>民俗层</h3>
          <p>吉凶：{mansion.folk.auspiciousness}</p>
          <p>对应动物：{mansion.folk.animal}</p>
          <p>{mansion.folk.imagery}</p>
          <p>{mansion.folk.verse}</p>
          <small>{mansion.folk.folkSourceRef}</small>
        </section>
      </div>

      <section className="birth-mansion-tool">
        <h3>查本命宿</h3>
        <label>月：<input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} /></label>
        <label>日：<input type="number" min={1} max={31} value={day} onChange={(e) => setDay(Number(e.target.value))} /></label>
        <button className="a23-cta" onClick={onQuery}>查询</button>
        {birthResult && (
          <p>本命宿：{birthResult.mansionName}（太阳黄经约 {birthResult.solarLongitude.toFixed(1)}°）</p>
        )}
      </section>

      <p>{mansion.disclaimer}</p>
      <PrivacyHint />
    </div>
  );
}
