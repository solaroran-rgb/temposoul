// src/pages/bazi/components/TopicTabs.tsx · IT-5.10 依据（白名单 career|wealth|marriage|health）
// 修正：新增 fallbackSearch prop；导出 TOPIC_LABEL 供页面复用；当前 tab 加 disabled
import { useNavigate, useSearchParams } from 'react-router-dom';

export const TOPIC_LIST = ['career', 'wealth', 'marriage', 'health'] as const;
export type Topic = (typeof TOPIC_LIST)[number];

export const TOPIC_LABEL: Record<Topic, string> = {
  career: '事业',
  wealth: '财运',
  marriage: '感情',
  health: '健康',
};

export function isTopic(t: string | undefined): t is Topic {
  return !!t && (TOPIC_LIST as readonly string[]).includes(t);
}

export interface TopicTabsProps {
  active: Topic;
  /** 'page'（默认）用于 /bazi/topics 页内切换；'inline' 用于其他页底部入口 */
  variant?: 'page' | 'inline';
  /**

* 当调用页（如 /bazi/dayun）无查询串时，可用此对象把出生信息透传到目标页。
* 结构：{ gender, dateType, year, month, day, timeIndex }
  */
  fallbackSearch?: Record<string, string | number>;
}

export function TopicTabs({ active, variant = 'page', fallbackSearch }: TopicTabsProps) {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const existing = sp.toString();

  const suffix = existing
    ? `?${existing}`
    : fallbackSearch
      ? `?${new URLSearchParams(
          Object.entries(fallbackSearch).map(([k, v]) => [k, String(v)]),
        ).toString()}`
      : '';

  return (
    <nav
      className={`ts-topic-tabs${variant === 'inline' ? ' ts-topic-tabs--inline' : ''}`}
      aria-label="八字主题"
    >
      {TOPIC_LIST.map((t) => {
        const isActive = t === active;
        return (
          <button
            key={t}
            type="button"
            className={`ts-topic-tabs__item${isActive ? ' is-active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            disabled={isActive}
            onClick={() => {
              if (!isActive) navigate(`/bazi/topics/${t}${suffix}`);
            }}
          >
            {TOPIC_LABEL[t]}
          </button>
        );
      })}
    </nav>
  );
}

export default TopicTabs;
