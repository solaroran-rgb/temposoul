// src/pages/fortune/ZodiacProfilePage.tsx
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import type { ReactElement } from 'react';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { ConfidenceBadge } from '@/components/knowledge/ConfidenceBadge';
import { ZODIAC_SIGNS } from '@/data/astrology/zodiac-matrix';
import { type ProfileTopic } from '@/data/fortune/zodiac-profiles';
import { getZodiacProfiles } from '@/i18n/body/content';
import { guardText } from '@/lib/assertions-guard';
import { trackPageView } from '@/lib/analytics';
import { stableHash } from '@/lib/stable-hash';
import type { PageState } from '@/types/page-state';
import './zodiac-profile-page.css';

const TOPIC_LABELS: Record<ProfileTopic, string> = { personality: '性格解析', love: '爱情指南', career: '事业运势' };

function renderTemplate(template: string, vars: Record<string, string[]>, signName: string, element: string, ruler: string, modality: string, seed: number): string {
  let result = template
    .replace(/\{name\}/g, signName)
    .replace(/\{element\}/g, element)
    .replace(/\{ruler\}/g, ruler)
    .replace(/\{modality\}/g, modality);

  for (const [key, values] of Object.entries(vars)) {
    // 修复：使用 stableHash 确保同一 signId+topic+key 永远选中同一个词
    const idx = stableHash(`${seed}-${key}`) % values.length;
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), values[idx]);
  }
  return result;
}

export default function ZodiacProfilePage(): ReactElement {
  const { signId, topic } = useParams<{ signId: string; topic: string }>();
  const [pageState, setPageState] = useState<PageState>('idle');

  useEffect(() => { trackPageView(`/fortune/zodiac-profile/${signId}/${topic}`); }, [signId, topic]);

  const sign = ZODIAC_SIGNS.find(s => s.id === signId);
  const validTopic = (['personality', 'love', 'career'].includes(topic || '') ? topic : 'personality') as ProfileTopic;
  const profile = getZodiacProfiles().find(p => p.signId === signId && p.topic === validTopic);

  const content = useMemo(() => {
    if (!sign || !profile || !profile.ready) return null;
    const elementLabel = ({ fire: '火象', earth: '土象', air: '风象', water: '水象' } as Record<string, string>)[sign.element];
    const modalityLabel = ({ cardinal: '开创', fixed: '固定', mutable: '变动' } as Record<string, string>)[sign.modality];
    return renderTemplate(profile.template, profile.variables, sign.name, elementLabel, sign.ruler, modalityLabel, stableHash(`${signId}-${validTopic}`));
  }, [sign, profile, signId, validTopic]);

  useEffect(() => {
    if (!sign) { setPageState('ok-empty'); return; }
    if (!profile || !profile.ready) { setPageState('degraded'); return; }
    setPageState('ok');
  }, [sign, profile]);

  return (
    <div className="zodiac-profile-page">
      <PageTopbar title={`${sign?.name || '星座'} · ${TOPIC_LABELS[validTopic]}`} onBack={() => window.history.back()} />

      <nav className="zodiac-profile__topics">
        {(['personality', 'love', 'career'] as ProfileTopic[]).map(t => (
          <Link
            key={t}
            to={`/fortune/zodiac-profile/${signId}/${t}`}
            className={`zodiac-profile__topic-tab ${t === validTopic ? 'zodiac-profile__topic-tab--active' : ''}`}
          >
            {TOPIC_LABELS[t]}
          </Link>
        ))}
      </nav>

      {pageState === 'ok-empty' && <div className="zodiac-profile__empty">未找到该星座信息</div>}
      {pageState === 'degraded' && <div className="zodiac-profile__stub"><p>该主题内容正在编写中，敬请期待。</p></div>}

      {pageState === 'ok' && content && profile && (
        <article className="zodiac-profile__content">
          <ConfidenceBadge confidence={profile.confidence} />
          <p className="zodiac-profile__text">{content}</p>
        </article>
      )}

      <div className="zodiac-profile__guard">
        {guardText('星座运势内容基于占星学传统理论的确定性语料模板生成，非实时AI预测，仅供文化娱乐参考，不构成对现实结果的承诺或建议。')}
      </div>
      <PrivacyHint />
    </div>
  );
}
