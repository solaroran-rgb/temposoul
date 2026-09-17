// A9-4 · 主星详情（修正：null 安全加载 + 未就绪星不渲染内容）
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { StarNatureCard } from '../../components/ziwei/StarNatureCard';
import { StarBrightnessTable } from '../../components/ziwei/StarBrightnessTable';
import { StarKeyPalaces } from '../../components/ziwei/StarKeyPalaces';
import { StarCombos } from '../../components/ziwei/StarCombos';
import { StarSkeleton } from '../../components/ziwei/StarSkeleton';
import { STAR_IDS, type StarId, type ZiweiStarDoc } from '../../data/ziwei-stars/types';
import { loadStarDoc } from '../../data/ziwei-stars/loaders';
import { trackPageView } from '../../lib/analytics';
import './ziwei-stars.css';

function isStarId(v: string | undefined): v is StarId {
  return !!v && (STAR_IDS as readonly string[]).includes(v);
}

export function StarDetailPage() {
  const navigate = useNavigate();
  const { starId } = useParams<{ starId: string }>();
  const [doc, setDoc] = useState<ZiweiStarDoc | null>(null);
  const [loading, setLoading] = useState(true);

  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  useEffect(() => {
    if (!isStarId(starId)) {
      navigate('/ziwei/stars', { replace: true });
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const d = await loadStarDoc(starId);
      if (cancelled) return;
      setDoc(d);
      setLoading(false);
      try {
        trackPageView(`/ziwei/stars/${starId}`);
      } catch {
        /* noop */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [starId, navigate]);

  const title = doc && doc.ready ? `${doc.starName} · 紫微主星详解` : '紫微主星详解';

  return (
    <div className="ts-page ts-page--ziwei-stars-detail">
      <PageTopbar title={title} onBack={onBack} />
      <main className="ts-page__main">
        {loading && <StarSkeleton />}
        {!loading && doc && doc.ready && (
          <>
            <StarNatureCard nature={doc.nature} />
            <section className="ts-card">
              <h2 className="ts-card__title">庙旺亮度</h2>
              <StarBrightnessTable rows={doc.brightness} />
            </section>
            <section className="ts-card">
              <h2 className="ts-card__title">入关键宫</h2>
              <StarKeyPalaces rows={doc.keyPalaces} />
            </section>
            <section className="ts-card">
              <h2 className="ts-card__title">常用组合</h2>
              <StarCombos rows={doc.combos} />
            </section>
            <p className="ts-star-meta">
              出处：{doc.source}｜{doc.note}
            </p>
          </>
        )}
        {!loading && (!doc || !doc.ready) && (
          <>
            <StarSkeleton />
            <button
              type="button"
              className="ts-btn"
              onClick={() => navigate('/ziwei/stars', { replace: true })}
            >
              返回主星列表
            </button>
          </>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default StarDetailPage;
