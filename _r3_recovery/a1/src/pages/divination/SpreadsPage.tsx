
// A11-6 · src/pages/divination/SpreadsPage.tsx · 牌阵列表
import { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { NEW_SPREADS, CORE_SPREAD_LABELS } from '../../data/tarot/spreads-extra';
import './tarot-spreads.css';

interface CardItem { id: string; name: string; scene: string; count: number; pending: boolean }

export function SpreadsPage() {
  const navigate = useNavigate();
  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  const coreItems: CardItem[] = Object.entries(CORE_SPREAD_LABELS).map(([id, name]) => ({
    id, name, scene: '既有牌阵', count: 0, pending: true,
  }));
  const newItems: CardItem[] = NEW_SPREADS.map(s => ({
    id: s.spreadId, name: s.spreadName, scene: s.scene, count: s.cardCount, pending: false,
  }));
  const all = [...newItems, ...coreItems];

  return (
    <div className="ts-page ts-page--spreads">
      <PageTopbar title="塔罗牌阵库" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">塔罗牌阵库</h1>
        <p className="ts-page__note">共 {all.length} 阵；新增 6 阵覆盖关系/事业/是非/综合等常见场景。</p>
        <ul className="ts-spreads-grid">
          {all.map(s => (
            <li key={s.id} className="ts-spreads-grid__item">
              <Link to={`/tarot/spreads/${s.id}`} className="ts-spreads-grid__link">
                <span className="ts-spreads-grid__name">{s.name}</span>
                <span className="ts-spreads-grid__scene">{s.scene}</span>
                <span className="ts-spreads-grid__count">{s.pending ? '即将上线' : `${s.count} 张`}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default SpreadsPage;

