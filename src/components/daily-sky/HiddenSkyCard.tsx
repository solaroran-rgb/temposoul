// src/components/daily-sky/HiddenSkyCard.tsx
// 隐藏卡（文化深度版）纯展示组件——分享解锁后展示，规格 §1 B3 片。
//
// Props（冻结）：{ dateKey: string; onClose?: () => void }
// 展示：theme 标题(serif) + 引文 + 出处 + note + 合规句
//       + 「今日已分享解锁 · 文化深度版」角标 + 关闭按钮。
// 视觉只消费 src/styles/tokens.css 变量（暗黑星云深色、白正文、禁白卡片）；
// prefers-reduced-motion 下动效归零。本组件只渲染，不做解锁判定（由接线片 B4 控制显隐）。

import type { ReactElement } from 'react';
import { getHiddenCardContent } from '@/lib/growth/hidden-card';

interface HiddenSkyCardProps {
  /** 当日日期键 YYYY-MM-DD（决定文化深度内容）。 */
  dateKey: string;
  /** 关闭回调（由外层控制显隐）。 */
  onClose?: () => void;
}

const CARD_STYLE = `
.hc-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-lg);
  padding: var(--sp-6);
  color: var(--text-primary);
  max-width: 560px;
  width: 100%;
  box-sizing: border-box;
  position: relative;
}
.hc-badge {
  display: inline-block;
  font-size: 12px;
  color: var(--accent-lunar);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-sm);
  padding: 2px var(--sp-2);
  letter-spacing: 0.04em;
}
.hc-title {
  font-family: var(--font-serif-zh), var(--font-serif-en), serif;
  font-size: 22px;
  line-height: 1.4;
  margin: var(--sp-3) 0 var(--sp-2);
}
.hc-quote {
  margin: var(--sp-4) 0 var(--sp-1);
  font-family: var(--font-serif-zh), var(--font-serif-en), serif;
  font-size: 16px;
  line-height: 1.7;
}
.hc-source {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
}
.hc-note {
  margin: var(--sp-4) 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-primary);
}
.hc-compliance {
  margin: var(--sp-4) 0 0;
  font-size: 12px;
  color: var(--text-secondary);
}
.hc-close {
  position: absolute;
  top: var(--sp-3);
  right: var(--sp-3);
  background: var(--button-secondary-bg);
  border: 1px solid var(--button-secondary-border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  width: 28px;
  height: 28px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: filter var(--motion-base) var(--ease-out),
    border-color var(--motion-base) var(--ease-out),
    color var(--motion-base) var(--ease-out);
}
.hc-close:hover { filter: brightness(1.15); border-color: var(--accent-primary); color: var(--text-primary); }
.hc-close:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .hc-card, .hc-card * { transition: none !important; animation: none !important; }
}
`;

export default function HiddenSkyCard({ dateKey, onClose }: HiddenSkyCardProps): ReactElement {
  const content = getHiddenCardContent(dateKey);
  return (
    <section className="hc-card" aria-label="隐藏卡 · 文化深度版">
      <style>{CARD_STYLE}</style>
      <button type="button" className="hc-close" onClick={onClose} aria-label="关闭隐藏卡">
        ×
      </button>
      <span className="hc-badge">今日已分享解锁 · 文化深度版</span>
      <h3 className="hc-title">{content.theme}</h3>
      <blockquote className="hc-quote">「{content.quote}」</blockquote>
      <p className="hc-source">—— {content.source}</p>
      <p className="hc-note">{content.note}</p>
      <p className="hc-compliance">{content.compliance}</p>
    </section>
  );
}
