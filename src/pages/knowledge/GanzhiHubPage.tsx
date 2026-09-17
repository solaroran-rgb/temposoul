/**

* C11-干支专题 Hub（修改后：不依赖 ConfidenceBadge）
  */
import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageTopbar } from '../../components/PageTopbar';
import { PrivacyHint } from '../../components/PrivacyHint';
import { GanzhiMatrix } from '../../components/knowledge/GanzhiMatrix';
import { TIANGAN, DIZHI } from '../../data/knowledge/ganzhi';
import { ganzhiArticles } from '../../data/knowledge/registry';

export function GanzhiHubPage(): React.ReactElement {
  const nav = useNavigate();
  const articles = useMemo(() => ganzhiArticles(), []);

  useEffect(() => {
    // trackPageView('/knowledge/ganzhi');
  }, []);

  const onBack = (): void => {
    if (window.history.length > 1) nav(-1);
    else nav('/');
  };

  const stemCards = TIANGAN.map((e, i) => ({
    char: e.char,
    slug: articles[i]?.slug ?? '',
    ready: articles[i]?.ready ?? false,
    meta: `${e.structure.yinYang}·${e.structure.wuxing || '—'}`,
  }));

  const branchCards = DIZHI.map((e, i) => ({
    char: e.char,
    slug: articles[10 + i]?.slug ?? '',
    ready: articles[10 + i]?.ready ?? false,
    meta: `${e.structure.yinYang}·${e.structure.wuxing || '—'}`,
  }));

  const renderBlock = (title: string, cards: typeof stemCards): React.ReactElement => (
    <section>
      <h2>{title}</h2>
      <ul className="ganzhi-hub__cards">
        {cards.map((c) => (
          <li key={c.char}>
            {c.ready ? (
              <Link className="ganzhi-hub__card" to={`/knowledge/${c.slug}`}>
                <span className="ganzhi-hub__char">{c.char}</span>
                <span className="muted">{c.meta}</span>
              </Link>
            ) : (
              <span className="ganzhi-hub__card ganzi-hub__card--na">
                <span className="ganzhi-hub__char">{c.char}</span>
                <span className="muted">内容整理中</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <>
      <PageTopbar title="天干地支专题" onBack={onBack} />
      <main className="ganzhi-hub">
        <p>
          天干地支是中国传统历法与命理的基础符号系统。
          <span className="badge">可核验：阴阳 / 五行 / 方位</span>
          <span className="badge badge--legend">民俗：性情 / 类象</span>
        </p>

        {renderBlock('十天干', stemCards)}
        {renderBlock('十二地支', branchCards)}
        <GanzhiMatrix />

        <p className="muted">涉及脏腑的内容仅为传统文化观念陈述，不构成医疗建议。</p>
      </main>
      <PrivacyHint />
    </>
  );
}
