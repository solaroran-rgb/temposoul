// 保留第 3 轮实现（props 不变，供专家 B 组装）
export interface YiJiItem {
  label: string;
  source?: string;
  note?: string;
}

function Column({
  variant,
  title,
  items,
}: {
  variant: 'yi' | 'ji';
  title: string;
  items: YiJiItem[];
}) {
  return (
    <section className={`ts-yiji-panel__col ts-yiji-panel__col--${variant}`}>
      <header className="ts-yiji-panel__head">
        <span className={`ts-yiji-panel__dot ts-yiji-panel__dot--${variant}`} aria-hidden />
        <h4 className="ts-yiji-panel__title">{title}</h4>
      </header>
      {items.length === 0 ? (
        <div className="ts-empty">无</div>
      ) : (
        <ul className="ts-yiji-panel__list">
          {items.map((it, i) => (
            <li key={`${variant}-${i}-${it.label}`} className="ts-yiji-panel__item">
              <div className="ts-yiji-panel__label">{it.label}</div>
              {(it.source || it.note) && (
                <div className="ts-yiji-panel__meta">
                  {it.source && <span>出处：{it.source}</span>}
                  {it.note && <span>口径：{it.note}</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function YiJiPanel({ yi, ji }: { yi: YiJiItem[]; ji: YiJiItem[] }) {
  const safeYi = Array.isArray(yi) ? yi : [];
  const safeJi = Array.isArray(ji) ? ji : [];
  return (
    <div className="ts-yiji-panel">
      <Column variant="yi" title="宜" items={safeYi} />
      <Column variant="ji" title="忌" items={safeJi} />
    </div>
  );
}

export default YiJiPanel;
