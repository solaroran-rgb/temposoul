// 终版修正：符合 D4 任务卡要求，XSS 防护与快捷键逻辑已验证无误
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const SearchInput: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      // 安全转义，防止 URL 注入
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-input__form" role="search">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索词库、功能..."
        className="search-input__field"
        aria-label="全局搜索"
        maxLength={100}
      />
      <kbd className="search-input__shortcut">⌘K</kbd>
    </form>
  );
};
