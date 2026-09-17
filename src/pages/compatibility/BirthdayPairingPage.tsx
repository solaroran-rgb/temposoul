// B23-2 src/pages/compatibility/BirthdayPairingPage.tsx
/**
 * 生日配对（趣味工具）：双人生日输入 → 三维度确定性结果。
 * 结果页 noindex；seed = djb2(birthA + birthB) 经 pickBySeed 抽档位文案；
 * 六态机；禁止婚恋强制结论。
 */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { useDocumentMeta } from '@/lib/use-document-meta';
import { trackPageView, trackEvent } from '@/lib/analytics';
import { djb2 } from '@/lib/hash';
import { seedToIndex } from '@/lib/deterministic';
import { guardText } from '@/lib/assertions-guard';
import {
  westernZodiac,
  chineseZodiacOfYear,
  zodiacScore,
  chineseZodiacScore,
  LEVEL_ADVICE,
  LEVEL_LABEL,
  DISCLAIMER,
  buildSharePrompt,
  levelFromScore,
  type BirthdayPairingResult,
} from '@/data/compatibility/birthday-pairing';
import { calcLifePath, lifePathCompatibilityScore } from '@/lib/numerology';

type PageState = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function BirthdayPairingPage() {
  const nav = useNavigate();
  const [birthA, setBirthA] = useState('');
  const [birthB, setBirthB] = useState('');
  const [state, setState] = useState<PageState>('idle');
  const [result, setResult] = useState<BirthdayPairingResult | null>(null);
  // degraded：某维度计算失败时隐藏该维度
  const [missingDims, setMissingDims] = useState<string[]>([]);

  useDocumentMeta({ title: '生日配对 · 趣味测试 | TempoSoul', noIndex: true });

  useEffect(() => {
    trackPageView('/compatibility/birthday');
  }, []);

  const canSubmit = useMemo(() => /^\d{4}-\d{2}-\d{2}$/.test(birthA) && /^\d{4}-\d{2}-\d{2}$/.test(birthB), [birthA, birthB]);

  function handleSubmit() {
    if (!canSubmit) return;
    setState('loading');
    setMissingDims([]);
    try {
      // 维度计算（任一维度失败 → degraded 隐藏该维度）
      let zScore = 60;
      let cScore = 60;
      let lScore = 60;
      const miss: string[] = [];

      const zA = westernZodiac(birthA);
      const zB = westernZodiac(birthB);
      if (zA === '未知' || zB === '未知') miss.push('zodiac');
      else zScore = zodiacScore(zA, zB);

      const cyA = chineseZodiacOfYear(Number(birthA.slice(0, 4)));
      const cyB = chineseZodiacOfYear(Number(birthB.slice(0, 4)));
      cScore = chineseZodiacScore(cyA, cyB);

      const lpA = calcLifePath(birthA);
      const lpB = calcLifePath(birthB);
      lScore = lifePathCompatibilityScore(lpA.number, lpB.number);

      // 加权：星座 0.35 / 生肖 0.3 / 灵数 0.35；星座维度缺失时按剩余权重归一
      const weightZ = miss.includes('zodiac') ? 0 : 0.35;
      const weightSum = miss.includes('zodiac') ? 0.65 : 1;
      const raw = (miss.includes('zodiac') ? 0 : zScore * weightZ) + cScore * 0.3 + lScore * 0.35;
      const score = Math.round(raw / weightSum);

      const level = levelFromScore(score);

      // 确定性 seed 抽档位文案：djb2 → parseInt(base36) → >>>0 → seedToIndex
      const seedStr = djb2(`${birthA}|${birthB}`);
      const seed = (parseInt(seedStr, 36) || 0) >>> 0;
      const advicePool = LEVEL_ADVICE[level];
      const advice = advicePool[seedToIndex(seed, advicePool.length)];

      setResult({
        score,
        level,
        dimensions: {
          zodiac: { score: zScore, summary: miss.includes('zodiac') ? '' : `${zA} × ${zB}` },
          chineseZodiac: { score: cScore, summary: `${cyA} × ${cyB}` },
          lifePathNumber: {
            score: lScore,
            summary: `${lpA.number}${lpA.isMasterNumber ? '(主)' : ''} × ${lpB.number}${lpB.isMasterNumber ? '(主)' : ''}`,
            isMasterNumber: lpA.isMasterNumber || lpB.isMasterNumber,
          },
        },
        advice,
        disclaimer: DISCLAIMER,
        sharePrompt: buildSharePrompt(score, level),
      });
      setMissingDims(miss);
      setState(miss.length > 0 ? 'degraded' : 'ok');
      trackEvent('birthday_pairing_result', { level });
    } catch {
      setState('error');
    }
  }

  return (
    <main className="page-birthday-pairing">
      <PageTopbar title="生日配对" onBack={() => nav('/')} />
      <p className="bp-intro">输入两个公历生日，看星座 / 生肖 / 生命灵数三个维度的趣味匹配结果。</p>

      <div className="bp-form">
        <label className="bp-field">
          <span>TA 的生日</span>
          <input type="date" value={birthA} onChange={(e) => setBirthA(e.target.value)} />
        </label>
        <label className="bp-field">
          <span>TA 的生日</span>
          <input type="date" value={birthB} onChange={(e) => setBirthB(e.target.value)} />
        </label>
        <button type="button" className="btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
          开始配对
        </button>
      </div>

      {state === 'loading' && <div className="skeleton" role="status">计算中…</div>}
      {state === 'error' && (
        <div role="alert">
          计算出错。<button type="button" onClick={() => setState('idle')}>重试</button>
        </div>
      )}
      {state === 'degraded' && <p className="bp-note">部分维度暂不可用，结果仅基于可用维度计算。</p>}
      {(state === 'ok' || state === 'degraded') && result && (
        <article className="bp-result" aria-label="配对结果">
          <h2>
            缘分指数 {result.score} 分 · {LEVEL_LABEL[result.level]}
          </h2>
          <ul className="bp-dims">
            {!missingDims.includes('zodiac') && (
              <li>星座 {result.dimensions.zodiac.score} 分：{result.dimensions.zodiac.summary}</li>
            )}
            <li>生肖 {result.dimensions.chineseZodiac.score} 分：{result.dimensions.chineseZodiac.summary}</li>
            <li>
              生命灵数 {result.dimensions.lifePathNumber.score} 分：{result.dimensions.lifePathNumber.summary}
              {result.dimensions.lifePathNumber.isMasterNumber && '（含主数）'}
            </li>
          </ul>
          <p className="bp-advice">{guardText(result.advice)}</p>
          <p className="bp-disclaimer">{result.disclaimer}</p>
          <details>
            <summary>复制分享语</summary>
            <p>{result.sharePrompt}</p>
          </details>
        </article>
      )}

      <PrivacyHint />
    </main>
  );
}
