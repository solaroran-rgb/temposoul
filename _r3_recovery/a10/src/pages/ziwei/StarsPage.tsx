
// A9-4 · 十四主星列表（修正：从 loaders.ts 导入共享 READY_STAR_IDS）
import { useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { STAR_IDS } from '../../data/ziwei-stars/types';
import { isStarReady } from '../../data/ziwei-stars/loaders';

const STAR_NAMES: Record<string, string> = {
  ziwei: '紫微', tianji: '天机', taiyang: '太阳', wuqu: '武曲', tongtian: '天同',
  lianzhen: '廉贞', tianfu: '天府', taiyin: '太阴', tanlang: '贪狼', jumen: '巨门',
  tianxiang: '天相', tianliang: '天梁', qisha: '七杀', pojun: '破军',
};

export function StarsPage() {
  const navigate = useNavigate();
  const onBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) navigate(-1);
    else navigate('/');
  }, [navigate]);

  return (
    <div className="ts-page ts-page--ziwei-stars">
      <PageTopbar title="十四主星" onBack={onBack} />
      <main className="ts-page__main">
        <h1 className="ts-page__title">十四主星详解</h1>
        <ul className="ts-stars-grid">
          {STAR_IDS.map(id => {
            const ready = isStarReady(id);
            const label = STAR_NAMES[id] ?? id;
            return (
              <li key={id} className={`ts-stars-grid__item${ready ? '' : ' is-pending'}`}>
                {ready ? (
                  <Link to={`/ziwei/stars/${id}`} className="ts-stars-grid__link">
                    <span className="ts-stars-grid__name">{label}</span>
                    <span className="ts-stars-grid__hint">查看详解</span>
                  </Link>
                ) : (
                  <div className="ts-stars-grid__link is-disabled" aria-disabled="true">
                    <span className="ts-stars-grid__name">{label}</span>
                    <span className="ts-stars-grid__hint">内容整理中</span>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </main>
      <PrivacyHint />
    </div>
  );
}

export default StarsPage;

