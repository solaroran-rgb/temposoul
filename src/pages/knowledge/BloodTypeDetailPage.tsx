import { useEffect } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { LookupCardLayout } from '@/components/divination/LookupCardLayout';
import { ScienceBoundaryCallout } from '@/components/knowledge/ScienceBoundaryCallout';
import { BLOOD_TYPE_ENTRIES } from '@/data/knowledge/blood-type';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView } from '@/lib/analytics';

const VALID = ['A', 'B', 'AB', 'O'] as const;
type BloodType = typeof VALID[number];

function isBloodType(v: string | null | undefined): v is BloodType {
  return !!v && (VALID as readonly string[]).includes(v);
}

export default function BloodTypeDetailPage() {
  const { type: pathType } = useParams();
  const [params] = useSearchParams();
  const queryType = params.get('type');
  const resolved = isBloodType(pathType) ? pathType : (isBloodType(queryType) ? queryType : null);

  useEffect(() => {
    if (resolved) trackPageView(`/knowledge/blood-type/${resolved}`);
  }, [resolved]);

  if (!resolved) return <Navigate to="/knowledge/blood-type" replace />;
  const entry = BLOOD_TYPE_ENTRIES.find((e) => e.type === resolved);
  if (!entry) return <Navigate to="/knowledge/blood-type" replace />;

  return (
    <LookupCardLayout
      title={`${entry.type}型血型性格`}
      state="ok"
      topCallout={<ScienceBoundaryCallout message="科学边界提示" detail={guardText(entry.scientificNote)} />}
      renderPicker={() => <div />}
      renderResult={() => (
        <div>
          <section><h3>历史起源</h3><p>{guardText(entry.historicalOrigin)}</p></section>
          <section><h3>民俗说法</h3><ul>{entry.folkTraits.map((t) => <li key={t}>{guardText(t)}</li>)}</ul></section>
          <section><h3>科学说明</h3><p>{guardText(entry.scientificNote)}</p></section>
          <section><h3>反思</h3><p>{guardText(entry.reflection)}</p></section>
          <p>{guardText(entry.disclaimer)}</p>
        </div>
      )}
    />
  );
}
