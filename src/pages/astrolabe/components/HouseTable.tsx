import React from 'react';

// A6 标注为"未变更保留版"但仓库未交付；此处为接口对齐最小表格实现。
export const HouseTable: React.FC<{ houses: unknown[] }> = ({ houses }) => {
  const list = Array.isArray(houses) ? houses : [];
  if (list.length === 0) return <div className="house-table__empty">暂无宫位数据。</div>;
  return (
    <ul className="house-table">
      {list.map((h, i) => {
        const o = (h ?? {}) as Record<string, unknown>;
        return (
          <li key={i} className="house-table__row">
            第 {String(o.number ?? i + 1)} 宫 {String(o.sign ?? '')} {String(o.cusp ?? '')}
          </li>
        );
      })}
    </ul>
  );
};

export default HouseTable;
