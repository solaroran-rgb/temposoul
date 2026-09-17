
// A11-4 · src/components/ziwei/StarSkeleton.tsx · 骨架
export function StarSkeleton() {
  return (
    <div className="ts-star-skeleton" role="status" aria-label="内容整理中">
      <div className="ts-star-skeleton__line" />
      <div className="ts-star-skeleton__line" />
      <div className="ts-star-skeleton__line" />
      <p className="ts-star-skeleton__hint">内容整理中，敬请期待</p>
    </div>
  );
}

export default StarSkeleton;

---

