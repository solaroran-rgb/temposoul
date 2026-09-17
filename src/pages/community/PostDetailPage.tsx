// src/pages/community/PostDetailPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { PrivacyHint } from '@/components/PrivacyHint';
import CommentComposer from '@/components/community/CommentComposer';
import { POSTS_SEED, POST_COMMENTS_SEED, PostDetail, PostComment } from '@/data/community/posts';

type Status = 'idle' | 'loading' | 'ok' | 'ok-empty' | 'degraded' | 'error';

export default function PostDetailPage() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();
  const [status, setStatus] = useState<Status>('loading');
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = POSTS_SEED.find((item) => item.id === postId);
      if (!found) {
        setStatus('error');
        return;
      }
      const postComments = POST_COMMENTS_SEED.filter((item) => item.postId === found.id).sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      setPost(found);
      setComments(postComments);
      setStatus(postComments.length > 0 ? 'ok' : 'ok-empty');
    }, 0);
    return () => clearTimeout(timer);
  }, [postId]);

  const handleCommented = (comment: PostComment) => {
    setComments((prev) => [...prev, comment]);
    setStatus('ok');
  };

  if (status === 'loading') {
    return (
      <div>
        <PageTopbar title="帖子详情" onBack={() => navigate(-1)} />
        <PrivacyHint />
        <div className="skeleton" />
        <div className="skeleton" />
      </div>
    );
  }

  if (status === 'error' || !post) {
    return (
      <div>
        <PageTopbar title="帖子详情" onBack={() => navigate(-1)} />
        <PrivacyHint />
        <div className="error-tip">帖子不存在或已被删除</div>
      </div>
    );
  }

  return (
    <div>
      <PageTopbar title={post.title} onBack={() => navigate(-1)} />
      <PrivacyHint />
      <article className="post-detail">
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>作者：{post.authorId}</span>
          <span>发布时间：{new Date(post.createdAt).toLocaleString('zh-CN')}</span>
        </div>
        <div className="post-content">{post.content}</div>
      </article>

      <section className="post-comments">
        <h2>评论（{comments.length}）</h2>
        {status === 'ok-empty' && comments.length === 0 ? (
          <div className="empty-tip">还没有评论，来抢沙发</div>
        ) : (
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-author">{comment.authorId}</div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-time">
                  {new Date(comment.createdAt).toLocaleString('zh-CN')}
                </div>
              </div>
            ))}
          </div>
        )}
        <CommentComposer postId={post.id} onCommented={handleCommented} />
      </section>
    </div>
  );
}
