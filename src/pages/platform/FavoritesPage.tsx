// D9-2
// src/pages/platform/FavoritesPage.tsx
import React, { useState } from 'react';
import { useFavorites } from '../../contexts/FavoritesContext';
import { Link } from 'react-router-dom';

type TabType = 'all' | 'chart' | 'article' | 'name';

export const FavoritesPage: React.FC = () => {
  const { favorites, remove, clear, exportJSON } = useFavorites();
  const [tab, setTab] = useState<TabType>('all');

  const filtered = tab === 'all' ? favorites : favorites.filter((f) => f.type === tab);

  const getLink = (f: (typeof favorites)[0]) => {
    if (f.type === 'chart') return `/result?system=${f.system || 'bazi'}`;
    if (f.type === 'article') return `/knowledge/${f.refId}`;
    if (f.type === 'name') return `/name-report?name=${encodeURIComponent(f.title)}`;
    return '#';
  };

  return (
    <div className="favorites-page">
      <h1 className="favorites-page__title">我的收藏</h1>

      <div className="favorites-page__tabs" role="tablist">
        {(['all', 'chart', 'article', 'name'] as TabType[]).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'all' ? '全部' : t === 'chart' ? '排盘' : t === 'article' ? '文章' : '起名'}
          </button>
        ))}
      </div>

      <div className="favorites-page__actions">
        <button className="btn btn-secondary" onClick={exportJSON}>
          导出 JSON
        </button>
        <button className="btn btn-danger" onClick={clear}>
          清空全部
        </button>
      </div>

      <ul className="favorites-list">
        {filtered.length === 0 ? (
          <li className="favorites-list__empty">暂无收藏内容</li>
        ) : (
          filtered.map((f) => (
            <li key={f.id} className="favorites-item">
              <Link to={getLink(f)} className="favorites-item__link">
                <span className="favorites-item__type">{f.type}</span>
                <span className="favorites-item__title">{f.title}</span>
              </Link>
              <button
                className="favorites-item__remove"
                onClick={() => remove(f.id)}
                aria-label="删除"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};
