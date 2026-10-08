// src/components/growth/ProfileGrowthPanel.tsx
// S-6b B4 接线片 · 输入页档案区成长面板（规格 §3.2）。
// 展示：连续天数 → 已解锁徽章/称号（unlockedMilestones 映射冻结文案）
//       → 邀请好友种子入口（createInviteToken + 复制 /login?invite=... 链接）
//       → AI 解读额度余额（getAiCredits 只读）→ 每日免费解读状态。
// 纯 localStorage 只读展示 + 复制链接，不接后端付费/订阅；
// 视觉只消费 src/styles/tokens.css 变量（暗黑星云深色、白正文、禁白卡片）；
// prefers-reduced-motion 动效归零；文案中性，无吉凶/运势/现金措辞。

import { useEffect, useRef, useState, type ReactElement } from 'react';
import {
  getFreeReadUsedToday,
  getStreakState,
  STREAK_MILESTONES,
  unlockedMilestones,
} from '@/lib/growth/streak';
import { getAiCredits } from '@/lib/growth/ai-credits';
import { createInviteToken } from '@/lib/growth/invite';

const PANEL_STYLE = `
.pgp-panel {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
  box-sizing: border-box;
  max-width: 600px;
  margin: 0 auto 14px;
}
.pgp-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--sp-2);
}
.pgp-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}
.pgp-days {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}
.pgp-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
}
.pgp-item {
  margin: 0;
  font-size: 13px;
  color: var(--text-primary);
  line-height: 1.5;
}
.pgp-empty {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}
.pgp-meta {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
}
.pgp-invite {
  align-self: flex-start;
  background: var(--button-secondary-bg);
  border: 1px solid var(--button-secondary-border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  padding: var(--sp-2) var(--sp-4);
  font-size: 13px;
  cursor: pointer;
  transition: filter var(--motion-base) var(--ease-out),
    border-color var(--motion-base) var(--ease-out),
    transform var(--motion-fast) var(--ease-out);
}
.pgp-invite:hover { filter: brightness(1.15); border-color: var(--accent-primary); }
.pgp-invite:active { transform: scale(0.98); }
.pgp-invite:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
.pgp-copied {
  margin: 0;
  font-size: 12px;
  color: var(--accent-lunar);
}
@media (prefers-reduced-motion: reduce) {
  .pgp-panel, .pgp-panel * { transition: none !important; animation: none !important; }
}
`;

export function ProfileGrowthPanel(): ReactElement {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const streak = getStreakState();
  const unlocked = unlockedMilestones(streak);
  const credits = getAiCredits();
  const freeReadUsed = getFreeReadUsedToday();

  const handleCopyInvite = () => {
    // 复用既有路由 /login + query（不新增路由）；token 24h 有效。
    const link = `${window.location.origin}/login?invite=${createInviteToken()}`;
    const done = () => {
      setCopied(true);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setCopied(false), 2200);
    };
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link).then(done).catch(done);
    } else {
      done();
    }
  };

  return (
    <section className="pgp-panel" aria-label="成长概览">
      <style>{PANEL_STYLE}</style>
      <div className="pgp-head">
        <h3 className="pgp-title">成长概览</h3>
        <p className="pgp-days">已连续 {streak.current} 天访问</p>
      </div>

      {unlocked.length > 0 ? (
        <ul className="pgp-list">
          {unlocked.map((key) => {
            const m = STREAK_MILESTONES.find((item) => item.key === key);
            if (!m) return null;
            return (
              <li key={key} className="pgp-item">
                {m.description}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="pgp-empty">连续访问可解锁文化专题、徽章与称号</p>
      )}

      <p className="pgp-meta">解读额度余额：{credits} 次</p>
      <p className="pgp-meta">{freeReadUsed ? '今日免费解读：已领取' : '今日免费解读：可领取'}</p>

      <button type="button" className="pgp-invite" onClick={handleCopyInvite}>
        复制邀请链接
      </button>
      {copied ? <p className="pgp-copied">已复制邀请链接</p> : null}
    </section>
  );
}

export default ProfileGrowthPanel;
