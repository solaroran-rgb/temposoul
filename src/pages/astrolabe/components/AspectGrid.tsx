import React from 'react';

// A6 标注为"未变更保留版"但仓库未交付；此处为接口对齐最小网格实现。
export const AspectGrid: React.FC<{ aspects: unknown[] }> = ({ aspects }) => {
  const list = Array.isArray(aspects) ? aspects : [];
  if (list.length === 0) return <div className="aspect-grid__empty">暂无主要相位数据。</div>;
  return (
    <ul className="aspect-grid">
      {list.map((a, i) => {
        const o = (a ?? {}) as Record<string, unknown>;
        return (
          <li key={i} className="aspect-grid__cell">
            {String(o.planet1 ?? '')} {String(o.type ?? o.aspect ?? '相位')}{' '}
            {String(o.planet2 ?? '')}
          </li>
        );
      })}
    </ul>
  );
};

export default AspectGrid;
