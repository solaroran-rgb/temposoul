import React from 'react';

interface AstroEvent {
  date?: string;
  type?: string;
  title?: string;
  description?: string;
  [key: string]: unknown;
}

// B6 未单独交付 EventTimeline 组件；此处为接口对齐最小实现，按 events 字段渲染时间线。
export const EventTimeline: React.FC<{ events: AstroEvent[] }> = ({ events }) => {
  if (!events || events.length === 0) {
    return <div className="event-timeline__empty">本年度暂无星象事件数据。</div>;
  }
  return (
    <ul className="event-timeline">
      {events.map((ev, idx) => (
        <li key={idx} className="event-timeline__item">
          {ev.date && <span className="event-timeline__date">{ev.date}</span>}
          <span className="event-timeline__title">{ev.title ?? ev.type ?? '星象事件'}</span>
          {ev.description && <p className="event-timeline__desc">{ev.description}</p>}
        </li>
      ))}
    </ul>
  );
};

export default EventTimeline;
