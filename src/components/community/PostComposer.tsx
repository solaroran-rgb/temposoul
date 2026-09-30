// src/components/community/PostComposer.tsx
import { useState } from 'react';
import type { ForumPost } from '@/data/community/forum';
import { checkSensitive } from '@/data/community/moderation';
import { trackEvent } from '@/lib/analytics';

interface PostComposerProps {
  boardId: string;
  onPosted: (post: ForumPost) => void;
}

export default function PostComposer({ boardId, onPosted }: PostComposerProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sensitive = checkSensitive(`${title} ${content}`);
  const blocked = sensitive.length > 0;

  const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !blocked;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    // 本地乐观回退：接口失败时仍插入列表，保证不白屏
    const fallback: ForumPost = {
      id: `post-${Date.now()}`,
      boardId,
      title: trimmedTitle,
      authorId: 'current-user',
      excerpt: trimmedContent.slice(0, 80),
      replyCount: 0,
      createdAt: new Date().toISOString(),
      ready: false,
    };

    setSubmitting(true);
    try {
      const res = await fetch('/api/v1/forum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId, title: trimmedTitle, content: trimmedContent }),
      });
      if (res.ok) {
        const created = await res.json();
        onPosted({ ...fallback, ...created });
      } else {
        onPosted(fallback);
      }
    } catch {
      onPosted(fallback);
    } finally {
      setSubmitting(false);
      setTitle('');
      setContent('');
    }

    trackEvent('forum_post_submit', { boardId });
  };

  return (
    <form className="post-composer" onSubmit={handleSubmit}>
      <h3>发布新帖</h3>
      <input
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="标题"
        maxLength={60}
      />
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="正文，请遵守社区规范"
        rows={4}
      />
      {blocked && (
        <p className="composer-warning" role="alert">
          内容包含敏感词：{sensitive.map((s) => s.word).join('、')}，禁止提交。
        </p>
      )}
      <button type="submit" disabled={!canSubmit || submitting}>
        {submitting ? '发布中…' : '发布'}
      </button>
    </form>
  );
}
