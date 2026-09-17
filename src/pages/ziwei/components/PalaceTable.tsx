import React from 'react';

interface PalaceRow {
  index: number;
  name: string;
  ganZhi?: string;
  majorStars?: string[];
  minorStars?: string[];
  sihua?: Array<{ star: string; kind: string }>;
  decadalRange?: string;
}

// A6 标注为"未变更保留版"但仓库未交付；此处为接口对齐最小表格实现。
export const PalaceTable: React.FC<{ palaces: PalaceRow[] }> = ({ palaces }) => {
  if (!palaces || palaces.length === 0)
    return <div className="palace-table__empty">暂无宫位数据。</div>;
  return (
    <div className="palace-table">
      {palaces.map((p) => (
        <div key={p.index} className="palace-table__cell">
          <div className="palace-table__name">
            {p.index + 1}. {p.name}
          </div>
          {p.ganZhi && <div className="palace-table__ganzhi">{p.ganZhi}</div>}
          {p.majorStars?.length ? (
            <div className="palace-table__stars">{p.majorStars.join('、')}</div>
          ) : null}
          {p.decadalRange && <div className="palace-table__decadal">{p.decadalRange}</div>}
        </div>
      ))}
    </div>
  );
};

export default PalaceTable;
