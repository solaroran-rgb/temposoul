// src/pages/community/ForumPage.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import { BoardTabs } from '@/components/community/BoardTabs';
import PostComposer from '@/components/community/PostComposer';
import { FORUM_BOARDS, FORUM_POSTS, ForumBoard, ForumPost } from '@/data/community/forum';
import { trackPageView, trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function ForumPage() {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [boards, setBoards] = useState<ForumBoard[]>(FORUM_BOARDS);
  const [currentBoardId, setCurrentBoardId] = useState<string | undefined>(boardId);

  // 真实调用 GET /api/v1/forum（?board=xxx）。失败时优雅降级为本地 seed，不白屏。
  const loadBoard = useCallback(
    async (bid?: string) => {
      setStatus('loading');
      try {
        const url = bid
          ? `/api/v1/forum?board=${encodeURIComponent(bid)}`
          : '/api/v1/forum';
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`http_${res.status}`);
        const data = await res.json();
        setBoards(Array.isArray(data.boards) ? data.boards : FORUM_BOARDS);
        setPosts(Array.isArray(data.posts) ? data.posts : []);
        setCurrentBoardId(bid);
        setStatus(Array.isArray(data.posts) && data.posts.length > 0 ? 'ok' : 'ok-empty');
      } catch {
        // 降级：接口不可用时回退静态示例数据
        setBoards(FORUM_BOARDS);
        setPosts(bid ? FORUM_POSTS.filter((p) => p.boardId === bid) : FORUM_POSTS);
        setCurrentBoardId(bid);
        setStatus('degraded');
      }
    },
    [],
  );

  useEffect(() => {
    trackPageView(boardId ? `/community/board/${boardId}` : '/community');
    loadBoard(boardId);
  }, [boardId, loadBoard]);

  useEffect(() => {
    if (boardId && boardId !== currentBoardId) {
      setCurrentBoardId(boardId);
    }
  }, [boardId, currentBoardId]);

  const filteredPosts = useMemo(() => {
    if (!currentBoardId) return posts;
    return posts
      .filter((p) => p.boardId === currentBoardId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, currentBoardId]);

  const handleBoardChange = (nextBoardId: string) => {
    trackEvent('forum_board_switch', { boardId: nextBoardId });
    navigate(`/community/board/${nextBoardId}`);
  };

  const handlePosted = (newPost: ForumPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setStatus('ok');
  };

  if (status === 'loading') {
    return (
      <div>
        <PageTopbar title="社区论坛" onBack={() => navigate(-1)} />
        <PrivacyHint />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div>
        <PageTopbar title="社区论坛" onBack={() => navigate(-1)} />
        <PrivacyHint />
        <div className="error-tip">版块不存在或加载失败</div>
      </div>
    );
  }

  // 无 boardId：显示版块网格
  if (!currentBoardId) {
    return (
      <div>
        <PageTopbar title="社区论坛" onBack={() => navigate(-1)} />
        <PrivacyHint />
        {status === 'degraded' && (
          <div className="error-tip">社区接口暂不可用，当前展示本地示例数据</div>
        )}
        <div className="forum-boards">
          {boards.map((board) => (
            <button
              key={board.id}
              type="button"
              className="forum-board-card"
              onClick={() => handleBoardChange(board.id)}
            >
              <h3>{board.name}</h3>
              <p>{board.desc}</p>
              <span className="forum-board-count">{board.postCount} 帖</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 有 boardId：显示版块帖子流
  return (
    <div>
      <PageTopbar
        title={boards.find((b) => b.id === currentBoardId)?.name ?? '版块'}
        onBack={() => navigate('/community')}
      />
      <PrivacyHint />
      {status === 'degraded' && (
        <div className="error-tip">社区接口暂不可用，当前展示本地示例数据</div>
      )}
      <BoardTabs boards={boards} activeId={currentBoardId} onChange={handleBoardChange} />
      <PostComposer boardId={currentBoardId} onPosted={handlePosted} />
      {status === 'ok-empty' || filteredPosts.length === 0 ? (
        <div className="empty-tip">该版块还没有帖子，来发第一帖吧</div>
      ) : (
        <div className="post-list">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="post-item"
              onClick={() => navigate(`/community/post/${post.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/community/post/${post.id}`);
              }}
            >
              <h3>{post.title}</h3>
              <p className="post-excerpt">{post.excerpt}</p>
              <div className="post-meta">
                <span>作者：{post.authorId}</span>
                <span>回复：{post.replyCount}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
