
// A9-6 · 牌阵详情（修正：现有 6 键不显示"未找到"，显示"即将上线"）
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { SpreadLayoutPreview } from '../../components/divination/SpreadLayoutPreview';
import { findSpread } from '../../data/tarot/spreads-extra';
import './tarot-spreads.css';

/** 现有 6 键（与 core tarotSpreads 镜像）——仅用于 UI 回退，不含布局数据 */
const CORE_SPREAD_LABELS: Record<string, string> = {
  single: '单张',
  three: '三张',
  love: '爱情牌阵',
  career: '事业牌阵',
  decision: '选择牌阵',
  celtic: '凯尔特十字',
};

export function SpreadDetailPage() {
  const navigate = useNavigate();
  const { spreadId } = useParams<{ spreadId: string }>();
  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  const spread = spreadId ? findSpread(spreadId) : null;
  const coreLabel = spreadId ? CORE_SPREAD_LABELS[spreadId] : undefined;

  if (!spread) {
    return (
      <div className="ts-page">
        <PageTopbar title="牌阵详情" onBack={onBack} />
        <main className="ts-page__main">
          {coreLabel ? (
            <>
              <h1 className="ts-page__title">{coreLabel}</h1>
              <div className="ts-empty">详情页即将上线；如需抽牌请前往塔罗抽牌页。</div>
              <button type="button" className="ts-btn ts-btn--primary" onClick={() => navigate('/tarot', { replace: false })}>
                前往塔罗抽牌
              </button>
            </>
          ) : (
            <>
              <div className="ts-empty">未找到该牌阵</div>
              <button type="button" className="ts-btn" onClick={() => navigate('/tarot/spreads', { replace: true })}>
                返回牌阵库
              </button>
            </>
          )}
        </main>
        <PrivacyHint />
      </div>
    );
  }

  return (
    <div className="ts-page ts-page--spread-detail">
      <PageTopbar title={spread.spreadName} onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">{spread.spreadName}</h1>
        <p className="ts-page__note">适用：{spread.scene}｜{spread.cardCount} 张</p>
        <section className="ts-card">
          <h2 className="ts-card__title">布局预览</h2>
          <SpreadLayoutPreview layout={spread.layout} cardCount={spread.cardCount} />
        </section>
        <section className="ts-card">
          <h2 className="ts-card__title">牌位含义</h2>
          <table className="ts-table">
            <caption className="ts-table__caption">{spread.spreadName}牌位</caption>
            <thead><tr><th>#</th><th>位置</th><th>含义</th></tr></thead>
            <tbody>
              {spread.positions.map(p => (
                <tr key={p.index}><td>{p.index}</td><td>{p.label}</td><td>{p.meaning}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="ts-card">
          <h2 className="ts-card__title">解牌步骤</h2>
          <ol className="ts-spread-steps">
            {spread.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>
        <p className="ts-spread-meta">来源：{spread.source}</p>
        <button type="button" className="ts-btn ts-btn--primary" disabled>用此牌阵抽牌（即将上线）</button>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default SpreadDetailPage;

