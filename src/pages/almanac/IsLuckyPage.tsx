// src/pages/almanac/IsLuckyPage.tsx
// B16-补交终版：IT-8-1 修正 —— useAlmanacData 返回 {data, loading, error}；缓存改用本地 safeStorage
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { ReactElement } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { useAlmanacData } from '@/hooks/useAlmanacData';
import { evaluateScene, type SceneType, type SceneVerdict } from '@/lib/almanac-rules';
import { guardText } from '@/lib/assertions-guard';
import { safeStorage } from '@/lib/safe-storage';
import { trackPageView, trackEvent } from '@/lib/analytics';
import type { PageState } from '@/types/page-state';
import './is-lucky-page.css';

const SCENES: SceneType[] = ['marriage', 'travel', 'move', 'business', 'build'];
const SCENE_LABELS: Record<SceneType, string> = { marriage: '婚嫁', travel: '出行', move: '搬家', business: '开业', build: '动土' };
const CACHE_KEY_PREFIX = 'temposoul:almanac:is-lucky:';

export default function IsLuckyPage(): ReactElement {
  const { sceneId } = useParams<{ sceneId?: string }>();
  const activeScene = (SCENES.includes(sceneId as SceneType) ? sceneId : 'marriage') as SceneType;

  const today = new Date().toISOString().slice(0, 10);
  const cacheKey = `${CACHE_KEY_PREFIX}${today}`;

  const { data, loading, error } = useAlmanacData(today);
  const [verdict, setVerdict] = useState<SceneVerdict | null>(null);
  const [pageState, setPageState] = useState<PageState>('idle');

  useEffect(() => { trackPageView(`/almanac/is-lucky/${activeScene}`); }, [activeScene]);

  useEffect(() => {
    if (loading) { setPageState('loading'); return; }
    if (error || !data) { setPageState('error'); return; }

    try {
      const cached = safeStorage.getJSON<SceneVerdict | null>(cacheKey, null);
      if (cached && cached.sceneId === activeScene) {
        setVerdict(cached);
        setPageState('ok');
        return;
      }

      // 尝试获取用户生肖（假设存在全局 user profile 缓存）
      const userProfile = safeStorage.getJSON<{ zodiac?: string } | null>('temposoul:user:profile', null);
      const result = evaluateScene(activeScene, data, userProfile?.zodiac);

      safeStorage.setJSON(cacheKey, result);
      setVerdict(result);
      setPageState('ok');
      trackEvent('scene_verdict_calculated', { scene: activeScene, verdict: result.verdict });
    } catch {
      setPageState('degraded');
    }
  }, [loading, error, data, activeScene, cacheKey]);

  const verdictLabel = verdict?.verdict === 'auspicious' ? '大吉' : verdict?.verdict === 'inauspicious' ? '不宜' : '平';
  const verdictClass = verdict?.verdict === 'auspicious' ? 'is-lucky__verdict--good' : verdict?.verdict === 'inauspicious' ? 'is-lucky__verdict--bad' : 'is-lucky__verdict--neutral';

  return (
    <div className="is-lucky-page">
      <PageTopbar title="今日吉凶" onBack={() => window.history.back()} />

      <nav className="is-lucky__scenes">
        {SCENES.map(s => (
          <Link
            key={s}
            to={`/almanac/is-lucky/${s}`}
            className={`is-lucky__scene-tab ${s === activeScene ? 'is-lucky__scene-tab--active' : ''}`}
          >
            {SCENE_LABELS[s]}
          </Link>
        ))}
      </nav>

      {pageState === 'loading' && <div className="skeleton is-lucky__skeleton" />}
      {pageState === 'error' && <div className="is-lucky__error">黄历数据加载失败，请稍后重试</div>}

      {pageState === 'degraded' && data && (
        <div className="is-lucky__degraded">
          <p>场景判定暂时不可用，以下为今日基础宜忌：</p>
          <ul>{data.recommends?.map(r => <li key={r}>宜: {r}</li>)}</ul>
          <ul>{data.avoids?.map(a => <li key={a}>忌: {a}</li>)}</ul>
        </div>
      )}

      {(pageState === 'ok') && verdict && (
        <>
          <section className={`is-lucky__verdict ${verdictClass}`}>
            <h2 className="is-lucky__verdict-title">{verdictLabel}</h2>
            <div className="is-lucky__verdict-score">综合评分: {verdict.score}</div>
            <ConfidenceBadge confidence={verdict.confidence} />
          </section>

          <section className="is-lucky__evidence">
            <h3>判定依据</h3>
            <ul className="is-lucky__evidence-list">
              {verdict.evidence.map((e, i) => <li key={i} className="is-lucky__evidence-item">{e}</li>)}
              {data?.dayOfficer && <li className="is-lucky__evidence-item">值日: {data.dayOfficer}</li>}
            </ul>
          </section>

          <div className="is-lucky__guard">
            {guardText('本页面内容仅供民俗文化参考，不构成任何医疗、法律或投资建议。吉凶判定基于传统历法规则的确定性计算，不代表对现实结果的承诺。')}
          </div>
        </>
      )}
      <PrivacyHint />
    </div>
  );
}
