// D9-4
// src/components/home/HomeShortcuts.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShortcutPersonalization } from '../../hooks/useShortcutPersonalization';
import type { ShortcutItem } from '../../data/home-shortcuts';

export const HomeShortcuts: React.FC = () => {
  const { sortedGroups, trackClick } = useShortcutPersonalization();
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

  // 升维：全局 Esc 键逃逸机制
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && expanded) {
        setExpanded(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  const handleMainClick = (groupId: string) => {
    setExpanded(expanded === groupId ? null : groupId);
  };

  const handleSubClick = (
    e: React.MouseEvent | React.KeyboardEvent,
    target: string,
    item: ShortcutItem,
  ) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    trackClick(item);
    navigate(target);
  };

  return (
    <nav ref={navRef} className="home-shortcuts" aria-label="首页快捷功能导航">
      <div className="home-shortcuts__grid">
        {sortedGroups.map((g) => (
          <div key={g.groupId} className="home-shortcuts__group">
            <button
              className="home-shortcuts__main"
              aria-expanded={expanded === g.groupId}
              aria-controls={`panel-${g.groupId}`}
              onClick={() => handleMainClick(g.groupId)}
            >
              <span className="home-shortcuts__title">{g.title}</span>
              <span className="home-shortcuts__arrow" aria-hidden="true">
                {expanded === g.groupId ? '∧' : '∨'}
              </span>
            </button>
            {expanded === g.groupId && (
              <div
                id={`panel-${g.groupId}`}
                className="home-shortcuts__panel"
                role="region"
                aria-label={`${g.title}子功能`}
              >
                {g.items.map((item) => (
                  <a
                    key={item.id}
                    href={item.target}
                    className="home-shortcuts__sub"
                    onClick={(e) => handleSubClick(e, item.target, item)}
                    onKeyDown={(e) => handleSubClick(e, item.target, item)}
                    tabIndex={0}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
