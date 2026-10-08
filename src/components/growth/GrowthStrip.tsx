// src/components/growth/GrowthStrip.tsx
// 连续登录成长条（规格 §3 冻结纯展示组件；props 由外部注入，组件内不写业务状态）。
// 展示：连续天数「已连续 N 天」→ 7/30/100 里程碑进度（达成者标记徽章/称号）
//       → 每日免费解读按钮（未用可点、已用显示「今日已用」）→ 邀请入口提示。
// 视觉只消费 src/styles/tokens.css 变量：暗黑星云深色、白正文、无白卡片；
// prefers-reduced-motion 动效归零；文案中性，无吉凶/运势措辞。

import type { ReactElement } from 'react';
import { STREAK_MILESTONES, type StreakState } from '@/lib/growth/streak';

export interface GrowthStripProps {
  state: StreakState;
  unlocked: Array<'d7' | 'd30' | 'd100'>;
  freeReadUsed: boolean;
  onFreeRead?: () => void;
  inviteUrl?: string | null;
}

const KIND_LABEL: Record<'topic' | 'badge' | 'title', string> = {
  topic: '专题',
  badge: '徽章',
  title: '称号',
};

const STRIP_STYLE = `
.gs-strip {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  box-sizing: border-box;
}
.gs-days {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}
.gs-milestones {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: var(--sp-2);
  flex-wrap: wrap;
}
.gs-step {
  flex: 1 1 88px;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: var(--sp-2) var(--sp-3);
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.4;
}
.gs-step--reached {
  border-color: var(--accent-primary);
  color: var(--text-primary);
}
.gs-step-days {
  display: block;
  font-size: 12px;
  letter-spacing: 0.04em;
}
.gs-free {
  align-self: flex-start;
  background: var(--button-secondary-bg);
  border: 1px solid var(--button-secondary-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  padding: var(--sp-2) var(--sp-4);
  font-size: 14px;
  cursor: pointer;
  transition: filter var(--motion-base) var(--ease-out),
    border-color var(--motion-base) var(--ease-out),
    transform var(--motion-fast) var(--ease-out);
}
.gs-free:hover:not(:disabled) {
  filter: brightness(1.15);
  border-color: var(--accent-primary);
}
.gs-free:active:not(:disabled) { transform: scale(0.98); }
.gs-free:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
.gs-free:disabled {
  opacity: 0.5;
  cursor: default;
}
.gs-invite {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}
@media (prefers-reduced-motion: reduce) {
  .gs-strip, .gs-strip * { transition: none !important; animation: none !important; }
}
`;

export function GrowthStrip({
  state,
  unlocked,
  freeReadUsed,
  onFreeRead,
  inviteUrl,
}: GrowthStripProps): ReactElement {
  return (
    <section className="gs-strip" aria-label="连续登录成长">
      <style>{STRIP_STYLE}</style>
      <p className="gs-days">已连续 {state.current} 天</p>
      <ul className="gs-milestones">
        {STREAK_MILESTONES.map((m) => {
          const reached = unlocked.includes(m.key);
          return (
            <li key={m.key} className={reached ? 'gs-step gs-step--reached' : 'gs-step'}>
              <span className="gs-step-days">{m.days} 天</span>
              <span>{reached ? `${m.title}（${KIND_LABEL[m.kind]}）` : '未解锁'}</span>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="gs-free"
        disabled={freeReadUsed}
        onClick={() => {
          if (!freeReadUsed) onFreeRead?.();
        }}
      >
        {freeReadUsed ? '今日已用' : '领取今日免费解读'}
      </button>
      {inviteUrl ? <p className="gs-invite">邀请好友，双方各 +1 解读</p> : null}
    </section>
  );
}

export default GrowthStrip;
