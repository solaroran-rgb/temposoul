import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LookupCardLayout } from '@/components/divination/LookupCardLayout';
import { ScienceBoundaryCallout } from '@/components/knowledge/ScienceBoundaryCallout';
import { BLOOD_TYPE_ENTRIES } from '@/data/knowledge/blood-type';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView } from '@/lib/analytics';
import './BloodTypePage.css';

export default function BloodTypePage() {
  useEffect(() => { trackPageView('/knowledge/blood-type'); }, []);

  return (
    <LookupCardLayout
      title="血型性格"
      state="ok"
      topCallout={<ScienceBoundaryCallout message="血型与性格无科学定论" detail="以下内容仅供文化娱乐与自我反思参考。" />}
      renderPicker={() => <div />}
      renderResult={() => (
        <div className="blood-type-grid">
          {BLOOD_TYPE_ENTRIES.map((e) => (
            <Link key={e.type} to={`/knowledge/blood-type/${e.type}`} className="blood-type-card">
              <h2>{e.type}型</h2>
              <p>{e.folkTraits.map(guardText).join('、')}</p>
              <small>{guardText(e.disclaimer)}</small>
            </Link>
          ))}
        </div>
      )}
    />
  );
}
