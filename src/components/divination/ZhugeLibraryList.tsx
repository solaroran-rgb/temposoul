// A11-5 · src/components/divination/ZhugeLibraryList.tsx · 签文库
import type { ZhugeSign } from '../../data/zhuge/types';

export function ZhugeLibraryList({ signs }: { signs: ZhugeSign[] }) {
  const safe = Array.isArray(signs) ? signs : [];
  if (safe.length === 0) return <div className="ts-empty">签文库准备中</div>;
  return (
    <ul className="ts-zhuge-lib">
      {safe.map((s) => (
        <li key={s.signId} className="ts-zhuge-lib__item">
          <span className="ts-zhuge-lib__no">{s.signNo}</span>
          <span className="ts-zhuge-lib__title">{s.signTitle}</span>
          <span className="ts-zhuge-lib__fortune">{s.fortune}</span>
          {!s.ready && <span className="ts-zhuge-lib__hint">待录入</span>}
        </li>
      ))}
    </ul>
  );
}

export default ZhugeLibraryList;
