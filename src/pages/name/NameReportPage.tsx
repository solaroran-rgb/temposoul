import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { PremiumGate } from '../../components/PremiumGate';
import { useAiChat } from '../../hooks/useAiChat';
import { evaluateNameProfile } from '@temposoul/core/onomastics';
import { dossierProvider, getZodiacRootTable } from '../../data/character-dossier/loader';
import { buildNamePrompt } from './lib/buildNamePrompt';
import { guardText } from '../../lib/assertions-guard';
import { consumeQuota, readQuota } from './hooks/useNameQuota';
import { trackName } from './lib/trackName';

import { splitHanName } from '../../data/surname-compound';

function splitName(name: string, isHan: boolean): { surname: string; given: string } {
  // 汉字名：优先双字姓匹配（复姓），再退化为单字姓（GC-17 hotfix）
  if (isHan) return splitHanName(name);
  const parts = name.split(/[\s-]+/).filter(Boolean);
  return { surname: parts[0] ?? name, given: parts.slice(1).join(' ') };
}

export function NameReportPage(): React.ReactElement {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const name = (params.get('name') ?? '').trim();
  const ai = useAiChat();
  const [quota, setQuota] = useState(() => readQuota('name-report'));

  useEffect(() => {
    setQuota(readQuota('name-report'));
  }, []);
  useEffect(() => {
    if (name) trackName('trackNameReportOpen', { nameLength: name.length });
  }, [name]);

  const profile = useMemo(() => {
    if (!name) return null;
    const isHan = /[\u4e00-\u9fff]/.test(name);
    const { surname, given } = splitName(name, isHan);
    return evaluateNameProfile(
      { surname, given, type: 'person', script: isHan ? 'han' : 'latin' },
      { dossierProvider, zodiacRootTable: getZodiacRootTable() },
    );
  }, [name]);

  const onPolish = useCallback(() => {
    if (!profile || quota.locked) return;
    consumeQuota('name-report');
    setQuota(readQuota('name-report'));
    ai.analyze(buildNamePrompt(profile));
  }, [profile, quota.locked, ai]);

  const content = ai.streamingContent || ai.turns[ai.turns.length - 1]?.content || '';
  const busy = ai.status === 'loading' || ai.status === 'streaming';

  return (
    <>
      <PageTopbar
        title="姓名深度报告"
        onBack={() => (window.history.length > 1 ? nav(-1) : nav('/'))}
      />
      <main className="name-report">
        {!profile ? (
          <p className="name-report__empty">
            缺少姓名字段，请从起名器选择候选后进入（/name-report?name=李昭）。
          </p>
        ) : (
          <>
            <p className="name-report__boundary">
              本档案为事实与民俗文化参考，不含吉凶预测、成功率或必然事件断言。
            </p>
            <section className="name-report__block">
              <h2>事实层</h2>
              <p>读音：{profile.fact.phonetics.data.pinyin.join(' ') || '数据准备中'}</p>
              <p>
                字义：
                {profile.fact.semantics.data.meanings.map((m) => m.meaning).join('；') ||
                  '编辑编撰待审阅'}
              </p>
              <p>生僻等级：{profile.fact.glyph.data.rareCharLevel}</p>
            </section>
            <section className="name-report__block">
              <h2>民俗层（文化习俗，非可验证结论）</h2>
              <p>{profile.folk.disclaimer}</p>
              <p>
                五格：
                {profile.folk.wuge.status === 'unavailable'
                  ? '不适用'
                  : JSON.stringify(profile.folk.wuge.data)}
              </p>
            </section>
            <section className="name-report__block">
              <h2>文化层</h2>
              <p>性别倾向：{profile.culture.genderTendency ?? '未知'}</p>
              <p>使用场景：{profile.culture.usageScenario.join('、')}</p>
              {profile.conflicts.length > 0 && (
                <ul className="name-report__conflicts">
                  {profile.conflicts.map((c) => (
                    <li key={c.dimension}>
                      {c.a} ↔ {c.b}：{c.note}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="name-report__ai">
              <h2>AI 润色（每日 1 次）</h2>
              <button type="button" onClick={onPolish} disabled={busy || quota.locked}>
                {busy ? '生成中…' : quota.locked ? '今日额度已用完' : '生成润色解读'}
              </button>
              <p className="name-report__quota">
                今日剩余 {quota.remaining}/{quota.limit}
              </p>
              {content && <div className="name-report__content">{guardText(content)}</div>}
              {ai.error && (
                <p className="name-report__error">AI 解读暂不可用，可稍后重试（档案不受影响）。</p>
              )}
              {quota.locked && (
                <PremiumGate quota={1}>
                  <div className="name-report__locked-placeholder" />
                </PremiumGate>
              )}
            </section>
          </>
        )}
      </main>
      <PrivacyHint />
    </>
  );
}
