// src/components/community/BoardTabs.tsx
import type { ForumBoard } from '@/data/community/forum';

interface BoardTabsProps {
  boards: ForumBoard[];
  activeId: string;
  onChange: (id: string) => void;
}

export function BoardTabs({ boards, activeId, onChange }: BoardTabsProps) {
  return (
    <div className="board-tabs" role="tablist" aria-label="版块切换">
      {boards.map((board) => {
        const isActive = board.id === activeId;
        return (
          <button
            key={board.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? 'board-tab board-tab--active' : 'board-tab'}
            onClick={() => onChange(board.id)}
          >
            {board.name}
          </button>
        );
      })}
    </div>
  );
}
