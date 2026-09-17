import { useState, useEffect } from 'react';
import { Review } from '@/data/consult/profile';
import { guardText } from '@/lib/assertions-guard';
import './ReviewList.css';

export function ReviewList({ advisorId }: { advisorId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const mock: Review[] = [
      {
        id: 'r1',
        advisorId,
        authorName: '用户***',
        rating: 5,
        content: '很准',
        createdAt: Date.now(),
        ready: false,
      },
    ];
    setReviews(mock);
  }, [advisorId]);

  if (reviews.length === 0) return <div className="empty">暂无评价</div>;

  return (
    <div className="reviews">
      {reviews
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((r) => (
          <div key={r.id} className="review">
            <div>
              {r.authorName} - {r.rating}星
            </div>
            <div>{guardText(r.content)}</div>
            <button className="report">举报</button>
          </div>
        ))}
    </div>
  );
}
