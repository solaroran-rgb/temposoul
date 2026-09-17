// B23-1 src/pages/astrology/CelebrityListPage.tsx
/**
 * 名人星盘列表页：领域 Tab + 卡片列表。
 * 六态机：idle / loading / ok / ok-empty / degraded / error（本页纯静态数据，
 * loading/error 为防御性分支，degraded 预留）。
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CELEBRITY_CHARTS, CELEBRITY_FIELDS, type CelebrityField } from '@/data/astrology/celebrity-charts';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { trackPageView } from '@/lib/analytics';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function CelebrityListPage() {
  const nav = useNavigate();
  const [state, setState] = useState<PageState>('idle');
  const [field, setField] = useState<CelebrityField | 'all'>('all');

  useDocumentMeta({ title: '名人星盘资料 · 星座文化参考 | TempoSoul' });

  useEffect(() => {
    trackPageView('/astrology/celebrities');
    setState('ok');
  }, []);

  const list = useMemo(
    () => (field === 'all' ? CELEBRITY_CHARTS : CELEBRITY_CHARTS.filter((c) => c.field === field)),
    [field],
  );

  return (
    <main className="page-celebrity-list">
      <PageTopbar title="名人星盘资料" onBack={() => nav('/')} />
      <p className="celebrity-intro">
        收录 20 位公众人物的公开生日与出生地，做星座文化视角的通俗整理，仅供文化参考。
      </p>

      <div className="celebrity-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={field === 'all'}
          className={`celebrity-tab${field === 'all' ? ' is-active' : ''}`}
          onClick={() => setField('all')}
        >
          全部
        </button>
        {CELEBRITY_FIELDS.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={field === f.key}
            className={`celebrity-tab${field === f.key ? ' is-active' : ''}`}
            onClick={() => setField(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {state === 'loading' && <div className="skeleton" role="status" />}
      {state === 'error' && (
        <div role="alert">
          数据加载失败。
          <button type="button" onClick={() => setState('ok')}>重试</button>
        </div>
      )}
      {state === 'degraded' && <p className="celebrity-note">部分资料展示不完整，请以文字信息为准。</p>}
      {state === 'ok' && list.length === 0 && (
        <p className="celebrity-empty">该领域暂未收录。</p>
      )}
      {state === 'ok' && list.length > 0 && (
        <ul className="celebrity-grid">
          {list.map((c) => (
            <li key={c.id} className="celebrity-card">
              <Link to={`/astrology/celebrities/${c.id}`} className="celebrity-card__link">
                <h3 className="celebrity-card__name">{c.name}</h3>
                <p className="celebrity-card__meta">
                  {CELEBRITY_FIELDS.find((f) => f.key === c.field)?.label} · {c.birthData.locationName}
                </p>
                <p className="celebrity-card__desc">{c.metaDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <PrivacyHint />
    </main>
  );
}
