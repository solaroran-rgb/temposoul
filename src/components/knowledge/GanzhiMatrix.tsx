/**

* C11-干支专题：六十甲子矩阵（修改后，不依赖未交付组件）
  */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { buildJiazi } from '../../data/knowledge/ganzhi';
import { ganzhiArticles } from '../../data/knowledge/registry';

export function GanzhiMatrix(): React.ReactElement {
  const articles = useMemo(() => ganzhiArticles(), []);
  const jiazi = useMemo(() => buildJiazi(), []);

  return (
    <section className="ganzhi-matrix" aria-labelledby="ganzhi-matrix-title">
      <h2 id="ganzhi-matrix-title">六十甲子</h2>
      <p className="muted">点击天干 / 地支跳转到对应文章；未就绪条目显示「内容整理中」。</p>

      <ol className="ganzhi-matrix__grid">
        {jiazi.map((j) => {
          const stem = articles[j.index % 10];
          const branch = articles[10 + (j.index % 12)];
          return (
            <li key={j.index} className="ganzhi-matrix__cell">
              <span className="ganzhi-matrix__no">{j.index + 1}</span>
              {stem?.ready ? (
                <Link className="ganzhi-matrix__link" to={`/knowledge/${stem.slug}`}>
                  {j.tiangan}
                </Link>
              ) : (
                <span className="ganzhi-matrix__char">{j.tiangan}</span>
              )}
              {branch?.ready ? (
                <Link className="ganzhi-matrix__link" to={`/knowledge/${branch.slug}`}>
                  {j.dizhi}
                </Link>
              ) : (
                <span className="ganzhi-matrix__char">{j.dizhi}</span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
