/**
 * 单字详情 /kangxi/:char（P0 构建期静态生成；JSON-LD 见契约决策 17，P1 深化）
 */
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { getDossier } from '../../data/character-dossier/loader';
import { CharDossierCard } from './components/CharDossierCard';
import { useNameI18n } from '../../i18n/locales/name.zh-CN';
import '../../styles/name-dossier.css';

export function KangxiCharPage(): React.ReactElement {
  const nav = useNavigate();
  const { char } = useParams<{ char: string }>();
  const { t } = useNameI18n();
  const key = decodeURIComponent(char || '');
  const dossier = getDossier(key);

  return (
    <div className="kangxi-char-page">
      <PageTopbar
        title={key ? `${key} · ${t('kangxi.title')}` : t('kangxi.title')}
        onBack={() => nav('/kangxi')}
      />
      <main className="kangxi-char-page__main">
        {dossier ? (
          <CharDossierCard dossier={dossier} />
        ) : (
          <div className="kangxi-char-page__empty">
            <p>{t('kangxi.notFound')}</p>
            <Link to="/kangxi">{t('kangxi.back')}</Link>
          </div>
        )}
      </main>
      <PrivacyHint />
    </div>
  );
}

export default KangxiCharPage;
