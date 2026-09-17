// 修正：IT-2.2 依据（数据源 = data.luckInfo.cycles）+ 选中交互
export interface DayunCycle {
  age: number;
  year: number;
  ganZhi: string;
}

export interface DayunTimelineProps {
  cycles: DayunCycle[];
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

export function DayunTimeline({ cycles, selectedIndex = -1, onSelect }: DayunTimelineProps) {
  if (!cycles || cycles.length === 0) return <div className="ts-empty">暂无大运数据</div>;
  return (
    <ol className="ts-dayun-timeline">
      {cycles.map((c, i) => {
        const isXiaoyun = c.ganZhi === '小运';
        const isSelected = i === selectedIndex;
        const className = [
          'ts-dayun-timeline__item',
          isXiaoyun ? 'ts-dayun-timeline__item--xiaoyun' : '',
          isSelected ? 'ts-dayun-timeline__item--selected' : '',
        ]
          .filter(Boolean)
          .join(' ');

        const content = (
          <>
            <span className="ts-dayun-timeline__age">{c.age}岁</span>
            <span className="ts-dayun-timeline__year">{c.year}</span>
            <span className="ts-dayun-timeline__ganzhi">{c.ganZhi}</span>
            {isXiaoyun && <span className="ts-dayun-timeline__tag">小运</span>}
          </>
        );

        return (
          <li key={`${c.year}-${i}`} className={className}>
            {onSelect ? (
              <button
                type="button"
                className="ts-dayun-timeline__btn"
                onClick={() => onSelect(i)}
                aria-pressed={isSelected}
              >
                {content}
              </button>
            ) : (
              <div className="ts-dayun-timeline__row">{content}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default DayunTimeline;
