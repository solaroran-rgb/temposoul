import React from 'react';

// A6 标注为"未变更保留版"但仓库未交付；此处为接口对齐最小表格实现。
export const PlanetTable: React.FC<{ planets: unknown[] }> = ({ planets }) => {
  const list = Array.isArray(planets) ? planets : [];
  if (list.length === 0) return <div className="planet-table__empty">暂无行星数据。</div>;
  return (
    <ul className="planet-table">
      {list.map((p, i) => {
        const o = (p ?? {}) as Record<string, unknown>;
        return (
          <li key={i} className="planet-table__row">
            {String(o.name ?? o.planet ?? `行星 ${i + 1}`)} {String(o.sign ?? '')}{' '}
            {String(o.degree ?? '')}°
          </li>
        );
      })}
    </ul>
  );
};

export default PlanetTable;
