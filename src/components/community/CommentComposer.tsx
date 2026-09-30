// src/components/community/CommentComposer.tsx
import { useState } from 'react';
import type { PostComment } from '@/data/community/posts';
import { checkSensitive } from '@/data/community/moderation';
import { trackEvent } from '@/lib/analytics';

interface CommentComposerProps {
  postId: string;
  onCommented?: (comment: PostComment) => void;
}

export default function CommentComposer({ postId, onCommented }: CommentComposerProps) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const sensitive = checkSensitive(content);
  const blocked = sensitive.length > 0;

  const canSubmit = content.trim().length > 0 && !blocked;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    const trimmed = content.trim();

    // 本地乐观回退：接口失败时仍插入评论，保证不白屏
    const fallback: PostComment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: 'current-user',
      content: trimmed,
      createdAt: new Date().toISOString(),
      ready: false,
    };

    setSubmitting(true);
    try {
      const res = await fetch(`/api/v1/forum/${encodeURIComponent(postId)}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
      });
      if (res.ok) {
        const created = await res.json();
        onCommented?.({ ...fallback, ...created });
      } else {
        onCommented?.(fallback);
      }
    } catch {
      onCommented?.(fallback);
    } finally {
      setSubmitting(false);
      setContent('');
    }

    trackEvent('forum_comment_submit', { postId });
  };

  return (
    <form className="comment-composer" onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="写下你的评论"
        rows={3}
      />
      {blocked && (
        <p className="composer-warning" role="alert">
          内容包含敏感词：{sensitive.map((s) => s.word).join('、')}，禁止提交。
        </p>
      )}
      <button type="submit" disabled={!canSubmit || submitting}>
        {submitting ? '回复中…' : '回复'}
      </button>
    </form>
  );
}
