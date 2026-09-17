/**

* C9-终版：四维观察列表（无总分）
* 修复：复用 ConfidenceBadge 统一徽章；不可用维度显式展示原因
  */
import React from 'react';
import { toDimensionView, type PairDimension } from '../../types/pair';
import { ConfidenceBadge } from '../knowledge/ConfidenceBadge';

export function PairDimensionList({
  dimensions,
}: {
  dimensions: PairDimension[];
}): React.ReactElement {
  const views = dimensions.map(toDimensionView);
  return (
    <section className="pair-dimensions" aria-label="配对观察维度">
      <h3 className="pair-dimensions__title">四维观察（可复算，非吉凶判断）</h3>
      <ul className="pair-dimensions__list">
        {views.map((v) => (
          <li
            key={v.key}
            className={`pair-dimensions__item ${v.available ? '' : 'pair-dimensions__item--na'}`}
          >
            <div className="pair-dimensions__head">
              <strong>{v.label}</strong>
              <ConfidenceBadge confidence={v.confidence} />
            </div>
            <p className="pair-dimensions__detail">{v.detail}</p>
            {v.formula && (
              <details className="pair-dimensions__formula">
                <summary>查看算式（数字无实证意义）</summary>
                <p>{v.formula}</p>
              </details>
            )}
            {!v.available && v.reason && (
              <p className="pair-dimensions__reason">不可用原因：{v.reason}</p>
            )}
            <p className="pair-dimensions__source">来源：{v.source}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
