import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { suggestNames, type Candidate } from './lib/suggestNames';
import { readQuota, consumeQuota } from './hooks/useNameQuota';
import { trackName } from './lib/trackName';

const MEANING_CHIPS = ['光明', '清雅', '坚韧', '聪慧', '温润', '宏阔', '安宁', '灵动'];
const LENGTH_OPTIONS = [
  { value: '1', label: '单字名' },
  { value: '2', label: '双字名' },
];

export function NamesPage(): React.ReactElement {
  const nav = useNavigate();
  const [surname, setSurname] = useState('');
  const [meanings, setMeanings] = useState<string[]>(['光明']);
  const [length, setLength] = useState<'1' | '2'>('2');
  const [avoid, setAvoid] = useState('');
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const quota = readQuota('name-generator');

  const canGenerate = useMemo(() => surname.trim().length > 0, [surname]);

  const onGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setLoading(true);
    trackName('trackNameGenerate', { surnameLength: surname.trim().length });
    try {
      setCandidates(
        await suggestNames({
          surname: surname.trim(),
          length: length === '1' ? 1 : 2,
          meanings,
          script: 'han',
          avoidChars: avoid.split(/[\s,，、]+/).filter(Boolean),
          limit: 50,
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [canGenerate, surname, length, meanings, avoid]);

  const onAiPick = useCallback(() => {
    if (quota.locked) return;
    consumeQuota('name-generator');
    trackName('trackNameReportOpen', { source: 'names-ai' });
    if (candidates[0]) nav(`/name-report?name=${encodeURIComponent(candidates[0].name)}`);
  }, [quota.locked, candidates, nav]);

  return (
    <>
      <PageTopbar title="起名器" onBack={() => (window.history.length > 1 ? nav(-1) : nav('/'))} />
      <main className="names-page">
        <p className="names-page__boundary">
          事实与民俗文化参考，不含吉凶预测、成功率或必然事件断言。
        </p>
        <section className="names-page__form">
          <label className="names-page__field">
            <span>姓氏</span>
            <input
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              maxLength={4}
              placeholder="如：李"
            />
          </label>
          <div className="names-page__field">
            <span>名字长度</span>
            <div className="names-page__chips">
              {LENGTH_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  className={`names-page__chip ${length === o.value ? 'names-page__chip--active' : ''}`}
                  onClick={() => setLength(o.value as '1' | '2')}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div className="names-page__field">
            <span>寓意偏好</span>
            <div className="names-page__chips">
              {MEANING_CHIPS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`names-page__chip ${meanings.includes(m) ? 'names-page__chip--active' : ''}`}
                  onClick={() =>
                    setMeanings((p) => (p.includes(m) ? p.filter((x) => x !== m) : [...p, m]))
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <label className="names-page__field">
            <span>避讳字（空格分隔）</span>
            <input
              value={avoid}
              onChange={(e) => setAvoid(e.target.value)}
              placeholder="如：病 殇"
            />
          </label>
          <button
            type="button"
            className="names-page__submit"
            onClick={onGenerate}
            disabled={!canGenerate || loading}
          >
            {loading ? '正在筛选…' : '生成候选'}
          </button>
        </section>

        {candidates.length > 0 && (
          <section className="names-page__result">
            <header className="names-page__result-head">
              <h2>候选 {candidates.length} 个（先裁剪后评估，非吉凶排序）</h2>
              <button
                type="button"
                className="names-page__ai"
                onClick={onAiPick}
                disabled={quota.locked}
              >
                智能推荐（今日剩余 {quota.remaining}/{quota.limit}）
              </button>
            </header>
            <ul className="names-page__list">
              {candidates.map((c) => (
                <li key={c.name} className="names-page__item">
                  <div className="names-page__item-head">
                    <strong>{c.name}</strong>
                    <span className="names-page__score">文化适配 {c.score}</span>
                  </div>
                  <p className="names-page__highlights">{c.highlights.join('｜')}</p>
                  {c.risks.length > 0 && (
                    <p className="names-page__risks">注意：{c.risks.join('；')}</p>
                  )}
                  <button
                    type="button"
                    className="names-page__report"
                    onClick={() => {
                      trackName('trackNameReportOpen', { source: 'names-list' });
                      nav(`/name-report?name=${encodeURIComponent(c.name)}`);
                    }}
                  >
                    查看深度报告
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <PrivacyHint />
    </>
  );
}
