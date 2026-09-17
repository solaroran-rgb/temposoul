// B23-3 src/pages/lingsign/MazuSignPage.tsx
/**
 * 妈祖灵签独立页（/lingsign/mazu）。
 *
 * 裁决说明：现有灵签机制 lingsign-loaders.ts 中的 LingSignCode 为封闭联合类型，
 * 注册 code='mazu' 需改动共享文件（越出本域 12+1 文件红线），故按方案备选路径
 * 新建独立页，直接静态导入本域数据 SIGNS，渲染交互对齐 DailySignPage 既有范式。
 *
 * 确定性规则：seed = djb2(dateKey(YYYY-MM-DD) + category)，同日同类同签。
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SIGNS } from '@/data/lingsign/mazu';
import type { LingSign } from '@/pages/divination/lib/lingsign-loaders';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { trackPageView } from '@/lib/analytics';
import { djb2, dateKey } from '@/lib/hash';
import { guardText } from '@/lib/assertions-guard';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

const CATEGORIES = ['综合', '事业', '财运', '感情', '出行'] as const;

export default function MazuSignPage() {
  const nav = useNavigate();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('综合');
  const [state, setState] = useState<PageState>('idle');
  const [current, setCurrent] = useState<LingSign | null>(null);

  useDocumentMeta({ title: '妈祖灵签 · 六十甲子签 | TempoSoul' });

  useEffect(() => {
    trackPageView('/lingsign/mazu');
    setState('ok');
  }, []);

  const readySigns = useMemo(() => SIGNS.filter((s) => s.ready), []);

  function handleDraw() {
    setState('loading');
    try {
      // 确定性：同日同类同签
      const seedStr = djb2(`${dateKey()}|${category}`);
      const idx = Math.abs(parseInt(seedStr, 36) || 0) % readySigns.length;
      if (!Number.isFinite(idx) || idx < 0 || idx >= readySigns.length) {
        setState('ok-empty');
        return;
      }
      setCurrent(readySigns[idx]);
      setState(readySigns[idx].gloss ? 'ok' : 'degraded');
    } catch {
      setState('error');
    }
  }

  return (
    <main className="page-mazu-sign">
      <PageTopbar title="妈祖灵签" onBack={() => nav('/')} />

      <div className="mazu-cats" role="tablist" aria-label="问题类别">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            className={`mazu-cat${category === c ? ' is-active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <button type="button" className="btn-primary" onClick={handleDraw} style={{ minHeight: 44 }}>
        诚心抽签
      </button>

      {state === 'loading' && <div className="skeleton" role="status">签文加载中…</div>}
      {state === 'error' && (
        <div role="alert">
          签文加载失败。<button type="button" onClick={() => setState('ok')}>重试</button>
        </div>
      )}
      {state === 'ok-empty' && <p className="mazu-empty">签号越界，请重新抽取。</p>}
      {state === 'degraded' && current && (
        <article className="sign-card">
          <h3>{guardText(current.signTitle)}</h3>
          <p className="sign-card__poem">{guardText(current.poem)}</p>
          <p className="sign-card__source">{guardText(current.source)}</p>
          <p className="mazu-note">解签文字暂缺，仅展示签诗。</p>
        </article>
      )}
      {state === 'ok' && current && (
        <article className="sign-card" aria-label="签文结果">
          <h3>{guardText(current.signTitle)}</h3>
          <p className="sign-card__poem">{guardText(current.poem)}</p>
          <p className="sign-card__gloss">{guardText(current.gloss)}</p>
          <p className="sign-card__meta">
            运势：{guardText(current.fortune)} · 主题：{guardText(current.subject)}
          </p>
          <p className="sign-card__source">{guardText(current.source)}</p>
          <p className="mazu-disclaimer">灵签为民间民俗文本，仅供文化参考，不构成任何决定建议。</p>
        </article>
      )}

      <PrivacyHint />
    </main>
  );
}
