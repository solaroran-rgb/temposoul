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

  const sensitive = checkSensitive(content);
  const blocked = sensitive.length > 0;

  const canSubmit = content.trim().length > 0 && !blocked;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    const newComment: PostComment = {
      id: `comment-${Date.now()}`,
      postId,
      authorId: 'current-user',
      content: content.trim(),
      createdAt: new Date().toISOString(),
      ready: false,
    };

    onCommented?.(newComment);
    trackEvent('forum_comment_submit', { postId });
    setContent('');
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
      <button type="submit" disabled={!canSubmit}>
        回复
      </button>
    </form>
  );
}
