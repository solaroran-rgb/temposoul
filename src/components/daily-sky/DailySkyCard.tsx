// src/components/daily-sky/DailySkyCard.tsx
// 每日星象卡（规格 §4 冻结组件）。
// 展示顺序：日期+时区行 → 天象标题(serif) → 个性化行 → 引文+出处 → 合规脚注
//           → 「分享今日星空」按钮 → 副标「今日仅此一版」。
// 24h 刷新：挂载时 refreshIfNewDay + visibilitychange + 每 60s 检查 getDailyKey() 变化即重取。
// 视觉只消费 src/styles/tokens.css 变量；prefers-reduced-motion 下动效归零。
// （本文件替换首页片 TEMP-STUB，对外 Props 保持不变。）

import { useCallback, useEffect, useState, type ReactElement } from 'react';
import { buildDailySky, type DailySkyPayload } from '@/lib/daily-sky/daily';
import { getDailyKey, refreshIfNewDay } from '@/lib/daily-sky/dailyKey';
import type { DailySkyProfile } from '@/lib/daily-sky/profile';
import { buildDailyShareUrl } from '@/lib/daily-sky/share';
// S-6b B4 接线（仅消费 B1/B2/B3 冻结接口，不重复实现）
import {
  getFreeReadUsedToday,
  getStreakState,
  markFreeReadUsedToday,
  markVisit,
  unlockedMilestones,
} from '@/lib/growth/streak';
import { isHiddenCardUnlocked, unlockHiddenCard } from '@/lib/growth/hidden-card';
import { createInviteToken } from '@/lib/growth/invite';
import { GrowthStrip } from '@/components/growth/GrowthStrip';
import HiddenSkyCard from '@/components/daily-sky/HiddenSkyCard';

// 类型再导出，兼容首页片从本文件引类型的旧 import 路径。
export type { DailySkyPayload, DailySkyProfile };

interface DailySkyCardProps {
  /** 外部可注入 payload（分享片 / 首页片复用）；缺省时组件自取 buildDailySky。 */
  payload?: DailySkyPayload;
  /** 分享按钮回调（由外层决定落地行为，如打开分享画布）。 */
  onShare?: (payload: DailySkyPayload) => void;
}

const CARD_STYLE = `
.ds-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
  color: var(--text-primary);
  max-width: 560px;
  width: 100%;
  box-sizing: border-box;
}
.ds-meta {
  font-size: 13px;
  color: var(--text-secondary);
  letter-spacing: 0.04em;
}
.ds-title {
  font-family: var(--font-serif-zh), var(--font-serif-en), serif;
  font-size: 28px;
  line-height: 1.35;
  margin: var(--sp-3) 0 var(--sp-2);
}
.ds-note { margin: 0; }
.ds-zodiac {
  margin: var(--sp-1) 0 0;
  color: var(--text-secondary);
  font-size: 14px;
}
.ds-quote {
  margin: var(--sp-4) 0 var(--sp-1);
  font-family: var(--font-serif-zh), var(--font-serif-en), serif;
  font-size: 16px;
}
.ds-source {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}
.ds-compliance {
  margin: var(--sp-4) 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}
.ds-share {
  margin-top: var(--sp-4);
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
.ds-share:hover { filter: brightness(1.15); border-color: var(--accent-primary); }
.ds-share:active { transform: scale(0.98); }
.ds-share:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
.ds-sub {
  margin: var(--sp-3) 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}
.ds-toast {
  margin: var(--sp-2) 0 0;
  font-size: 13px;
  color: var(--accent-lunar);
}
@media (prefers-reduced-motion: reduce) {
  .ds-card, .ds-card * { transition: none !important; animation: none !important; }
}
`;

export default function DailySkyCard({
  payload: external,
  onShare,
}: DailySkyCardProps): ReactElement {
  const [payload, setPayload] = useState<DailySkyPayload | null>(external ?? null);
  const [watchKey, setWatchKey] = useState<string>(() => getDailyKey());
  // S-6b B4：免费解读额度（1 次/日）、隐藏卡显隐、邀请链接（token 挂载时生成一次，24h 有效）
  const [freeReadUsed, setFreeReadUsed] = useState<boolean>(() => getFreeReadUsedToday());
  const [freeReadToast, setFreeReadToast] = useState(false);
  const [hiddenJustUnlocked, setHiddenJustUnlocked] = useState(false);
  const [hiddenDismissed, setHiddenDismissed] = useState(false);
  const [invitePath] = useState(() => `/login?invite=${createInviteToken()}`);

  const rebuild = useCallback(() => {
    setPayload(buildDailySky());
  }, []);

  useEffect(() => {
    if (external) {
      setPayload(external);
      return;
    }
    // 挂载：跨天则按新日重建（refreshIfNewDay 内部会刷新 lastSeen）
    refreshIfNewDay();
    rebuild();

    // 60s 轮询 + 回到前台时检查日键是否变化（跨零点即重取）
    const check = () => {
      const k = getDailyKey();
      if (k !== watchKey) {
        setWatchKey(k);
        rebuild();
      }
    };
    const onVisible = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') check();
    };
    const timer = setInterval(check, 60_000);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisible);
    }
    return () => {
      clearInterval(timer);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisible);
      }
    };
  }, [external, rebuild, watchKey]);

  // S-6b B4：挂载即计一次访问（同日不叠加 / 跨天 +1 / 断签重置边界均在 streak.ts 内实现）。
  useEffect(() => {
    markVisit();
  }, []);

  // 免费解读领取后的中性提示自动消退（不接后端付费/订阅，纯额度标记）。
  useEffect(() => {
    if (!freeReadToast) return;
    const t = window.setTimeout(() => setFreeReadToast(false), 2400);
    return () => window.clearTimeout(t);
  }, [freeReadToast]);

  const handleFreeRead = () => {
    if (getFreeReadUsedToday()) return;
    markFreeReadUsedToday();
    setFreeReadUsed(true);
    setFreeReadToast(true);
  };

  const handleShare = () => {
    if (!payload) return;
    onShare?.(payload);
    try {
      // 静态引用分享片接口（share.ts 已落盘）；达单日上限返回 null 时静默降级。
      const url = buildDailyShareUrl(payload);
      if (url) {
        // S-6b B3 接线：分享成功才解锁当日文化深度隐藏卡（达日上限返回 null 则不解锁）。
        unlockHiddenCard(payload.dateKey);
        setHiddenDismissed(false);
        setHiddenJustUnlocked(true);
        if (typeof window !== 'undefined' && navigator.clipboard) {
          navigator.clipboard.writeText(window.location.origin + url).catch(() => {
            /* 复制失败不阻塞 */
          });
        }
      }
    } catch {
      /* 分享片模块未就绪 / 环境不支持时静默降级 */
    }
  };

  if (!payload) {
    return (
      <section className="ds-card" aria-busy="true">
        <style>{CARD_STYLE}</style>
        <p className="ds-meta">正在取今日星空…</p>
      </section>
    );
  }

  const streak = getStreakState();
  // 隐藏卡显隐：localStorage 解锁标记或本次分享刚解锁，且未被用户手动关闭。
  const showHiddenCard =
    !hiddenDismissed && !!payload && (hiddenJustUnlocked || isHiddenCardUnlocked(payload.dateKey));

  return (
    <>
      <section className="ds-card" aria-label="今日星象">
        <style>{CARD_STYLE}</style>
        <p className="ds-meta">
          {payload.dateKey} · {payload.timeZone}
        </p>
        <h2 className="ds-title">{payload.skyEventTitle}</h2>
        <p className="ds-note">{payload.personalNote}</p>
        {payload.zodiacLine ? <p className="ds-zodiac">{payload.zodiacLine}</p> : null}
        <blockquote className="ds-quote">「{payload.quote}」</blockquote>
        <p className="ds-source">—— {payload.source}</p>
        <p className="ds-compliance">{payload.compliance}</p>
        <button type="button" className="ds-share" onClick={handleShare}>
          分享今日星空
        </button>
        <p className="ds-sub">今日仅此一版</p>
        {/* S-6b B1 接线：卡尾成长条（连续天数/里程碑/免费解读/邀请入口） */}
        <GrowthStrip
          state={streak}
          unlocked={unlockedMilestones(streak)}
          freeReadUsed={freeReadUsed}
          onFreeRead={handleFreeRead}
          inviteUrl={invitePath}
        />
        {freeReadToast ? <p className="ds-toast">今日免费解读已领取</p> : null}
      </section>
      {/* S-6b B3 接线：分享解锁后，主卡之后追加文化深度隐藏卡 */}
      {showHiddenCard && payload ? (
        <div style={{ marginTop: '16px' }}>
          <HiddenSkyCard dateKey={payload.dateKey} onClose={() => setHiddenDismissed(true)} />
        </div>
      ) : null}
    </>
  );
}
